import { Category, Course } from "@prisma/client"


type CourseWithProgressWithCategory = Course & {
    category: Category | null
    chapters: {id: string}[]
    progress: number | null
}

interface Props{
    items: CourseWithProgressWithCategory[]
}
export const CoursesList = ({items}: Props) => {
    return (
        <div>
            {items.map((item:any) => (
                <div key={item.id}>
                    {item.title}
                </div>
            ))}
        </div>
    )
}