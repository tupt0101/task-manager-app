import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
  userId: null,
  role: null,
  name: null,
  avatar: "",
  memberId: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        userId: action.userId,
        role: action.role,
        name: action.name,
        avatar: action.avatar,
        memberId: action.memberId
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};
