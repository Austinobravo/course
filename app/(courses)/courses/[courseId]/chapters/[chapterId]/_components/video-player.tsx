"use client"
interface Props{
    playbackId: string
    courseId: string
    chapterId: string
    nextChapterId?: string
    isLocked: boolean
    completeOnEnd: boolean
    title: string
}
export const VideoPlayer = ({playbackId,
    courseId,
    chapterId,
    nextChapterId,
    isLocked,
    completeOnEnd,
    title}: Props) => {

        return (
            <div></div>
        )

}