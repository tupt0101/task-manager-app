import React from "react";
import { Platform, Text } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from "react-navigation-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import StartupScreen from "../screens/StartupScreen";
import EditAccountScreen from "../screens/manage/EditAccountScreen";
import EditGroupScreen from "../screens/manage/EditGroupScreen";
import EditProjectScreen from "../screens/manage/EditProjectScreen";
import EditTaskScreen from "../screens/manage/EditTaskScreen";
import ProjectDetailScreen from "../screens/overview/ProjectDetailScreen";
import ProjectOverviewScreen from "../screens/overview/ProjectOverviewScreen";
import TaskOverviewScreen from "../screens/overview/TaskOverviewScreen";
import AccountOverviewScreen from "../screens/overview/AccountOverviewScreen";
import AccountScreen from "../screens/user/AccountScreen";
import AuthScreen from "../screens/user/AuthScreen";
import NotificationScreen from "../screens/user/NotificationScreen";
import TaskHistoryScreen from "../screens/user/TaskHistoryScreen";
import ScannerScreen from "../screens/overview/ScannerScreen";

import Colors from "../constants/Colors";

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : ""
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold"
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans"
  },
  headerTintColor: Platform.OS === "android" ? "white" : "black",
  headerTransparent: Platform.OS === "android" ? false : true,
  headerBackTitle: "Back"
};

const AuthNavigator = createStackNavigator(
  {
    Auth: {
      screen: AuthScreen,
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    defaultStackNavOptions: defaultStackNavOptions
  }
);

const AccountNavigator = createStackNavigator(
  {
    Account: AccountScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const NotiNavigator = createStackNavigator(
  {
    Noti: NotificationScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const AccNavigator = createStackNavigator(
  {
    AccountOverview: AccountOverviewScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const ProjectNavigator = createStackNavigator(
  {
    ProjectOverview: ProjectOverviewScreen,
    ProjectDetail: ProjectDetailScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const TaskNavigator = createStackNavigator(
  {
    TaskOverview: TaskOverviewScreen,
    History: TaskHistoryScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const TaskTabNavigator = createMaterialTopTabNavigator(
  {
    Notifications: {
      screen: NotiNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons
              name="ios-notifications"
              size={26}
              color={tabInfo.tintColor}
            />
          );
        },
        tabBarLabel:
          Platform.OS === "android" ? (
            <Text style={{ fontFamily: "open-sans-bold" }}>Notifications</Text>
          ) : (
            "Notifications"
          ),
        tabBarColor: Colors.accent
      }
    },
    Accounts: {
      screen: AccNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons name="ios-person" size={26} color={tabInfo.tintColor} />
          );
        },
        tabBarLabel:
          Platform.OS === "android" ? (
            <Text style={{ fontFamily: "open-sans-bold" }}>Accounts</Text>
          ) : (
            "Accounts"
          ),
        tabBarColor: Colors.accent
        // tabBarVisible: false
      }
    },
    Projects: {
      screen: ProjectNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons name="ios-rocket" size={26} color={tabInfo.tintColor} />
          );
        },
        tabBarLabel:
          Platform.OS === "android" ? (
            <Text style={{ fontFamily: "open-sans-bold" }}>Projects</Text>
          ) : (
            "Projects"
          ),
        tabBarColor: Colors.accent
      }
    },
    Tasks: {
      screen: TaskNavigator,
      navigationOptions: {
        tabBarIcon: tabInfo => {
          return (
            <Ionicons name="ios-calendar" size={26} color={tabInfo.tintColor} />
          );
        },
        tabBarLabel:
          Platform.OS === "android" ? (
            <Text style={{ fontFamily: "open-sans-bold" }}>Tasks</Text>
          ) : (
            "Tasks"
          ),
        tabBarColor: Colors.accent
      }
    }
  },
  {
    tabBarPosition: "bottom",
    tabBarOptions: {
      labelStyle: {
        fontFamily: "open-sans"
      },
      showLabel: false,
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.8)"
      },
      indicatorStyle: {
        color: Colors.accent
      },
      activeTintColor: Colors.primary,
      showIcon: true,
      inactiveTintColor: "white"
    }
  }
);

const RootNavigator = createStackNavigator({
  TaskNav: {
    screen: TaskTabNavigator,
    navigationOptions: {
      headerShown: false
    }
  },
  EditTask: {
    screen: EditTaskScreen,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  EditProject: {
    screen: EditProjectScreen,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  EditGroup: {
    screen: EditGroupScreen,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  EditAccount: {
    screen: EditAccountScreen,
    navigationOptions: {
      gestureEnabled: false
    }
  },
  AccountNav: {
    screen: AccountNavigator,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false
    }
  },
  Scanner: {
    screen: ScannerScreen,
    navigationOptions: {
      gestureEnabled: false,
      headerBackTitle: "Back",
      headerTitleStyle: {
        fontFamily: Platform.OS === "android" ? "open-sans" : "open-sans-bold"
      },
      headerBackTitleStyle: {
        fontFamily: "open-sans"
      },
      headerTintColor: Platform.OS === "android" ? "black" : "black"
    }
  }
});

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Root: RootNavigator
});

export default createAppContainer(MainNavigator);
