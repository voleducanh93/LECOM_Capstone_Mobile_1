import { useQuery } from "@tanstack/react-query"
import { courseApi } from "@/api/course"

export const useCourseEnrollment = (courseId: string) => {
  return useQuery({
    queryKey: ["courseEnrollment", courseId],
    queryFn: async () => {
      console.log("📤 Checking enrollment for:", courseId)
      const response = await courseApi.getEnrollment(courseId)
      console.log("📥 Enrollment Check Response:", response)
      return response.result
    },
    enabled: !!courseId, // chỉ fetch khi courseId tồn tại
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}
