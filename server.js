/* eslint-disable */
const http = require('http');
const app = require('./lib/app.js');
const fs = require('fs');
const PORT = 8080;
let users;
try {
  const data = fs.readFileSync('./data/users.json', 'utf8');
  users = JSON.parse(data);
} catch (error) {
  users = {};
}

app.saveData = function (data, onFinish = () => { }) {
  fs.writeFile('./data/todoData.json', JSON.stringify(data, null, 2), onFinish);
}

app.initializeApp(users);

const server = http.createServer(app);
server.on('error', (e) => console.error('**error**', e.message));
server.listen(PORT, () => console.log(`server listening at ${PORT}`));
