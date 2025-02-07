
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { auth } from "../../firebaseConfig"; // Firebase auth to update user info
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"; // To fetch recipe details

const Profile = ({ route, navigation }) => {
  const { userName: paramUserName, profileImage } = route.params || {};

  const [displayName, setDisplayName] = useState(paramUserName || "User");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("N/A");
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false); // State to control date picker visibility
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]); // State for bookmarked recipes
  const [showBookmarks, setShowBookmarks] = useState(false); // State to control visibility of bookmarks dropdown
  const [dropdownHeight, setDropdownHeight] = useState(new Animated.Value(0)); // Animation value for dropdown

  useEffect(() => {
    if (paramUserName) {
      setDisplayName(paramUserName); // Dynamically set the username if available
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email); // Get email from Firebase
    }

    fetchBookmarkedRecipes(); // Fetch bookmarked recipes when profile loads
  }, [paramUserName]);

  // Fetch the list of bookmarked recipes from AsyncStorage
  const fetchBookmarkedRecipes = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem("bookmarks");
      const bookmarkedRecipesIds = bookmarks ? JSON.parse(bookmarks) : [];
      if (bookmarkedRecipesIds.length > 0) {
        const recipesData = await Promise.all(
          bookmarkedRecipesIds.map((id) =>
            axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
          )
        );
        setBookmarkedRecipes(recipesData.map((res) => res.data.meals[0]));
      }
    } catch (error) {
      console.error("Error fetching bookmarked recipes:", error);
    }
  };

  // Handle saving the updated profile info
  const handleSave = () => {
    setIsEditing(false);
    // Update Firebase if needed:
    // auth.currentUser.updateProfile({ displayName: displayName });
    // Save DOB to your database (Firestore, etc.)
  };

  // Handle toggling between edit and save mode
  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle date change in DateTimePicker
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dob;
    setShowDatePicker(Platform.OS === 'ios' ? true : false); // Keep date picker open on iOS until manually closed
    setDob(currentDate.toISOString().split('T')[0]); // Set date to "YYYY-MM-DD" format
  };

  // Handle logging out
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace("Login"); // Navigate to login screen after logout
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  // Toggle visibility of bookmarked recipes dropdown
  const toggleBookmarks = () => {
    setShowBookmarks(!showBookmarks);

    // Animate the dropdown
    Animated.timing(dropdownHeight, {
      toValue: showBookmarks ? 0 : bookmarkedRecipes.length * hp("20%"),
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  // Render each bookmarked recipe item
  const renderBookmarkItem = ({ item }) => (
    <View style={styles.bookmarkCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.idMeal })}
        style={styles.bookmarkContainer}
      >
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.bookmarkImage}
        />
        <Text style={styles.bookmarkTitle}>{item.strMeal}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => navigation.goBack()}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <UserCircleIcon size={hp("6%")} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.profileContent}>
        <Text style={styles.title}>Profile</Text>

        {/* Username */}
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter username"
            placeholderTextColor="#888"
          />
        ) : (
          <Text style={styles.displayName}>{displayName}</Text>
        )}

        {/* Email */}
        <Text style={styles.emailText}>{email}</Text>

        {/* Date of Birth */}
        {isEditing ? (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dobButton}
            >
              <Text style={styles.dobButtonText}>Select Date of Birth</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={dob === "N/A" ? new Date() : new Date(dob)}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        ) : (
          <Text style={styles.dobText}>{dob === "N/A" ? "No DOB provided" : `DOB: ${dob}`}</Text>
        )}

        {/* Edit / Save button */}
        <TouchableOpacity
          onPress={handleEdit}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>{isEditing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Show/Hide Bookmarked Recipes */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleBookmarks}
        >
          <Text style={styles.toggleButtonText}>
            {showBookmarks ? "Hide Bookmarked Recipes" : "Show All Bookmarked Recipes"}
          </Text>
        </TouchableOpacity>

        {/* Bookmarked Recipes List (Horizontal Scroll) */}
        <Animated.View style={[styles.bookmarkedContainer, { height: dropdownHeight }]}>
          <FlatList
            data={bookmarkedRecipes}
            renderItem={renderBookmarkItem}
            keyExtractor={(item) => item.idMeal}
            horizontal={true} // This enables horizontal scrolling
            showsHorizontalScrollIndicator={false} // Hides the horizontal scroll indicator
            contentContainerStyle={styles.horizontalList} // Apply custom styles for horizontal list
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp("3%"),
    backgroundColor: "#4CAF50", // Vibrant green background for header
    paddingBottom: hp("2%"),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("1%"),
  },
  profileImage: {
    width: hp("12%"),
    height: hp("12%"),
    borderRadius: hp("6%"),
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#4CAF50", // Matching profile header color
  },
  profileContent: {
    marginTop: hp("3%"),
    marginLeft: wp("6%"),
    marginRight: wp("6%"),
    backgroundColor: "#fff",
    padding: wp("5%"),
    borderRadius: 10,
    elevation: 4, // Adding shadow for a modern feel
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp("2%"),
  },
  displayName: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp("1%"),
  },
  emailText: {
    fontSize: wp("4.5%"),
    color: "#888",
    marginBottom: hp("1.5%"),
  },
  dobText: {
    fontSize: wp("4.5%"),
    color: "#888",
    marginBottom: hp("2%"),
  },
  input: {
    fontSize: wp("4.5%"),
    padding: wp("3%"),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: hp("2%"),
    backgroundColor: "#f0f0f0",
  },
  dobButton: {
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    backgroundColor: "#ddd",
    borderRadius: 10,
    marginBottom: hp("1.5%"),
  },
  dobButtonText: {
    fontSize: wp("4%"),
    color: "#333",
  },
  editButton: {
    marginTop: hp("2%"),
    backgroundColor: "#4CAF50",
    paddingVertical: hp("1.5%"),
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  editButtonText: {
    fontSize: wp("4.5%"),
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: hp("3%"),
    backgroundColor: "#FF6347", // Tomato color for logout
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("10%"),
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: wp("4.5%"),
    color: "#fff",
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: hp("3%"),
    backgroundColor: "#eeeeee",
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("5%"),
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#ccc",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  toggleButtonText: {
    fontSize: wp("4.2%"),
    color: "#333",
    fontWeight: "bold",
  },
  bookmarkedContainer: {
    overflow: "hidden",
    marginTop: hp("2%"),
  },
  horizontalList: {
    paddingVertical: hp("2%"),
  },
  bookmarkCard: {
    marginRight: wp("4%"),
    backgroundColor: "#f8f8f8",
    padding: wp("3%"),
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkImage: {
    width: wp("30%"),
    height: hp("15%"),
    borderRadius: wp("3%"),
  },
  bookmarkTitle: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: hp("1%"),
  },
});

export default Profile;


