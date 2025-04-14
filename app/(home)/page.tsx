import Navbar from '@/components/home/header/navbar'
import HeroSection from '@/components/home/hero-section';
import TopArcticles from '@/components/home/top-articles-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BlogFooter } from '@/components/home/blog-footer';
import { Suspense } from 'react';
import { AllArticlesPageSkeleton } from '../articles/page';


export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <section className='relative py-16 md:py-10'>
        <div className='container mx-auto px-4'>

          <div className='mb-8 text-center'>
            <h2 className='text-3xl font-bold tracking-light text-gray-900 dark:text-white sm:text-4xl'>Featured Articles</h2>
            <p>Discover our most popular and trending content</p>
          </div>


         <Suspense fallback={<AllArticlesPageSkeleton/>}>
          <TopArcticles />
         </Suspense>
          <div className='text-center mt-10'>
            <Link href={'/articles'}>
              <Button className="rounded-full hover:bg-gray-900 hover:text-white dark:bg-white dark:text-gray-900">View Articles</Button>
            </Link>
          </div>
        </div>


      </section>

      <BlogFooter />

    </div>
  );
}
