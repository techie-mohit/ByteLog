"use client"
import React, { useActionState } from 'react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { createComment } from '@/actions/create-comment'

type CommentInputProsps = {
    articleId: string
}

const CommentInput: React.FC<CommentInputProsps> = ({articleId}) => {

    const[formState, action, isPending] = useActionState(createComment.bind(null, articleId), {errors:{}});
    return (
        <form action={action} className='mb-8'>
            <div className='flex gap-4'>
                <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex-1'>
                    <Input type="text" name="body" placeholder='Write a comment...' className='w-full py-6 text-lg' />

                    {
                    formState.errors.body && <p className='text-red-500 text-sm'>{formState.errors.body}</p>
                    }
                    <div className='mt-4 flex justify-end'>
                        <Button type="submit"disabled={isPending}>
                            {
                                isPending ? "Loading..." : "Post Comment"
                            }
                        </Button>
                    </div>

                    {
                        formState.errors.formError && <p className='text-red-500 text-sm'>{formState.errors.formError[0]}</p>
                    }

                </div>


            </div>


        </form>
    )
}

export default CommentInput
