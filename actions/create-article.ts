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

export const createArticle = async (prevState: CreateArticleFormState, formData: FormData): Promise<CreateArticleFormState> => {
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

    // to get userId from clerk userId
    const existingUser = await prisma.user.findUnique({
        where: {
            clerkUserId: userId
        }   
    })

    if(!existingUser) {
        return {
            errors: {
                formError: ["User not found . please register again"]
            }
        }
    }


    // start creating file
    const imageFile = formData.get("featuredImage") as File | null;
    if(!imageFile || imageFile.name === "undefined") {
        return {
            errors: {
                featuredImage: [" image file is required"]
            }
        }
    }

    // upload image to cloudinary or any other service
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse : UploadApiResponse | undefined = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto"},
            (error, result)=>{
                if(error){
                    reject(error)
                }
                else{
                    resolve(result)
                }
            }
        );

        uploadStream.end(buffer);
    })

    const imageUrl = uploadResponse?.secure_url;
    if(!imageUrl){
        return{
            errors: {
                featuredImage: ["Image upload failed"]
            }
        }
    }
    
    try {
        await prisma.article.create({
            data:{
                title:result.data.title,
                category:result.data.category,
                content:result.data.content,
                featuredImage:imageUrl,
                authorId:existingUser?.id, // use the id from the user table

            }
        })
    } catch (error:unknown) {

        if(error instanceof Error){
            return {
                errors: {
                    formError: [error.message]
                }
            }
        }else{
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