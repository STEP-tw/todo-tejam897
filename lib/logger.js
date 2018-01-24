/* eslint-disable */
const fSystem = require('fs');
const timeStamp = require('./time.js').timeStamp;

const toS = (o) => JSON.stringify(o, null, 2);
const logRequest = function (req, res,next, fs = fSystem) {
  const text = ['--------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''].join('\n');
  fs.appendFile('request.log', text, () => { });
  console.log(`${req.method} ${req.url}`);
  next();
};

module.exports = logRequest;
