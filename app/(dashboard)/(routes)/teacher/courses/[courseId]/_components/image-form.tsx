"use client"

import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Course } from '@prisma/client'
import Image from "next/image"
import { FileUpload } from '@/components/file-upload'

interface Props{
    initialData: Course
    courseId: string
}



const ImageForm = ({initialData, courseId}: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const formSchema = z.object({
        imageUrl: z.string().min(1, {message: "Image is required"})
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {imageUrl: initialData?.ImageUrl || ""}
    })
    const toggleEdit= () => setIsEditing((current) => !current)
    const {isSubmitting, isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
       try{
        await axios.patch(`/api/courses/${courseId}`, values)
        toast.success("Course Updated")
        toggleEdit()
        router.refresh()
       }catch(error:any){
        toast.error("Error", error)
       }
    }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course Image
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && !initialData.ImageUrl && (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an image
                    </>
                )}
                {!isEditing && initialData.ImageUrl &&(
                    <>
                <Pencil className='h-4 w-4 mr-2'/>
                Edit Image
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            !initialData.ImageUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <ImageIcon className="h-10 w-10 text-slate-500"/>
                </div>
            ) : (
                <div className="relative aspect-video mt-2">
                    <Image alt="Upload" fill className="object-cover rounded-md" src={initialData.ImageUrl}/>
                </div>
            )
        )}
        {isEditing && (
            <div>
                <FileUpload endpoint="courseImage" onChange={(url) =>{
                    if(url){
                        onSubmit({ imageUrl: url})
                    }
                }}/>
                <div className="text-xs text-muted-foreground mt-4">16:9 aspect ratio recommended</div>
            </div>
        )}
        
    </div>
  )
}

export default ImageForm