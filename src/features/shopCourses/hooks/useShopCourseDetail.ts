import { useQuery } from "@tanstack/react-query"
import { shopCourseApi } from "../../../api/shopCourses"

export const useShopCourseDetail = (courseId: string) => {
  const courseQuery = useQuery({
    queryKey: ["course-detail", courseId],
    queryFn: () => shopCourseApi.getCourseById(courseId),
    enabled: !!courseId,
  })

  const sectionsQuery = useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: () => shopCourseApi.getCourseSections(courseId),
    enabled: !!courseId,
  })

  return {
    course: courseQuery.data?.result,
    sections: sectionsQuery.data?.result,
    isLoading: courseQuery.isLoading || sectionsQuery.isLoading,
    isError: courseQuery.isError || sectionsQuery.isError,
  }
}
