
import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Search } from 'lucide-react'
import { Prisma } from '@prisma/client'

type SearchPageProps  = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          name: true,
          imageUrl: true,
          email: true
        }
      }
    }
  }>[]
}

const AllArticlePage  = async ({ articles }: SearchPageProps) => {



  if (articles.length === 0) {
    return <NoSearchResults />
  }

  return (
    <div className='grid gap-8 sm:grid-cols-2 lg:grid-cols-3'>
      {articles.map((article) => (
        <Card key={article.id} className='group relative overflow-hidden transition-all hover:shadow-lg max-w-sm'>
          <div className='p-4'>
            {/* Image */}
            <div className='relative mb-2 h-48 overflow-hidden rounded-xl'>
              <Image
                src={article.featuredImage}
                alt='Featured image'
                fill
                className='object-cover'
              />
            </div>

            {/* Title & Category */}
            <h3 className='text-lg font-semibold '>{article.title}</h3>
            <p className='mt-2 text-sm text-muted-foreground'>{article.category}</p>

            {/* Author & Date */}
            <div className='mt-6 flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <Avatar>
                  <AvatarImage src={article.author.imageUrl as string} />
                  <AvatarFallback className='text-sm'>
                    CN
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm'>{article.author.name}</span>
              </div>
              <div className='text-sm text-muted-foreground'>
                {new Date(article.createdAt).toDateString()}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default AllArticlePage


export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground">
        No Results Found
      </h3>

      {/* Description */}
      <p className="mt-2 text-muted-foreground">
        We could not find any articles matching your search. Try a different
        keyword or phrase.
      </p>
    </div>
  );
}