import { AsyncStorage } from "react-native";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

const EXPIRED_TIME = 3600;
let timer;

export const authenticate = (
  userId,
  role,
  name,
  avatar,
  memberId,
  expiryTime
) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE,
      userId: userId,
      role: role,
      name: name,
      avatar: avatar,
      memberId: memberId
    });
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch("https://task-tupt.herokuapp.com/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      const errResData = await response.json();
      const message = errResData.message;
      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.id,
        resData.role,
        resData.name,
        resData.avatar,
        resData.memberId,
        EXPIRED_TIME * 1000
      )
    );

    const expirationDate = new Date(new Date().getTime() + EXPIRED_TIME * 1000);
    saveDataToStorage(
      resData.id,
      resData.role,
      resData.name,
      resData.avatar,
      resData.memberId,
      expirationDate
    );
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (
  userId,
  role,
  name,
  avatar,
  memberId,
  expirationDate
) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      userId,
      role,
      name,
      avatar,
      memberId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
