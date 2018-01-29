const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const logRequest = require('./logger');
const SessionManager = require('./models/sessionManager');
const TodoApp = require('./models/todoApp');
const lib = require('./handlers');

const app = express();

app.fs = fs;

app.initializeApp = function (users) {
  app.todoApp = new TodoApp({});
  app.sessionManager = new SessionManager(users);
};

app.getUserData = lib.getUserData.bind(app);

app.use(express.urlencoded({
  extended: false,
  type: (req) => true
}));

app.use(cookieParser());
app.use(logRequest);
app.use(lib.loadUser);
app.use(lib.redirectLoggedInUserToHome);

app.use('/todolist', (req, res, next) => {
  if (req.user) {next();}
  else {res.redirect('/login');}
});

app.use(lib.redirectLoggedOutUserToLogin);

app.post('/logout', lib.handleUserLogout);

app.get('/', lib.serveLoginPage);
app.get('/login', lib.serveLoginPage);

app.post('/login', lib.handleUserLogin);

app.get('/todolists', lib.serveTodolists);
app.post('/todolists', lib.addTodoList);
app.put('/todolists', lib.editTodoList);
app.delete('/todolists', lib.deleteTodoList);

app.get('/todolist/:listId', lib.serveTodoItems);
app.post('/todolist/:listId', lib.addTodoItem);
app.put('/todolist/:listId', lib.editTodoItem);
app.delete('/todolist/:listId', lib.deleteTodoItem);

app.use(express.static('public'));

module.exports = app;
