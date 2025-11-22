import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface CreateCommunityPostPayload {
  title: string
  body: string
}

export interface CommunityPost {
  id: string
  userId: string
  title: string
  body: string
  createdAt: string
  approvalStatus: string
}

export type CreateCommunityPostResponse = ApiResponse<CommunityPost>

export const communityApi = {
  // Tạo bài viết mới
  createPost: async (
    payload: CreateCommunityPostPayload
  ): Promise<CreateCommunityPostResponse> => {
    const { data } = await apiClient.post<CreateCommunityPostResponse>(
      "/community",
      payload
    )
    return data
  },
}
