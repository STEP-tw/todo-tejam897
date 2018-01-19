const fs = require('fs');
const DefaultHandler = require('./defaultHandler.js');
const getContentType = require('../contentType').getContentType;

class StaticFileHandler extends DefaultHandler {
  constructor(root, fSystem = fs) {
    super()
    this.root = root;
    this.fs = fSystem;
  }
  getFilePath(url) {
    return `${this.root}${url}`;
  }
  execute(req, res) {
    if (req.method != 'GET') return;
    let filePath = this.getFilePath(req.url);
    try {
      let content = this.fs.readFileSync(filePath);
      res.setHeader('Content-Type', getContentType(filePath));
      res.write(content);
      res.end();
    } catch (err) {
      return ;
    }
  }
}
module.exports = StaticFileHandler;