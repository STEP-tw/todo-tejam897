const http = require('http');
let app = require('./lib/app.js');
let fs = require('fs');
const PORT = 8080;
let users;
try {
  let data = fs.readFileSync('./data/users.json', 'utf8');
  users = JSON.parse(data);
} catch (error) {
  users = {};
}
app.injectData(users);
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
