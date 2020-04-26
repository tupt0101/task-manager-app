import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  FlatList
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import TaskItem from "../../components/manage/TaskItem";
import HeaderButton from "../../components/UI/HeaderButton";
import Avatar from "../../components/UI/Avatar";
import Colors from "../../constants/Colors";
import * as tasksActions from "../../store/actions/tasks";
import NewCommit from "../../components/manage/NewCommit";
import NewRequest from "../../components/manage/NewRequest";

const NotificationScreen = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const role = useSelector(state => state.auth.role);
  const accountId = useSelector(state => state.auth.userId);
  const memberId = useSelector(state => state.auth.memberId);

  const tasks = useSelector(state => state.tasks.tasks);

  let taskList;
  if (tasks) {
    taskList = tasks
      .filter(task => task.status === 2 || task.request === 2)
      .filter(task => task.creator === accountId || task.creator === memberId);
  }

  // Set avatar
  const avatar = useSelector(state => state.auth.avatar);
  const fullname = useSelector(state => state.auth.name);

  const name = fullname && fullname.split(" ");

  // Set greeting
  const hour = new Date().getHours();
  let time;
  if (0 < hour && hour < 12) {
    time = "Morning";
  } else if (hour < 18) {
    time = "Afternoon";
  } else {
    time = "Evening";
  }

  useEffect(() => {
    props.navigation.setParams({ avatar: avatar });
  }, [isLoading]);

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
        <Text style={styles.headerText}>
          Good {time}, {name && name[name.length - 1]}
        </Text>
      </View>
      {taskList && taskList.length !== 0 && role === 1 ? (
        <FlatList
          onRefresh={loadTasks}
          refreshing={isRefreshing}
          data={taskList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData =>
            itemData.item.status === 2 ? (
              <NewCommit
                name={itemData.item.name}
                time={itemData.item.readableUpdatedDate}
                onSelect={() =>
                  onEditHandler(itemData.item.id, itemData.item.name)
                }
              />
            ) : (
              <NewRequest
                name={itemData.item.name}
                time={itemData.item.readableDate}
                onSelect={() =>
                  onEditHandler(itemData.item.id, itemData.item.name)
                }
              />
            )
          }
        />
      ) : (
        <View style={styles.notiContainer}>
          <Image
            source={require("../../assets/bell.png")}
            style={{ width: 100, height: 100 }}
          />
          <Text
            style={{
              fontFamily: "open-sans-bold",
              color: "white",
              fontSize: 20,
              marginTop: 20,
              marginBottom: 5
            }}
          >
            No notifications
          </Text>
          <Text style={{ fontFamily: "open-sans-bold", color: "white" }}>
            You have no
          </Text>
          <Text style={{ fontFamily: "open-sans-bold", color: "white" }}>
            new notifications
          </Text>
        </View>
      )}
    </ImageBackground>
  );
};

NotificationScreen.navigationOptions = navData => {
  const avatar = navData.navigation.getParam("avatar");
  return {
    headerTitle: "",
    headerLeft: () => (
      <Avatar
        image={avatar}
        onSelect={() => {
          navData.navigation.navigate("Account");
        }}
      />
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add new task"
          iconName={
            Platform.OS === "android"
              ? "md-add-circle-outline"
              : "ios-add-circle-outline"
          }
          onPress={() => {
            navData.navigation.navigate("");
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
    marginTop: 72
  },
  headerText: {
    fontSize: 32,
    fontFamily: "open-sans-bold",
    color: "white"
  },
  notiContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginBottom: 60
  }
});

export default NotificationScreen;
