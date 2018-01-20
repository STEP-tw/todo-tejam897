let fs = require('fs');
const StaticFileHandler = require('./models/staticFileHandler.js');
let webApp = require('../serverFrameWork/webApp.js');
const logRequest = require('./logger');
const SessionHandler = require('./models/sessionHandler');

const lib = require('./handlers');

let app = webApp.create();

let sessionHandler;

if (process.env.TESTMODE){
  app.initialize = mockedFS => {
    sessionHandler = new SessionHandler('./data/users.json', mockedFS);
    sessionHandler.loadSessionData();
  };
} else {
  sessionHandler = new SessionHandler('./data/users.json', fs);
  sessionHandler.loadSessionData();
}

let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = sessionHandler.getUserBySessionId(sessionid);
  if (user) {
    req.user = user;
  }
};

const handleUserLogout = (req, res) => {
  let sessionid = req.user.sessionid;
  sessionHandler.logoutUser(sessionid)
  res.setHeader('Set-Cookie', `sessionid='' Max-Age=0`);
  res.redirect('/');
}

const handleUserLogin = (req, res) => {
  let sessionid = sessionHandler.logInUser(req.body.userId);
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
app.use(lib.redirectLoggedInUserToHome);
app.use(lib.redirectLoggedOutUserToLogin);

app.get('/logout', handleUserLogout);

app.get('/', lib.serveLoginPage);
app.get('/login', lib.serveLoginPage);

app.post('/login', handleUserLogin);

app.get('/todolists', lib.serveTodolists);
app.post('/todolists', lib.addTodoList)

app.postUse(publicFileHandler.getHandler());

module.exports = app;
