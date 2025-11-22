import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CoursesStackNavigator } from "./CoursesStackNavigator";
import { PostsStackNavigator } from "./PostsStackNavigator";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { ProductsStackNavigator } from "./ProductsStackNavigator";
import { HomeStackNavigator } from "./HomeStackNavigator";

const Tab = createBottomTabNavigator<any>();

export function MainTabNavigator() {
  return (
    <SafeAreaView 
  className="flex-1" 
  edges={['bottom']}

>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#3B82F6",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarActiveTintColor: "#ACD6B8",
          tabBarInactiveTintColor: "#9CA3AF",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F5F5DC",
            paddingBottom: Platform.OS === 'ios' ? 0 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 60 : 68,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginBottom: Platform.OS === 'ios' ? 0 : 4,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>🏠</Text>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="CoursesTab"
          component={CoursesStackNavigator}
          options={{
            title: "Courses",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>📚</Text>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ProductsTab"
          component={ProductsStackNavigator}
          options={{
            title: "Products",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>🛍️</Text>
            ),
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackNavigator}
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Text style={{ fontSize: focused ? 26 : 24 }}>👤</Text>
            ),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}