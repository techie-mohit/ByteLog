"use server"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { z } from "zod"

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})


const createArticleSchema = z.object({
    title: z.string().min(3).max(100),
    category: z.string().min(3).max(100),
    content: z.string().min(10)          // for infinite rah sakte hai content me se max ko hata do 
})

type CreateArticleFormState = {
    errors: {
        title?: string[],
        category?: string[],
        featuredImage?: string[],
        content?: string[],
        formError?: string[]
    }
}

export const editArticle = async (articleId: string, prevState: CreateArticleFormState, formData: FormData): Promise<CreateArticleFormState> => {
    // Sanitize content input
    const rawContent = formData.get("content")?.toString() || "";
    const cleanedContent = rawContent.replace(/<(.|\n)*?>/g, "").trim();

    const result = createArticleSchema.safeParse({
        title: formData.get("title"),
        category: formData.get("category"),

        content: cleanedContent // use cleaned version here
    });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const { userId } = await auth();   // provded by clerk
    if (!userId) {
        return {
            errors: {
                formError: ["You must be logged in to create an article"]
            }
        }
    }

    const existingArticle = await prisma.article.findUnique({
        where: { id: articleId }
    });
    if (!existingArticle) {
        return {
            errors: {
                formError: ["Article not found"]
            }
        }
    }

    // to get userId from clerk userId
    const existingUser = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!existingUser || existingArticle.authorId !== existingUser.id) {
        return {
            errors: {
                formError: ["User not found . please register again"]
            }
        }
    }


    // start editing file
    let imageUrl = existingArticle.featuredImage; // default to existing image URL
    const entry = formData.get("featuredImage");

    let imageFile: File | null = null;
    if (entry instanceof File && entry.size > 0) {
        imageFile = entry;
    }

    if (imageFile) {
        try {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResponse: UploadApiResponse | undefined = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto"
                    },
                    (error, result) => {
                        if (error) {
                            reject(error)
                        }
                        else {
                            resolve(result)
                        }
                    }
                );

                uploadStream.end(buffer);
            });
            if (uploadResponse?.secure_url) {
                imageUrl = uploadResponse.secure_url
            } else {
                return {
                    errors: {
                        featuredImage: ["Image upload failed"]
                    }
                }

            }
        } catch (error) {
        console.log(error);
            return {
                errors: {
                    formError: ["Error  uploading  failed please try again"]
                }
            }

        }

    }

    try {
        await prisma.article.update({
            where: { id: articleId },
            data: {
                title: result.data.title,
                category: result.data.category,
                content: result.data.content,
                featuredImage: imageUrl

            }
        })
    } catch (error: unknown) {

        if (error instanceof Error) {
            return {
                errors: {
                    formError: [error.message]
                }
            }
        } else {
            return {
                errors: {
                    formError: ["Something went internal server wrong"]
                }
            }
        }

    }





    // start creating the article
    revalidatePath('/dashboard') // revalidate the dashboard page to show the new article
    redirect("/dashboard") // redirect to the articles page after creating the article
}