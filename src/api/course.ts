import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface CourseItem {
  id: string
  title: string
  slug: string
  summary: string
  categoryId: string
  categoryName: string
  shopId: number
  shopName: string
  shopAvatar: string | null
  courseThumbnail: string
  active: number
}

export interface CourseListResult {
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  items: CourseItem[]
}

export type CourseListResponse = ApiResponse<CourseListResult>

export interface CourseQueryParams {
  limit?: number
  category?: string
  page?: number
}

export const courseApi = {
  getCourses: async (params?: CourseQueryParams): Promise<CourseListResponse> => {
    const { data } = await apiClient.get<CourseListResponse>("/home/courses", {
      params,
    })
    return data
  },
}
