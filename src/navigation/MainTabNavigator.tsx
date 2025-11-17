import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text } from "react-native";
import { CoursesStackNavigator } from "./CoursesStackNavigator";
import { PostsStackNavigator } from "./PostsStackNavigator";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { ProductsStackNavigator } from "./ProductsStackNavigator";
import { HomeStackNavigator } from "./HomeStackNavigator"; // ✅ Import HomeStackNavigator

const Tab = createBottomTabNavigator<any>();

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3B82F6",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator} // ✅ Đổi từ HomeScreen thành HomeStackNavigator
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
          headerShown: true, // ✅ Thêm để ẩn header của Tab
        }}
      />
      <Tab.Screen
        name="CoursesTab"
        component={CoursesStackNavigator}
        options={{
          title: "Courses",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📚</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProductsTab"
        component={ProductsStackNavigator}
        options={{
          title: "Products",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📝</Text>,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}