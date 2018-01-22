let fs = require('fs');
let TodoApp = require('./models/todoApp');
let htmlLib = require('./htmlLib');

let todoApp = new TodoApp({});
todoApp.addUser('Teja', 'teja')
todoApp.addUser('Neeraj', 'nrjais')

const serveLoginPage = function (req, res) {
  let loginPage = fs.readFileSync('./templates/login.html', 'utf8');
  loginPage = loginPage.replace('MESSAGE', req.cookies.message || '');
  res.write(loginPage);
  res.end();
}

let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/', '/login']) && req.user)
    res.redirect('/todolists');
}

let redirectLoggedOutUserToLogin = (req, res) => {
  let forbiddenUrls = ['/logout', '/todolists']
  if (req.urlIsOneOf(forbiddenUrls) && !req.user)
    res.redirect('/login');
}

const serveTodolists = (req, res) => {
  let filePath = './templates/todolists.html';
  let content = fs.readFileSync(filePath, 'utf8');
  let user = todoApp.getUser(req.user.username);
  let todoLists = user.getAllTodoLists();
  let todoListsHtml = htmlLib.convertAllTodoListsToHtml(todoLists);
  content = content.replace('TODOLISTS', todoListsHtml);
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

const serveTodoItems = (req, res) => {
  let filePath = './templates/todoitems.html';
  let content = fs.readFileSync(filePath, 'utf8');
  let user = todoApp.getUser(req.user.username);
  let todoItems = user.getAllTodoItems(req.listId);
  let todoItemsHtml = htmlLib.convertAllTodoItemsToHtml(todoItems);
  content = content.replace('TODOITEMS', todoItemsHtml);
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

const addTodoList = function (req, res) {
  let userName = req.user.username;
  let user = todoApp.getUser(userName);
  let title = req.body.title;
  let description = req.body.description;
  user.addTodoList(title, description);
  res.redirect('/todolists');
}

const addTodoItem= function(req,res){
  let item = req.body.objective;
  let listId = req.listId;
  let user = todoApp.getUser(req.user.username);
  user.addTodoItemTo(listId,item);
  res.redirect(`/todolist/${listId}`);
}

const setListId = function (req, res) {
  let url = req.url;
  let urlRegex = /^\/todolist\/[\d]+$/;
  if (urlRegex.test(url)) {
    let listId = +url.split('/').pop();
    req.listId = listId;
    req.url = '/todolist';
  }
}

const editTodoList = function(req,res){
  let userName = req.user.username;
  let user = todoApp.getUser(userName);
  let title = req.body.title;
  let listId = req.body.listId;
  user.updateTodoList(listId, title);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
}

const deleteTodoList = function(req,res){
  let userName = req.user.username;
  let user = todoApp.getUser(userName);
  let listId = req.body.listId;
  user.deleteTodoList(listId);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
}

module.exports = {
  serveLoginPage,
  redirectLoggedInUserToHome,
  redirectLoggedOutUserToLogin,
  serveTodolists,
  addTodoList,
  setListId,
  serveTodoItems,
  addTodoItem,
  editTodoList,
  deleteTodoList
}