import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface CartItem {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
  productImage: string
}

export interface CartResult {
  userId: string
  items: CartItem[]
  subtotal: number
}

export type CartResponse = ApiResponse<CartResult>

export interface AddToCartPayload {
  productId: string
  quantity: number
}

export interface UpdateCartItemPayload {
  absoluteQuantity?: number // Cập nhật số lượng tuyệt đối
  quantityChange?: number   // Thay đổi số lượng (+/-)
}

export const cartApi = {
  // Lấy giỏ hàng
  getCart: async (): Promise<CartResponse> => {
    const { data } = await apiClient.get<CartResponse>("/cart/")
    return data
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (payload: AddToCartPayload): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.post<ApiResponse<null>>("/cart/items", payload)
    return data
  },

  // Xóa sản phẩm khỏi giỏ
  deleteCartItem: async (productId: string): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/cart/items/${productId}`)
    return data
  },

  // Cập nhật số lượng sản phẩm trong giỏ
  updateCartItem: async (
    productId: string,
    payload: UpdateCartItemPayload
  ): Promise<ApiResponse<null>> => {
    const { data } = await apiClient.patch<ApiResponse<null>>(
      `/cart/items/${productId}`,
      payload
    )
    return data
  },
}
