import { useMutation } from "@tanstack/react-query"
import { courseApi } from "@/api/course"

export const useEnrollCourse = (courseId: string) => {
  return useMutation({
    mutationFn: async () => {
      console.log("📤 Enrolling course:", courseId)
      const response = await courseApi.enrollCourse(courseId)
      console.log("📥 Enrollment Response:", response)
      return response.result
    },
    onError: (error) => {
      console.error("❌ Enroll failed:", error)
    },
    onSuccess: (data) => {
      console.log("✅ Enrolled successfully:", data)
    }
  })
}
