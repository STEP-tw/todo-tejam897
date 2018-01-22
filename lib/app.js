let fs = require('fs');
const StaticFileHandler = require('./models/staticFileHandler.js');
let webApp = require('../serverFrameWork/webApp.js');
const logRequest = require('./logger');
const SessionHandler = require('./models/sessionHandler');
let TodoApp = require('./models/todoApp');
const lib = require('./handlers');

let app = webApp.create();

app.fs = fs;

app.injectData = function (users) {
  app.todoApp = new TodoApp({});
  app.sessionHandler = new SessionHandler(users);
}

let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = app.sessionHandler.getUserBySessionId(sessionid);
  if (user) {
    req.user = user;
  }
};

app.getUserData = function(userDetails){
  let userName = userDetails.username;
  let user = app.todoApp.getUser(userName);
  if (!user) {
    let name = userDetails.name;
    user = app.todoApp.addUser(name,userName);
  };
  return user;
};

const handleUserLogout = (req, res) => {
  let sessionid = req.user.sessionid;
  app.sessionHandler.logoutUser(sessionid)
  res.setHeader('Set-Cookie', `sessionid='' Max-Age=0`);
  res.redirect('/');
}

const handleUserLogin = (req, res) => {
  let sessionid = app.sessionHandler.logInUser(req.body.userId);
  if (sessionid) {
    res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
    res.redirect('/todolists');
    return;
  }
  res.setHeader('Set-Cookie', `message=Login Failed; Max-Age=5`);
  res.redirect('/login');
}

let publicFileHandler = new StaticFileHandler('./public');

app.use(logRequest);
app.use(loadUser);
app.use(lib.setListId);
app.use(lib.redirectLoggedInUserToHome);
app.use(lib.redirectLoggedOutUserToLogin);

app.post('/logout', handleUserLogout);

app.get('/', lib.serveLoginPage.bind(app));
app.get('/login', lib.serveLoginPage.bind(app));

app.post('/login', handleUserLogin);

app.get('/todolists', lib.serveTodolists.bind(app));
app.post('/todolists', lib.addTodoList.bind(app));
app.put('/todolists', lib.editTodoList.bind(app));
app.delete('/todolists', lib.deleteTodoList.bind(app));

app.get('/todolist', lib.serveTodoItems.bind(app));
app.post('/todolist', lib.addTodoItem.bind(app));
app.put('/todolist', lib.editTodoItem.bind(app));

app.postUse(publicFileHandler.getHandler());

module.exports = app;
