import Account from "../models/account";

const ACCOUNTS = [
  new Account("u1", "admin@mail.com", "111111", "admin", "Phan Thanh Tu", ""),
  new Account(
    "u2",
    "manager@mail.com",
    "111111",
    "manager",
    "Trinh Thi Minh Khue",
    ""
  ),
  new Account(
    "u3",
    "member@mail.com",
    "111111",
    "member",
    "Nguyen Van Member",
    ""
  )
];

export default ACCOUNTS;
