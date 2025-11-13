import { courseApi, CourseDetailResponse } from "@/api/course"
import { useQuery } from "@tanstack/react-query"

export const useCourseBySlug = (slug: string) => {
  return useQuery<CourseDetailResponse, Error>({
    queryKey: ["course", slug], // query key
    queryFn: () => courseApi.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}
