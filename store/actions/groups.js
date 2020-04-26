import Group from "../../models/group";

export const CREATE_GROUP = "CREATE_GROUP";
export const SET_GROUPS = "SET_GROUPS";
export const LOAD_GROUP_MEMBER = "LOAD_GROUP_MEMBER";
export const UPDATE_GROUP = "UPDATE_GROUP";
export const DELETE_GROUP = "DELETE_GROUP";

export const fetchGroups = () => {
  return async dispatch => {
    try {
      const response = await fetch("https://task-tupt.herokuapp.com/groups");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedGroups = [];

      for (const key in resData) {
        loadedGroups.push(
          new Group(
            resData[key].id,
            resData[key].name,
            resData[key].managerId,
            resData[key].memberId
          )
        );
      }

      dispatch({
        type: SET_GROUPS,
        groups: loadedGroups
      });
    } catch (error) {
      throw error;
    }
  };
};

export const createGroup = (name, managerId, memberId) => {
  return async dispatch => {
    const response = await fetch("https://task-tupt.herokuapp.com/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        managerId,
        memberId
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_GROUP,
      groupData: {
        id: resData.id,
        name,
        managerId,
        memberId
      }
    });
  };
};

export const loadGroupMember = managerId => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/groups/${managerId}`
    );

    const resData = await response.json();

    dispatch({
      type: LOAD_GROUP_MEMBER,
      memberId: resData.memberId
    });
  };
};

export const updateGroup = (id, name, managerId, memberId) => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/groups/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          managerId,
          memberId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: UPDATE_GROUP,
      groupData: {
        id,
        name,
        managerId,
        memberId
      }
    });
  };
};

export const deleteGroup = groupId => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/groups/${groupId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_GROUP, gId: groupId });
  };
};
