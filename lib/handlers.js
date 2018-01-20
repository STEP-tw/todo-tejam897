let TodoApp = require('./models/todoApp');
let fs = require('fs');

let todoApp = new TodoApp({});
todoApp.addUser('Teja','teja')

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
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}

const addTodoList = function(req,res){
  let userName = req.user.username;
  let user = todoApp.getUser(userName);
  let title = req.body.title;
  let description = req.body.description;
  user.addTodoList(title, description);
  res.redirect('/todolists');
}

module.exports = {
  serveLoginPage,
  redirectLoggedInUserToHome,
  redirectLoggedOutUserToLogin,
  serveTodolists,
  addTodoList
}