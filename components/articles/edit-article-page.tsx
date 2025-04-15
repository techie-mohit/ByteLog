
"use client"
import React, { FormEvent, startTransition, useActionState, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import dynamic from 'next/dynamic'
import { Button } from '../ui/button'
import 'react-quill-new/dist/quill.snow.css'
import type { Article } from '@prisma/client'
import { editArticle } from '@/actions/edit-article'
import Image from 'next/image';


const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type EditArticleProps = {
    article: Article;
}


const EditArticlePage: React.FC<EditArticleProps> = ({ article }) => {
    const [content, setContent] = useState(article.content);
    const [formState, action, isPending] = useActionState(editArticle.bind(null, article.id), { errors: {} });

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        formData.append("content", content);

        startTransition(() => {      // You use it when submitting the article with useActionState, so the form doesn't freeze or lag while it's doing server work f we do not use it then the form will freeze and lag while it's doing server work
            action(formData);
        });
    }


    return (
        <div className='max-w-4xl mx-auto p-6 '>
            <Card>
                <CardHeader>
                    <CardTitle>Create New Article</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className='space-y-6 '>
                        <div className='space-y-2'>
                            <Input
                                type="text"
                                name="title"
                                defaultValue={article.title} // Set the default value to the article title
                                placeholder="Enter a article title"
                            />
                            {formState.errors.title && (<span className='text-red-600 text-sm'>{formState.errors.title}</span>)}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor="category">Category</Label>
                            <select className="flex h-10 w-full rounded-md" name="category" id="category" defaultValue={article.category}>
                                <option value="" className='text-black'>Select Category</option>
                                <option value="technology" className='text-black'>Technology</option>
                                <option value="programming" className='text-black'>Programming</option>
                                <option value="development" className='text-black'>Development</option>

                            </select>
                            {formState.errors.category && (<span className='text-red-600 text-sm'>{formState.errors.category}</span>)}
                        </div>
                        <div className='space-y-2'>
                            <Label htmlFor='FeaturedImage'>Featured Image</Label>
                            <Input
                                type="file"
                                id="featureImage"
                                name="featuredImage"
                                accept="image/*"
                            />
                            <div className='mb-4'>
                                {
                                    article.featuredImage && (
                                        <Image
                                            src={article.featuredImage}
                                            alt="featured Image"
                                            width={192} // Tailwind w-48 = 12 * 16 = 192px
                                            height={128} // Tailwind h-32 = 8 * 16 = 128px
                                            className="rounded-md"
                                        />
                                    )
                                }

                            </div>

                        </div>
                        <div className='space-y-2'>
                            <Label>Content</Label>
                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                            />
                            {formState.errors.content && (<span className='text-red-600 text-sm'>{formState.errors.content[0]}</span>)}

                        </div>

                        <div className='flex justify-end gap-4'>
                            <Button variant={"outline"}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>

                                {isPending ? "Loading ... " : "Edit Article"}

                            </Button>

                        </div>


                    </form>
                </CardContent>

            </Card>

        </div>
    )
}

export default EditArticlePage; 
