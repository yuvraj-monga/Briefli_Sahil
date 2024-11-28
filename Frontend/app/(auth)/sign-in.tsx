import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

// Warm up the browser to improve performance for OAuth
export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Ensure that the auth session is completed if needed
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  useWarmUpBrowser(); 

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(custom)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      setError(
        "Failed to sign in. Please check your credentials and try again."
      );
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  const onPressGoogle = React.useCallback(async () => {
    try {
      const { createdSessionId } = await startGoogleOAuthFlow({
        redirectUrl: Linking.createURL("/(custom)", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(custom)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  const onPressApple = React.useCallback(async () => {
    try {
      const { createdSessionId } = await startAppleOAuthFlow({
        redirectUrl: Linking.createURL("/(custom)", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(custom)");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerflex}
    >
      <View style={styles.container}>
        <View style={styles.topBackground}>
          <Image
            source={require("../../assets/images/authcompone.png")}
            style={styles.topImage}
          />
        </View>

        <View style={styles.backgroundImgContainer}>
          <Image
            style={styles.backgroundImg}
            source={require("../../assets/images/authcomptwo.png")}
          />
        </View>

        <Text style={styles.title}>Sign In</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#333" />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="E-mail"
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#333" />
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Password"
            secureTextEntry
            onChangeText={setPassword}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity> 

        {/* OAuth Buttons */}
        <Text style={styles.orText}>OR</Text>
        <View style={styles.oauthContainer}>
          <TouchableOpacity
            style={[styles.oauthButton, styles.googleButton]}
            onPress={onPressGoogle}
          >
            <Ionicons
              name="logo-google"
              size={24}
              color="#ffffff"
              style={styles.oauthIcon}
            />
            <Text style={styles.oauthText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.oauthButton, styles.appleButton]}
            onPress={onPressApple}
          >
            <Ionicons
              name="logo-apple"
              size={24}
              color="#FFF"
              style={styles.oauthIcon}
            />
            <Text style={styles.oauthText}>Apple ID</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpLinkContainer}>
          <Text style={styles.signUpLinkText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/sign-up")}>
            <Text style={styles.signUpLinkHighlight}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  containerflex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  topImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontFamily: "UbuntuBold",
    marginTop: 300,
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  backgroundImg: {
    position: "absolute",
    top: 100,
    left: 28,
    right: 0,
  },
  backgroundImgContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 8,
    elevation: 1,
    height: 50,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#5910ec",
    paddingVertical: 16,
    paddingHorizontal: 100,
    borderRadius: 10,
    marginHorizontal: 0,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "UbuntuBold",
  },
  orText: {
    marginVertical: 2,
    fontSize: 16,
    color: "#AAA",
    textAlign: "center",
  },
  oauthContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 4,
  },
  oauthButton: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    backgroundColor: "#FFF",
    elevation: 1, // Adding shadow for a floating effect
    width: 120, // Ensuring buttons are square
    height: 48,
    justifyContent: "center", // Center the icon inside the button
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  googleButton: {
    backgroundColor: "#000000e8", // Google's brand color
  },
  appleButton: {
    backgroundColor: "#000000e8", // Apple's brand color
  },
  oauthIcon: {
    alignSelf: "center",
    color: "#FFF",
  },
  oauthText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  signUpLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpLinkText: {
    color: "#666",
    fontSize: 16,
  },
  signUpLinkHighlight: {
    color: "#6200EE",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

// import { useSignIn } from "@clerk/clerk-expo";
// import { Link, useRouter } from "expo-router";
// import {
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import React from "react";

// export default function SignInScreen() {
//   const { signIn, setActive, isLoaded } = useSignIn();
//   const router = useRouter();

//   const [emailAddress, setEmailAddress] = React.useState("");
//   const [password, setPassword] = React.useState("");

//   const onSignInPress = React.useCallback(async () => {
//     if (!isLoaded) {
//       return;
//     }

//     try {
//       const signInAttempt = await signIn.create({
//         identifier: emailAddress,
//         password,
//       });

//       if (signInAttempt.status === "complete") {
//         await setActive({ session: signInAttempt.createdSessionId });
//         router.replace("/");
//       } else {
//         console.error(JSON.stringify(signInAttempt, null, 2));
//       }
//     } catch (err: any) {
//       console.error(JSON.stringify(err, null, 2));
//     }
//   }, [isLoaded, emailAddress, password]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign In</Text>
//       <TextInput
//         style={styles.input}
//         autoCapitalize="none"
//         value={emailAddress}
//         placeholder="Email Address"
//         onChangeText={setEmailAddress}
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         value={password}
//         placeholder="Password"
//         secureTextEntry
//         onChangeText={setPassword}
//       />
//       <TouchableOpacity style={styles.button} onPress={onSignInPress}>
//         <Text style={styles.buttonText}>Sign In</Text>
//       </TouchableOpacity>
//       <View style={styles.signUpLinkContainer}>
//         <Text style={styles.signUpLinkText}>Don't have an account? </Text>
//         <Link href="/sign-up" style={styles.signUpLinkText}>
//           Sign Up
//         </Link>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#ffffff",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#E0E0E0",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     backgroundColor: "#FFF",
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   button: {
//     backgroundColor: "#6200EE",
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     width: "100%",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   signUpLinkContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   signUpLinkText: {
//     color: "#6200EE",
//     fontSize: 16,
//   },
// });
