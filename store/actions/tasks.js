import Task from "../../models/task";

export const SET_TASKS = "SET_TASKS";
export const CREATE_TASK = "CREATE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const DELETE_TASK = "DELETE_TASK";
export const ACCEPT_REQUEST = "ACCEPT_REQUEST";

export const fetchTasks = () => {
  return async dispatch => {
    try {
      const response = await fetch("https://task-tupt.herokuapp.com/tasks");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedTasks = [];

      for (const key in resData) {
        loadedTasks.push(
          new Task(
            resData[key].id,
            resData[key].projectId,
            resData[key].source,
            resData[key].name,
            resData[key].detail,
            resData[key].status,
            resData[key].date,
            resData[key].due,
            resData[key].creator,
            resData[key].assignee,
            resData[key].request,
            resData[key].commitDate,
            resData[key].commitNote,
            resData[key].attachment,
            resData[key].mark,
            resData[key].comment,
            resData[key].commentDate,
            resData[key].updated,
            resData[key].updatedBy
          )
        );
      }

      dispatch({
        type: SET_TASKS,
        tasks: loadedTasks
      });
    } catch (error) {
      throw error;
    }
  };
};

export const createTask = (
  projectId,
  source,
  name,
  detail,
  status,
  due,
  creator,
  assignee,
  request
) => {
  return async dispatch => {
    const date = new Date();
    const response = await fetch("https://task-tupt.herokuapp.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectId,
        source,
        name,
        detail,
        status,
        date,
        due,
        creator,
        assignee,
        request
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_TASK,
      taskData: {
        id: resData.id,
        projectId,
        source,
        name,
        detail,
        status,
        date,
        due,
        creator,
        assignee,
        request
      }
    });
  };
};

export const updateTask = (
  taskId,
  name,
  detail,
  status,
  due,
  assignee,
  commitNote,
  attachment,
  mark,
  comment,
  updatedBy
) => {
  return async dispatch => {
    const updated = new Date();
    const response = await fetch(
      `https://task-tupt.herokuapp.com/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          detail,
          status,
          due,
          assignee,
          commitNote,
          attachment,
          mark,
          comment,
          updated,
          updatedBy
        })
      }
    );

    // console.log(commitNote);
    // console.log("updated: " + updatedBy);
    // console.log(attachment);

    dispatch({
      type: UPDATE_TASK,
      tId: taskId,
      taskData: {
        name,
        detail,
        status,
        due,
        assignee,
        commitNote,
        attachment,
        mark,
        comment,
        updated,
        updatedBy
      }
    });
  };
};

export const deleteTask = taskId => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/tasks/${taskId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_TASK, tId: taskId });
  };
};

export const acceptRequest = (taskId, request) => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/tasks/r/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          request
        })
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: ACCEPT_REQUEST, tId: taskId, request: request });
  };
};
