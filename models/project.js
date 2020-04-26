import moment from "moment";

class Project {
  constructor(id, name, description, date, due, creator, assignee) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.date = date;
    this.due = due;
    this.creator = creator;
    this.assignee = assignee;
  }

  get readableDue() {
    return moment(this.due).format("dddd, MMM Do YYYY");
  }
}
export default Project;
