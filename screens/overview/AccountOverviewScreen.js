import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  Button,
  Alert,
  Platform,
  ActivityIndicator
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import ActionSheet from "react-native-actionsheet";

import HeaderButton from "../../components/UI/HeaderButton";
import ProjectItem from "../../components/manage/ProjectItem";
import Avatar from "../../components/UI/Avatar";
import CustomButton from "../../components/UI/CustomButton";
import * as accountsActions from "../../store/actions/accounts";
import * as groupsActions from "../../store/actions/groups";
import Colors from "../../constants/Colors";

const AccountOverviewScreen = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const role = useSelector(state => state.auth.role);

  const accounts = useSelector(state =>
    state.accounts.accounts.filter(acc => acc.role !== 0)
  );
  const accountId = useSelector(state => state.auth.userId);
  const currentUser = accounts.find(acc => acc.id === accountId);

  // Set account list
  // const [accountList, setAccountList] = useState(
  //   role !== 0 && accounts.filter(acc => acc.role === 2)
  // );
  let accountList;
  if (role === 0) {
    accountList = accounts;
  } else if (role === 1) {
    accountList = accounts.filter(acc => acc.id === currentUser.memberId);
  } else {
    accountList = accounts.filter(acc => acc.id === accountId);
  }

  // Set avatar
  const avatar = useSelector(state => state.auth.avatar);

  useEffect(() => {
    props.navigation.setParams({ avatar: avatar });
    props.navigation.setParams({ role: role });
  }, [isLoading]);

  const dispatch = useDispatch();

  const loadAccounts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);
    try {
      await dispatch(accountsActions.fetchAccounts()).then();
    } catch (error) {
      setError(error.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      "willFocus",
      loadAccounts
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadAccounts]);

  useEffect(() => {
    setIsLoading(true);
    loadAccounts().then(() => {
      setIsLoading(false);
    });
  }, [dispatch, loadAccounts]);

  const onViewHandler = id => {
    props.navigation.navigate("AccountDetail", {
      accountId: id
    });
  };

  const onEditHandler = (id, name) => {
    props.navigation.navigate("EditAccount", {
      accountId: id,
      accountName: name
    });
  };

  const onDeleteHandler = id => {
    Alert.alert("Are you sure?", "Do you really want to delete this account?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(accountsActions.deactivateAccount(id));
        }
      }
    ]);
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try Again"
          onPress={loadAccounts}
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
        <Text style={styles.headerText}>Accounts</Text>
      </View>
      {accounts.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "open-sans", fontSize: 15, color: "black" }}
          >
            No accounts found! Maybe start creating some.
          </Text>
        </View>
      ) : (
        <FlatList
          onRefresh={loadAccounts}
          refreshing={isRefreshing}
          data={role === 0 ? accounts : accountList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <ProjectItem
              title={itemData.item.name}
              assignee={itemData.item.assignee}
            >
              {role === 0 && (
                <View style={styles.options}>
                  <Button
                    title="View"
                    onPress={() => {
                      onViewHandler(itemData.item.id);
                    }}
                  />
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
            </ProjectItem>
          )}
        />
      )}
    </ImageBackground>
  );
};

AccountOverviewScreen.navigationOptions = navData => {
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
            navData.navigation.navigate("EditAccount");
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

export default AccountOverviewScreen;
