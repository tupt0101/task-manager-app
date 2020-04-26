class Account {
  constructor(id, email, password, role, name, avatar, active, memberId) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
    this.name = name;
    this.avatar = avatar;
    this.active = active;
    this.memberId = memberId;
  }
}

export default Account;
