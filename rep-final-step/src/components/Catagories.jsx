import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const Catagories = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );

      // Filter out the category "Beef"
      const filteredCategories = response.data.categories.filter(
        (category) => category.strCategory !== "Beef"
      );

      setCategories(filteredCategories);
      if (filteredCategories.length > 0) {
        setSelectedCategory(filteredCategories[0].strCategory); // Set default category
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        item.strCategory === selectedCategory && styles.selectedCategory,
      ]}
      onPress={() => setSelectedCategory(item.strCategory)}
    >
      <Text
        style={[
          styles.categoryText,
          item.strCategory === selectedCategory && styles.selectedText,
        ]}
      >
        {item.strCategory}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        horizontal
        renderItem={renderCategory}
        keyExtractor={(item) => item.idCategory}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp("2%"),
  },
  categoryItem: {
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1%"),
    marginHorizontal: wp("2%"),
    backgroundColor: "#F0F0F0",
    borderRadius: wp("2%"),
  },
  selectedCategory: {
    backgroundColor: "#FF6347", // Highlight selected category
  },
  categoryText: {
    fontSize: wp("4%"),
    color: "#555",
  },
  selectedText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Catagories;