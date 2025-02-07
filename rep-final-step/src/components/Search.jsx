import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchSection}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for recipes or foods..."
        value={searchQuery}
        onChangeText={setSearchQuery}  // Update the search query state
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    alignItems: "center",
    marginVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
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
});

export default Search;