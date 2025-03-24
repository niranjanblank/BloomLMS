import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";



const CoursesPage = async () => {

    const {userId} = await auth()

    const courses =  await db.course.findMany({
        where: {
            userId: userId as string
        }
    })
    
   
    return ( 
        <div className="p-6">
            <Link href="/teacher/create">
            <Button>
                New Course
            </Button>
            </Link>

            <div className="flex gap-2 ">
            {
            courses.map((course)=>(
                <Link href={`/teacher/courses/${course.id}`} key={course.id}>
                    {course.title}
                </Link>
            ))
            }
            </div>
        </div>
     );
}
 
export default CoursesPage;