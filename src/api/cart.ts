import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface CartProductItem {
  productId: string
  productName: string
  productSlug: string
  unitPrice: number
  quantity: number
  lineTotal: number
  productImage: string
}

export interface CartShopGroup {
  shopId: number
  shopName: string
  shopAvatar: string
  items: CartProductItem[]
  subtotal: number
}

export interface CartResult {
  userId: string
  items: CartShopGroup[]
  subtotal: number
}


export interface CheckoutFormPayload {
  shipToName: string
  shipToPhone: string
  shipToAddress: string
  note?: string
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
  checkoutFromCart: async (
    payload: CheckoutFormPayload
  ): Promise<ApiResponse<any>> => {
    // 1. Lấy giỏ hàng hiện tại
    const cartResponse = await cartApi.getCart()
    const cart = cartResponse.result // kiểu CartResult

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống, không thể checkout")
    }

    // 2. Lấy toàn bộ productId trong cart
    const selectedProductIds = cart.items.flatMap((shopGroup) =>
      shopGroup.items.map((item) => item.productId)
    )

    // 3. Build body đúng format backend yêu cầu
    const body = {
      shipToName: payload.shipToName,
      shipToPhone: payload.shipToPhone,
      shipToAddress: payload.shipToAddress,
      note: payload.note ?? "",
      selectedProductIds,
      paymentMethod: "payos",       // mặc định
      walletAmountToUse: null,      // mặc định
      voucherCode: "string",        // tạm default
    }

    // 4. Gọi API checkout
    const { data } = await apiClient.post<ApiResponse<any>>(
      "/orders/checkout",
      body
    )

    return data
  },
}
