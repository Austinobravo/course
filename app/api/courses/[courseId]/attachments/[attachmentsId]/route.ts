import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(req:Request, {params}: {params: {courseId: string, attachmentsId: string}}){
        try{
            const {userId} = auth()
            if (!userId){
                return new NextResponse("Unauthorized", {status: 401})
            }
            const courseOwner = await db.course.findUnique({
                where:{
                    id: params.courseId,
                    userId: userId
                }
            })
            if (!courseOwner){
                return new NextResponse("Unauthorized", {status: 401})
            }
            const attachment = await db.attachment.delete({
                where:{
                    courseId: params.courseId,
                    id: params.attachmentsId
                }
            })
            return NextResponse.json(attachment)
        }catch(error){
            console.error("Attachment",error);
            return new NextResponse("Internal Error", {status: 500})
            
        }
}