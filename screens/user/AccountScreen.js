import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Platform,
  Image,
  TouchableOpacity
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-generator";

import HeaderButton from "../../components/UI/HeaderButton";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/auth";

const AccountScreen = props => {
  const accountId = useSelector(state => state.auth.userId);
  const account = useSelector(state =>
    state.accounts.accounts.find(acc => acc.id === accountId)
  );

  const dispatch = useDispatch();

  const logoutHandler = () => {
    props.navigation.navigate("Auth");
    dispatch(authActions.logout());
  };

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../../assets/bg_img.jpg")}
        style={styles.background}
      >
        <Image
          source={{
            uri: account.avatar
          }}
          style={styles.avatar}
        />
      </ImageBackground>
      <View style={styles.detail}>
        <Text style={styles.name}>{account.name}</Text>
        <Text style={styles.email}>{account.email}</Text>
        <Text style={styles.role}>
          {account.role === 0
            ? "ADMIN"
            : account.role === 1
            ? "MANAGER"
            : "MEMBER"}
        </Text>
        <View
          style={{
            marginTop: 10,
            width: 170,
            height: 180
          }}
        >
          <QRCode
            value={accountId.toString()}
            size={Platform.OS === "android" ? 180 : 400}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={logoutHandler}>
          <Text style={styles.buttonText}>Log out</Text>
          <Ionicons name="ios-log-out" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

AccountScreen.navigationOptions = navData => {
  return {
    headerTitle: "My Account",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Done"
          iconName={
            Platform.OS === "android"
              ? "md-arrow-dropleft"
              : "ios-arrow-dropleft"
          }
          color={Colors.primary}
          onPress={() => {
            navData.navigation.pop();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },
  background: {
    width: "100%",
    height: 180,
    marginTop: Platform.OS === "android" ? 0 : 65,
    justifyContent: "center",
    alignItems: "center"
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: "white",
    borderWidth: 3
  },
  detail: {
    width: "100%",
    // height: 80,
    justifyContent: "center",
    alignItems: "center"
    // borderBottomColor: "#ccc",
    // borderBottomWidth: 1
  },
  name: {
    fontFamily: "open-sans",
    fontSize: 20,
    marginTop: 5
  },
  email: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "grey",
    marginBottom: 5
  },
  role: {
    fontFamily: "open-sans",
    fontSize: 18,
    marginBottom: 5
  },
  buttonContainer: {
    width: "100%"
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 5
  },
  buttonText: {
    fontFamily: "open-sans",
    fontSize: 18,
    color: Colors.primary,
    marginRight: 5
  }
});

export default AccountScreen;
