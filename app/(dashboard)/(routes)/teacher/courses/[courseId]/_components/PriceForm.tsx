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
import { Pencil } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Course } from "@prisma/client"
import { formatPrice } from "@/lib/format"
interface PriceFormProps {
    initialData: Course
    courseId: string
}


const formSchema = z.object({
    price: z.coerce.number()
})

const PriceForm = ({initialData, courseId}:PriceFormProps) => {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)

    const toggleEdit = () => {
        setIsEditing(!isEditing)
    }
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price ?? 0
        }
    })

    const {isSubmitting, isValid} = form.formState


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course updated")
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
        Course Price
        <Button variant="ghost" onClick={toggleEdit}>
            {isEditing? (
                <>Cancel</>
            ):(
                <>
                  <Pencil className="h-4 w-4 mr-2"/>
                  Edit Price
                </>)}
        </Button>
    </div>
    {!isEditing && (
        <p className="text-sm mt-2">
            {initialData.price && formatPrice(initialData.price) || "No Price"}
        </p>
    )}

    {isEditing && (
        <Form {...form}>
            <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
            >
                <FormField
                control={form.control}
                name="price"
                render = {({field})=>(
                    <FormItem>
                        <FormControl>
                            <Input
                            className="bg-white"
                            disabled = {isSubmitting}
                            placeholder="Set a price for your course"
                            step="0.01"
                            type="number"
                            {...field}
                            
                            />
                        </FormControl>
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
 
export default PriceForm;