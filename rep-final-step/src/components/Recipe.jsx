import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MasonryList from "@react-native-seoul/masonry-list";
import axios from "axios";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

const Recipe = ({ selectedCategory }) => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (selectedCategory) {
      fetchRecipes();
    }
  }, [selectedCategory]);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`
      );
      setRecipes(response.data.meals || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const renderRecipe = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate("RecipeDetail", { recipeId: item.idMeal })}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
      <Text style={styles.recipeText}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedCategory} Recipes</Text>
      <MasonryList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderRecipe}
        numColumns={2}
        contentContainerStyle={styles.masonryContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("3%"),
    flex: 1,
  },
  title: {
    fontSize: wp("6%"),
    fontWeight: "bold",
    color: "#2e2e2e",
    marginBottom: hp("2%"),
    // marginLeft:wp('0%'),
    textAlign: "center",
    // marginLeft:hp("-1%"),
    
  },
  masonryContent: {
    paddingBottom: hp("5%"),
  },
  recipeCard: {
    margin: wp("2%"),
    backgroundColor: "#FFF",
    borderRadius: wp("4%"),
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  recipeImage: {
    width: "100%",
    height: hp("20%"),
    borderRadius: wp("4%"),
  },
  recipeText: {
    padding: wp("3%"),
    fontSize: wp("4.5%"),
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Recipe;