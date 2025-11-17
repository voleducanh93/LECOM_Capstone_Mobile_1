import { useQuery } from "@tanstack/react-query"
import { shopOrdersApi } from "@/api/shopOrders"

export const useMyShopOrders = () => {
  return useQuery({
    queryKey: ["shopOrders"],
    queryFn: shopOrdersApi.getMyShopOrders,
  })
}
