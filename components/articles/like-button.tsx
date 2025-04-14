"use client"
import React, { useOptimistic, useTransition } from 'react'
import { Button } from '../ui/button'
import { Bookmark, Share2, ThumbsUp } from 'lucide-react'

import { Like } from '@prisma/client'
import { likeDislikeToggle } from '@/actions/like-dislike'

type LikeButtonProps = {
    articleId:string,
    likes:Like[],
    isLiked:boolean
}

const LikeButton:React.FC<LikeButtonProps> = ({articleId, likes, isLiked}) => {

    // optimistic state for like button is used because whwn click the like button then quickly changes show rather than waiting for the server response
    // optimistic state is used to show the like button is clicked or not and then after the server response it will be updated
    const[optimisticLike, setOptimisticLike] =  useOptimistic(likes.length);
    const [isPending, startTransition] = useTransition();


    const handleLikeDislike = async()=>{
        startTransition(async()=>{
            setOptimisticLike(isLiked ? optimisticLike -1 : optimisticLike + 1 )  // optimistic ui update
            await likeDislikeToggle(articleId) // this is the function that will be called when the like button is clicked
        })
    }
  return (
    <div className='flex gap-8 mb-12 border-t pt-8'>
        <form action={handleLikeDislike}>
            <Button disabled={isPending} type="submit" variant={"outline"} className='gap-2'>
                <ThumbsUp className='h-5 w-5'/>{optimisticLike}
            </Button>
        </form>

        <Button variant={"outline"} className="gap-2">
            <Bookmark  className='h-5 w-5'/>
        </Button>

        <Button variant={'outline'} className="gap-2">
            <Share2 className='h-5 w-5'/>
        </Button>
      
    </div>
  )
}

export default LikeButton
