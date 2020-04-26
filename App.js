import React, { useState, useEffect } from "react";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import * as Font from "expo-font";
import { Provider } from "react-redux";
import { AppLoading } from "expo";
import { composeWithDevTools } from "redux-devtools-extension";
import ReduxThunk from "redux-thunk";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

import projectsReducer from "./store/reducers/projects";
import tasksReducer from "./store/reducers/tasks";
import accountsReducer from "./store/reducers/accounts";
import groupsReducer from "./store/reducers/groups";
import authReducer from "./store/reducers/auth";

// import TaskNavigator from "./navigation/TaskNavigator";
import NavigationContainer from "./navigation/NavigationContainer";

// import registerForPushNotificationsAsync from "./notifications/registerForPushNotificationsAsync";

const rootReducer = combineReducers({
  projects: projectsReducer,
  tasks: tasksReducer,
  accounts: accountsReducer,
  groups: groupsReducer,
  auth: authReducer
});

// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk),
  composeWithDevTools()
);

const fetchFont = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf")
  });
};

const PUSH_REGISTRATION_ENDPOINT = "https://task-tupt.herokuapp.com/token";

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //     if (status !== "granted") {
  //       return;
  //     }
  //     console.log("in");
  //     let token = await Notifications.getExpoPushTokenAsync();
  //     console.log(token);

  //     const response = await fetch(PUSH_REGISTRATION_ENDPOINT, {
  //       method: "POST",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         token: {
  //           value: token
  //         },
  //         user: {
  //           username: "tupt",
  //           name: "Phan Thanh Tu"
  //         }
  //       })
  //     });

  //     // notificationSubscription = Notifications.addListener(notificationHandler);
  //   })();
  // }, []);

  if (!fontLoaded) {
    return (
      <AppLoading startAsync={fetchFont} onFinish={() => setFontLoaded(true)} />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
