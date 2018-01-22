const User = require('./user');

class TodoApp{
  constructor(users){
    this._users = users;
  }

  getUser(userName){
    return this._users[userName];
  }

  addUser(name, userName){
    let user = new User(name, userName);
    this._users[userName] = user;
    return user;
  }
}

module.exports = TodoApp;