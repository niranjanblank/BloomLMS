"use server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import Mux from "@mux/mux-node"

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
  });

  const video = mux.video; 

export async function PATCH(req: Request,
    {params} : {params: {courseId:string, chapterId: string}}
){
    try{
        const {userId} = await auth()
        const {courseId, chapterId} = await params

        const {isPublished, ...values} = await req.json()

        if(!userId){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const chapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                ...values
            }
        })

        // handle video upload
        if(values.videoUrl){
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId
                }
            })

            // clean up function to delete mux data if already exists   
            if (existingMuxData){
                await video.assets.delete(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const asset = await video.assets.create({
                input: [{url: values.videoUrl}],
                playback_policy: ["public"],
                test: false
            })
    
            await db.muxData.create({
                data: {
                    chapterId: chapterId,
                    assetId: asset.id,
                    playbackId: asset.playback_ids?.[0]?.id
                }
            })
    
        }

    

        return NextResponse.json(chapter)
    }
    catch(error){
        console.log("[COURSES_CHAPTER_ID", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}