"use client"

import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle, File, Loader2, X } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Attachment, Course } from '@prisma/client'
import Image from "next/image"
import { FileUpload } from '@/components/file-upload'

interface Props{
    initialData: Course & { attachments: Attachment[]}
    courseId: string
}



const AttachmentForm = ({initialData, courseId}: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const router = useRouter()
    const formSchema = z.object({
        url: z.string().min(1)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {url: initialData?.ImageUrl || ""}
    })
    const toggleEdit= () => setIsEditing((current) => !current)
    const {isSubmitting, isValid} = form.formState
    const onSubmit =async (values:z.infer<typeof formSchema>) => {
       try{
        await axios.post(`/api/courses/${courseId}/attachments`, values)
        toast.success("Course Updated")
        toggleEdit()
        router.refresh()
       }catch(error:any){
        toast.error("Error", error)
       }
    }
    const onDelete = async (id: string) => {
        try{
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("Attachment deleted successfully")
            router.refresh()

        }catch(error: any){
            toast.error(error)
        }finally{
            setDeletingId(null)
        }
    }
  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
        <div className='font-medium flex items-center justify-between'>
            Course attachments
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing &&  (
                    <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an file
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
            <>
             {initialData.attachments.length === 0 && (
                <p className="text-sm mt-2 text-slate-500 italic">
                    No attachements 
                </p>
             )}
             {initialData.attachments.length > 0 && (
                <div className="space-y-2">
                    {initialData.attachments.map((attachments) => (
                        <div key={attachments.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md">
                            <File className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p className="text-xs line-clamp-1"> {attachments.name}</p>
                            {deletingId === attachments.id && (
                                <div>
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                </div>
                            )}
                            {deletingId !== attachments.id && (
                                <button onClick={() => onDelete(attachments.id)} className="ml-auto hover:opacity-75 transition">
                                    <X className="h-4 w-4 "/>
                                </button>
                            )}

                        </div>
                    ))}

                </div>
             )}
            </>
        )}
        {isEditing && (
            <div>
                <FileUpload endpoint="courseAttachment" onChange={(url) =>{
                    if(url){
                        onSubmit({ url: url})
                    }
                }}/>
                <div className="text-xs text-muted-foreground mt-4">Add anything your students might need</div>
            </div>
        )}
        
    </div>
  )
}

export default AttachmentForm