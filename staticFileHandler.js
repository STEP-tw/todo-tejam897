let fs = require('fs');

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

let isStaticFileRequest = function(file,method){
  return fs.existsSync(file)&&method == 'GET';
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

let staticFileHandler = function(req,res){
  let source = setResourcePath(req.url);
  if(isStaticFileRequest(source,req.method)) return serveAsStaticFile(source,res,fs);
}

exports.staticFileHandler = staticFileHandler;
exports.setResourcePath = setResourcePath;
exports.serveAsStaticFile = serveAsStaticFile;
exports.isStaticFileRequest = isStaticFileRequest;
