import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shopCourseApi, CreateLessonPayload } from "@/api/shopCourses";

export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateLessonPayload) => {
      console.log("🚀 Creating lesson:", payload);
      return shopCourseApi.createLesson(payload);
    },
    onSuccess: (data, variables) => {
      console.log("✅ Lesson created successfully:", data);
      
      // ✅ Invalidate tất cả queries liên quan đến shop course detail
      queryClient.invalidateQueries({ 
        queryKey: ["course-sections"],
        exact: false, // Invalidate tất cả queries bắt đầu với "shopCourseDetail"
      });

      // ✅ Hoặc nếu bạn biết courseId, invalidate chính xác
      // queryClient.invalidateQueries({ 
      //   queryKey: ["shopCourseDetail", courseId],
      // });
    },
    onError: (error: any) => {
      console.log("❌ Create Lesson Error:", error);
      console.log("❌ Response data:", error.response?.data);
    },
  });
}