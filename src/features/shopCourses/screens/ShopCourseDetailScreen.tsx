import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useShopCourseDetail } from "../hooks/useShopCourseDetail";
import { CourseLesson, CourseSection } from "@/api/shopCourses";

export function ShopCourseDetailScreen({ navigation, route }: any) {
  const { courseId } = route.params;
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const { course, sections, isLoading, isError } = useShopCourseDetail(courseId);

  console.log("📚 Shop Course Detail:", { course, sections, isLoading, isError });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTotalLessons = () => {
    if (!sections) return 0;
    return sections.reduce((total, section) => total + section.lessons.length, 0);
  };

  const getTotalDuration = () => {
    if (!sections) return 0;
    return sections.reduce(
      (total, section) =>
        total +
        section.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0),
      0
    );
  };

  const renderLesson = (lesson: CourseLesson, index: number) => (
    <TouchableOpacity
      key={lesson.id}
      className="flex-row items-center p-4 bg-beige/20 dark:bg-dark-border/20 rounded-xl mb-2"
      activeOpacity={0.7}
      onPress={() => {
        Alert.alert("Lesson", `Playing: ${lesson.title}`);
      }}
    >
      {/* Lesson Number */}
      <View className="w-10 h-10 rounded-full bg-mint/20 dark:bg-gold/20 items-center justify-center mr-3">
        <Text className="text-mint dark:text-gold font-bold">{index + 1}</Text>
      </View>

      {/* Lesson Info */}
      <View className="flex-1">
        <Text
          className="text-base font-semibold text-light-text dark:text-dark-text mb-1"
          numberOfLines={2}
        >
          {lesson.title}
        </Text>
        <View className="flex-row items-center">
          <FontAwesome name="video-camera" size={12} color="#9CA3AF" />
          <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary ml-1">
            {lesson.type}
          </Text>
          <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary mx-2">
            •
          </Text>
          <FontAwesome name="clock-o" size={12} color="#9CA3AF" />
          <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary ml-1">
            {formatDuration(lesson.durationSeconds)}
          </Text>
        </View>
      </View>

      {/* Play Icon */}
      <View className="w-10 h-10 rounded-full bg-mint/10 dark:bg-gold/10 items-center justify-center">
        <FontAwesome name="play" size={14} color="#ACD6B8" />
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: CourseSection) => {
    const isExpanded = expandedSections.has(section.id);

    return (
      <View
        key={section.id}
        className="mb-4 bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-beige/30 dark:border-dark-border/30"
      >
        {/* Section Header */}
        <TouchableOpacity
          className="flex-row items-center justify-between p-4"
          onPress={() => toggleSection(section.id)}
          activeOpacity={0.7}
        >
          <View className="flex-1 flex-row items-center">
            <View className="w-8 h-8 rounded-lg bg-mint/10 dark:bg-gold/10 items-center justify-center mr-3">
              <FontAwesome name="folder-open" size={16} color="#ACD6B8" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-light-text dark:text-dark-text mb-1">
                {section.title}
              </Text>
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary">
                {section.lessons.length} {section.lessons.length === 1 ? 'lesson' : 'lessons'}
              </Text>
            </View>
          </View>

          {/* Expand Icon */}
          <FontAwesome
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#9CA3AF"
          />
        </TouchableOpacity>

        {/* Lessons List */}
        {isExpanded && (
          <View className="px-4 pb-4">
            {section.lessons.map((lesson, index) => renderLesson(lesson, index))}
          </View>
        )}
      </View>
    );
  };

  const renderLoading = () => (
    <View className="flex-1 bg-cream dark:bg-dark-background">
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#ACD6B8" />
        <Text className="text-light-textSecondary dark:text-dark-textSecondary mt-4">
          Loading course...
        </Text>
      </View>
    </View>
  );

  const renderError = () => (
    <View className="flex-1 bg-cream dark:bg-dark-background">
      <View className="flex-1 items-center justify-center px-6">
        <FontAwesome name="exclamation-circle" size={64} color="#FF6B6B" />
        <Text className="text-xl font-bold text-light-text dark:text-dark-text mt-4 mb-2">
          Something went wrong
        </Text>
        <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center mb-6">
          Unable to load course information
        </Text>
        <TouchableOpacity
          className="px-6 py-3 rounded-full bg-mint dark:bg-gold"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) return renderLoading();
  if (isError || !course) return renderError();

  return (
    <View className="flex-1 bg-cream dark:bg-dark-background">
      {/* Header */}
      <View 
        className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-dark-card border-b border-beige/30 dark:border-dark-border/30"
        style={{ paddingTop: Platform.OS === 'ios' ? 50 : 16 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-beige/50 dark:bg-dark-border/50 items-center justify-center"
        >
          <FontAwesome name="arrow-left" size={18} color="#ACD6B8" />
        </TouchableOpacity>

        <Text
          className="flex-1 text-xl font-bold text-light-text dark:text-dark-text text-center mx-4"
          numberOfLines={1}
        >
          {course.title}
        </Text>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-beige/50 dark:bg-dark-border/50 items-center justify-center"
          onPress={() => {
            Alert.alert("Edit", "Feature coming soon");
          }}
        >
          <FontAwesome name="edit" size={18} color="#ACD6B8" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Course Thumbnail */}
        <View className="relative">
          {course.courseThumbnail ? (
            <Image
              source={{ uri: course.courseThumbnail }}
              className="w-full h-64"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-64 bg-gradient-to-br from-mint to-skyBlue dark:from-gold dark:to-lavender items-center justify-center">
              <FontAwesome name="book" size={64} color="white" />
            </View>
          )}

          {/* Status Badge */}
          <View
            className={`absolute top-4 right-4 px-4 py-2 rounded-full ${
              course.active === 1
                ? "bg-mint/90 dark:bg-gold/90"
                : "bg-coral/90"
            }`}
          >
            <Text className="text-white text-xs font-bold">
              {course.active === 1 ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        {/* Course Info */}
        <View className="px-6 py-6">
          {/* Category */}
          <View className="flex-row items-center mb-4">
            <View className="px-3 py-1 rounded-full bg-mint/10 dark:bg-gold/10">
              <Text className="text-mint dark:text-gold text-xs font-semibold">
                {course.categoryName}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-light-text dark:text-dark-text mb-3">
            {course.title}
          </Text>

          {/* Summary */}
          <Text className="text-base text-light-textSecondary dark:text-dark-textSecondary mb-6 leading-6">
            {course.summary}
          </Text>

          {/* Stats */}
          <View className="flex-row bg-white dark:bg-dark-card rounded-2xl p-4 mb-6 border border-beige/30 dark:border-dark-border/30">
            <View className="flex-1 items-center border-r border-beige/30 dark:border-dark-border/30">
              <FontAwesome name="list" size={20} color="#ACD6B8" />
              <Text className="text-2xl font-bold text-light-text dark:text-dark-text mt-2">
                {sections?.length || 0}
              </Text>
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                {sections?.length === 1 ? 'Section' : 'Sections'}
              </Text>
            </View>

            <View className="flex-1 items-center border-r border-beige/30 dark:border-dark-border/30">
              <FontAwesome name="play-circle" size={20} color="#ACD6B8" />
              <Text className="text-2xl font-bold text-light-text dark:text-dark-text mt-2">
                {getTotalLessons()}
              </Text>
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                {getTotalLessons() === 1 ? 'Lesson' : 'Lessons'}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <FontAwesome name="clock-o" size={20} color="#ACD6B8" />
              <Text className="text-2xl font-bold text-light-text dark:text-dark-text mt-2">
                {Math.floor(getTotalDuration() / 60)}
              </Text>
              <Text className="text-xs text-light-textSecondary dark:text-dark-textSecondary mt-1">
                {Math.floor(getTotalDuration() / 60) === 1 ? 'Minute' : 'Minutes'}
              </Text>
            </View>
          </View>

          {/* Sections Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-light-text dark:text-dark-text">
              Course Content
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (sections && sections.length > 0) {
                  const allExpanded = sections.every((s) =>
                    expandedSections.has(s.id)
                  );
                  if (allExpanded) {
                    setExpandedSections(new Set());
                  } else {
                    setExpandedSections(new Set(sections.map((s) => s.id)));
                  }
                }
              }}
            >
              <Text className="text-sm text-mint dark:text-gold font-semibold">
                {sections?.every((s) => expandedSections.has(s.id))
                  ? "Collapse All"
                  : "Expand All"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sections List */}
          {sections && sections.length > 0 ? (
            sections.map((section) => renderSection(section))
          ) : (
            <View className="bg-white dark:bg-dark-card rounded-2xl p-8 items-center border border-beige/30 dark:border-dark-border/30">
              <FontAwesome name="folder-open-o" size={48} color="#D1D5DB" />
              <Text className="text-lg font-bold text-light-text dark:text-dark-text mt-4 mb-2">
                No Content Yet
              </Text>
              <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center">
                Add sections and lessons to complete your course
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="px-6 py-4 bg-white dark:bg-dark-card border-t border-beige/30 dark:border-dark-border/30">
        <TouchableOpacity
          className="bg-mint dark:bg-gold rounded-full py-4 items-center"
          onPress={() => {
            Alert.alert("Add Content", "Feature coming soon");
          }}
        >
          <Text className="text-white text-base font-bold">
            + Add New Section
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}