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
import ActionSheet from "react-native-actionsheet";

import HeaderButton from "../../components/UI/HeaderButton";
import ProjectItem from "../../components/manage/ProjectItem";
import Avatar from "../../components/UI/Avatar";
import CustomButton from "../../components/UI/CustomButton";
import Colors from "../../constants/Colors";
import * as projectsActions from "../../store/actions/projects";

const ProjectOverviewScreen = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const accountId = useSelector(state => state.auth.userId);
  const role = useSelector(state => state.auth.role);
  const avatar = useSelector(state => state.auth.avatar);

  const accounts = useSelector(state => state.accounts.accounts);
  const projects = useSelector(state => state.projects.projects);
  let projectList;
  if (role === 0) {
    projectList = projects;
  } else if (role === 1) {
    projectList = projects.filter(pro => pro.assignee === accountId);
  } else {
    let manager = accounts.find(acc => acc.memberId === accountId);
    projectList = projects.filter(pro => pro.assignee === manager.id);
  }

  // Set avatar
  useEffect(() => {
    props.navigation.setParams({ avatar: avatar });
  }, [isLoading]);

  const dispatch = useDispatch();

  const loadProjects = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(projectsActions.fetchProjects()).then();
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadProjects
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadProjects]);

  useEffect(() => {
    setIsLoading(true);
    loadProjects().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadProjects]);

  const showActionSheet = () => {
    this.ActionSheet.show();
  };

  const onViewHandler = (id, name) => {
    props.navigation.navigate("ProjectDetail", {
      projectId: id,
      projectName: name
    });
  };

  const onEditHandler = (id, name) => {
    props.navigation.navigate("EditProject", {
      projectId: id,
      projectName: name
    });
  };

  const onDeleteHandler = id => {
    Alert.alert(
      "Are you sure?",
      "This will delete all tasks in the project. Do you really want to delete this project?",
      [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            dispatch(projectsActions.deleteProject(id));
          }
        }
      ]
    );
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try Again"
          onPress={loadProjects}
          color={Colors.primary}
        />
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
        <Text style={styles.headerText}>Projects</Text>
      </View>
      {projects.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "open-sans", fontSize: 15, color: "black" }}
          >
            No projects found! Maybe start creating some.
          </Text>
        </View>
      ) : (
        <FlatList
          onRefresh={loadProjects}
          refreshing={isRefreshing}
          data={projectList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <ProjectItem
              icon={Platform.OS === "android" ? "md-rocket" : "ios-rocket"}
              title={itemData.item.name}
              projectId={itemData.item.id}
            >
              <View style={styles.options}>
                <Button
                  title="View"
                  onPress={() => {
                    onViewHandler(itemData.item.id, itemData.item.name);
                  }}
                />
                {role === 0 && (
                  <View style={styles.adminOptions}>
                    <Button
                      title="Edit"
                      onPress={() => {
                        onEditHandler(itemData.item.id, itemData.item.name);
                      }}
                    />
                    <Button
                      title="Delete"
                      onPress={onDeleteHandler.bind(this, itemData.item.id)}
                      color="red"
                    />
                  </View>
                )}
              </View>
            </ProjectItem>
          )}
        />
      )}
      {role === 0 && (
        <View style={styles.bottom}>
          <CustomButton
            icon="plus"
            size={50}
            color="white"
            onSelect={showActionSheet}
          />
        </View>
      )}
      <ActionSheet
        ref={o => (this.ActionSheet = o)}
        options={["New Project", "Cancel"]}
        cancelButtonIndex={1}
        onPress={index => {
          if (index == 0) {
            props.navigation.navigate("EditProject");
          }
        }}
      />
    </ImageBackground>
  );
};

ProjectOverviewScreen.navigationOptions = navData => {
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
            Platform.OS === "android" ? "md-qr-scanner" : "ios-qr-scanner"
          }
          onPress={() => {
            navData.navigation.navigate("Scanner");
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
  },
  adminOptions: {
    width: "60%",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default ProjectOverviewScreen;
