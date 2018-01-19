let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;
const StaticFileHandler = require('./staticFileHandler.js');
let webApp = require('../serverFrameWork/webApp.js');

let user = require('./models/user.js');
let user1 = new user('teja', 'tejam');
let user2 = new user('dhanu', 'dhanul');
let users = [user1, user2];

let app = webApp.create();

let toS = o => JSON.stringify(o, null, 2);
let logRequest = function (req) {
  let text = ['--------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''].join('\n');
  fs.appendFile('request.log', text, () => { });
  console.log(`${req.method} ${req.url}`);
}

let serveTemplate = (req, res) => {
  return res.sendFile('.' + req.url);
}
let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/', '/login.html', '/index.html']) && req.user) res.redirect('/templates/home.html');
}
let redirectLoggedOutUserToLogin = (req, res) => {
  if (req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/login.html');
}

let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = users.find((u) => u.sessionid == sessionid);
  if (sessionid && user) {
    req.user = user;
  }
};
let storeTodo = (req, res) => {
  //new Todo(req.body)
  let todo = req.body;
}

let publicFileHandler = new StaticFileHandler('./public');
app.use(logRequest);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.use(publicFileHandler.getHandler());
app.post('/login', (req, res) => {
  let user = users.find((u) => u.userId == req.body.userId && u.name == req.body.name);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('./templates/home.html');
});
app.post('/logout', (req, res) => {
  let user = users.find((u) => u.sessionid == req.user.sessionid);
  res.setHeader('Set-Cookie', `sessionid=''`);
  delete user.sessionid;
  res.redirect('/index.html');
});
app.get('/templates/home.html', serveTemplate);
app.get('/templates/createTodo.html', serveTemplate);
app.post('/templates/createTodo.html', storeTodo);
app.get('/templates/showTodo.html', serveTemplate);

module.exports = app;
