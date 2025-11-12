import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CreateSectionPayload, CreateSectionResponse } from "../../../api/shopCourses"
import { shopCourseApi } from "../../../api/shopCourses"

export const useCreateSection = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateSectionResponse, Error, CreateSectionPayload>({
    mutationFn: (payload) => shopCourseApi.createCourseSection(payload),

    onSuccess: (data, variables) => {
      // ✅ Sau khi tạo section thành công, refetch lại danh sách sections của course đó
      queryClient.invalidateQueries({
        queryKey: ["course-sections", variables.courseId],
      })
      console.log(" Section created successfully:", data)
    },

    onError: (error) => {
      console.error(" Failed to create section:", error)
    },
  })
}
