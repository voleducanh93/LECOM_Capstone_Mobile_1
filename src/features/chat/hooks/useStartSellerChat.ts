import { chatApi } from "@/api/chat";
import { useMutation } from "@tanstack/react-query";

export const useStartSellerChat = () => {
  return useMutation({
    mutationFn: (payload: { productId: string }) =>
      chatApi.startSellerChat(payload),
  });
};
