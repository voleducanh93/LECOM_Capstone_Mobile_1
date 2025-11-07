import { useQuery } from "@tanstack/react-query"
import { courseCategoryApi } from "@/api/courseCategory"

export const useCourseCategories = () => {
  return useQuery({
    queryKey: ["course-categories"],
    queryFn: async () => {
      const response = await courseCategoryApi.getCourseCategories()
      return response.result
    },
  })
}
