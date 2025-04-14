"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const ArticleDetailLoading = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8 animate-pulse">
      {/* Title Skeleton */}
      <Skeleton className="h-10 w-3/4 rounded-xl" />

      {/* Author and Date */}
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>

      {/* Image Skeleton */}
      <Skeleton className="h-64 w-full rounded-2xl" />

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/6 rounded" />
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-4 mt-8">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>

      {/* Comments Section */}
      <Card className="mt-12">
        <CardContent className="space-y-4 pt-6">
          <Skeleton className="h-6 w-1/3 rounded" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </CardContent>
      </Card>
    </div>
  )
}

export default ArticleDetailLoading
