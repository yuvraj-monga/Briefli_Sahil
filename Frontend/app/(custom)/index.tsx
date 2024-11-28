import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HomeSvgComponent from "../../Components/HomeSvg";
import HomeSvgComponentActive from "../../Components/HomeSvgActive";
import Explore from "./explore";
import UserProfile from "./user";
import NewsFeed from "./NewsFeed1";

type TabNames = "home" | "profile";

const CustomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabNames>("home");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const tabAnimations = useRef<Record<TabNames, Animated.Value>>({
    home: new Animated.Value(1),
    profile: new Animated.Value(1),
  }).current;

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const stopRotation = () => {
    rotateAnim.stopAnimation();
    rotateAnim.setValue(0);
  };

  const loadIndexContent = () => {
    setIsLoading(true);
    startRotation();
    setTimeout(() => {
      setIsLoading(false);
      stopRotation();
    }, 2000);
  };

  useEffect(() => {
    if (activeTab === "home") {
      loadIndexContent();
    }
  }, [activeTab]);

  const handleRefresh = () => {
    setActiveTab("home");
    loadIndexContent();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      );
    }

    switch (activeTab) {
      case "home":
        return <NewsFeed />;
      case "profile":
        return <UserProfile />;
      default:
        return <NewsFeed />;
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const TabButton: React.FC<{
    name: TabNames;
    icon: JSX.Element;
    activeIcon: JSX.Element;
  }> = ({ name, icon, activeIcon }) => (
    <TouchableOpacity onPress={() => setActiveTab(name)} style={styles.tabItem}>
      <Animated.View
        style={[
          styles.tabContent,
          {
            transform: [
              {
                translateY: tabAnimations[name].interpolate({
                  inputRange: [0.95, 1],
                  outputRange: [-5, 0],
                }),
              },
              { scale: tabAnimations[name] },
            ],
          },
        ]}
      >
        {activeTab === name ? activeIcon : icon}
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.tabBarContainer}>
        <View style={styles.tabBarBackground} />
        <View style={styles.tabBar}>
          <TabButton
            name="home"
            icon={<HomeSvgComponent size={24} color="gray" />}
            activeIcon={<HomeSvgComponentActive size={24} color="#614bb3" />}
          />
          <TouchableOpacity onPress={handleRefresh} style={styles.tabItem}>
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <MaterialIcons
                name="refresh"
                size={28}
                color={isLoading ? "#000000" : "gray"}
              />
            </Animated.View>
          </TouchableOpacity>
          <TabButton
            name="profile"
            icon={
              <MaterialIcons name="person-outline" size={24} color="gray" />
            }
            activeIcon={
              <MaterialIcons name="person" size={24} color="#614bb3" />
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    position: "relative",
    height: 60,
  },
  tabBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#f4ecec",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  tabBar: {
    flexDirection: "row",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CustomNavigation;
