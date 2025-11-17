import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

// ==============================================
// TYPES
// ==============================================

export interface ShopOrderDetailItem {
  id: string | null
  productId: string
  productName: string
  productImage: string | null
  quantity: number
  unitPrice: number
  lineTotal: number
  productSku: string | null
  productCategory: string | null
}

export interface ShopOrderItem {
  id: string
  orderCode: string
  userId: string

  shopId: number
  shopName: string

  customerName: string | null

  shipToName: string
  shipToPhone: string
  shipToAddress: string

  subtotal: number
  shippingFee: number
  discount: number
  total: number

  status: string          // "Processing"
  paymentStatus: string   // "Paid"

  balanceReleased: boolean

  createdAt: string
  completedAt: string | null

  details: ShopOrderDetailItem[]
}

export type ShopOrderListResponse = ApiResponse<ShopOrderItem[]>

// ==============================================
// API MODULE
// ==============================================

export const shopOrdersApi = {
  getMyShopOrders: async (): Promise<ShopOrderListResponse> => {
    const { data } = await apiClient.get<ShopOrderListResponse>(
      "/orders/shop/my"
    )
    return data
  },
}
