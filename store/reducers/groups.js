import {
  CREATE_GROUP,
  LOAD_GROUP_MEMBER,
  SET_GROUPS,
  UPDATE_GROUP,
  DELETE_GROUP,
  updateGroup
} from "../actions/groups";
import Group from "../../models/group";

const initialState = {
  groups: [],
  memberId: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUPS:
      return {
        groups: action.groups
      };
    case CREATE_GROUP:
      const newGroup = new Group(
        action.groupData.id,
        action.groupData.name,
        action.groupData.managerId,
        action.groupData.memberId
      );
      return {
        ...state,
        groups: state.groups.concat(newGroup)
      };
    case LOAD_GROUP_MEMBER:
      return {
        memberId: action.memberId
      };
    case UPDATE_GROUP:
      const groupIndex = state.groups.findIndex(
        group => group.id === action.gId
      );
      const updatedGroup = new Group(
        action.gId,
        action.groupData.name,
        action.groupData.managerId,
        action.groupData.memberId
      );
      const updatedGroups = [...state.groups];
      updatedGroups[groupIndex] = updateGroup;
      return {
        ...state,
        groups: updatedGroups
      };
    case DELETE_GROUP:
      return {
        ...state,
        groups: state.groups.filter(gr => gr.id !== action.gId)
      };
    default:
      return state;
  }
};
