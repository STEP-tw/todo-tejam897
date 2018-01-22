const DefaultHandler = require('./defaultHandler');
class SessionHandler{
  constructor(users){
    this.users = users;
  }
  isValidUser(userName){
    if (this.users[userName])
      return true;
    return false;
  }
  getUserByUserName(userName){
    return this.users[userName];
  }
  logInUser(userName){
    let sessionId = new Date().getTime().toString();
    if(this.isValidUser(userName)){
      let user = this.getUserByUserName(userName);
      user.sessionId = sessionId;
      return sessionId;
    }
    return false;
  }
  getUserBySessionId (sessionId){
    let users = Object.keys(this.users);
    if(sessionId){
      let userName = users.find(user => this.users[user].sessionId == sessionId);
      return this.users[userName];
    }
  }
  logoutUser(sessionId){
    let user = this.getUserBySessionId(sessionId);
    if(user)
      return delete user.sessionId;
    return false;
  }
}

module.exports = SessionHandler;