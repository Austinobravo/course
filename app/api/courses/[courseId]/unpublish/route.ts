import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}:{params: {courseId: string}}){

    try{
        const {userId} = auth()
        const {courseId} = params
        

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        const course = await db.course.findUnique({
            where:{
                id: courseId,
                userId
            },
        })
        if(!course){
            return new NextResponse("Not Found", {status: 404})
        }

        const unPublishedCourse = await db.course.update({
            where:{
                id: courseId,
                userId
            },
            data: {
                isPublished: false
            }
        })
        return NextResponse.json(unPublishedCourse, {status: 200})
    }catch(error){
        console.error("Course Patch", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}