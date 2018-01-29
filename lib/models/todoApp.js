const User = require('./user');

class TodoApp {
  constructor(users = {}) {
    this._users = users;
  }

  get userData() {
    return this._users;
  }

  getUser(userName) {
    return this._users[userName];
  }

  addUser(name, userName) {
    const user = new User(name, userName);
    this._users[userName] = user;
    return user;
  }

}

module.exports = TodoApp;
