"use client"

import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Pencil, PlusCircle, Video } from 'lucide-react'

import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { Chapter, MuxData } from '@prisma/client';
import  MuxPlayer from "@mux/mux-player-react"

import { FileUpload } from '@/components/file-upload'

interface Props{
    initialData: Chapter & {muxData?: MuxData | null}
    courseId: string
    chapterId: string
}



const ChapterVideoForm = ({initialData, courseId, chapterId}: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const formSchema = z.object({
        videoUrl: z.string().min(1, {message: "Image is required"})
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
       
    })
    const toggleEdit= () => setIsEditing((current) => !current)
    const {isSubmitting, isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
       try{
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
        toast.success("Chapter Updated")
        toggleEdit()
        router.refresh()
       }catch(error:any){
        toast.error("Error", error)
       }
    }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course video
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && !initialData.videoUrl && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an video
                    </>
                )}
                {!isEditing && initialData.videoUrl &&(
                    <>
                <Pencil className='h-4 w-4 mr-2'/>
                Edit Image
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            !initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Video className="h-10 w-10 text-slate-500"/>
                </div>
            ) : (
                <div className="relative aspect-video mt-2">
                    <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""}/>
                </div>
            )
        )}
        {isEditing && (
            <div>
                <FileUpload endpoint="chapterVideo" onChange={(url) =>{
                    if(url){
                        onSubmit({ videoUrl: url})
                    }
                }}/>
                <div className="text-xs text-muted-foreground mt-4">Upload this chapter's video</div>
            </div>
        )}
        {initialData.videoUrl && !isEditing && 
            <div className="text-xs text-muted-foreground mt-2">
                Videos can take a few minutes..
            </div>
        }
        
    </div>
  )
}

export default ChapterVideoForm