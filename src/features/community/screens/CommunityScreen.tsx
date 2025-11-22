import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCreateCommunityPost } from "../hooks/useCreateCommunityPost";

export function CommunityScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { mutate: createPost, isPending } = useCreateCommunityPost();

  const handleCreatePost = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    createPost(
      { title: title.trim(), body: body.trim() },
      {
        onSuccess: () => {
          Alert.alert("✅ Success", "Post created successfully!");
          setTitle("");
          setBody("");
          setShowCreateModal(false);
        },
        onError: (error: any) => {
          Alert.alert("❌ Error", error.message || "Failed to create post");
        },
      }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-dark-background" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="px-6 py-4 bg-white dark:bg-dark-card border-b border-beige/30 dark:border-dark-border/30">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-light-text dark:text-dark-text">
              Community
            </Text>
            <View className="flex-row items-center mt-2">
              <View className="w-2 h-2 rounded-full bg-mint dark:bg-gold mr-2" />
              <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                Connect & Share
              </Text>
            </View>
          </View>

          {/* Create Post Button */}
          <TouchableOpacity
            className="w-12 h-12 rounded-xl bg-mint dark:bg-gold items-center justify-center shadow-lg"
            onPress={() => setShowCreateModal(true)}
          >
            <FontAwesome name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Empty State */}
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-32 h-32 rounded-full bg-mint/20 dark:bg-gold/20 items-center justify-center mb-6">
            <FontAwesome name="comments" size={60} color="#ACD6B8" />
          </View>
          
          <Text className="text-3xl font-bold text-light-text dark:text-dark-text mb-3 text-center">
            No Posts Yet
          </Text>
          
          <Text className="text-base text-light-textSecondary dark:text-dark-textSecondary text-center mb-8 px-4">
            Be the first to share something with the community!
          </Text>

          <TouchableOpacity
            className="bg-mint dark:bg-gold rounded-2xl py-4 px-8 shadow-lg active:opacity-80"
            onPress={() => setShowCreateModal(true)}
          >
            <View className="flex-row items-center">
              <FontAwesome name="plus" size={18} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Create Post</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 mt-20 bg-cream dark:bg-dark-background rounded-t-3xl">
            {/* Modal Header */}
            <View className="px-6 py-4 bg-white dark:bg-dark-card border-b border-beige/30 dark:border-dark-border/30 rounded-t-3xl">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-light-text dark:text-dark-text">
                    Create Post
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <View className="w-2 h-2 rounded-full bg-mint dark:bg-gold mr-2" />
                    <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary">
                      Share with community
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  className="w-10 h-10 rounded-xl bg-coral/10 items-center justify-center"
                  onPress={() => setShowCreateModal(false)}
                  disabled={isPending}
                >
                  <FontAwesome name="times" size={20} color="#F2A297" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              className="flex-1 px-6 py-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Title Input */}
              <View className="mb-4">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg bg-mint/10 dark:bg-gold/10 items-center justify-center mr-2">
                    <FontAwesome name="header" size={14} color="#ACD6B8" />
                  </View>
                  <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                    Title <Text className="text-coral">*</Text>
                  </Text>
                </View>
                
                <View className="bg-white dark:bg-dark-card rounded-2xl border border-beige/30 dark:border-dark-border/30 px-4">
                  <TextInput
                    className="text-base text-light-text dark:text-dark-text py-4"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter post title"
                    placeholderTextColor="#9CA3AF"
                    editable={!isPending}
                  />
                </View>
              </View>

              {/* Body Input */}
              <View className="mb-6">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 rounded-lg bg-mint/10 dark:bg-gold/10 items-center justify-center mr-2">
                    <FontAwesome name="align-left" size={14} color="#ACD6B8" />
                  </View>
                  <Text className="text-sm font-semibold text-light-text dark:text-dark-text">
                    Content <Text className="text-coral">*</Text>
                  </Text>
                </View>
                
                <View className="bg-white dark:bg-dark-card rounded-2xl border border-beige/30 dark:border-dark-border/30 px-4">
                  <TextInput
                    className="text-base text-light-text dark:text-dark-text py-4 min-h-[200px]"
                    value={body}
                    onChangeText={setBody}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    editable={!isPending}
                  />
                </View>
              </View>

              {/* Info Card */}
              <View className="bg-mint/10 dark:bg-gold/10 rounded-2xl p-4 border border-mint/30 dark:border-gold/30 mb-6">
                <View className="flex-row items-start">
                  <FontAwesome name="info-circle" size={16} color="#ACD6B8" />
                  <Text className="flex-1 ml-3 text-sm text-light-text dark:text-dark-text">
                    Be respectful and follow community guidelines when posting.
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="gap-3">
                <TouchableOpacity
                  className="bg-mint dark:bg-gold rounded-2xl py-4 shadow-lg active:opacity-80"
                  onPress={handleCreatePost}
                  disabled={isPending}
                >
                  <View className="flex-row items-center justify-center">
                    {isPending ? (
                      <>
                        <ActivityIndicator size="small" color="white" />
                        <Text className="text-white font-bold text-lg ml-2">Creating...</Text>
                      </>
                    ) : (
                      <>
                        <FontAwesome name="send" size={18} color="white" />
                        <Text className="text-white font-bold text-lg ml-2">Post</Text>
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-white dark:bg-dark-card rounded-2xl py-4 border-2 border-beige/30 dark:border-dark-border/30 active:opacity-80"
                  onPress={() => setShowCreateModal(false)}
                  disabled={isPending}
                >
                  <Text className="text-light-text dark:text-dark-text font-bold text-lg text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}