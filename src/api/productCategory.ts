import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface ProductCategoryItem {
  id: string
  name: string
  description: string | null
}

export type ProductCategoryListResponse = ApiResponse<ProductCategoryItem[]>

export const productCategoryApi = {
  getProductCategories: async (): Promise<ProductCategoryListResponse> => {
    const { data } = await apiClient.get<ProductCategoryListResponse>("/ProductCategory")
    return data
  },
}
