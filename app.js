let webApp = require('./webApp.js');
let app = webApp.create();
let fs = require('fs');
let toS = o=>JSON.stringify(o,null,2);

let staticFileHandler = require('./staticFileHandler.js').staticFileHandler;
let loggedinUsers = require('./loggedinUsers.js').users;
let registeredUsers = require('./registeredUsers.js').users;

let logRequest = function(req){
  console.log(`requested to ${req.method} ${req.url}`);
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = loggedinUsers[sessionid];
  if(sessionid && user){
    req.user = user;
  }
};

const getContentType = function(filePath) {
  let fileExtension = filePath.slice(filePath.lastIndexOf('.'));
  console.log(fileExtension);
  let contentTypes = {
    '.html':'text/html',
    '.css':'text/css',
    '.js':'text/javascript',
    '.png':'image/png',
    '.gif':'image/gif',
    '.jpg':'image/jpg',
    '.pdf':'application/pdf',
    '.ico':'image/ico'
  }
  return contentTypes[fileExtension];
}



let showHomePage = function(req,res){
  let user = req.user;
  res.write(`<p>hii ${user.userId}  you havent created any todo<p/><p> click on addNew to add the todo<p/><button type="submit"  value =submit>addNew</button>`)
  res.end();
}

let registerUser = function(req,res){
  let user = req.body;
  user.todos = [];
  registeredUsers[user.userId] = user;
  let users = toS(registeredUsers);
  fs.writeFileSync('registeredUsers.js',`let users = ${users}\n exports.users = users`);
  res.redirect('html/login.html');
}

app.use(staticFileHandler);
app.use(logRequest);
app.use(loadUser)
app.post('/registerForm',registerUser);
app.post('/login',(req,res)=>{
  let user = registeredUsers[req.body.userId];
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('html/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid =sessionid;
  loggedinUsers[sessionid] = user;
  let users = toS(loggedinUsers);
  fs.writeFileSync('loggedinUsers.js',`let users = ${users}\n exports.users = users`);
  console.log(user);
  res.redirect('html/home.html');
});

app.get('/home',showHomePage);
app.get('/logout',(req,res)=>{
  delete loggedinUsers[req.user.sessionid];
  delete req.user.sessionid;
  fs.writeFileSync('loggedinUsers.js',`let users = ${toS(loggedinUsers)}\n exports.users = users`);
  res.redirect('html/index.html');
});
app.post('/html/showTodo.html',(req,res)=>{
  console.log(req.body);
  res.redirect('/html/showTodo.html');
})
module.exports = app;
