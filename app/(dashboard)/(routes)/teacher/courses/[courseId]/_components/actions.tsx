"use client"

import { ConfirmModal } from "@/components/modals/confirm-modal"
import { Button } from "@/components/ui/button"
import { useConfettiStore } from "@/hooks/use-confetti-store"
import axios from "axios"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

interface Props{
    disabled: boolean
    courseId: string
    isPublished: boolean
}
export function Actions({disabled, courseId, isPublished}: Props){
    const router = useRouter()
    const confetti = useConfettiStore()
    const [isLoading, setIsLoading] = useState(false)
    const onDelete = async () => {
        try{
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            toast.success("Course deleted")
            router.refresh()
            router.push(`/teacher/courses`)

        }catch(error:any){ 
            toast.error(error)
        }finally{
            setIsLoading(false)
        }
    }
    const onClick = async () => {
        try{
            setIsLoading(true)
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/chapters/unpublish`)
                toast.success("Course unpublished")
            }else{
                await axios.patch(`/api/courses/${courseId}/chapters/publish`)
                toast.success("Course published")
                confetti.onOpen()

            }
            router.refresh()

        }catch(error){
            toast.error("Something went wrong")
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button onClick={onClick} disabled={disabled || isLoading} variant="outline" size="sm">
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
                <ConfirmModal onConfirm={onDelete} children={undefined}/>
            <Button size="sm" disabled={isLoading}>
                <Trash className="w-4 h-4" />
            </Button>

        </div>
    )
}