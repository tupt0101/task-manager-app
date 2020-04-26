import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../../constants/Colors";
import Card from "../UI/Card";

const ProjectItem = props => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => {
          setShowOptions(prevState => !prevState);
        }}
      >
        <Card style={styles.projectItem}>
          <View style={styles.summary}>
            {/* <Ionicons name={props.icon} size={23} color={Colors.primary} /> */}
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.projectId}>{props.projectId}</Text>
          </View>
          {showOptions && props.children}
        </Card>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: "100%"
  },
  projectItem: {
    backgroundColor: "white",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 20
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 2
  },
  title: {
    marginLeft: 10,
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  projectId: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888"
  },
  due: {
    fontFamily: "open-sans",
    fontSize: 16,
    color: "#888"
  }
});

export default ProjectItem;
