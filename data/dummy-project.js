import Project from "../models/project";

const PROJECTS = [
  new Project(
    "p1",
    "Project 1",
    "This is first project of company.",
    new Date(),
    new Date(),
    "u1",
    "u2"
  ),
  new Project(
    "p2",
    "Project 2",
    "This is second project of company.",
    new Date(),
    new Date(),
    "u1",
    "u2"
  ),
  new Project(
    "p3",
    "Project 3",
    "This is third project of company.",
    new Date(),
    new Date(),
    "u1",
    "u2"
  )
];

export default PROJECTS;
