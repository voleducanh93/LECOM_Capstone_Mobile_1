import { CourseDetailScreen } from "@/features/courses/screens/CourseDetailScreen";
import { CoursesScreen } from "@/features/courses/screens/CoursesScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { CoursesStackParamList } from "./types";
import { LessonPlayerScreen } from "@/features/courses/screens/LessonPlayerScreen";

const Stack = createNativeStackNavigator<CoursesStackParamList>();

export function CoursesStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3B82F6",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="CoursesList"
        component={CoursesScreen}
        options={{
          title: "Danh sách khóa học",
        }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{
          title: "Chi tiết khóa học",
        }}
      />
      <Stack.Screen
        name="LessonPlayer"
        component={LessonPlayerScreen}
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
}
