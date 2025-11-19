import { chatApi } from "@/api/chat";
import { useQuery } from "@tanstack/react-query";

export const useConversationMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => chatApi.getConversationMessages(conversationId!),
    enabled: !!conversationId,
  });
};
