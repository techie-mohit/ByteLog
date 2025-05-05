import EditArticlePage from '@/components/articles/edit-article-page'
import { prisma } from '@/lib/prisma'
import React from 'react'

type EditArticleParams = {
  params: { id: string }
}

const EditPage: React.FC<EditArticleParams> = async ({ params }) => {
  const id  = params.id;

  const article = await prisma.article.findUnique({
    where: { id },
  })
  console.log('article', article)

  if (!article) return <h1>Article Not Found for ID: {id}</h1>

  return (
    <div>
      <EditArticlePage article={article} />
    </div>
  )
}

export default EditPage
