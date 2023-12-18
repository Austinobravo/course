import { db } from '@/lib/db'
import React from 'react'
import Categories from './_components/categories'
import SearchInput from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import { auth } from '@clerk/nextjs'
import { CoursesList } from '@/components/courses-list'

interface Props {
  searchParams: {
    title: string
    categoryId: string
  }
}

const SearchPage = async ({searchParams}: Props) => {
  const {userId} = auth()
  if(!userId){
    return
  }
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  })

  const courses = await getCourses({
    userId,
    ...searchParams

  })
  return (
    <>
    <div className="px-6 pt-6 md:hidden md:mb-0 block">
      <SearchInput/>

    </div>
    <div className='p-6'>
      <Categories items={categories}/>
    </div>
    <CoursesList items={courses}/>
    </>
  )
}

export default SearchPage