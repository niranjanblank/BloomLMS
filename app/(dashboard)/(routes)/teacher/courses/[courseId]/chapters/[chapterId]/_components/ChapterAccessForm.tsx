"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { useState } from "react"
import {  Switch } from "@/components/ui/switch"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Chapter, Course } from "@prisma/client"
import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string
    chapterId: string
}


const formSchema = z.object({
    isFree: z.boolean().default(false)
})

const ChapterAccessForm = ({initialData, courseId, chapterId}:ChapterAccessFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: Boolean(initialData.isFree),
          },
    })

    const {isSubmitting, isValid} = form.formState


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
    <div className="font-medium flex items-center justify-between">
        Chapter Access
        <Button variant="ghost" onClick={toggleEdit}>
            {isEditing? (
                <>Cancel</>
            ):(
                <>
                  <Pencil className="h-4 w-4 mr-2"/>
                  Edit Access
                </>)}
        </Button>
    </div>
    {!isEditing && (
        <div className="text-sm mt-2 text-slate-700 italic">
            {initialData.isFree?"This chapter is free for preview": "This chapter is locked"}
        </div>
    )}

    {isEditing && (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
            >
                <FormField
                control={form.control}
                name="isFree"
                render = {({field})=>(
                    <FormItem>
                        <FormControl>
                           <Switch
                           checked={field.value}
                           onCheckedChange={field.onChange}
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormDescription>
                                Switch this if you want to make this chapter free for preview
                            </FormDescription>
                        </div>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                <div className="flex items-center gap-x-2">
                    <Button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    >
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )}
    </div> );
}
 
export default ChapterAccessForm;