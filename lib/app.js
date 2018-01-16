let fs = require('fs');
let user = require('../js/user.js')
let webApp = require('../frameWork/webApp.js');
let staticFileHandler = require('./staticFileHandler.js');
let users = [{userId:'tejam',name:'teja'},{userId:'dhanul',name:'dhanu'}]

let app = webApp.create();
let toS = o=>JSON.stringify(o,null,2);

let logRequest = function(req){
  console.log(`requested to ${req.method} ${req.url}`);
}
let serveTemplate = (req,res)=>{
  res.sendFile('.'+req.url);
}

let loadUser = (req,res)=>{
  let sessionid = req.cookies.sessionid;
  let user = users.find((u)=>u.sessionid == sessionid);
  console.log(user);
  if(sessionid && user){
    req.user = user;
  }
};

let handleStaticFiles = function(req,res){
  if(req.method == 'GET') {
    let staticFolder = new staticFileHandler('./public');
    let staticFile = staticFolder.getStaticFile(req.url);
    if(fs.existsSync(staticFile)) {
      res.sendFile(staticFile);
    };
  }
}

app.use(handleStaticFiles);
app.use(logRequest);
app.use(loadUser)
app.post('/login',(req,res)=>{
  let user = users.find((u)=>u.userId== req.body.userId&&u.name == req.body.name);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid =sessionid;
  res.redirect('./templates/home.html');
});

app.post('/logout',(req,res)=>{
  console.log(req.user);
  let user = users.find((u)=>u.sessionid == req.user.sessionid);
  res.setHeader('Set-Cookie',`sessionid=''`);
  delete  user.sessionid;
  res.redirect('/index.html');
});
app.post('/templates/showTodo.html',serveTemplate)

app.get('/templates/home.html',serveTemplate);
app.get('/templates/todo.html',serveTemplate)
module.exports = app;
