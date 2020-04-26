import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";

const Avatar = props => {
  return (
    <TouchableOpacity onPress={props.onSelect}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: props.image }} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginLeft: 20,
    zIndex: 100
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
});

export default Avatar;
