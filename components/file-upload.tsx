"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import { ourFileRouter, OurFileRouter } from "@/app/api/uploadthing/core"
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter
}

const FileUpload = ({onChange, endpoint}:FileUploadProps) => {
    return ( <UploadDropzone 
        endpoint={endpoint} 
        onClientUploadComplete={(res)=> onChange(res?.[0].ufsUrl)}
        onUploadError={(error: Error)=> {
            toast.error(`${error?.message}`)
        }}
        /> );
}
 
export default FileUpload;