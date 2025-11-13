import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cartApi, UpdateCartItemPayload } from "@/api/cart"

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      payload,
    }: {
      productId: string
      payload: UpdateCartItemPayload
    }) => cartApi.updateCartItem(productId, payload),

    onSuccess: () => {
      // Làm mới giỏ hàng sau khi update
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },

    onError: (error: any) => {
      console.error("Cập nhật giỏ hàng thất bại:", error)
    },
  })
}
