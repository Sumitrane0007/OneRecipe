import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

const Loader = ({ navigation, route }) => {
  const { isLoggedIn } = route.params; // Get the login status from navigation params

  useEffect(() => {
    // Navigate after a brief delay
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.navigate("About"); // Navigate to About if logged in
      } else {
        navigation.navigate("Login"); // Navigate to Login if not logged in
      }
    }, 2000); // 2-second delay

    return () => clearTimeout(timer); // Cleanup timer
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ActivityIndicator size="large" color="#FFFFFF" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4A90E2", // Blue background
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Loader;
