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
import {File, Loader2, Pencil, PlusCircle, X } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Attachment, Course } from "@prisma/client"

import FileUpload from "@/components/file-upload"
interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]}
    courseId: string
}


const formSchema = z.object({
    url: 
        z.string().min(1, {
          message: "Attachment is required",
        })

})

const AttachmentForm = ({initialData, courseId}:AttachmentFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)
    const [deletingId, setDeletingId] = useState<string|null>(null)


    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }


   


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course updated")
            toggleEdit()
            router.refresh()
        }
        catch(error){
            toast.error("Something went wrong")
        }
    }

    const onDelete = async (id:string) => {
        try{
            setDeletingId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("Attachment deleted")
            router.refresh()
        }
        catch{
            toast.error("Something went wrong")
        }
        finally{
            setDeletingId(null);
        }
    }
    return ( 
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        {/* toggle between the add or edit buttons */}
    <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button variant="ghost" onClick={toggleEdit}>
            {isEditing && (
                <>Cancel</>
            )}

            { !isEditing &&
                    (
                <>
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Add a file
                </>)
            }
        </Button>
    </div>


    {!isEditing && (
        <>
        {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
                No Attachments yet
            </p>
        )}

        {initialData.attachments.length >0 && (
            <>
             {initialData.attachments.map(attachment=>(
                <div 
                key={attachment.id}
                className="flex items-center p-3 w-ful bg-sky-100 
                border-sky-200 mt-2 border text-sky-700 rounded-md "
                >
                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                    <p className="text-xs line-clamp-1">
                        {attachment.name}                    
                    </p>
                    {deletingId === attachment.id && (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    )}
                    {deletingId !== attachment.id && (
                        <button
                        onClick={()=>onDelete(attachment.id)}
                        type="button"
                        className="ml-auto hover:opacity-75 transition"
                        >
                        <X className="h-4 w-4"/>
                        </button>
                    )}
                </div>

             ))}
            </>
        )}
        </>
    )
    }

    {isEditing && (
       <div>
            <FileUpload
            endpoint="courseAttachment"
            onChange={(url)=> {
                if(url){
                    onSubmit({url: url})
                }
            }}
            />
            <div className="text-xs text-muted-foreground mt-4">
                Add anything your students might need to complete the course
            </div>
        </div>
    )}
    </div> );
}
 
export default AttachmentForm;