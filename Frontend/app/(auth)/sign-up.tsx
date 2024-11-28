import * as React from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useSignUp, useOAuth, useSession, useClerk } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const {} = useSession();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      handleSignUpError(err);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(custom)");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      handleSignUpError(err);
    }
  };

  const handleSignUpError = (err: any) => {
    if (err.clerkError && err.errors && err.errors.length > 0) {
      const errorMessage =
        err.errors[0]?.message || "An unknown error occurred.";
      setError(errorMessage);
    } else {
      setError("An unknown error occurred.");
    }
  };

  const closeModal = () => setError(null);

  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({
    strategy: "oauth_apple",
  });

  const { signOut } = useClerk();

  const onPressGoogle = React.useCallback(async () => {
    try {

      await signOut()
      
      const {
        createdSessionId,
        signIn,
        signUp,
        setActive: Active,
      } = await startGoogleOAuthFlow({
        redirectUrl: Linking.createURL("/(custom)", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        Active!({ session: createdSessionId });
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
        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => router.replace("/(custom)")}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
          <AntDesign name="arrowright" size={20} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Sign up</Text>

        {!pendingVerification && (
          <>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>
            </View>

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
          </>
        )}

        {pendingVerification && (
          <>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Verification Code"
              onChangeText={setCode}
            />
            <TouchableOpacity style={styles.button} onPress={onPressVerify}>
              <Text style={styles.buttonText}>Verify Email</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.signInLinkContainer}>
          <Text style={styles.signInLinkText}>Already have an account? </Text>

          <TouchableOpacity onPress={() => router.push("/sign-in")}>
            <Text style={styles.signInLinkHighlight}>Sign In</Text>
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    height: 90,
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
  forgotPassword: {
    alignItems: "flex-end",
  },
  forgotPasswordText: {
    color: "#6E40C9",
    fontSize: 14,
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
  signInLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signInLinkText: {
    color: "#666",
    fontSize: 16,
  },
  signInLinkHighlight: {
    color: "#6200EE",
    fontSize: 16,
    fontWeight: "bold",
  },
  skipButton: {
    position: "absolute",
    top: 80,
    right: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    backgroundColor: "#ead2d231",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
