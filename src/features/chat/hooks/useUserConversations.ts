import { useQuery } from "@tanstack/react-query";
import { chatApi } from "@/api/chat";

export const useUserConversations = () => {
  return useQuery({
    queryKey: ["chat", "userConversations"],
    queryFn: () => chatApi.getUserConversations(),
  });
};
