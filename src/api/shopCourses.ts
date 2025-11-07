import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface ShopCourse {
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
  active: number // 1 = active, 0 = inactive
}

export interface CourseLesson {
  id: string
  courseSectionId: string
  title: string
  type: string
  durationSeconds: number
  contentUrl: string
  orderIndex: number
}

export interface CourseSection {
  id: string
  title: string
  orderIndex: number
  lessons: CourseLesson[]
}

export interface CreateCoursePayload {
  title: string
  slug: string
  summary: string
  categoryId: string
  shopId: number
  courseThumbnail: string
}

export type ShopCoursesResponse = ApiResponse<ShopCourse[]>
export type CreateCourseResponse = ApiResponse<ShopCourse>
export type CourseDetailResponse = ApiResponse<ShopCourse>
export type CourseSectionsResponse = ApiResponse<CourseSection[]>

export const shopCourseApi = {
  // ✅ Lấy danh sách khóa học của shop
  getMyCourses: async (): Promise<ShopCoursesResponse> => {
    const { data } = await apiClient.get<ShopCoursesResponse>("/seller/courses/my")
    return data
  },

  // ✅ Tạo khóa học mới
  createCourse: async (payload: CreateCoursePayload): Promise<CreateCourseResponse> => {
    const { data } = await apiClient.post<CreateCourseResponse>("/seller/courses", payload)
    return data
  },

  // ✅ Lấy chi tiết 1 khóa học theo ID
  getCourseById: async (courseId: string): Promise<CourseDetailResponse> => {
    const { data } = await apiClient.get<CourseDetailResponse>(`/seller/courses/${courseId}`)
    return data
  },

  // ✅ Lấy danh sách section và bài học trong khóa học
  getCourseSections: async (courseId: string): Promise<CourseSectionsResponse> => {
    const { data } = await apiClient.get<CourseSectionsResponse>(
      `/seller/courses/${courseId}/sections`
    )
    return data
  },
}
