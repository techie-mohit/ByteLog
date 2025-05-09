// "use server"

// import { prisma } from "@/lib/prisma"
// import { revalidatePath } from "next/cache";

// export const deleteArticle = async(articleId: string)=>{
//     await prisma.article.delete({
//         where:{id : articleId}
//     });
//     revalidatePath("/dashboard")
// }


"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteArticle = async (articleId: string) => {
  // Step 1: Delete all likes linked to this article
  await prisma.like.deleteMany({
    where: { articleId },
  })

  // Step 2: Delete all comments linked to this article
  await prisma.comment.deleteMany({
    where: { articleId },
  })

  // Step 3: Delete the article itself
  await prisma.article.delete({
    where: { id: articleId },
  })

  // Optional: Revalidate the UI
  revalidatePath("/dashboard")
}
