import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProjectItem from "../../components/manage/ProjectItem";
import Avatar from "../../components/UI/Avatar";
import * as groupsAction from "../../store/actions/groups";
import Colors from "../../constants/Colors";

const GroupOverviewScreen = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const role = useSelector(state => state.auth.role);

  const groups = useSelector(state => state.groups.groups);
  const accounts = useSelector(state => state.accounts.accounts);

  // Set avatar
  const accountId = useSelector(state => state.auth.userId);
  const avatar = useSelector(state => state.auth.avatar);

  useEffect(() => {
    props.navigation.setParams({ avatar: avatar });
    props.navigation.setParams({ role: role });
  }, [isLoading]);

  const dispatch = useDispatch();

  const loadGroups = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(groupsAction.fetchGroups()).then();
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadGroups);

    return () => {
      willFocusSub.remove();
    };
  }, [loadGroups]);

  useEffect(() => {
    setIsLoading(true);
    loadGroups().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadGroups]);

  const onEditHandler = id => {
    props.navigation.navigate("EditGroup", {
      groupId: id
    });
  };

  const onDeleteHandler = id => {
    Alert.alert("Are you sure?", "Do you really want to delete this group?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(groupsAction.deleteGroup(id));
        }
      }
    ]);
  };

  if (error) {
    console.log(error);
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try Again" onPress={loadGroups} color={Colors.primary} />
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
        <Text style={styles.headerText}>Groups</Text>
      </View>
      {groups.length === 0 ? (
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
          onRefresh={loadGroups}
          refreshing={isRefreshing}
          data={groups}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <ProjectItem
              title={itemData.item.name}
              assignee={itemData.item.assignee}
            >
              {role === 0 && (
                <View style={styles.options}>
                  <Button
                    title="Edit"
                    onPress={() => {
                      onEditHandler(itemData.item.id);
                    }}
                  />
                  <Button
                    title="Delete"
                    onPress={onDeleteHandler.bind(this, itemData.item.id)}
                    color="red"
                  />
                </View>
              )}
            </ProjectItem>
          )}
        />
      )}
    </ImageBackground>
  );
};

GroupOverviewScreen.navigationOptions = navData => {
  const avatar = navData.navigation.getParam("avatar");
  const role = navData.navigation.getParam("role");
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
    headerRight: role === 0 && (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add new task"
          iconName={
            Platform.OS === "android"
              ? "md-add-circle-outline"
              : "ios-add-circle-outline"
          }
          onPress={() => {
            navData.navigation.navigate("EditGroup");
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

export default GroupOverviewScreen;
