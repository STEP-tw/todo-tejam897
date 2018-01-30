const htmlLib = require('./htmlLib');

const serveLoginPage = function (req, res) {
  let loginPage = req.app.fs.readFileSync('./templates/login.html', 'utf8');
  loginPage = loginPage.replace('MESSAGE', req.cookies.message || '');
  res.setHeader('Content-Type', 'text/html');
  res.write(loginPage);
  res.end();
};

const redirectLoggedInUserToHome = function (req, res, next) {
  if (['/', '/login'].includes(req.url) && req.user) {
    res.redirect('/todolists');
    return;
  }
  next();
};

const redirectLoggedOutUserToLogin = function (req, res,next) {
  if (!req.user) { 
    res.redirect('/login'); 
    return;
  }
  next();
};

const serveTodolists = function (req, res) {
  const filePath = './templates/todolists.html';
  let content = req.app.fs.readFileSync(filePath, 'utf8');
  const user = req.app.getUserData(req.user);
  const todoLists = user.getAllTodoLists();
  const todoListsHtml = htmlLib.convertAllTodoListsToHtml(todoLists);
  content = content.replace('TODOLISTS', todoListsHtml);
  content = content.replace('USERNAME', user.name);
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
};

const serveTodoItems = function (req, res) {
  const filePath = './templates/todoitems.html';
  let content = req.app.fs.readFileSync(filePath, 'utf8');
  const user = req.app.getUserData(req.user);
  let listId = req.params.listId;
  const todoItems = user.getAllTodoItems(listId);
  let todoItemsHtml = '';
  if (todoItems) {
    todoItemsHtml = htmlLib.convertAllTodoItemsToHtml(todoItems);
  }
  content = content.replace('TODOITEMS', todoItemsHtml);
  content = content.replace('TODOLISTDESCRIPTION', user.getDescriptionOfList(listId));
  content = content.replace('TODOLISTTITLE', user.getTitleOfList(listId));
  content = content.replace('USERNAME', user.name);
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
};

const addTodoList = function (req, res) {
  const user = req.app.getUserData(req.user);
  const title = req.body.title;
  const description = req.body.description;
  user.addTodoList(title, description);
  req.app.saveData(req.app.todoApp.userData);
  res.redirect('/todolists');
};

const addTodoItem = function (req, res) {
  const item = req.body.objective;
  const listId = req.params.listId;
  const user = req.app.getUserData(req.user);
  user.addTodoItemTo(listId, item);
  req.app.saveData(req.app.todoApp.userData);
  res.redirect(`/todolist/${listId}`);
};

const editTodoList = function (req, res) {
  const user = req.app.getUserData(req.user);
  const title = req.body.title;
  const listId = req.body.listId;
  user.updateTodoList(listId, title);
  req.app.saveData(req.app.todoApp.userData);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
};

const deleteTodoList = function (req, res) {
  const user = req.app.getUserData(req.user);
  const listId = req.body.listId;
  user.deleteTodoList(listId);
  req.app.saveData(req.app.todoApp.userData);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
};

const deleteTodoItem = function (req, res) {
  const user = req.app.getUserData(req.user);
  const listId = req.params.listId;
  const itemId = req.body.itemId;
  user.deleteTodoItem(listId, itemId);
  req.app.saveData(req.app.todoApp.userData);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
};

const updateItemStatus = function (req, res) {
  const user = req.app.getUserData(req.user);
  const listId = req.params.listId;
  const itemId = req.body.itemId;
  user.changeStatus(listId, itemId);
  req.app.saveData(req.app.todoApp.userData);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
};

const editItemObjective = function (req, res) {
  const user = req.app.getUserData(req.user);
  const listId = req.params.listId;
  const itemId = req.body.itemId;
  const objective = req.body.objective;
  user.editTodoItemObjective(listId, itemId, objective);
  req.app.saveData(req.app.todoApp.userData);
  res.setHeader('Content-Type', 'text/plain');
  res.end('success');
};

const editActions = {
  changeStatus: updateItemStatus,
  editItemObjective
};

const editTodoItem = function (req, res) {
  const action = req.body.action;
  if (editActions[action]) {
    editActions[action](req, res);
  }
  else { res.end('failed'); }
};

const loadUser = function (req,res,next) {
  const sessionid = req.cookies.sessionid;
  const user = req.app.sessionManager.getUserBySessionId(sessionid);
  if (user) {
    req.user = user;
  }
  next();
};

const getUserData = function (userDetails) {
  const userName = userDetails.username;
  let user = this.todoApp.getUser(userName);
  if (!user) {
    const name = userDetails.name;
    user = this.todoApp.addUser(name, userName);
  }
  return user;
};

const handleUserLogout = function (req, res) {
  const sessionid = req.user.sessionid;
  req.app.sessionManager.logoutUser(sessionid);
  res.setHeader('Set-Cookie', `sessionid='' Max-Age=0`);
  res.redirect('/');
};

const handleUserLogin = function (req, res) {
  const sessionid = req.app.sessionManager.logInUser(req.body.userId);
  if (sessionid) {
    res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
    res.redirect('/todolists');
    return;
  }
  res.setHeader('Set-Cookie', `message=Login Failed; Max-Age=5`);
  res.redirect('/login');
};

module.exports = {
  serveLoginPage,
  redirectLoggedInUserToHome,
  redirectLoggedOutUserToLogin,
  serveTodolists,
  addTodoList,
  serveTodoItems,
  addTodoItem,
  editTodoList,
  deleteTodoList,
  editTodoItem,
  deleteTodoItem,
  loadUser,
  getUserData,
  handleUserLogout,
  handleUserLogin
};
