import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserCircleIcon } from "react-native-heroicons/outline";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import Catagories from "../components/Catagories";
import Recipe from "../components/Recipe";
import { useRoute, useNavigation, useFocusEffect } from "@react-navigation/native";
import { auth } from "../../firebaseConfig";
import axios from "axios";

const About = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userName: paramUserName, profileImage } = route.params || {};
  const [selectedCategory, setSelectedCategory] = useState("");
  const [displayName, setDisplayName] = useState(paramUserName || "User");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!paramUserName) {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setDisplayName(currentUser.displayName || "User");
      } else {
        console.warn("No userName provided and no current user found.");
      }
    }
  }, [paramUserName]);

  const handleSearchInput = async (text) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults([]); // Clear results if search query is empty
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${text}`
      );
      setSearchResults(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const renderSearchSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.idMeal })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.suggestionImage} />
      <Text style={styles.suggestionText}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  // Reset search query and results when the About screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // Reset search query and results on screen focus
      setSearchQuery("");
      setSearchResults([]);
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="black" />

      {/* Top Header Section */}
      <View style={styles.header}>
        <View style={styles.imageCircle}>
          <Image
            source={require("../../assets/file.png")}
            style={styles.circularLogo}
          />
        </View>
        {/* <TouchableOpacity
  style={styles.profileImageContainer}
  onPress={() => navigation.navigate("Profile", { userName: displayName })}
>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <UserCircleIcon size={hp("6%")} color="#000" />
          )}
        </TouchableOpacity> */}
            <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => navigation.navigate("Profile", { userName: displayName })}
        >
          <UserCircleIcon size={hp("6%")} color="#000" />
        </TouchableOpacity>
         
      </View>

      {/* Greeting Section */}
      <View style={styles.greeting}>
        <Text style={styles.helloText}>Hello, {displayName}</Text>
        <Text style={styles.subtitleText}>
          Make your own food, stay at home
        </Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for recipes or food..."
          value={searchQuery}
          onChangeText={handleSearchInput}
        />
      </View>

      {/* Display Search Results If Search Query Exists */}
      {searchQuery && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderSearchSuggestion}
          style={styles.suggestionsList}
          keyboardShouldPersistTaps="handled"
        />
      )}

      {/* Categories and Recipe Sections Always Display */}
      <Catagories
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Recipe selectedCategory={selectedCategory} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  profileImageContainer: {
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp("9%"),
    paddingVertical: hp("1%"),
  },
  imageCircle: {
    width: hp("6%"),
    height: hp("6%"),
    borderRadius: hp("3%"),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  circularLogo: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  greeting: {
    marginTop: wp("5%"),
    marginLeft: wp("7%"),
  },
  helloText: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#000",
  },
  subtitleText: {
    fontSize: wp("4%"),
    color: "#555",
    marginTop: hp("0.5%"),
  },
  searchSection: {
    marginHorizontal: wp("5%"),
    marginBottom: hp("2%"),
  },
  searchInput: {
    width: "100%",
    height: hp("6%"),
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: wp("3%"),
    fontSize: wp("4%"),
  },
  suggestionsList: {
    marginHorizontal: wp("5%"),
    maxHeight: hp("30%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: hp("2%"),
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  suggestionImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: wp("3%"),
  },
  suggestionText: {
    fontSize: wp("4%"),
    color: "#333",
  },
});

export default About;

