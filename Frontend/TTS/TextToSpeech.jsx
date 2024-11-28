import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import * as Speech from "expo-speech";
import { Ionicons } from "@expo/vector-icons";

const TextToSpeech = ({ newsData, onIndexChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

  const speechOptions = {
    pitch: 1.0,
    rate: 0.6,
    volume: 1.0,
  };

  const startSpeaking = useCallback(() => {
    if (!isPlaying || currentIndex >= newsData.length) {
      console.log(
        `Stopping speech: isPlaying=${isPlaying}, currentIndex=${currentIndex}`
      );
      return;
    }

    const currentNews = newsData[currentIndex];
    const textToSpeak = `${currentNews.title}. ${currentNews.content}`;

    console.log(`Starting speech for item ${currentIndex}: ${textToSpeak}`);

    Speech.speak(textToSpeak, {
      ...speechOptions,
      onStart: () => {
        setIsPlaying(true);
        console.log(`Started speaking item ${currentIndex}`);
      },
      onDone: () => {
        console.log(`Finished speaking item ${currentIndex}`);
        if (currentIndex < newsData.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
          onIndexChange(currentIndex + 1);
        } else {
          setIsPlaying(false);
          setShowControls(false);
        }
      },
      onError: (error) => {
        console.error(`Error speaking item ${currentIndex}: ${error}`);
        setIsPlaying(false);
      },
    });
  }, [isPlaying, currentIndex, newsData, speechOptions]);

  useEffect(() => {
    if (isPlaying) {
      startSpeaking();
    }
  }, [isPlaying, currentIndex, startSpeaking]);

  const stopSpeaking = () => {
    if (!isPlaying) return;
    Speech.stop();
    console.log(`Speech stopped`);
    setIsPlaying(false);
  };

  const handlePress = () => {
    setShowControls(true);
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => setIsPlaying(true));
  };

  const handleControlPress = (action) => {
    if (action === "stop") {
      stopSpeaking();
      setCurrentIndex(0);
      onIndexChange(0);
      setShowControls(false);
    } else if (action === "pause") {
      stopSpeaking();
    }

    Animated.timing(animation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const interpolateScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.playButtonContainer,
          { transform: [{ scale: interpolateScale }] },
        ]}
      >
        {!isPlaying && !showControls && (
          <TouchableOpacity onPress={handlePress} style={styles.button}>
            <Ionicons name="play-circle" size={60} color="white" />
            <Text style={styles.text}>Play All</Text>
          </TouchableOpacity>
        )}
        {showControls && (
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => handleControlPress("stop")}
              style={styles.controlButton}
            >
              <Ionicons name="stop-circle" size={40} color="red" />
              <Text style={styles.text}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleControlPress("pause")}
              style={styles.controlButton}
            >
              <Ionicons name="pause-circle" size={40} color="white" />
              <Text style={styles.text}>Pause</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#554e4ec5",
    borderRadius: 50,
    alignItems: "center",
    zIndex: 1000,
  },
  playButtonContainer: {
    alignItems: "center",
  },
  button: {
    alignItems: "center",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 140,
    marginTop: 10,
  },
  controlButton: {
    alignItems: "center",
  },
  text: {
    color: "white",
    marginTop: 5,
  },
});

export default TextToSpeech;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   Animated,
// } from "react-native";
// import * as Speech from "expo-speech";
// import { Ionicons } from "@expo/vector-icons";

// const TextToSpeech = ({ text, onFinish }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [showControls, setShowControls] = useState(false);
//   const animation = useRef(new Animated.Value(0)).current;

//   const speechOptions = {
//     pitch: 1.0,
//     rate: 0.6,
//     volume: 1.0,
//   };

//   const startSpeaking = () => {
//     if (isPlaying) return;
//     Speech.speak(text, {
//       onStart: () => {
//         setIsPlaying(true);
//       },
//       onDone: () => {
//         setIsPlaying(false);
//         onFinish();
//       },
//       onError: () => {
//         setIsPlaying(false);
//       },
//       ...speechOptions,
//     });
//   };

//   const stopSpeaking = () => {
//     if (!isPlaying) return;
//     Speech.stop();
//     setIsPlaying(false);
//   };

//   const handlePress = () => {
//     setShowControls(true);
//     Animated.spring(animation, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start(() => startSpeaking());
//   };

//   const handleControlPress = (action) => {
//     if (action === "stop" || action === "pause") {
//       setShowControls(false);
//       Animated.timing(animation, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start(() => {
//         if (action === "stop") {
//           stopSpeaking();
//         } else if (action === "pause") {
//           stopSpeaking();
//         }
//       });
//     }
//   };

//   const interpolateScale = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [0.5, 1],
//   });

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.playButtonContainer,
//           { transform: [{ scale: interpolateScale }] },
//         ]}
//       >
//         {!isPlaying && !showControls && (
//           <TouchableOpacity onPress={handlePress} style={styles.button}>
//             <Ionicons name="play-circle" size={60} color="white" />
//             <Text style={styles.text}>Play </Text>
//           </TouchableOpacity>
//         )}
//         {showControls && (
//           <View style={styles.controls}>
//             <TouchableOpacity
//               onPress={() => handleControlPress("stop")}
//               style={styles.controlButton}
//             >
//               <Ionicons name="stop-circle" size={40} color="red" />
//               <Text style={styles.text}>Stop</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => handleControlPress("pause")}
//               style={styles.controlButton}
//             >
//               <Ionicons name="pause-circle" size={40} color="white" />
//               <Text style={styles.text}>Pause</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Animated.View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     backgroundColor: "#554e4ec5",
//     borderRadius: 50,
//     alignItems: "center",
//   },
//   playButtonContainer: {
//     alignItems: "center",
//   },
//   button: {
//     alignItems: "center",
//   },
//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     width: 140,
//     marginTop: 10,
//   },
//   controlButton: {
//     alignItems: "center",
//   },
// });

// export default TextToSpeech;
