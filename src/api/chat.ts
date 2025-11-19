import { ApiResponse } from "../types/common";
import { apiClient } from "./client";

// ======================
// 📌 TYPES
// ======================

export interface ChatProductInfo {
  id: string;
  name: string;
  thumbnail: string | null;
}

export interface ConversationItem {
  id: string;
  isAIChat: boolean;
  buyerId: string;
  sellerId: string;
  product: ChatProductInfo;
  lastMessage: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

// Response types
export type StartChatResponse = ApiResponse<ConversationItem>;
export type SendMessageResponse = ApiResponse<ChatMessage>;
export type ConversationListResponse = ApiResponse<ConversationItem[]>;
export type MessageListResponse = ApiResponse<ChatMessage[]>;

// ======================
// 📌 PAYLOADS
// ======================

export interface StartChatPayload {
  productId: string;
}

export interface SendMessagePayload {
  content: string;
}

// ======================
// 📌 API MODULE
// ======================

export const chatApi = {
  // Bắt đầu chat giữa Buyer → Seller
  startSellerChat: async (
    payload: StartChatPayload
  ): Promise<StartChatResponse> => {
    const { data } = await apiClient.post<StartChatResponse>(
      "/chat/seller/start",
      payload
    );
    return data;
  },

  // Gửi tin nhắn vào 1 conversation
  sendMessage: async (
    conversationId: string,
    payload: SendMessagePayload
  ): Promise<SendMessageResponse> => {
    const { data } = await apiClient.post<SendMessageResponse>(
      `/chat/${conversationId}/message`,
      payload
    );
    return data;
  },

  // Lấy danh sách conversation cho User (buyer)
  getUserConversations: async (): Promise<ConversationListResponse> => {
    const { data } = await apiClient.get<ConversationListResponse>(
      "/chat/user"
    );
    return data;
  },

  // Lấy danh sách conversation cho Seller
  getSellerConversations: async (): Promise<ConversationListResponse> => {
    const { data } = await apiClient.get<ConversationListResponse>(
      "/chat/seller"
    );
    return data;
  },

  // Lấy toàn bộ messages của 1 cuộc hội thoại
  getConversationMessages: async (
    conversationId: string
  ): Promise<MessageListResponse> => {
    const { data } = await apiClient.get<MessageListResponse>(
      `/chat/${conversationId}/messages`
    );
    return data;
  },
};
