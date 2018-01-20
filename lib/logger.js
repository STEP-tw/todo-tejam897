let fs = require('fs');
const timeStamp = require('./time.js').timeStamp;

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

module.exports = logRequest;