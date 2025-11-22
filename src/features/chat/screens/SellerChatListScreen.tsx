import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSellerConversations } from "../hooks/useSellerConversations";
import { useChatRealtime } from "../hooks/useChatRealtime";
import { useQueryClient } from "@tanstack/react-query";
import type { ConversationItem } from "@/api/chat";
import type { ChatStackParamList } from "@/navigation/ChatStackNavigator";

export function SellerChatListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ChatStackParamList>>();
  const queryClient = useQueryClient();
  
  const { data, isLoading, isError, refetch, isRefetching } = useSellerConversations();

  // ✅ Real-time updates for all seller conversations
  useChatRealtime(undefined, (message) => {
    console.log("🔔 New message received (Seller):", message);
    // Invalidate seller conversations to refetch with new message
    queryClient.invalidateQueries({ queryKey: ["chat", "sellerConversations"] });
  });

  const conversations = data?.result || [];

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderConversationItem = ({ item }: { item: ConversationItem }) => (
    <Pressable
      className="bg-white dark:bg-dark-card rounded-2xl mb-3 overflow-hidden border border-beige/30 dark:border-dark-border/30"
      onPress={() => navigation.navigate("ChatDetail", { conversationId: item.id })}
    >
      <View className="p-4">
        <View className="flex-row items-start">
          {/* Product Thumbnail */}
          {item.product.thumbnail ? (
            <Image
              source={{ uri: item.product.thumbnail }}
              className="w-16 h-16 rounded-xl bg-beige/20 mr-3"
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-xl bg-skyBlue/10 dark:bg-gold/10 items-center justify-center mr-3">
              <FontAwesome name="shopping-bag" size={24} color="#A5C4FB" />
            </View>
          )}

          {/* Conversation Info */}
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-1">
              <Text 
                className="text-base font-bold text-light-text dark:text-dark-text flex-1" 
                numberOfLines={1}
              >
                {item.product.name}
              </Text>
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary ml-2">
                {formatTime(item.lastMessageAt)}
              </Text>
            </View>

            {/* Customer Name */}
            <View className="flex-row items-center mb-2">
              <FontAwesome name="user-circle" size={12} color="#9CA3AF" />
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary ml-1">
                Customer inquiry
              </Text>
            </View>

            {/* AI Badge */}
            {item.isAIChat && (
              <View className="flex-row items-center mb-2">
                <View className="px-2 py-0.5 rounded-full bg-lavender/10 dark:bg-gold/10">
                  <Text className="text-[10px] text-lavender dark:text-gold font-bold">
                    🤖 AI Handled
                  </Text>
                </View>
              </View>
            )}

            {/* Last Message */}
            <Text 
              className="text-sm text-light-textSecondary dark:text-dark-textSecondary" 
              numberOfLines={2}
            >
              {item.lastMessage}
            </Text>
          </View>

          {/* Unread Indicator */}
          <View className="w-3 h-3 rounded-full bg-skyBlue ml-2" />
        </View>
      </View>
    </Pressable>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="w-20 h-20 rounded-full bg-beige/20 dark:bg-dark-border/20 items-center justify-center mb-4">
        <FontAwesome name="comments-o" size={40} color="#A5C4FB" />
      </View>
      <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-2">
        No Customer Inquiries
      </Text>
      <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center px-8">
        When customers ask about your products, conversations will appear here
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-dark-background" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A5C4FB" />
          <Text className="text-light-textSecondary dark:text-dark-textSecondary mt-4">
            Loading customer conversations...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-dark-background" edges={['top', 'bottom']}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-20 h-20 rounded-full bg-coral/10 items-center justify-center mb-4">
            <FontAwesome name="exclamation-circle" size={40} color="#FF6B6B" />
          </View>
          <Text className="text-xl font-bold text-light-text dark:text-dark-text mb-2">
            Failed to Load
          </Text>
          <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary text-center mb-4">
            Unable to load customer conversations
          </Text>
          <Pressable
            className="bg-skyBlue dark:bg-gold px-6 py-3 rounded-xl"
            onPress={() => refetch()}
          >
            <Text className="text-white dark:text-dark-text font-bold">
              Try Again
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-dark-background" edges={['top', 'bottom']}>
      <View className="flex-1">
        {/* Header */}
        <View 
          className="px-6 py-4 bg-white dark:bg-dark-card border-b border-beige/30 dark:border-dark-border/30" 
          style={{ paddingTop: Platform.OS === 'ios' ? 16 : 16 }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold text-light-text dark:text-dark-text">
                Customer Chats
              </Text>
              <View className="flex-row items-center mt-2">
                <View className="w-2 h-2 rounded-full bg-skyBlue dark:bg-gold mr-2" />
                <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                  {conversations.length} {conversations.length === 1 ? 'inquiry' : 'inquiries'}
                </Text>
              </View>
            </View>
            <View className="w-14 h-14 rounded-2xl bg-skyBlue/10 dark:bg-gold/10 items-center justify-center">
              <FontAwesome name="comments" size={24} color="#A5C4FB" />
            </View>
          </View>
        </View>

        {/* Conversations List */}
        <FlatList
          data={conversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ 
            padding: 24, 
            paddingBottom: 40,
            flexGrow: 1 
          }}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor="#A5C4FB"
              colors={["#A5C4FB"]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}