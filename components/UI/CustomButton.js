import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import Colors from "../../constants/Colors";

const CustomeButton = props => {
  return (
    <TouchableOpacity onPress={props.onSelect} style={styles.buttonContainer}>
      <Icon name={props.icon} color="white" size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default CustomeButton;
