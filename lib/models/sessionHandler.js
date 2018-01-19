const DefaultHandler = require('./defaultHandler');
class SessionHandler{
  constructor(sessionDataFilePath,fs){
    this.dataFilePath = sessionDataFilePath;
    this.fs = fs;
    this.users = {};
  }
  loadSessionData(){
    try {
      let data = this.fs.readFileSync(this.dataFilePath,'utf8');
      this.users = JSON.parse(data);
    } catch (error) {
      this.users = {};
    }
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
}

module.exports = SessionHandler;