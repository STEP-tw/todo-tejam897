let webApp = require('./webApp.js');
let app = webApp.create();
let fs = require('fs');

let logRequest = function(req){
  console.log(`requested to ${req.method} ${req.url}`);
}

let registeredUsers = {};

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
  console.log(registeredUsers);
  res.redirect('/login')
}

app.use(fileHandler);
app.use(logRequest);

app.post('/registerForm',registerUser);
// app.get('/login',  res.setHeader('Content-type','text/html');
//   if(req.cookies.logInFailed) res.write('<p>logIn Failed</p>');
//   res.write('<form method="POST"> <input name="userName"><input name="place"> <input type="submit"></form>');
//   res.end();)
module.exports = app;
