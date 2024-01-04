"use client"

import { UserButton, useAuth } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import SearchInput from './search-input'
import { Teacher } from '@/lib/teacher'

const NavbarRoutes = () => {
    const pathname = usePathname()
    const router = useRouter()
    const {userId} = useAuth()

    const isTeacherPage = pathname?.startsWith("/teacher")
    const isPlayerPage = pathname?.includes("/courses")
    const isSearchPage = pathname === "/search"
  return (
    <>
    {isSearchPage && 
        <div className='hidden md:block'>
            <SearchInput/>
        </div>
    }
    <div className='flex gap-x-2 ml-auto'>
        {isTeacherPage || isPlayerPage ? (
            <Link href="/">
                <Button size="sm" variant="ghost">
                    <LogOut className='h-4 w-4 mr-2'/>
                    Exit
                </Button>
            </Link>
        ): Teacher(userId) ? (
            <Link href="/teacher/courses">
                <Button size="sm" variant="ghost">
                    Teacher Mode
                </Button>
            </Link>
        ): null}
        <UserButton afterSignOutUrl='/'/>
    </div>
    </>
  )
}

export default NavbarRoutes