import ArticleDetailPage from '@/components/articles/article-detail-page';
import { prisma } from '@/lib/prisma';
import React from 'react'

type ArticleDetailPageProps = {    // this will used to get an id from the url
    params:Promise<{id:string}>    
}

const page:React.FC<ArticleDetailPageProps> = async({params}) => {
    const id = (await params).id;
    const article = await prisma.article.findUnique({
        where:{
            id
        },
        include:{
            author:{
                select:{
                    name:true,
                    email:true,
                    imageUrl:true,
                },
            },
        },
    })

    if(!article){
        return <h1>Article Not Found</h1>
    }
  return (
    <div>
      <ArticleDetailPage article={article}/>
    </div>
  )
}

export default page
