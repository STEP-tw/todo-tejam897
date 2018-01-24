const fs = require('fs');
const StaticFileHandler = require('./models/staticFileHandler.js');
const webApp = require('../serverFrameWork/webApp.js');
const logRequest = require('./logger');
const SessionManager = require('./models/sessionManager');
const TodoApp = require('./models/todoApp');
const lib = require('./handlers');

const app = webApp.create();

app.fs = fs;

app.injectData = function (users) {
  app.todoApp = new TodoApp({});
  app.sessionManager = new SessionManager(users);
};

const publicFileHandler = new StaticFileHandler('./public');

app.getUserData = lib.getUserData.bind(app);

app.use(logRequest);
app.use(lib.loadUser.bind(app));
app.use(lib.setListId);
app.use(lib.redirectLoggedInUserToHome);
app.use(lib.redirectLoggedOutUserToLogin);

app.post('/logout', lib.handleUserLogout.bind(app));

app.get('/', lib.serveLoginPage.bind(app));
app.get('/login', lib.serveLoginPage.bind(app));

app.post('/login', lib.handleUserLogin.bind(app));

app.get('/todolists', lib.serveTodolists.bind(app));
app.post('/todolists', lib.addTodoList.bind(app));
app.put('/todolists', lib.editTodoList.bind(app));
app.delete('/todolists', lib.deleteTodoList.bind(app));

app.get('/todolist', lib.serveTodoItems.bind(app));
app.post('/todolist', lib.addTodoItem.bind(app));
app.put('/todolist', lib.editTodoItem.bind(app));
app.delete('/todolist', lib.deleteTodoItem.bind(app));

app.postUse(publicFileHandler.getHandler());

module.exports = app;
