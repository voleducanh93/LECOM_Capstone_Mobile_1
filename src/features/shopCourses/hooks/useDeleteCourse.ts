import { useMutation, useQueryClient } from "@tanstack/react-query"
import { shopCourseApi } from "@/api/shopCourses"

export const useDeleteCourse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (courseId: string) => shopCourseApi.deleteCourse(courseId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-courses"] })
      queryClient.invalidateQueries({ queryKey: ["course-detail"] })
    },

    onError: (error: any) => {
      console.error("Xóa khóa học thất bại:", error?.response?.data || error)
    },
  })
}
