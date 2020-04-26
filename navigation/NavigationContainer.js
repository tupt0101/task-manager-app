import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import TaskNavigator from "./TaskNavigator";
import AdminNavigator from "./AdminNavigator";

const NavigationContainer = props => {
  const navRef = useRef();
  const isAuth = useSelector(state => !!state.auth.userId);
  const role = useSelector(state => state.auth.role);

  useEffect(() => {
    if (!isAuth) {
      navRef.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return role !== 0 ? (
    <TaskNavigator ref={navRef} />
  ) : (
    <AdminNavigator ref={navRef} />
  );
};

export default NavigationContainer;
