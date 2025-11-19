import { chatApi } from "@/api/chat";
import { useQuery } from "@tanstack/react-query";

export const useSellerConversations = () => {
  return useQuery({
    queryKey: ["chat", "sellerConversations"],
    queryFn: () => chatApi.getSellerConversations(),
  });
};
