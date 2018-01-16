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
};

exports.getContentType = getContentType;
