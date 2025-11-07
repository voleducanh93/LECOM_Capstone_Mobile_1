import { useQuery } from "@tanstack/react-query"
import { productCategoryApi } from "../api/productCategory"

export const useProductCategories = () => {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const response = await productCategoryApi.getProductCategories()
      return response.result
    },
  })
}
