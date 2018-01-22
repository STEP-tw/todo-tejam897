let htmlLib = require('./htmlLib');

const serveLoginPage = function (req, res) {
  let loginPage = this.fs.readFileSync('./templates/login.html', 'utf8');
  loginPage = loginPage.replace('MESSAGE', req.cookies.message || '');
  res.write(loginPage);
  res.end();
}

let redirectLoggedInUserToHome = function (req, res) {
  if (req.urlIsOneOf(['/', '/login']) && req.user)
    res.redirect('/todolists');
}

let redirectLoggedOutUserToLogin = function (req, res) {
  let forbiddenUrls = ['/logout', '/todolists', '/todolist']
  if (req.urlIsOneOf(forbiddenUrls) && !req.user)
    res.redirect('/login');
}

const serveTodolists = function (req, res) {
  let filePath = './templates/todolists.html';
  let content = this.fs.readFileSync(filePath, 'utf8');
  let user = this.getUserData(req.user);
  let todoLists = user.getAllTodoLists();
  let todoListsHtml = htmlLib.convertAllTodoListsToHtml(todoLists);
  content = content.replace('TODOLISTS', todoListsHtml);
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

const serveTodoItems = function (req, res) {
  let filePath = './templates/todoitems.html';
  let content = this.fs.readFileSync(filePath, 'utf8');
  let user = this.getUserData(req.user);
  let todoItems = user.getAllTodoItems(req.listId);
  let todoItemsHtml = '';
  if (todoItems) {
    todoItemsHtml = htmlLib.convertAllTodoItemsToHtml(todoItems);
  }
  content = content.replace('TODOITEMS', todoItemsHtml);
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

const addTodoList = function (req, res) {
  let user = this.getUserData(req.user);
  let title = req.body.title;
  let description = req.body.description;
  user.addTodoList(title, description);
  res.redirect('/todolists');
}

const addTodoItem = function (req, res) {
  let item = req.body.objective;
  let listId = req.listId;
  let user = this.getUserData(req.user);
  user.addTodoItemTo(listId, item);
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

const editTodoList = function (req, res) {
  let user = this.getUserData(req.user);
  let title = req.body.title;
  let listId = req.body.listId;
  user.updateTodoList(listId, title);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
}

const deleteTodoList = function (req, res) {
  let user = this.getUserData(req.user);
  let listId = req.body.listId;
  user.deleteTodoList(listId);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
}

const deleteTodoItem = function (req, res) {
  let user = this.getUserData(req.user);
  let listId = req.listId;
  let itemId = req.body.itemId;
  user.deleteTodoItem(listId, itemId);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
}

const updateItemStatus = function (req, res, app) {
  let user = app.getUserData(req.user);
  let listId = req.listId;
  let itemId = req.body.itemId;
  user.changeStatus(listId, itemId);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
}

let editActions = {
  changeStatus: updateItemStatus
}

const editTodoItem = function (req, res) {
  let action = req.body.action;
  if (editActions[action])
    editActions[action](req, res, this);
  else res.end('failed');
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
  deleteTodoList,
  editTodoItem,
  deleteTodoItem
}