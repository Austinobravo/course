"use client"

import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Props{
    initialData: {
        title: string
    }
    courseId: string
}



const TitleForm = ({initialData, courseId}: Props) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const formSchema = z.object({
        title: z.string().min(1, {message: "Title is required"})
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
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
            Course title
            <Button onClick={toggleEdit} variant="ghost">
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && (
                    <>
                <Pencil className='h-4 w-4 mr-2'/>
                Edit title
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className="text-sm mt-2">
                {initialData.title}
            </p>
        )}
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField control={form.control} name="title" render={({field}) => 
                        <FormItem>
                            <FormControl>
                                <Input disabled={isSubmitting} placeholder="eg. 'Graphics Design'" {...field}/>
                            </FormControl>
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

export default TitleForm