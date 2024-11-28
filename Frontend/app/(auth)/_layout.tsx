import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerTitle: "Briefli",
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 24,
          fontFamily: "UbuntuBold",
        },
      }}
    />
  );
}