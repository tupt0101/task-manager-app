import moment from "moment";

class Task {
  constructor(
    id,
    projectId,
    source,
    name,
    detail,
    status,
    date,
    due,
    creator,
    assignee,
    request,
    commitDate,
    commitNote,
    attachment,
    mark,
    comment,
    commentDate,
    updated,
    updatedBy
  ) {
    this.id = id;
    this.projectId = projectId;
    this.source = source;
    this.name = name;
    this.detail = detail;
    this.status = status;
    this.date = date;
    this.due = due;
    this.creator = creator;
    this.assignee = assignee;
    this.request = request;
    this.commitDate = commitDate;
    this.commitNote = commitNote;
    this.attachment = attachment;
    this.mark = mark;
    this.comment = comment;
    this.commentDate = commentDate;
    this.updated = updated;
    this.updatedBy = updatedBy;
  }

  get readableDate() {
    return moment(this.date).format("dddd, MMM Do YYYY");
  }

  get readableDue() {
    return moment(this.due).format("dddd, MMM Do YYYY");
  }

  get readableCommitDate() {
    return moment(this.commitDate).format("dddd, MMM Do YYYY");
  }

  get readableCommentDate() {
    return moment(this.commentDate).format("dddd, MMM Do YYYY");
  }

  get readableUpdatedDate() {
    return moment(this.updated).format("dddd, MMM Do - hh:mm");
  }
}

export default Task;
