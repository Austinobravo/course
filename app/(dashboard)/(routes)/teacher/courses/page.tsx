
import React from 'react'
import { columns } from './_components/columns'
import { auth } from '@clerk/nextjs'
import { db } from '@/lib/db'
import { DataTable } from './_components/data-table'

const page = async () => {
  const {userId} = auth()
  
  if(!userId) return 

  const courses =await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
  return (
    <div>
        <DataTable columns={columns} data={courses}/>
    </div>
  )
}

export default page