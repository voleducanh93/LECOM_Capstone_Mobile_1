import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Platform } from "react-native";
import { UserChatListScreen } from "@/features/chat/screens/UserChatListScreen";
import { ChatDetailScreen } from "@/features/chat/screens/ChatDetailScreen";

// ==============================================
// CHAT STACK PARAM LIST
// ==============================================
export type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: {
    conversationId: string;
  };
  StartChat?: {
    productId?: string;
    productSlug?: string;
  };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export function ChatStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "ios" ? "default" : "slide_from_right",
        contentStyle: {
          backgroundColor: "#FAF8F5", // cream background
        },
      }}
    >
      <Stack.Screen
        name="ChatList"
        component={UserChatListScreen}
        options={{
          title: "Messages",
        }}
      />
      
      {/* ✅ Chat Detail Screen */}
      <Stack.Screen
        name="ChatDetail"
        component={ChatDetailScreen}
        options={{
          title: "Chat",
        }}
      />

      {/* TODO: Add StartChat screen (optional) */}
      {/* <Stack.Screen
        name="StartChat"
        component={StartChatScreen}
        options={{
          headerShown: true,
          title: "New Chat",
          presentation: "modal",
          headerStyle: {
            backgroundColor: "#FAF8F5",
          },
          headerTintColor: "#2D3748",
        }}
      /> */}
    </Stack.Navigator>
  );
}