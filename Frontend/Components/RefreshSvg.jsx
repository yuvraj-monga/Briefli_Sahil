import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg"; // Correct import for Path and Svg

const HomeSvgComponent = ({ color, size }) => {
  return (
    <View style={styles.container}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        color={color}
      >
        <Path
          d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
          stroke="black"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <Path
          d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
          stroke="black"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="translate(0.5, 0.5)"
        />
        <Path
          d="M2 10C2 10 4.00498 7.26822 5.63384 5.63824C7.26269 4.00827 9.5136 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.89691 21 4.43511 18.2543 3.35177 14.5M2 10V4M2 10H8"
          stroke="black"
          stroke-width="8"
          stroke-linecap="round"
          stroke-linejoin="round"
          transform="translate(0.2, 0.2)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeSvgComponent;
