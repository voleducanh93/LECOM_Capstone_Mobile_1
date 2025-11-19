import { useEffect } from "react";
import { chatHub } from "@/api/chatHub";

export const useChatRealtime = (
  conversationId?: string,
  onMessage?: (msg: any) => void
) => {
  useEffect(() => {
    if (!conversationId) return;

    const run = async () => {
      await chatHub.connect(conversationId);
      chatHub.onReceiveMessage((msg) => {
        if (onMessage) onMessage(msg);
      });
    };

    run();

    return () => {
      chatHub.offReceiveMessage();
    };
  }, [conversationId]);
};
