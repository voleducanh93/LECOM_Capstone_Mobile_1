import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shopCourseApi } from "@/api/shopCourses"

export function useDeleteSection(courseId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sectionId: string) => shopCourseApi.deleteSection(sectionId),
    onSuccess: () => {
      // ✅ Làm mới danh sách sections sau khi xóa section
      queryClient.invalidateQueries({ queryKey: ["course-sections", courseId] })
      console.log("✅ Section deleted successfully")
    },
    onError: (error: any) => {
      console.error("❌ Delete section failed:", error.response?.data || error.message)
    },
  })
}
