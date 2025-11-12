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

export interface CreateSectionPayload {
  courseId: string
  title: string
  orderIndex: number
}

export interface CreateLessonPayload {
  courseSectionId: string
  title: string
  durationSeconds: number
  contentUrl: string
  orderIndex: number
  type?: string // default "Video"
}

export interface UpdateCoursePayload {
  title: string
  summary: string
  categoryId: string
  courseThumbnail: string
  active: number
}

export type ShopCoursesResponse = ApiResponse<ShopCourse[]>
export type CreateCourseResponse = ApiResponse<ShopCourse>
export type CourseDetailResponse = ApiResponse<ShopCourse>
export type CourseSectionsResponse = ApiResponse<CourseSection[]>
export type CreateSectionResponse = ApiResponse<CourseSection>
export type CreateLessonResponse = ApiResponse<CourseLesson>

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

  // ✅ Cập nhật khóa học
  updateCourse: async (
    courseId: string,
    payload: UpdateCoursePayload
  ): Promise<CreateCourseResponse> => {
    const { data } = await apiClient.put<CreateCourseResponse>(
      `/seller/courses/${courseId}`,
      payload
    )
    return data
  },

  // 🗑️ Xóa khóa học
  deleteCourse: async (courseId: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/seller/courses/${courseId}`)
    return data
  },

  // ✅ Lấy danh sách section và bài học trong khóa học
  getCourseSections: async (courseId: string): Promise<CourseSectionsResponse> => {
    const { data } = await apiClient.get<CourseSectionsResponse>(
      `/seller/courses/${courseId}/sections`
    )
    return data
  },

  // ✅ Tạo section mới trong khóa học
  createCourseSection: async (payload: CreateSectionPayload): Promise<CreateSectionResponse> => {
    const { data } = await apiClient.post<CreateSectionResponse>(
      "/seller/courses/sections",
      payload
    )
    return data
  },

  // ✅ Tạo lesson mới trong section (mặc định type = "Video")
  createLesson: async (payload: CreateLessonPayload): Promise<CreateLessonResponse> => {
    const { data } = await apiClient.post<CreateLessonResponse>("/seller/courses/lessons", {
      ...payload,
      type: payload.type || "Video",
    })
    return data
  },

  // 🗑️ Xóa lesson theo ID
  deleteLesson: async (lessonId: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/seller/courses/lessons/${lessonId}`
    )
    return data
  },

  // 🗑️ Xóa section theo ID
  deleteSection: async (sectionId: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(
      `/seller/courses/sections/${sectionId}`
    )
    return data
  },
}
