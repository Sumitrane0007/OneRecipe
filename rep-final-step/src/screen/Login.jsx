
import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";  // Ensure this is the correct path to your Firebase config
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { CommonActions } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If the user is logged in, navigate directly to the next screen
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "About", params: { userName: user.displayName || "User" } }],
          })
        );
      }
    });

    // Clean up the listener when the component unmounts
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userName = user.displayName || "User";

      Alert.alert("Success", "Logged in successfully!");

      // Navigate to the About screen after successful login
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "About", params: { userName } }],
        })
      );
    } catch (error) {
      console.error("Login error:", error.code, error.message); // Added debugging for error details
      if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Please enter a valid email address.");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email.");
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert("Error", "Invalid login credentials. Please check your email and password.");
      } else {
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate("Signup")}>
        Don't have an account? Sign up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
    backgroundColor: "#F9F9F9",
  },
  input: {
    borderWidth: 1,
    padding: wp("3%"),
    marginVertical: hp("2%"),
    borderRadius: 5,
    borderColor: "#ccc",
    fontSize: wp("4%"),
  },
  link: {
    marginTop: hp("3%"),
    color: "blue",
    textAlign: "center",
    fontSize: wp("4%"),
  },
});
