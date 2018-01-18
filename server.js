let fs = require('fs');
const timeStamp = require('./serverFrameWork/time.js').timeStamp;
const http = require('http');
let app = require('./lib/app.js');
const PORT = 8080;
let server = http.createServer(app);
server.on('error',e=>console.error('**error**',e.message));
server.listen(PORT,(e)=>console.log(`server listening at ${PORT}`));
