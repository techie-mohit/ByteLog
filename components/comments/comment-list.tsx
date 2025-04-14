import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { Prisma } from '@prisma/client'

type CommentListProps = {
    comments: Prisma.CommentGetPayload<{
        include: {
            author: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true,
                }
            }
        }
    }>[]
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
    return (
        <div className="space-y-8">
            {comments.map((comment) => (
                <div key={comment.id} className='flex gap-8'>
                    <Avatar>
                        <AvatarImage src={comment.author.imageUrl || ""} />
                        <AvatarFallback className='text-sm'>
                            {comment.author.name?.[0] ?? "?"}
                        </AvatarFallback>
                    </Avatar>

                    <div className='flex-1'>
                        <div className='mb-2'>
                            <span className='text-sm ml-2 font-semibold'>{comment.author.name}</span>
                            <span className='text-sm ml-4 text-gray-500'>{new Date(comment.createdAt).toDateString()}</span>
                        </div>
                        <p>{comment.body}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CommentList
