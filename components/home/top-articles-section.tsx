import React from 'react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { prisma } from '@/lib/prisma'

const TopArticles = async () => {
    const articles = await prisma.article.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            comments: true,
            author: {
                select: {
                    name: true,
                    imageUrl: true,
                    email: true,
                },
            },
        }
    });
    return (
        <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
            {articles.slice(0, 3).map((article) => (       // only 3 images are shown in the grid and home page
                
                 <Card key={article.id} className={cn("group relative overflow-hidden transition-all hover:scale-[1.02]", "border-gray-300/50 dark:border-white/10", "bg-white/50 dark:bg-gray-900/50")}>
                 <div className='p-6'>
                     <Link href={`/articles/${article.id}`} >
                         <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                             <Image src={article.featuredImage}
                                 alt="Article Image"
                                 fill
                                 className='w-full h-full object-cover'
                             />
                         </div>
                         <div className='flex items-center gap-4 text-lg text-gray-700 dark:text-gray-400'>
                             <Avatar className='h-7 w-8'>
                                 <AvatarImage src={article.author.imageUrl as string} />
                                 <AvatarFallback>CN</AvatarFallback>
                             </Avatar>
                             <span className=''>{article.author.name} </span>
                         </div>
                         <h3 className='mt-4 text-xl font-semibold text-gray-900 dark:text-white'>{article.title}</h3>
                         <p className='mt-2 text-gray-600 dark:text-gray-300'>{article.category}</p>
                         <div className='mt-6 flex  items-center justify-between text-sm text-gray-700 dark:text-gray-400'>
                             <span>{article.createdAt.toDateString()}</span>
                             <span>{12} min to read</span>
 
                         </div>
                     </Link>
 
                 </div>
             </Card>

            ))}
           

        </div>
    )
}

export default TopArticles
