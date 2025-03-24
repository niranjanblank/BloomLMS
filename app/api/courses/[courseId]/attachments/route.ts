import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req:Request,
    {params}: {params: {courseId: string}}
){
    try {
        const {userId} = await auth()
        const {url} = await req.json()
        const {courseId} = await params

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id:courseId,
                userId: userId
            }
        })

        // if the current user isnt the course owner, we send unauthorized
        if(!courseOwner){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: courseId
            }
        })

        return NextResponse.json(attachment)

    }
    catch(error) {
        console.log("[COURSE_ID_ATTACHMENT]", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}