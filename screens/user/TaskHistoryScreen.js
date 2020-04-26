import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  Button,
  TouchableOpacity
} from "react-native";
import { useSelector } from "react-redux";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Dropdown } from "react-native-material-dropdown";

import TaskItem from "../../components/manage/TaskItem";
import Colors from "../../constants/Colors";

const TaskHistoryScreen = props => {
  const [showFilter, setShowFilter] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [status, setStatus] = useState("Choose status...");
  const [member, setMember] = useState("Choose member...");

  const role = useSelector(state => state.auth.role);
  const accountId = useSelector(state => state.auth.userId);
  const memberId = useSelector(state => state.auth.memberId);

  let statusList = [
    { key: 5, value: "All" },
    { key: 3, value: "Complete" },
    { key: 4, value: "Incomplete" }
  ];

  // Get member list
  const accounts = useSelector(state =>
    state.accounts.accounts.filter(acc =>
      role === 0
        ? acc.role === 2
        : role === 1
        ? acc.id === memberId
        : acc.id === accountId
    )
  );

  let accountList = accounts.map(acc => {
    return { key: acc.id, value: acc.name };
  });
  accountList.unshift({ key: 0, value: "All" });

  const [showPickerFrom, setShowPickerFrom] = useState(false);
  const [showPickerTo, setShowPickerTo] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);

  // Get done task
  const tasks = useSelector(state =>
    state.tasks.tasks.filter(task => task.status === 3 || task.status === 4)
  );

  // Task list filtered by role
  let taskListByRole;
  if (role === 0) {
    taskListByRole = tasks;
  } else if (role === 1) {
    taskListByRole = tasks.filter(
      task => task.creator === accountId || task.creator === memberId
    );
  } else {
    taskListByRole = tasks.filter(task => task.assignee === accountId);
  }

  // Task list filterd by status and time
  const [taskList, setTaskList] = useState(taskListByRole);

  // Handler filter
  const showPickerFromHandler = () => {
    setShowPickerFrom(prevState => !prevState);
  };

  const selectFromHandler = date => {
    setFromDate(date);
    setShowPickerFrom(false);
  };

  const showPickerToHandler = () => {
    setShowPickerTo(prevState => !prevState);
  };

  const selectToHandler = date => {
    setToDate(date);
    setShowPickerTo(false);
  };

  // Search handler
  const searchHandler = () => {
    setTaskList(
      taskListByRole
        .filter(
          task =>
            new Date(task.updated) >= fromDate &&
            new Date(task.updated) <= toDate
        )
        .sort((a, b) => {
          return new Date(a.updated) - new Date(b.updated);
        })
    );
    if (status === 3 || status === 4) {
      setTaskList(
        taskListByRole
          .filter(
            task =>
              new Date(task.updated) >= fromDate &&
              new Date(task.updated) <= toDate
          )
          .sort((a, b) => {
            return new Date(a.updated) - new Date(b.updated);
          })
          .filter(task => task.status === status)
      );
    } else if (status === 5) {
      setTaskList(
        taskListByRole
          .filter(
            task =>
              new Date(task.updated) >= fromDate &&
              new Date(task.updated) <= toDate
          )
          .sort((a, b) => {
            return new Date(a.updated) - new Date(b.updated);
          })
      );
    }
    if (member > 0) {
      setTaskList(
        taskListByRole
          .filter(
            task =>
              new Date(task.updated) >= fromDate &&
              new Date(task.updated) <= toDate
          )
          .sort((a, b) => {
            return new Date(a.updated) - new Date(b.updated);
          })
          .filter(task =>
            status === 3 || status === 4
              ? task.status === status
              : task.status === 3 || task.status === 4
          )
          .filter(task => task.assignee === member)
      );
    } else if (member === 0) {
      setTaskList(
        taskListByRole
          .filter(
            task =>
              new Date(task.updated) >= fromDate &&
              new Date(task.updated) <= toDate
          )
          .sort((a, b) => {
            return new Date(a.updated) - new Date(b.updated);
          })
          .filter(task =>
            status === 3 || status === 4
              ? task.status === status
              : task.status === 3 || task.status === 4
          )
      );
    }
  };

  return (
    <View style={styles.screen}>
      {/* <View style={styles.header}></View> */}
      {/* <SegmentedControlTab
        tabsContainerStyle={styles.segment}
        values={["Time", "Complete", "Incomplete"]}
        selectedIndex={selectedTab}
        onTabPress={tabChangeHander}
      /> */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setShowFilter(prevState => !prevState)}
        >
          <Text style={styles.button}>
            {showFilter ? "Hide Filer" : "Show Filter"}
          </Text>
        </TouchableOpacity>
        {showFilter && (
          <View style={styles.filter}>
            <Text style={styles.title}>From</Text>
            <View style={styles.datePicker}>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>
                  {moment(fromDate).format("YYYY/MM/DD")}
                </Text>
              </View>
              <TouchableOpacity onPress={showPickerFromHandler}>
                <Ionicons name="ios-calendar" size={30} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              headerTextIOS="From the date:"
              isVisible={showPickerFrom}
              date={fromDate}
              mode="date"
              onConfirm={selectFromHandler}
              onCancel={showPickerFromHandler}
            />
            <Text style={styles.title}>To</Text>
            <View style={styles.datePicker}>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>
                  {moment(toDate).format("YYYY/MM/DD")}
                </Text>
              </View>
              <TouchableOpacity onPress={showPickerToHandler}>
                <Ionicons name="ios-calendar" size={30} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              headerTextIOS="To the date:"
              isVisible={showPickerTo}
              date={toDate}
              mode="date"
              onConfirm={selectToHandler}
              onCancel={showPickerToHandler}
            />
            <Dropdown
              fontSize={17}
              labelFontSize={17}
              labelTextStyle={{
                fontWeight: "bold"
              }}
              label="Status"
              data={statusList}
              value={status}
              onChangeText={(value, key, data) => {
                setStatus(data[key].key);
              }}
            />
            <Dropdown
              fontSize={17}
              labelFontSize={17}
              labelTextStyle={{
                fontWeight: "bold"
              }}
              label="Member"
              data={accountList}
              value={member}
              onChangeText={(value, key, data) => {
                setMember(data[key].key);
              }}
            />
            <Button title="Search" onPress={searchHandler} />
          </View>
        )}
      </View>
      {taskList.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontFamily: "open-sans", fontSize: 15, color: "black" }}
          >
            No history found! Let's work now.
          </Text>
        </View>
      ) : (
        <FlatList
          data={taskList}
          keyExtractor={item => item.id.toString()}
          renderItem={itemData => (
            <TaskItem
              title={itemData.item.name}
              projectId={itemData.item.projectId}
              due={itemData.item.readableUpdatedDate}
              onSelect={() => {}}
            >
              <Text style={styles.more}>Note: {itemData.item.commitNote}</Text>
              <Text style={styles.more}>
                Status: {itemData.item.status === 3 ? "Complete" : "Incomplete"}
              </Text>
              <Text style={styles.more}>Mark: {itemData.item.mark}/10</Text>
              <Text style={styles.more}>Comment: {itemData.item.comment}</Text>
            </TaskItem>
          )}
        />
      )}
    </View>
  );
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 0 : 65,
    backgroundColor:
      Platform.OS === "android" ? Colors.background : Colors.primary
  },
  segment: {
    marginTop: Platform.OS === "android" ? 0 : 65,
    width: "90%",
    marginLeft: "5%"
  },
  more: {
    fontFamily: "open-sans",
    fontSize: 15,
    marginVertical: 4
  },
  filterContainer: {
    marginTop: Platform.OS === "android" ? 0 : 65,
    backgroundColor: "white",
    padding: 20
  },
  button: {
    fontFamily: "open-sans-bold",
    fontSize: 16,
    color: Colors.primary
  },

  filter: {
    marginTop: 10
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 17
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10
  },
  dateContainer: {
    width: "90%",
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 17
  }
});

export default TaskHistoryScreen;
