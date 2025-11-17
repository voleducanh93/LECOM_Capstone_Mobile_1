import { ApiResponse } from "../types/common"
import { apiClient } from "./client"

export interface OrderDetailItem {
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

export interface OrderItem {
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

  status: string
  paymentStatus: string
  balanceReleased: boolean

  createdAt: string
  completedAt: string | null

  details: OrderDetailItem[]
}

export type OrderListResponse = ApiResponse<OrderItem[]>

export const ordersApi = {
  getMyOrders: async (): Promise<OrderListResponse> => {
    const { data } = await apiClient.get<OrderListResponse>("/orders/my")
    return data
  }
}
