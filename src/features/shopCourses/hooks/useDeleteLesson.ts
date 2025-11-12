import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shopCourseApi } from "@/api/shopCourses"

export function useDeleteLesson(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lessonId: string) => shopCourseApi.deleteLesson(lessonId),
    onSuccess: () => {
      // ✅ Làm mới danh sách sections sau khi xóa lesson
      queryClient.invalidateQueries({ queryKey: ["course-sections", courseId] })
      console.log("✅ Lesson deleted successfully")
    },
    onError: (error: any) => {
      console.error("❌ Delete lesson failed:", error.response?.data || error.message)
    },
  })
}
