import React, { useState, useCallback, useReducer, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-native-material-dropdown";

import * as groupsActions from "../../store/actions/groups";
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

const EditGroupScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Get list for dropdown
  const accounts = useSelector(state => state.accounts.accounts);

  const managers = accounts.filter(acc => acc.role === 1);
  const managerList = managers.map(value => {
    return { key: value.id, value: value.name };
  });

  const members = accounts.filter(acc => acc.role === 2);
  const memberList = members.map(value => {
    return { key: value.id, value: value.name };
  });

  // Get groupId
  const groupId = props.navigation.getParam("groupId");
  const editedGroup = useSelector(state =>
    state.groups.groups.find(gr => gr.id === groupId)
  );

  // Get init name
  const [managerId, setManagerId] = useState(
    editedGroup ? editedGroup.managerId : null
  );
  const manager = managers.find(acc => acc.id === managerId);
  const [managerName, setManagerName] = useState(manager ? manager.name : "");

  const [memberId, setMemberId] = useState(
    editedGroup ? editedGroup.memberId : null
  );
  const member = members.find(acc => acc.id === memberId);
  const [memberName, setMemberName] = useState(member ? member.name : "");
  console.log(memberId);
  const dispatch = useDispatch();

  //useReducer
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      name: editedGroup ? editedGroup.name : "",
      managerId: editedGroup ? editedGroup.managerId : "",
      memberId: editedGroup ? editedGroup.memberId : ""
    },
    inputValidities: {
      name: editedGroup ? true : false,
      managerId: editedGroup ? true : true,
      memberId: editedGroup ? true : true
    },
    formIsValid: editedGroup ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert("An error occurred!", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const submitHandler = useCallback(async () => {
    console.log(error);
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form.", {
        text: "OK"
      });
      return;
    }

    setError(null);
    setIsLoading(true);
    try {
      if (editedGroup) {
        await dispatch(
          groupsActions.updateGroup(
            groupId,
            formState.inputValues.name,
            managerId,
            memberId
          )
        );
      } else {
        await dispatch(
          groupsActions.createGroup(
            formState.inputValues.name,
            managerId,
            memberId
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, groupId, formState, managerId, memberId]);

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
              label="Group name"
              errorText="Please enter a valid name!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedGroup ? editedGroup.name : ""}
              initiallyValid={!!editedGroup}
            />
            <Text style={styles.label}>Manager</Text>
            <Dropdown
              fontSize={17}
              data={managerList}
              value={managerName}
              onChangeText={(value, key, data) => {
                setManagerId(data[key].key);
              }}
            />
            <Text style={styles.label}>Member</Text>
            <Dropdown
              fontSize={17}
              data={memberList}
              value={memberName}
              onChangeText={(value, key, data) => {
                setMemberId(data[key].key);
              }}
            />
            {/* <Input
              id="managerId"
              label="Manager"
              errorText="Please enter a valid managerId!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              require
              onInputChange={inputChangeHandler}
              initialValue={editedGroup ? editedGroup.managerId : ""}
              initiallyValid={!!editedGroup}
            />
            <Input
              id="memberId"
              label="Member"
              errorText="Please enter a valid memberId!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedGroup ? editedGroup.memberId : ""}
              initiallyValid={!!editedGroup}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

EditGroupScreen.navigationOptions = navData => {
  const groupId = navData.navigation.getParam("groupId");
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: groupId ? "Edit Group" : "New Group",
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
  label: {
    fontFamily: "open-sans-bold",
    fontSize: 17,
    marginTop: 10
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default EditGroupScreen;
