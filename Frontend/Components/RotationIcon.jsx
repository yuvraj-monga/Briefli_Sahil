import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";
import RefreshSvg from "./RefreshSvg.jsx";

const RotationIcon = ({ focused, size, color, triggerRefresh }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <RefreshSvg size={size} color={color} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RotationIcon;
