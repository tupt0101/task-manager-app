import React, { useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { useDispatch } from "react-redux";

import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";

const StartupScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        props.navigation.navigate("Auth");
        return;
      }
      const transformedData = JSON.parse(userData);
      const {
        userId,
        role,
        name,
        avatar,
        memberId,
        expiryDate
      } = transformedData;

      console.log("data: ", transformedData);

      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !userId) {
        props.navigation.navigate("Auth");
        console.log("Expired session!");
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      props.navigation.navigate("Root");
      dispatch(
        authActions.authenticate(
          userId,
          role,
          name,
          avatar,
          memberId,
          expirationTime
        )
      );
    };

    tryLogin();
  }, [dispatch]);
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default StartupScreen;
