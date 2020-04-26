import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  Platform
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import SegmentedControlTab from "react-native-segmented-control-tab";

import HeaderButton from "../../components/UI/HeaderButton";
import CustomButton from "../../components/UI/CustomButton";
import TaskItem from "../../components/manage/TaskItem";
import Colors from "../../constants/Colors";
import * as tasksActions from "../../store/actions/tasks";

const ProjectDetailScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedTab, setSelectedTab] = useState(0);

  const role = useSelector(state => state.auth.role);
  const accountId = useSelector(state => state.auth.userId);

  const projectId = props.navigation.getParam("projectId");
  const project = useSelector(state =>
    state.projects.projects.find(prj => prj.id === projectId)
  );

  // Get task of project
  const tasks = useSelector(state =>
    state.tasks.tasks
      .filter(task => task.projectId === project.id)
      .filter(task => task.request === 0)
  );

  // Filter task by status
  const [taskList, setTaskList] = useState(
    tasks.filter(task => task.status === 0)
  );
  const tabChangeHander = index => {
    setSelectedTab(index);
    if (index === 0) {
      setTaskList(tasks.filter(task => task.status === 0));
    } else if (index === 1) {
      setTaskList(tasks.filter(task => task.status === 1 || task.status === 2));
    } else {
      setTaskList(tasks.filter(task => task.status === 3 || task.status === 4));
    }
  };
  const dispatch = useDispatch();

  const onEditHandler = (id, name) => {
    props.navigation.navigate("EditTask", {
      taskId: id,
      taskName: name
    });
  };

  const onDeleteHandler = id => {
    Alert.alert("Are you sure?", "Do you really want to delete this task?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(tasksActions.deleteTask(id));
        }
      }
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.number}>{tasks.length}</Text>
      </View>
      <SegmentedControlTab
        tabsContainerStyle={styles.segment}
        values={["Open", "In Progress", "Done"]}
        selectedIndex={selectedTab}
        onTabPress={tabChangeHander}
      />
      {taskList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "open-sans", fontSize: 15, color: "black" }}
          >
            No tasks found! Maybe start creating some.
          </Text>
        </View>
      ) : (
        <FlatList
          data={taskList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <TaskItem
              title={itemData.item.name}
              assignee={itemData.item.assignee}
              due={itemData.item.readableDue}
              onSelect={() => {}}
            >
              <View style={styles.options}>
                <Button
                  title="Edit"
                  onPress={() => {
                    onEditHandler(itemData.item.id, itemData.item.name);
                  }}
                />
                {role === 1 && (
                  <Button
                    title="Delete"
                    onPress={onDeleteHandler.bind(this, itemData.item.id)}
                    color="red"
                  />
                )}
              </View>
            </TaskItem>
          )}
        />
      )}
      {(role === 1 || role === 2) && (
        <View style={styles.bottom}>
          <CustomButton
            icon="plus"
            size={50}
            color="white"
            onSelect={() => {
              props.navigation.navigate("EditTask", {
                projectId: projectId
              });
            }}
          />
        </View>
      )}
    </View>
  );
};

ProjectDetailScreen.navigationOptions = navData => {
  // const projectName = navData.navigation.getParam("projectName");
  return {
    headerTitle: "Project Detail"
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.background,
    width: "100%",
    height: "100%"
  },
  header: {
    width: "100%",
    height: 50,
    marginTop: Platform.OS === "android" ? 0 : 65,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  segment: {
    marginTop: 5,
    width: "90%",
    marginLeft: "5%"
  },
  projectName: {
    fontFamily: "open-sans-bold",
    color: "white",
    fontSize: 18,
    marginLeft: 20
  },
  number: {
    fontFamily: "open-sans",
    color: "white",
    fontSize: 18,
    marginRight: 20
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  }
});

export default ProjectDetailScreen;
