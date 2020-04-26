import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
  Button,
  TouchableOpacity,
  Platform
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import RadioForm from "react-native-simple-radio-button";
import { Dropdown } from "react-native-material-dropdown";

import * as tasksActions from "../../store/actions/tasks";
import HeaderButton from "../../components/UI/HeaderButton";
import Input from "../../components/UI/Input";
import ImagePicker from "../../components/manage/ImagePicker";
import Colors from "../../constants/Colors";
import * as groupsActions from "../../store/actions/groups";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities
    };
  }
  return state;
};

const EditTaskScreen = props => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [sourceTask, setSourceTask] = useState();
  // const [selectedImage, setSelectedImage] = useState("");
  const currentDate = new Date();

  // Get account
  const accountId = useSelector(state => state.auth.userId);
  const currentUser = useSelector(state =>
    state.accounts.accounts.find(user => user.id === accountId)
  );

  const role = useSelector(state => state.auth.role);

  // Get project
  const projectId = props.navigation.getParam("projectId");
  // const project = useSelector(state =>
  //   state.projects.projects.find(proj => proj.id === projectId)
  // );

  // Get task
  const tasks = useSelector(state => state.tasks.tasks);
  const taskId = props.navigation.getParam("taskId");
  const editedTask = tasks.find(task => task.id === taskId);

  const [attachment, setAttachment] = useState(
    editedTask ? editedTask.attachment : ""
  );

  // Radio group init
  let radio_props;
  if (!editedTask) {
    radio_props = [
      { label: "Open", value: 0 },
      { label: "In Progress", value: 1 },
      { label: "Commit", value: 2 }
    ];
  } else if (role === 1 || role === 0) {
    radio_props = [
      { label: "Open", value: 0 },
      { label: "In Progress", value: 1 },
      { label: "Commit", value: 2 },
      { label: "Complete", value: 3 },
      { label: "Incomplete", value: 4 }
    ];
  } else {
    radio_props = [
      { label: "Open", value: 0 },
      { label: "In Progress", value: 1 },
      { label: "Commit", value: 2 }
    ];
  }

  // Get incomplete task
  const inCompleteTasks = useSelector(state =>
    state.tasks.tasks.filter(task => task.status === 4)
  );

  let data = inCompleteTasks.map(value => {
    return { key: value.id, value: value.name };
  });

  const selectSourceHandler = taskId => {
    const source = tasks.find(task => task.id === taskId);
    // console.log(source);
  };

  const [chosenStatus, setChosenStatus] = useState(
    editedTask ? editedTask.status : 0
  );

  // Get assignee
  let member;
  if (role === 1) {
    member = useSelector(state =>
      state.accounts.accounts.find(acc => acc.id === currentUser.memberId)
    );
  } else if (role === 2) {
    member = currentUser;
  }

  const dispatch = useDispatch();

  // Setup date picker
  const showDatePicker = () => {
    setShowPicker(prevState => !prevState);
  };

  const [chosenDate, setChosenDate] = useState(
    editedTask ? new Date(editedTask.due) : currentDate
  );

  const confirmHandler = date => {
    setChosenDate(date);
    setShowPicker(false);
  };

  const imageTakenHandler = imgBase64 => {
    setAttachment(imgBase64);
  };

  //useReducer
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      // projectId: editedTask ? editedTask.projectId : project.id,
      source: editedTask ? editedTask.source : "NEW",
      name: editedTask ? editedTask.name : "",
      detail: editedTask ? editedTask.detail : "",
      status: editedTask ? editedTask.status : 0,
      due: editedTask ? editedTask.due : chosenDate,
      creator: editedTask ? editedTask.creator : currentUser.name,
      assignee: editedTask ? editedTask.assignee : member.name,
      commitNote: editedTask ? editedTask.commitNote : "",
      attachment: editedTask ? editedTask.attachment : "",
      mark: editedTask ? editedTask.mark : "",
      comment: editedTask ? editedTask.comment : "",
      request: editedTask ? editedTask.request : role === 1 ? 0 : 2
    },
    inputValidities: {
      // projectId: editedTask ? true : true,
      source: editedTask ? true : true,
      name: editedTask ? true : false,
      detail: editedTask ? true : false,
      status: editedTask ? true : true,
      due: editedTask ? true : true,
      creator: editedTask ? true : true,
      assignee: editedTask ? true : true,
      commitNote: editedTask ? true : true,
      attachment: editedTask ? true : true,
      mark: editedTask ? true : true,
      comment: editedTask ? true : true,
      request: true
    },
    formIsValid: editedTask ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", {
        text: "OK"
      });
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (editedTask) {
        await dispatch(
          tasksActions.updateTask(
            taskId,
            formState.inputValues.name,
            formState.inputValues.detail,
            chosenStatus,
            chosenDate,
            formState.inputValues.assignee,
            formState.inputValues.commitNote,
            attachment,
            formState.inputValues.mark,
            formState.inputValues.comment,
            accountId,
            formState.inputValues.request
          )
        );
      } else {
        await dispatch(
          tasksActions.createTask(
            projectId,
            formState.inputValues.source,
            formState.inputValues.name,
            formState.inputValues.detail,
            chosenStatus,
            chosenDate,
            currentUser.id,
            member.id,
            role === 1 ? 0 : 2
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, taskId, formState, chosenDate, chosenStatus, attachment]);

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler });
  }, [submitHandler]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        input: inputIdentifier,
        value: inputValue,
        isValid: inputValidity
      });
    },
    [dispatchFormState]
  );

  const acceptReqHandler = useCallback(
    async (id, request) => {
      setError(null);
      console.log(id, request);
      try {
        await dispatch(tasksActions.acceptRequest(id, request));
        props.navigation.goBack();
      } catch (error) {
        setError(error);
      }
    },
    [dispatch]
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView>
          <View style={styles.form}>
            {/* {!editedTask && (
              <Input
                id="projectId"
                label="Project"
                editable={false}
                initialValue={editedTask ? editedTask.projectId : project.id}
                initiallyValid={!!editedTask}
              />
            )} */}
            {/* {!editedTask && (
              <Input
                id="source"
                label="Source"
                editable={false}
                initialValue={editedTask ? editedTask.source : "NEW"}
                initiallyValid={!!editedTask}
              />
            )} */}
            <Input
              id="name"
              label="Task Name"
              errorText="Please enter a valid task name!"
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="sentences"
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedTask ? editedTask.name : ""}
              initiallyValid={!!editedTask}
            />
            {/* {!editedTask && <Text style={styles.label}>Source</Text>}
            {!editedTask && (
              <Dropdown
                value={0}
                data={data}
                onChangeText={(value, key, data) => {
                  selectSourceHandler(data[key].key);
                }}
              />
            )} */}
            <Input
              id="detail"
              label="Task Detail"
              errorText="Please enter a valid task detail!"
              keyboardType="default"
              returnKeyType="next"
              autoCapitalize="sentences"
              autoCorrect
              multiline
              numberOfLine={3}
              onInputChange={inputChangeHandler}
              initialValue={editedTask ? editedTask.detail : ""}
              initiallyValid={!!editedTask}
            />

            <View style={styles.datePicker}>
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.buttonContainer}
              >
                <Text style={styles.button}>Due to</Text>
              </TouchableOpacity>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>
                  {moment(chosenDate).format("dddd, MMM Do YYYY - hh:mm")}
                </Text>
              </View>
            </View>
            <DateTimePicker
              isVisible={showPicker}
              date={chosenDate}
              mode="datetime"
              onConfirm={confirmHandler}
              onCancel={showDatePicker}
            />
            {!editedTask && (
              <Input
                id="creator"
                label="Creator"
                editable={false}
                initialValue={
                  editedTask ? editedTask.creator : currentUser.name
                }
                initiallyValid={!!editedTask}
              />
            )}
            {!editedTask && (
              <Input
                id="assignee"
                label="Assignee"
                editable={false}
                initialValue={editedTask ? editedTask.assignee : member.name}
                initiallyValid={!!editedTask}
              />
            )}
            {editedTask && (
              <Input
                id="commitNote"
                label="Commit Note"
                errorText="Please enter a valid commit note!"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="sentences"
                autoCorrect
                // required
                onInputChange={inputChangeHandler}
                initialValue={editedTask ? editedTask.commitNote : ""}
                initiallyValid={!!editedTask}
              />
            )}
            {editedTask && <Text style={styles.label}>Attachment</Text>}
            {editedTask && (
              <ImagePicker
                imageSource={attachment}
                onImageTaken={imageTakenHandler}
              />
            )}
            {role !== 2 && editedTask && (
              <Input
                id="mark"
                label="Mark"
                errorText="Please enter a valid mark!"
                keyboardType="decimal-pad"
                returnKeyType="next"
                // required
                onInputChange={inputChangeHandler}
                initialValue={
                  editedTask && editedTask.mark
                    ? editedTask.mark.toString()
                    : ""
                }
                initiallyValid={!!editedTask}
                min={0.1}
                max={10}
              />
            )}
            {role !== 2 && editedTask && (
              <Input
                id="comment"
                label="Comment"
                errorText="Please enter a valid comment!"
                keyboardType="default"
                returnKeyType="next"
                autoCapitalize="sentences"
                autoCorrect
                // required
                onInputChange={inputChangeHandler}
                initialValue={editedTask ? editedTask.comment : ""}
                initiallyValid={!!editedTask}
              />
            )}
            <TouchableOpacity
              onPress={() => setShowOption(prevState => !prevState)}
            >
              <Text style={styles.label}>
                {showOption ? "Status" : "Choose status"}
              </Text>
            </TouchableOpacity>
            {showOption && (
              <RadioForm
                animation={true}
                radio_props={radio_props}
                initial={chosenStatus}
                onPress={value => setChosenStatus(value)}
                buttonSize={18}
                buttonColor={Colors.primary}
                selectedButtonColor={Colors.primary}
                labelStyle={{ fontSize: 17 }}
              />
            )}
            {editedTask && editedTask.request === 2 && (
              <View style={styles.optionContainer}>
                <Button
                  title="Accept"
                  onPress={() => acceptReqHandler(taskId, 0)}
                />
                <Button
                  title="Decline"
                  color={"red"}
                  onPress={() => acceptReqHandler(taskId, 1)}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

EditTaskScreen.navigationOptions = navData => {
  const taskName = navData.navigation.getParam("taskName");
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: taskName ? "Edit Task" : "New Task",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Back"
          iconName={
            Platform.OS === "android"
              ? "md-close-circle-outline"
              : "ios-close-circle-outline"
          }
          color="black"
          onPress={() => {
            navData.navigation.pop();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Back"
          iconName={
            Platform.OS === "android"
              ? "md-checkmark-circle-outline"
              : "ios-checkmark-circle-outline"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.background,
    width: "100%",
    height: "100%"
  },
  form: {
    marginTop: 20,
    backgroundColor: "white",
    padding: 20
  },
  label: {
    fontFamily: "open-sans-bold",
    fontSize: 17,
    marginTop: 10,
    marginBottom: 10
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  datePicker: {
    justifyContent: "flex-start",
    alignItems: "baseline"
  },
  buttonContainer: {
    marginVertical: 10
  },
  button: {
    color: "green",
    fontSize: 17,
    fontWeight: "bold"
  },
  dateContainer: {
    width: "100%",
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1
  },
  date: {
    fontFamily: "open-sans",
    fontSize: 17
  },
  optionContainer: {
    marginTop: 20,
    marginLeft: "10%",
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});

export default EditTaskScreen;
