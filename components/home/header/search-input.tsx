"use client"
import { searchAction } from '@/actions/search'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

const SearchInput = () => {

  const searchParams = useSearchParams();  // it is used to get search value from the search bar
  return (
    <form action={searchAction} >
        <div className='relative ' >
            <Search className= 'absolute left-1 top-4/7 h-4 w-4 -translate-y-1/2 text-muted-foreground'/>
            <Input type="search" 
            name="search" 
            placeholder='Search articles...' 
            defaultValue = {searchParams.get('search') || ''}
            className='pl-8 w-30 md:w-50 text-sm focus-visible:ring-1' />

        </div>

    </form>
  )
}

export default SearchInput
