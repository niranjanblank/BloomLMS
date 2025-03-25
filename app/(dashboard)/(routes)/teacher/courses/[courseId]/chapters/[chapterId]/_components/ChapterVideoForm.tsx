"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ImageIcon, Pencil, PlusCircle, VideoIcon } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Chapter, Course, muxData } from "@prisma/client"
import Image from "next/image"
import FileUpload from "@/components/file-upload"
interface ChapterVideoFormProps {
    initialData: Chapter & {muxData?: muxData | null}
    courseId: string
    chapterId: string
}


const formSchema = z.object({
    videoUrl: 
        z.string().min(1)

})

const ChapterVideoForm = ({initialData, courseId, chapterId}:ChapterVideoFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }


   


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter updated")
            toggleEdit()
            router.refresh()
        }
        catch(error){
            toast.error("Something went wrong")
        }
    }
    return ( 
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        {/* toggle between the add or edit buttons */}
    <div className="font-medium flex items-center justify-between">
        Course Image
        <Button variant="ghost" onClick={toggleEdit}>
            {isEditing && (
                <>Cancel</>
            )}

            { !isEditing &&  !initialData.videoUrl &&
                    (
                <>
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Add a video
                </>)
            }

        { !isEditing &&  initialData.videoUrl &&
                    (
                <>
                  <Pencil className="h-4 w-4 mr-2"/>
                  Edit a video
                </>)
            }
        </Button>
    </div>

    {/* image */}
    {!isEditing && !initialData.videoUrl ? (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500"/>
        </div>
            ):(
            <>{
                !isEditing && initialData.videoUrl && <div className="relative aspect-video mt-2">
                {/* <Image
                    alt="Upload"
                    fill
                    className="object-cover rounded-md"
                    src={initialData.videoUrl}
                />
         */}
                Video Uploadeded!
            </div>
        }
    </>
    )}

    {isEditing && (
       <div>
            <FileUpload
            endpoint="chapterVideo"
            onChange={(url)=> {
                if(url){
                    onSubmit({videoUrl: url})
                }
            }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                Upload this chapter&apos;s video
            </div>
        </div>
    )}

    {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
            Videos can take a few minutes to process. Refersh the page if video doesnt appear.
        </div>
    )}
    </div> );
}
 
export default ChapterVideoForm;