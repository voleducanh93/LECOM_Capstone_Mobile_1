import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shopCourseApi, UpdateCoursePayload } from "@/api/shopCourses"

export const useUpdateCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ courseId, payload }: { courseId: string; payload: UpdateCoursePayload }) =>
      shopCourseApi.updateCourse(courseId, payload),

    onSuccess: (_data, variables) => {
      // Làm mới lại dữ liệu khóa học và danh sách
      queryClient.invalidateQueries({ queryKey: ["shop-courses"] })
      queryClient.invalidateQueries({ queryKey: ["course-detail", variables.courseId] })
    },

    onError: (error: any) => {
      console.error("❌ Update course failed:", error.response?.data || error)
    },
  })
}
