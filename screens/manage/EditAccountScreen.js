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
import RadioForm from "react-native-simple-radio-button";

import * as accountsActions from "../../store/actions/accounts";
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

const EditAccountScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const avatar = "https://i.ibb.co/JvnwDgW/avatar.jpg";

  const radio_props = [
    { label: "Admin", value: 0 },
    { label: "Manager", value: 1 },
    { label: "Member", value: 2 }
  ];

  const accountId = useSelector(state => state.auth.userId);

  const account = useSelector(state =>
    state.accounts.accounts.find(user => user.id === accountId)
  );

  const accId = props.navigation.getParam("accountId");

  const editedAccount = useSelector(state =>
    state.accounts.accounts.find(acc => acc.id === accId)
  );

  const [chosenRole, setChosenRole] = useState(
    editedAccount ? editedAccount.role : 0
  );

  const dispatch = useDispatch();

  //useReducer
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: editedAccount ? editedAccount.email : "",
      password: editedAccount ? editedAccount.password : "",
      name: editedAccount ? editedAccount.name : "",
      avatar: editedAccount ? editedAccount.avatar : "",
      memberId: editedAccount ? editedAccount.memberId : null
    },
    inputValidities: {
      email: editedAccount ? true : false,
      password: editedAccount ? true : false,
      name: editedAccount ? true : false,
      avatar: editedAccount ? true : true,
      memberId: true
    },
    formIsValid: editedAccount ? true : false
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
      if (editedAccount) {
        await dispatch(
          accountsActions.updateAccount(
            accId,
            formState.inputValues.email,
            formState.inputValues.password,
            chosenRole,
            formState.inputValues.name,
            formState.inputValues.avatar,
            formState.inputValues.memberId
          )
        );
      } else {
        await dispatch(
          accountsActions.createAccount(
            formState.inputValues.email,
            formState.inputValues.password,
            chosenRole,
            formState.inputValues.name,
            avatar,
            formState.inputValues.memberId
          )
        );
      }
      props.navigation.goBack();
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  }, [dispatch, accId, formState, chosenRole]);

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
              id="email"
              label="Email"
              errorText="Please enter a valid email!"
              keyboardType="email-address"
              autoCapitalize="sentences"
              autoCorrect
              required
              email
              onInputChange={inputChangeHandler}
              initialValue={editedAccount ? editedAccount.email : ""}
              initiallyValid={!!editedAccount}
            />
            <Input
              id="password"
              label="Password"
              errorText="Please enter a valid password!"
              keyboardType="default"
              autoCapitalize="sentences"
              secureTextEntry={true}
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedAccount ? editedAccount.password : ""}
              initiallyValid={!!editedAccount}
            />
            {/* <Input
              id="confirm-password"
              label="Confirm password"
              errorText="Please enter a valid confirm password!"
              keyboardType="default"
              autoCapitalize="sentences"
              secureTextEntry={true}
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={""}
              initiallyValid={!!editedAccount}
            /> */}
            <Text style={styles.label}>Role</Text>
            <RadioForm
              animation={false}
              radio_props={radio_props}
              initial={chosenRole}
              onPress={value => setChosenRole(value)}
              buttonSize={18}
              buttonColor={Colors.primary}
              selectedButtonColor={Colors.primary}
              labelStyle={{ fontSize: 17 }}
            />
            <Input
              id="name"
              label="Name"
              errorText="Please enter a valid name!"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              required
              onInputChange={inputChangeHandler}
              initialValue={editedAccount ? editedAccount.name : ""}
              initiallyValid={!!editedAccount}
            />
            {/* <Input
              id="avatar"
              label="Avatar"
              keyboardType="default"
              autoCapitalize="sentences"
              autoCorrect
              onInputChange={inputChangeHandler}
              initialValue={editedAccount ? editedAccount.avatar : ""}
              initiallyValid={!!editedAccount}
            /> */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

EditAccountScreen.navigationOptions = navData => {
  const accountId = navData.navigation.getParam("accountId");
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: accountId ? "Edit Account" : "New Account",
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
    marginBottom: 10,
    marginTop: 10
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default EditAccountScreen;
