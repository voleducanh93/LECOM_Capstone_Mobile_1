import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { HomeScreen } from "@/features/home/screens/HomeScreen";
import { CourseDetailScreen } from "@/features/courses/screens/CourseDetailScreen";
import { ProductDetailScreen } from "@/features/products/screens/ProductDetailScreen";

export type HomeStackParamList = {
  HomeMain: undefined;
  CourseDetail: { slug: string };
  ProductDetail: { slug: string };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}