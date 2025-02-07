import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../firebaseConfig"; // Firebase configuration
import logo from "../../assets/logo.png"; // Replace with your logo

const Home = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Track login status

  // Shared values for animations
  const bounceValue = useSharedValue(0); // For image bounce
  const textScale = useSharedValue(1); // For text pulsing effect

  // Firebase listener to check if the user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return unsubscribe; // Cleanup listener
  }, []);

  // Animate the image and text
  useEffect(() => {
    // Image bounce animation
    bounceValue.value = withRepeat(
      withTiming(-80, { duration: 1000 }), // Move up by 80 units
      -1,
      true // Reverse direction
    );

    // Text pulsing animation
    textScale.value = withRepeat(
      withTiming(1.3, { duration: 1000 }), // Scale up to 1.2x
      -1,
      true // Reverse direction
    );

    // Navigate based on login status after 4 seconds
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        navigation.navigate("About"); // Navigate to Profile if logged in
      } else {
        navigation.navigate("Login"); // Navigate to Login if not logged in
      }
    }, 4000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [isLoggedIn, navigation]);

  // Animated styles for the bouncing logo
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounceValue.value }],
  }));

  // Animated styles for the text pulsing
  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textScale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Animated Image */}
      <Animated.Image source={logo} style={[styles.image, animatedImageStyle]} />
      {/* Animated Text */}
      <Animated.Text style={[styles.title, animatedTextStyle]}>Foody</Animated.Text>
      <Animated.Text style={[styles.subtitle, animatedTextStyle]}>
        Food is always right
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2B48C", // Light brown background
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp("60%"), // Increased width
    height: wp("60%"), // Increased height
    borderRadius: wp("35%"), // Round shape
    marginTop: wp("45%"), // Space below the logo
  },
  title: {
    color: "#FFFFFF", // White text color
    fontSize: wp("8%"), // Large font size
    fontWeight: "bold", // Bold font
    textAlign: "center", // Center align
    marginTop: wp("10%"),
  },
  subtitle: {
    color: "#FFFFFF", // White text color
    fontSize: wp("4%"), // Smaller font size for the tagline
    marginTop: wp("3%"), // Space between title and subtitle
    textAlign: "center", // Center align
    fontStyle: "italic", // Italic style for the tagline
  },
});

export default Home;
