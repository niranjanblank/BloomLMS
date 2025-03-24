import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = async () => {
    const {userId} = await auth()

    if(!userId) throw new Error("Unauthorized")
    return {userId}
}

export const ourFileRouter = {
    // for the image of course
    courseImage: f({image: {maxFileSize: "4MB", maxFileCount: 1}})
        .middleware(()=>handleAuth())
        .onUploadComplete(()=>{}),
    // all the attachments required for course
    courseAttachment: f(["text","image","video","audio","pdf"])
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
    // video for the chapter in course
    chapterVideo: f({video:{maxFileCount:1, maxFileSize: "1024MB" }})
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
