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

const AccountDetailScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [selectedTab, setSelectedTab] = useState(0);

  const currentRole = useSelector(state => state.auth.role);
  const currentAccountId = useSelector(state => state.auth.userId);

  const accountId = props.navigation.getParam("accountId");
  const account = useSelector(state =>
    state.accounts.accounts.find(acc => acc.id === accountId)
  );

  // Get project and task
  const projects = useSelector(state => state.projects.projects);
  const tasks = useSelector(state => state.tasks.tasks);

  // Get project or task base on role
  const [dataList, setDataList] = useState(
    account.role === 1
      ? projects.filter(proj => proj.assignee === accountId)
      : tasks.filter(task => task.assignee === accountId)
  );

  const dispatch = useDispatch();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        {/* <Text style={styles.projectName}>{project.name}</Text>
        <Text style={styles.number}>{tasks.length}</Text> */}
      </View>

      {dataList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "open-sans", fontSize: 15, color: "black" }}
          >
            No projects/tasks found! Maybe start creating some.
          </Text>
        </View>
      ) : (
        <FlatList
          data={dataList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <TaskItem
              title={itemData.item.name}
              assignee={itemData.item.assignee}
              due={itemData.item.readableDue}
              onSelect={() => {}}
            ></TaskItem>
          )}
        />
      )}
    </View>
  );
};

AccountDetailScreen.navigationOptions = navData => {
  // const projectName = navData.navigation.getParam("projectName");
  return {
    headerTitle: "Account Task"
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
    flexDirection: "row",
    marginTop: Platform.OS === "android" ? 0 : 65,
    backgroundColor: Colors.primary,
    justifyContent: "space-between",
    alignItems: "center"
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

export default AccountDetailScreen;
