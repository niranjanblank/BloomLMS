import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = await auth()
    const { courseId, chapterId } = await params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Ensure user owns the course
    const course = await db.course.findFirst({
      where: {
        id: courseId,
        userId,
      },
    })

    if (!course) {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    })

    return NextResponse.json(chapter)
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
