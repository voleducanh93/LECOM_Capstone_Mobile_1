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
  isEnrolled: boolean   // ⭐ NEW

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
      orderIndex: number    
      hasLinkedProducts: boolean 
      linkedProducts: {
        id: string
        name: string
        price: number
        thumbnailUrl: string
        shopName: string
      }[]
    }[]
  }[]
}


// ===== Enrollment types =====

export interface CourseEnrollment {
  id: string
  userId: string
  courseId: string
  courseTitle: string
  progress: number
  enrolledAt: string
  completedAt: string | null
}

export type CourseListResponse = ApiResponse<CourseListResult>
export type CourseDetailResponse = ApiResponse<CourseDetailResult>
export type CourseEnrollmentResponse = ApiResponse<CourseEnrollment>

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

  // POST /courses/{courseId}/enroll
  enrollCourse: async (courseId: string): Promise<CourseEnrollmentResponse> => {
    const { data } = await apiClient.post<CourseEnrollmentResponse>(
      `/courses/${courseId}/enroll`
    )
    return data
  },

  // GET /courses/{courseId}/enrollment
  getEnrollment: async (courseId: string): Promise<CourseEnrollmentResponse> => {
    const { data } = await apiClient.get<CourseEnrollmentResponse>(
      `/courses/${courseId}/enrollment`
    )
    return data
  },
}
