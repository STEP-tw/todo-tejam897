const User = require('./user');

class TodoApp{
  constructor(users){
    this._users = users;
  }

  getUser(userName){
    return this._users[userName];
  }

  addUser(name, userName){
    this._users[userName] = new User(name, userName);
  }
}

module.exports = TodoApp;