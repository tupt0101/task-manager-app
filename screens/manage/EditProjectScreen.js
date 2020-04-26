import React, { useState, useCallback, useEffect, useReducer } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
  Picker,
  TouchableOpacity
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { Dropdown } from "react-native-material-dropdown";

import * as projectsActions from "../../store/actions/projects";
import HeaderButton from "../../components/UI/HeaderButton";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

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

const EditProjectScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const currentDate = new Date();

  const accountId = useSelector(state => state.auth.userId);

  const account = useSelector(state =>
    state.accounts.accounts.find(user => user.id === accountId)
  );

  const proId = props.navigation.getParam("projectId");
  const editedProject = useSelector(state =>
    state.projects.projects.find(proj => proj.id === proId)
  );

  // Get manager list
  const accounts = useSelector(state =>
    state.accounts.accounts.filter(acc => acc.role === 1)
  );
  const accountList = accounts.map(value => {
    return { key: value.id, value: value.name };
  });

  // Get assignee name
  const [assigneeId, setAssigneeId] = useState(
    editedProject ? editedProject.assignee : null
  );
  const assignee = accounts.find(acc => acc.id === assigneeId);
  const [assigneeName, setAssigneeName] = useState(
    assignee ? assignee.name : ""
  );

  const [chosenDate, setChosenDate] = useState(
    editedProject ? new Date(editedProject.due) : currentDate
  );

  const showDatePicker = () => {
    setShowPicker(prevState => !prevState);
  };

  const confirmHandler = date => {
    setChosenDate(date);
    setShowPicker(false);
  };

  const dispatch = useDispatch();

  //useReducer
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedProject ? editedProject.name : "",
      description: editedProject ? editedProject.description : "",
      due: editedProject ? editedProject.due : chosenDate,
      creator: editedProject ? editedProject.creator : account.name,
      assignee: editedProject ? editedProject.assignee : ""
    },
    inputValidities: {
      name: editedProject ? true : false,
      description: editedProject ? true : false,
      due: editedProject ? true : true,
      creator: editedProject ? true : true,
      assignee: editedProject ? true : true
    },
    formIsValid: editedProject ? true : false
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
      if (editedProject) {
        await dispatch(
          projectsActions.updateProject(
            proId,
            formState.inputValues.name,
            formState.inputValues.description,
            chosenDate,
            assigneeId
          )
        );
      } else {
        await dispatch(
          projectsActions.createProject(
            formState.inputValues.name,
            formState.inputValues.description,
            chosenDate,
            account.id,
            assigneeId
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, proId, formState, assigneeId, chosenDate]);

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
            <Input
              id="name"
              label="Project Name"
              errorText="Please enter a valid project name!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedProject ? editedProject.name : ""}
              initiallyValid={!!editedProject}
            />
            <Input
              id="description"
              label="Description"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              multiline
              numberOfLine={3}
              onInputChange={inputChangeHandler}
              initialValue={editedProject ? editedProject.description : ""}
              initiallyValid={!!editedProject}
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
            {!editedProject && (
              <Input
                id="creator"
                label="Creator"
                editable={false}
                initialValue={
                  editedProject ? editedProject.creator : account.name
                }
                initiallyValid={!!editedProject}
              />
            )}
            <Dropdown
              fontSize={17}
              labelFontSize={17}
              labelTextStyle={{
                fontWeight: "bold"
              }}
              label="Assign to"
              data={accountList}
              value={assigneeName}
              onChangeText={(value, key, data) => {
                setAssigneeId(data[key].key);
              }}
            />
            {/* <Input
              id="assignee"
              label="Assignee"
              errorText="Please enter a valid assignee!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedProject ? editedProject.assignee : ""}
              initiallyValid={!!editedProject}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

EditProjectScreen.navigationOptions = navData => {
  const projectName = navData.navigation.getParam("projectName");
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: projectName ? "Edit Project" : "New Project",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Back"
          iconName={
            Platform.OS === "android"
              ? "md-close-circle-outline"
              : "ios-close-circle-outline"
          }
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
  }
});

export default EditProjectScreen;
