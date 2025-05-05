"use server"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


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

export const editArticle = async (
    articleId: string, 
    prevState: CreateArticleFormState, 
    formData: FormData
): Promise<CreateArticleFormState> => {
    

    const result = createArticleSchema.safeParse({
        title: formData.get("title"),
        category: formData.get("category"),

        content: formData.get("content") // use cleaned version here
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
    // console.log("userId", userId);

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
    console.log("existingUser", existingUser);

    if (!existingUser || existingArticle.authorId !== existingUser.id) {
        return {
            errors: {
                formError: ["User not found . please register again"]
            }
        }
    }


    // start editing file
    let imageUrl = existingArticle.featuredImage; // Default to the existing image

    // ✅ Check if a new image is provided
    const imageFile = formData.get("featuredImage") as File | null;
    if (imageFile && imageFile.name !== "undefined") {
        try {
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const uploadResult: UploadApiResponse | undefined = await new Promise(
                (resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: "image" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    uploadStream.end(buffer);
                }
            );

            if (uploadResult?.secure_url) {
                imageUrl = uploadResult.secure_url;
            } else {
                return {
                    errors: { featuredImage: ["Failed to upload image. Please try again."] },
                };
            }
        } catch (error) {
            if(error instanceof Error){
                return {
                    errors:{
                        formError:[error.message]
                    }
                }
            }else{
                return {
                    errors: { formError: ["Error uploading image. Please try again."] },
                };
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





    console.log("Article updated successfully");
    revalidatePath('/dashboard'); // revalidate the dashboard page to show the updated article

    // Instead of redirecting, return a success indicator to the client.
    redirect("/dashboard"); // redirect to the articles page after creating the article

}