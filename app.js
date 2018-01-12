let webApp = require('./webApp.js');
let app = webApp.create();
let fs = require('fs');
let toS = o=>JSON.stringify(o,null,2);

let logRequest = function(req){
  console.log(`requested to ${req.method} ${req.url}`);
}

let registeredUsers = require('./registeredUsers.js').users;

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

let isStaticFile = function(file){
  return fs.existsSync(file);
}

let serveAsStaticFile = function(staticFile,res){
  let contentType = getContentType(staticFile);
  res.setHeader('Content-Type',contentType);
  let content = fs.readFileSync(staticFile);
  res.write(content);
  res.end();
}

let setResourcePath = function(resource){
  console.log(`requested for ${resource}----------------------`);
  if(resource == '/') return './public/html/index.html';
  return './public'+resource;
}

let fileHandler = function(req,res){
  let source = setResourcePath(req.url);
  if(isStaticFile(source)) return serveAsStaticFile(source,res);
}

let registerUser = function(req,res){
  let user = req.body;
  registeredUsers[user.userId] = user;
  let users = toS(registeredUsers);
  fs.writeFileSync('registeredUsers.js',`let users = ${users}\n exports.users = users`);
  res.redirect('html/login.html');
}

app.use(fileHandler);
app.use(logRequest);

app.post('/registerForm',registerUser);
app.post('/login',(req,res)=>{
  let user = registeredUsers[req.body.userId];
  console.log(registeredUsers,req.body.userId);
  if(!user) {
    res.setHeader('Set-Cookie',`logInFailed=true`);
    res.redirect('html/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
});
module.exports = app;
