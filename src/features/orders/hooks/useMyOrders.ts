import { ordersApi } from "@/api/orders"
import { useQuery } from "@tanstack/react-query"

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: ordersApi.getMyOrders,
  })
}
