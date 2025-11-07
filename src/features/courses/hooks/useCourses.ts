import { courseApi, CourseQueryParams } from "@/api/course";
import { useQuery } from "@tanstack/react-query";

export const useCourses = (params?: CourseQueryParams) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: async () => {
      try {
        console.log("📤 Fetching courses with params:", params);
        const response = await courseApi.getCourses(params);
        console.log("📥 Full API Response:", response);
        console.log("📥 Response.result:", response.result);
        
  
        return response.result;
      } catch (error: any) {
        console.error(" Error fetching courses:", error);
        throw error;
      }
    },
    
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};