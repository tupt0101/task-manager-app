import Group from "../models/group";
import Project from "../models/project";
import Task from "../models/task";

const TASKS = [
  new Task(
    "t1",
    "p1",
    "new",
    "Task 1 ne",
    "This is the detail of task 1",
    "Open",
    new Date(),
    new Date(),
    "u2",
    "u3"
  ),
  new Task(
    "t2",
    "p1",
    "new",
    "Task 2 ne",
    "This is the detail of task 2",
    "Open",
    new Date(),
    new Date(),
    "u2",
    "u3"
  ),
  new Task(
    "t3",
    "p1",
    "new",
    "Task 3 ne",
    "This is the detail of task 3",
    "Open",
    new Date(),
    new Date(),
    "u2",
    "u3"
  ),
  new Task(
    "t4",
    "p2",
    "new",
    "Task 4 ne",
    "This is the detail of task 4",
    "Open",
    new Date(),
    new Date(),
    "u2",
    "u3"
  ),
  new Task(
    "t5",
    "p2",
    "new",
    "Task 5 ne",
    "This is the detail of task 5",
    "Open",
    new Date(),
    new Date(),
    "u2",
    "u3"
  )
];

export default TASKS;
