import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Button,
  Alert,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import TaskItem from "../../components/manage/TaskItem";
import HeaderButton from "../../components/UI/HeaderButton";
import Avatar from "../../components/UI/Avatar";
import Colors from "../../constants/Colors";
import * as tasksActions from "../../store/actions/tasks";

const TaskOverviewScreen = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const role = useSelector(state => state.auth.role);
  const accountId = useSelector(state => state.auth.userId);
  const avatar = useSelector(state => state.auth.avatar);
  const memberId = useSelector(state => state.auth.memberId);

  useEffect(() => {
    props.navigation.setParams({ avatar: avatar });
  }, [isLoading]);

  const tasks = useSelector(state =>
    state.tasks.tasks
      .filter(task => task.status < 3)
      .filter(task => task.request === 0)
  );
  let taskList;
  if (role === 1) {
    taskList = tasks.filter(
      task => task.creator === accountId || task.assignee === memberId
    );
  } else if (role === 2) {
    taskList = tasks.filter(task => task.assignee === accountId);
  } else {
    taskList = tasks;
  }

  const dispatch = useDispatch();

  const loadTasks = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(tasksActions.fetchTasks()).then();
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadTasks);

    return () => {
      willFocusSub.remove();
    };
  }, [loadTasks]);

  useEffect(() => {
    setIsLoading(true);
    loadTasks().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadTasks]);

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

  if (error) {
    console.log(error);
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try Again" onPress={loadTasks} color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/bg_img.jpg")}
      style={styles.background}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Tasks</Text>
      </View>
      {tasks.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "open-sans", fontSize: 15, color: "white" }}
          >
            No tasks found! Maybe start creating some.
          </Text>
        </View>
      ) : (
        <FlatList
          onRefresh={loadTasks}
          refreshing={isRefreshing}
          data={taskList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <TaskItem
              title={itemData.item.name}
              projectId={itemData.item.projectId}
              due={itemData.item.readableDue}
              onSelect={() => {}}
            >
              <View style={styles.options}>
                <Button
                  style={{ width: 500 }}
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
    </ImageBackground>
  );
};

TaskOverviewScreen.navigationOptions = navData => {
  const avatar = navData.navigation.getParam("avatar");
  return {
    headerTitle: "",
    headerLeft: () => (
      <Avatar
        image={avatar}
        onSelect={() => {
          navData.navigation.navigate("AccountNav");
        }}
      />
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Done"
          iconName={Platform.OS === "android" ? "md-list" : "ios-list"}
          color={Colors.primary}
          onPress={() => {
            navData.navigation.navigate("History");
          }}
        />
      </HeaderButtons>
    )
    // headerShown: false
  };
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  background: {
    width: "100%",
    height: "100%"
  },
  header: {
    marginLeft: 20,
    marginVertical: 15,
    marginTop: Platform.OS === "android" ? 0 : 72
  },
  headerText: {
    fontSize: 36,
    fontFamily: "open-sans-bold",
    color: "white"
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  }
});

export default TaskOverviewScreen;
