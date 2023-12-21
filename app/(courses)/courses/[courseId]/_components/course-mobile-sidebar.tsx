import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Chapter, Course, UserProgress } from "@prisma/client"
import { Menu } from "lucide-react"
import CourseSidebar from "./course-sidebar"

 
 interface Props{
    course: Course & {
        chapters:  (Chapter[] & {
            userProgress: UserProgress[] | null
        })
    }
    progressCount: number
}
 export const CourseMobileSidebar = ({course, progressCount}:Props) => {

    return (
        <>
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 trabsition">
                <Menu/>
            </SheetTrigger >
            <SheetContent side={`left`} className="p-0 bg-white w-72">
                <CourseSidebar  progressCount={progressCount} course={course}/>

            </SheetContent>
        </Sheet>
        
        </>
    )
 }