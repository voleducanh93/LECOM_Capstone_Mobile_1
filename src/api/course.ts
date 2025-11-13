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

export interface CourseDetailResult {
  id: string
  title: string
  slug: string
  summary: string
  categoryName: string
  courseThumbnail: string
  shop: {
    id: number
    name: string
    avatar: string | null
    description: string
  }
  sections: {
    id: string
    title: string
    orderIndex: number
    lessons: {
      id: string
      title: string
      type: string
      durationSeconds: number
      contentUrl: string
    }[]
  }[]
}


export type CourseListResponse = ApiResponse<CourseListResult>
export type CourseDetailResponse = ApiResponse<CourseDetailResult>

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

  getCourseBySlug: async (slug: string): Promise<CourseDetailResponse> => {
    const { data } = await apiClient.get<CourseDetailResponse>(`/home/courses/${slug}`)
    return data
  },
}
