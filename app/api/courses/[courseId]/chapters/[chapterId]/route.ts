import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from '@/lib/db';
import Mux from "@mux/mux-node"

const {Video} = new Mux(
    process.env.MUX_TOKEN_ID!, process.env.MUX_TOKEN_SECRET!
)
export  async function DELETE(req:Request, {params}: {params: {courseId: string, chapterId: string}}){
    try{
        const { userId} = auth()

        if(!userId) return new NextResponse("Unauthorized", {status: 401})

        const courseOwner = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId,
        
            }
        })
        if(!courseOwner) return new NextResponse("Unauthorized", {status:401})

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })
        if (!chapter) return new NextResponse("Not Found", {status: 404})

        if  (chapter.VideoUrl){
            const existingData = await db.muxData.findUnique({
                where: {
                    chapterId: params.chapterId
                }
            })

            if (existingData){
                await Video.Assets.del(existingData.assestId)
                await db.muxData.delete({
                    where: {
                        id: existingData.id
                    }
                })
            }
        }
        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedCourse= await db.chapter.findMany({
            where:{
                courseId: params.courseId,
                isPublished: true
            }
        })
        if(!publishedCourse.length){
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: true
                }
            })
        }
        return NextResponse.json(deletedChapter)

    }catch(error){
        return new NextResponse("Unauthorized", {status: 401})
    }
}
export async function PATCH (req: Request, {params}: {params: {courseId: string, chapterId: string}}){
    const {isPublished,...values} = await req.json()
    try{
        const {userId} = auth()
        if(!userId) return new NextResponse("Unauthorized", {status: 401})
        
        const courseOwner = await db.course.findUnique({
            where:{
                id: params.courseId,
                userId: userId,

            }
        })
        if(!courseOwner) return new NextResponse("Unauthorized", {status:401})

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        })
        if(values.videoUrl){
            const existingMuxData = await db.muxDaat.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            })
            if(existingMuxData){
                await Video.Assets.del(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const assest = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false
            })

            await db.muxData.create({
                data:{
                    chapterId: params.chapterId,
                    assetId: assest.id,
                    playblackId: assest.playback_ids?.[0]?.id
                }
            })
        }
        return NextResponse.json(chapter)
    }catch(error){
        return new NextResponse("internal error", {status: 500})

    }
}