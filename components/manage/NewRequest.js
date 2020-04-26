import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import Card from "../UI/Card";
import Avatar from "../UI/Avatar";

const NewRequest = props => {
  return (
    <TouchableOpacity onPress={props.onSelect}>
      <Card style={styles.newRequest}>
        <View style={styles.summary}>
          <Text style={styles.title}>New Request Task!</Text>
          <Text style={styles.time}>{props.time}</Text>
        </View>
        <View style={styles.dueContainer}>
          <Ionicons
            name={Platform.OS === "android" ? "md-calendar" : "ios-calendar"}
            size={23}
            color={Colors.primary}
          />
          <Text style={styles.name}>{props.name}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  newRequest: {
    backgroundColor: "white",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10
  },
  summary: {
    flexDirection: Platform.OS === "android" ? "column" : "row",
    justifyContent: Platform.OS === "android" ? "flex-start" : "space-between",
    alignItems: Platform.OS === "android" ? "flex-start" : "center",
    width: "100%",
    marginBottom: 15
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  time: {},
  dueContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    marginLeft: 5,
    fontFamily: "open-sans-bold",
    fontSize: 15,
    color: "#888"
  }
});

export default NewRequest;
