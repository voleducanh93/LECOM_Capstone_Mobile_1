import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface CourseCategoryItem {
  id: string
  name: string
  description: string | null
}

export type CourseCategoryListResponse = ApiResponse<CourseCategoryItem[]>

export const courseCategoryApi = {
  getCourseCategories: async (): Promise<CourseCategoryListResponse> => {
    const { data } = await apiClient.get<CourseCategoryListResponse>("/CourseCategory")
    return data
  },
}
