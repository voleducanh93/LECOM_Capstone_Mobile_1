import { cartApi, CheckoutFormPayload } from "@/api/cart"
import { ApiResponse } from "@/types/common"
import { useMutation } from "@tanstack/react-query"

export const useCheckout = () => {
  const {
    mutate: checkout,
    data,
    error,
    isPending,
    isSuccess,
    reset,
  } = useMutation<ApiResponse<any>, Error, CheckoutFormPayload>({
    mutationFn: async (payload) => {
      return await cartApi.checkoutFromCart(payload)
    },
  })

  return {
    checkout,      // hàm gọi check out
    data,          // result trả về từ API
    paymentUrl: data?.result?.paymentUrl, 
    orders: data?.result?.orders,
    isLoading: isPending,
    isSuccess,
    error,
    reset,
  }
}
