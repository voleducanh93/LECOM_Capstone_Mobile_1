import { chatApi } from "@/api/chat";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => chatApi.sendMessage(conversationId, { content }),
  });
};
