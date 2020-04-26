import Project from "../../models/project";

export const SET_PROJECTS = "SET_PROJECTS";
export const CREATE_PROJECT = "CREATE_PROJECT";
export const UPDATE_PROJECT = "UPDATE_PROJECT";
export const DELETE_PROJECT = "DELETE_PROJECT";

export const fetchProjects = () => {
  return async dispatch => {
    try {
      const response = await fetch("https://task-tupt.herokuapp.com/projects");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const loadedProjects = [];

      for (const key in resData) {
        loadedProjects.push(
          new Project(
            resData[key].id,
            resData[key].name,
            resData[key].description,
            resData[key].date,
            resData[key].due,
            resData[key].creator,
            resData[key].assignee
          )
        );
      }

      dispatch({
        type: SET_PROJECTS,
        projects: loadedProjects
      });
    } catch (error) {
      throw error;
    }
  };
};

export const createProject = (name, description, due, creator, assignee) => {
  return async dispatch => {
    const date = new Date();
    const response = await fetch("https://task-tupt.herokuapp.com/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        description,
        date,
        due,
        creator,
        assignee
      })
    });

    const resData = await response.json();

    dispatch({
      type: CREATE_PROJECT,
      projectData: {
        id: resData.id,
        name,
        description,
        date,
        due,
        creator,
        assignee
      }
    });
  };
};

export const updateProject = (id, name, description, due, assignee) => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/projects/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          description,
          due,
          assignee
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: UPDATE_PROJECT,
      pId: id,
      projectData: {
        name,
        description,
        due,
        assignee
      }
    });
  };
};

export const deleteProject = projectId => {
  return async dispatch => {
    const response = await fetch(
      `https://task-tupt.herokuapp.com/projects/${projectId}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({ type: DELETE_PROJECT, pId: projectId });
  };
};
