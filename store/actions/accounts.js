import Account from "../../models/account";

export const SET_ACCOUNTS = "SET_ACCOUNTS";
export const CREATE_ACCOUNT = "CREATE_ACCOUNT";
export const UPDATE_ACCOUNT = "UPDATE_ACCOUNT";
export const DELETE_ACCOUNT = "DELETE_ACCOUNT";

export const fetchAccounts = () => {
  return async dispatch => {
    try {
      const response = await fetch("https://task-tupt.herokuapp.com/accounts");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedAccounts = [];

      for (const key in resData) {
        loadedAccounts.push(
          new Account(
            resData[key].id,
            resData[key].email,
            resData[key].password,
            resData[key].role,
            resData[key].name,
            resData[key].avatar,
            resData[key].active,
            resData[key].memberId
          )
        );
      }

      dispatch({
        type: SET_ACCOUNTS,
        accounts: loadedAccounts
      });
    } catch (error) {
      throw error;
    }
  };
};

export const createAccount = (
  email,
  password,
  role,
  name,
  avatar,
  memberId
) => {
  return async dispatch => {
    const response = await fetch("https://task-tupt.herokuapp.com/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        role,
        name,
        avatar,
        active: 1,
        memberId
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_ACCOUNT,
      accountData: {
        id: resData.id,
        email,
        password,
        role,
        name,
        avatar,
        active: 1,
        memberId
      }
    });
  };
};

export const updateAccount = (
  id,
  email,
  password,
  role,
  name,
  avatar,
  memberId
) => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/accounts/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          avatar,
          active: 1,
          memberId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: UPDATE_ACCOUNT,
      accountData: {
        id,
        email,
        password,
        role,
        name,
        avatar,
        memberId
      }
    });
  };
};

export const deactivateAccount = id => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/accounts/d/${id}`,
      {
        method: "PUT"
      }
    );

    const resData = await response.json();

    dispatch({ type: DELETE_ACCOUNT, accId: id });
  };
};

export const deleteAccount = accountId => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/accounts/${accountId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_ACCOUNT, accId: accountId });
  };
};
