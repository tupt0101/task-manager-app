import Project from "../../models/project";

import {
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  SET_PROJECTS
} from "../actions/projects";

const initialState = {
  projects: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PROJECTS:
      return {
        projects: action.projects
      };
    case CREATE_PROJECT:
      const newProject = new Project(
        action.projectData.id,
        action.projectData.name,
        action.projectData.description,
        action.projectData.date,
        action.projectData.due,
        action.projectData.creator,
        action.projectData.assignee
      );
      return {
        ...state,
        projects: state.projects.concat(newProject)
      };
    case UPDATE_PROJECT:
      const projectIndex = state.projects.findIndex(
        proj => proj.id === action.pId
      );
      const updatedProject = new Project(
        action.pId,
        action.projectData.name,
        action.projectData.description,
        state.projects[projectIndex].date,
        action.projectData.due,
        state.projects[projectIndex].creator,
        action.projectData.assignee
      );
      const updatedProjects = [...state.projects];
      updatedProjects[projectIndex] = updatedProject;
      return {
        ...state,
        projects: updatedProjects
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.pId)
      };
    default:
      return state;
  }
};
