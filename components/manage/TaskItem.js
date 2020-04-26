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

const TaskItem = props => {
  const [showOptions, setShowOptions] = useState(false);

  const currentDate = new Date();

  return (
    <TouchableOpacity
      onPress={() => {
        setShowOptions(prevState => !prevState);
      }}
    >
      <Card style={styles.taskItem}>
        <View style={styles.summary}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.assignee}>{props.projectId}</Text>
          {/* <Avatar source={props.assignee} style={{ width: 20, height: 20 }} /> */}
        </View>
        <View style={styles.dueContainer}>
          <Ionicons
            name={Platform.OS === "android" ? "md-calendar" : "ios-calendar"}
            size={23}
            color={Colors.primary}
          />
          <Text style={styles.due}>{props.due}</Text>
        </View>
        {showOptions && props.children}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    backgroundColor: "white",
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 16
  },
  assignee: {
    fontFamily: "open-sans",
    fontSize: 18,
    color: "#888"
  },
  dueContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  due: {
    marginLeft: 5,
    fontFamily: "open-sans-bold",
    fontSize: 14,
    color: "#888"
  },
  dueWarning: {
    marginLeft: 5,
    fontFamily: "open-sans-bold",
    fontSize: 14,
    color: "orange"
  },
  dueDead: {
    marginLeft: 5,
    fontFamily: "open-sans-bold",
    fontSize: 14,
    color: "red"
  }
});

export default TaskItem;
