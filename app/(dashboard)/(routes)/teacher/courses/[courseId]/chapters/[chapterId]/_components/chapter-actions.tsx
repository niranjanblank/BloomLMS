"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "react-hot-toast"
import axios from "axios"
import { ConfirmModal } from "@/components/modals/confirm-modal"
import { useRouter } from "next/navigation"

interface ChapterActionsProps {
  disabled: boolean
  courseId: string
  chapterId: string
  isPublished: boolean
}

const ChapterActions = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const onClick = async () => {
    try {
      setIsLoading(true);
  
      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
        toast.success("Chapter published");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
      router.refresh()
    }
  };
  const onDelete = async () => {
    setDeleting(true)
    try {
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success("Chapter deleted successfully.")
      router.push(`/teacher/courses/${courseId}`)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2 mt-4">
      {/* Publish / Unpublish Button */}
  
        <Button
        onClick={onClick}
          disabled={disabled || deleting}
          variant={isPublished ? "destructive" : "default"}
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
    

      {/* Delete Button */}
      <ConfirmModal
        onConfirm={onDelete}
        loading={deleting}
        title="Delete Chapter?"
        description="This action is irreversible. The chapter and all associated data will be permanently removed."
        confirmText="Delete"
      >
        <Button
          disabled={isLoading || deleting}
          variant="destructive"
        >
          Delete
        </Button>
      </ConfirmModal>
    </div>
  )
}

export default ChapterActions
