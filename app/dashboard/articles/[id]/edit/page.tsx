import EditArticlePage from '@/components/articles/edit-article-page'
import { prisma } from '@/lib/prisma'
import React from 'react'

type EditArticleParams = {
    params: Promise<{id:string}>     // to get edit page ki id from url 
}

const EditPage : React.FC<EditArticleParams> = async({params}) => {

    const id = (await params).id;
    const article = await prisma.article.findUnique({
        where:{
            id,
        }
    })

    if(!article) return <h1>Article Not Founf For This {id}</h1>
  return (
    <div>
      <EditArticlePage article ={article}/>
    </div>
  )
}

export default EditPage
