import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}:{params: {courseId: string}}){

    try{
        const {userId} = auth()
        const {courseId} = params
        const values = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        const course = await db.course.findUnique({
            where:{
                id: courseId,
                userId
            },
            include: {
                chapters: {
                    include:{
                        muxData: true
                    }
                }
            }
        })
        if(!course){
            return new NextResponse("Not Found", {status: 404})
        }
        const hasPublishedChapter = course.chapters.some((chapter: any) => chapter.isPublished)
        if(!course || !course.description || !course.title || !course.categoryId || !hasPublishedChapter){
            return new NextResponse("Not Found", {status: 404})
        }


        const publishedCourse = await db.course.update({
            where:{
                id: courseId,
                userId
            },
            data: {
                isPublished: true
            }
        })
        return NextResponse.json(publishedCourse, {status: 200})
    }catch(error){
        console.error("Course Patch", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}