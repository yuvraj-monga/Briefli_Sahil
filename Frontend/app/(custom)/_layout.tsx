import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import MenuSvgComponent from "@/Components/MenuSvg";
import { Ionicons } from "@expo/vector-icons";

export default function AuthRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        tabBarActiveTintColor: "#614bb3",
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#f4ecec",
          shadowOpacity: 0,
          elevation: 0,
          borderTopWidth: 0,
          margin: 0,
          padding: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: true,
        headerTitle: "Briefli",
        headerTitleAlign: "center",
        headerTintColor: "#5229DA",
        headerTitleStyle: {
          fontSize: 24,
          fontFamily: "UbuntuBold",
          letterSpacing: 0.1,
        },
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#f4ecec",
          elevation: 0,
        },
        headerRight: () => {
          return (
            <Ionicons name="notifications-outline" size={30} color="#5229DA" />
          );
        },
        headerRightContainerStyle: {
          paddingHorizontal: 16,
        },
        headerLeft: () => {
          return <MenuSvgComponent size={30} color="#5229DA" />;
        },
        headerLeftContainerStyle: {
          paddingHorizontal: 16,
        },
      }}
    />
  );
}
