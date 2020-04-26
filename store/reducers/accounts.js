import ACCOUNTS from "../../data/dummy-account";
import Account from "../../models/account";

import {
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  SET_ACCOUNTS
} from "../actions/accounts";

const initialState = {
  accounts: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNTS:
      return {
        accounts: action.accounts
      };
    case CREATE_ACCOUNT:
      const newAccount = new Account(
        action.accountData.id,
        action.accountData.email,
        action.accountData.password,
        action.accountData.role,
        action.accountData.name,
        action.accountData.avatar,
        action.accountData.active,
        action.accountData.memberId
      );
      return {
        ...state,
        accounts: state.accounts.concat(newAccount)
      };
    case UPDATE_ACCOUNT:
      const accountIndex = state.accounts.findIndex(
        acc => acc.id === action.accId
      );
      const updatedAccount = new Account(
        action.accId,
        action.accountData.email,
        action.accountData.password,
        action.accountData.role,
        action.accountData.name,
        action.accountData.avatar,
        action.accountData.active,
        action.accountData.memberId
      );
      const updatedAccounts = [...state.accounts];
      updatedAccounts[accountIndex] = updatedAccount;
      return {
        ...state,
        accounts: updatedAccounts
      };
    case DELETE_ACCOUNT:
      return {
        ...state,
        accounts: state.accounts.filter(acc => acc.id !== action.accId)
      };
    default:
      return state;
  }
};
