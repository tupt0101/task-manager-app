import Task from "../../models/task";

import {
  DELETE_TASK,
  CREATE_TASK,
  UPDATE_TASK,
  SET_TASKS,
  ACCEPT_REQUEST
} from "../actions/tasks";
import { DELETE_PROJECT } from "../actions/projects";

const initialState = {
  tasks: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS:
      return {
        tasks: action.tasks
      };
    case CREATE_TASK:
      const newTask = new Task(
        action.taskData.id,
        action.taskData.projectId,
        action.taskData.source,
        action.taskData.name,
        action.taskData.detail,
        action.taskData.status,
        action.taskData.date,
        action.taskData.due,
        action.taskData.creator,
        action.taskData.assignee,
        action.taskData.request
      );
      return {
        ...state,
        tasks: state.tasks.concat(newTask)
      };
    case UPDATE_TASK:
      const taskIndex = state.tasks.findIndex(task => task.id === action.tId);
      const updatedTask = new Task(
        action.tId,
        state.tasks[taskIndex].projectId,
        state.tasks[taskIndex].source,
        action.taskData.name,
        action.taskData.detail,
        action.taskData.status,
        state.tasks[taskIndex].date,
        action.taskData.due,
        state.tasks[taskIndex].creator,
        action.taskData.assignee,
        new Date(),
        action.taskData.commitNote,
        action.taskData.attachment,
        action.taskData.mark,
        action.taskData.comment,
        new Date(),
        action.taskData.updated,
        action.taskData.updatedBy
      );
      const updatedTasks = [...state.tasks];
      updatedTasks[taskIndex] = updatedTask;
      return {
        ...state,
        tasks: updatedTasks
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.tId)
      };
    case DELETE_PROJECT:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.projectId !== action.pId)
      };
    case ACCEPT_REQUEST:
      return state;
    default:
      return state;
  }
};
