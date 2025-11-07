import { CourseItem } from "@/api/course";
import { useCourseCategories } from "@/hooks/useCourseCategories";
import { CoursesStackScreenProps } from "@/navigation/types";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCourses } from "../hooks/useCourses";

type Props = CoursesStackScreenProps<"CoursesList">;

export function CoursesScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);
const { data: categoriesData, isLoading: isCategoriesLoading } = useCourseCategories();

  const {
    data: coursesData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useCourses({
    page,
    limit: 10,
    category: selectedCategory || undefined,
  });

  // ✅ Debug logs
  console.log("🎯 CoursesScreen - Raw data:", coursesData);
  console.log("🎯 Type of coursesData:", typeof coursesData);
  console.log("🎯 Is Array?:", Array.isArray(coursesData));

  // ✅ FIX: Check if data is array or object
  const coursesList = Array.isArray(coursesData) 
    ? coursesData 
    : coursesData?.items || [];
  
  const totalItems = Array.isArray(coursesData)
    ? coursesData.length
    : coursesData?.totalItems || 0;
  
  const totalPages = Array.isArray(coursesData)
    ? 1
    : coursesData?.totalPages || 1;

  console.log("📊 Processed data:", {
    coursesList: coursesList.length,
    totalItems,
    totalPages,
  });

  const categories = [
  { id: "", name: "Tất cả" },
  ...(categoriesData?.map((item: any) => ({
    id: item.id,
    name: item.name,
  })) || []),
];


  // ✅ FIX: Filter from coursesList
  const filteredCourses = coursesList.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("🔍 Filtered courses:", filteredCourses.length);

  const renderCourseCard = ({ item }: { item: CourseItem }) => (
    <TouchableOpacity
      className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden mb-4 shadow-sm border border-beige/30 dark:border-dark-border/30"
      // activeOpacity={0.7}
      // onPress={() =>
      //   navigation.navigate("CourseDetail", { courseId: item.id })
      // }
    >
      {/* Thumbnail */}
      <View className="relative">
        {item.courseThumbnail ? (
          <Image
            source={{ uri: item.courseThumbnail }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-gradient-to-br from-mint to-skyBlue dark:from-gold dark:to-lavender items-center justify-center">
            <FontAwesome name="book" size={48} color="white" />
          </View>
        )}

        {/* Active Badge */}
        {item.active === 1 && (
          <View className="absolute top-3 right-3 px-3 py-1 rounded-full bg-mint/90 dark:bg-gold/90">
            <Text className="text-white text-xs font-bold">Đang mở</Text>
          </View>
        )}

        {/* Category Badge */}
        <View className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60">
          <Text className="text-white text-xs font-semibold">
            {item.categoryName}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Title */}
        <Text
          className="text-lg font-bold text-light-text dark:text-dark-text mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>

        {/* Summary */}
        <Text
          className="text-sm text-light-textSecondary dark:text-dark-textSecondary mb-3"
          numberOfLines={2}
        >
          {item.summary}
        </Text>

        {/* Shop Info */}
        <View className="flex-row items-center justify-between pt-3 border-t border-beige/30 dark:border-dark-border/30">
          <View className="flex-row items-center flex-1">
            {item.shopAvatar ? (
              <Image
                source={{ uri: item.shopAvatar }}
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <View className="w-8 h-8 rounded-full bg-mint/20 dark:bg-gold/20 items-center justify-center mr-2">
                <FontAwesome name="user" size={14} color="#ACD6B8" />
              </View>
            )}
            <Text
              className="text-sm font-semibold text-light-text dark:text-dark-text flex-1"
              numberOfLines={1}
            >
              {item.shopName}
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-mint/10 dark:bg-gold/10 items-center justify-center"
            // onPress={() =>
            //   navigation.navigate("CourseDetail", { courseId: item.id })
            // }
          >
            <FontAwesome name="arrow-right" size={14} color="#ACD6B8" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center py-20">
      <FontAwesome name="search" size={64} color="#D1D5DB" />
      <Text className="text-xl font-bold text-light-text dark:text-dark-text mt-4 mb-2">
        Không tìm thấy khóa học
      </Text>
      <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center px-6">
        {searchQuery
          ? `Không có kết quả cho "${searchQuery}"`
          : "Chưa có khóa học nào"}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 items-center justify-center px-6">
      <FontAwesome name="exclamation-circle" size={64} color="#FF6B6B" />
      <Text className="text-xl font-bold text-light-text dark:text-dark-text mt-4 mb-2">
        Có lỗi xảy ra
      </Text>
      <Text className="text-light-textSecondary dark:text-dark-textSecondary text-center mb-6">
        Không thể tải danh sách khóa học. Vui lòng thử lại.
      </Text>
      <TouchableOpacity
        className="px-6 py-3 rounded-full bg-mint dark:bg-gold"
        onPress={() => refetch()}
      >
        <Text className="text-white font-semibold">Thử lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View className="pb-4">
      {/* Title */}
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-3xl font-bold text-light-text dark:text-dark-text">
            Khóa học
          </Text>
          <Text className="text-sm text-light-textSecondary dark:text-dark-textSecondary mt-1">
            {totalItems} khóa học
          </Text>
        </View>
        <View className="w-12 h-12 rounded-2xl bg-mint/10 dark:bg-gold/10 items-center justify-center">
          <FontAwesome name="graduation-cap" size={24} color="#ACD6B8" />
        </View>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-white dark:bg-dark-card rounded-2xl px-4 py-3 border border-beige/30 dark:border-dark-border/30 mb-4">
        <FontAwesome
          name="search"
          size={18}
          color="#9CA3AF"
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-base text-light-text dark:text-dark-text"
          placeholder="Tìm kiếm khóa học..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <FontAwesome name="times-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
{/* Category Filter */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className="mb-2"
  contentContainerStyle={{ paddingRight: 16 }}
>
  {isCategoriesLoading ? (
    <ActivityIndicator size="small" color="#ACD6B8" />
  ) : (
    categories.map((item) => (
      <TouchableOpacity
        key={item.id}
        className={`px-4 py-2 rounded-full mr-2 ${
          selectedCategory === item.id
            ? "bg-mint dark:bg-gold"
            : "bg-white dark:bg-dark-card border border-beige/30 dark:border-dark-border/30"
        }`}
        onPress={() => {
  console.log("📂 Category selected:", item.name);
  setSelectedCategory(item.id === "" ? "" : item.name);
  setPage(1);
}}

      >
        <Text
          className={`font-semibold ${
            selectedCategory === item.id
              ? "text-white"
              : "text-light-text dark:text-dark-text"
          }`}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    ))
  )}
</ScrollView>
    </View>
  );

  const renderFooter = () => {
    const hasMore = page < totalPages;

    return (
      <View className="py-6">
        {hasMore && (
          <TouchableOpacity
            className="py-3 rounded-full bg-white dark:bg-dark-card border border-mint/30 dark:border-gold/30"
            onPress={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
          >
            <Text className="text-center text-mint dark:text-gold font-semibold">
              {isLoading ? "Đang tải..." : "Xem thêm"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Pagination Info */}
        <Text className="text-center text-sm text-light-textSecondary dark:text-dark-textSecondary mt-4">
          Trang {page} / {totalPages}
        </Text>
      </View>
    );
  };

  if (isLoading && page === 1) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-dark-background">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ACD6B8" />
          <Text className="text-light-textSecondary dark:text-dark-textSecondary mt-4">
            Đang tải khóa học...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView className="flex-1 bg-cream dark:bg-dark-background">
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-cream dark:bg-dark-background"
      edges={["top"]}
    >
      <FlatList
        ListHeaderComponent={renderHeader}
        data={filteredCourses}
        renderItem={renderCourseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              console.log("🔄 Pull to refresh");
              refetch();
            }}
            tintColor="#ACD6B8"
            colors={["#ACD6B8"]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}