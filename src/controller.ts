import { v4 } from "uuid";
import { users } from "./db/users";
import { User } from "./types";
import { deleteWrongFields } from "./utils";

const USER_KEYS = ["username", "age", "hobbies"];

export class UserController {
  userList: User[] = [];

  constructor() {
    this.userList = users;
  }

  getUsers() {
    return this.userList;
  }

  getUser(userId: string) {
    return this.userList.find(({ id }) => id === userId);
  }

  addUser(user: string) {
    const newUser = JSON.parse(user);
    for (const key of USER_KEYS) {
      if (!Object.keys(newUser).includes(key)) return false;
    }
    const filteredUser = deleteWrongFields(newUser) as User;
    filteredUser.id = v4();
    this.userList.push(filteredUser);
    return true;
  }

  putUser(userData: string, userId: string) {
    if (!userData) return true;
    const newUserData = JSON.parse(userData) as Partial<User>;
    const userIndex = this.userList.findIndex((el) => el.id === userId);
    if (userIndex === -1) return false;
    this.userList[userIndex] = {
      ...this.userList[userIndex],
      ...deleteWrongFields(newUserData),
    };
    return true;
  }

  deleteUser(userId: string) {
    const isUserExist = this.userList.some(({ id }) => id === userId);
    if (!isUserExist) return false;
    this.userList = this.userList.filter(({ id }) => id !== userId);
    return true;
  }
}
