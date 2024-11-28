import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg"; // Correct import for Path and Svg

const MenuSvgComponent = ({ color, size }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3 12H21M3 6H21M3 18H15"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MenuSvgComponent;
