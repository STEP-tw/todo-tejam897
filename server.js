/* eslint-disable */
const http = require('http');
const app = require('./lib/app.js');
const fs = require('fs');
const PORT = 8080;
let users;
let data;
try {
  let usersJson = fs.readFileSync('./data/users.json', 'utf8');
  users = JSON.parse(usersJson);
} catch (error) {
  fs.existsSync('data') || fs.mkdirSync('data');
  users = { 'teja': { "username": "tejam", "name": "Teja" } };
}
try {
  const todoJson = fs.readFileSync('./data/todoData.json', 'utf8');
  data = JSON.parse(todoJson);
} catch (error) {
  data = {};
}

app.saveData = function (data, onFinish = () => { }) {
  fs.writeFile('./data/todoData.json', JSON.stringify(data, null, 2), onFinish);
}

app.initializeApp(users, data);

const server = http.createServer(app);
server.on('error', (e) => console.error('**error**', e.message));
server.listen(PORT, () => console.log(`server listening at ${PORT}`));
