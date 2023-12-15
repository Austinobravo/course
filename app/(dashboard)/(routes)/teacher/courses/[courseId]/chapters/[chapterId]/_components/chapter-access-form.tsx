"use client"

import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Editor from '@/components/editor'
import { Chapter } from '@prisma/client'
import Preview from '@/components/preview'
import { Checkbox } from '@/components/ui/checkbox'

interface Props{
    initialData: Chapter
    courseId: string
    chapterId: string
}



const ChapterAccessForm = ({initialData, courseId, chapterId}: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const formSchema = z.object({
        isFree: z.boolean().default(false)
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: !!initialData.isFree
        }
 
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
            Chapter access
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && (
                    <>
                <Pencil className='h-4 w-4 mr-2'/>
                Edit access
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <div className={cn("text-sm mt-2", !initialData.isFree && "text-slate-500 italic")}>
                {!initialData.description && "This chapter is not free"}
                {initialData.isFree && "This chapter is free"}
            </div>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField control={form.control} name="isFree" render={({field}) => 
                        <FormItem className="flex flex-row items-start space-x-3 space-y-8 rounded-md border p-4">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormDescription>Check this box if you want to make this chapter free</FormDescription>
                            </div>
                            <FormMessage/>
                        </FormItem>
                }/>
                <div className="flex items-center gap-x-2">
                    <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>

                </div>     

                </form>

            </Form>
        )}
        
    </div>
  )
}

export default ChapterAccessForm