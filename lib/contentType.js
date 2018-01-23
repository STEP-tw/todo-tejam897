const getContentType = function(filePath) {
  const fileExtension = filePath.slice(filePath.lastIndexOf('.'));
  const contentTypes = {
    '.html':'text/html',
    '.css':'text/css',
    '.js':'text/javascript',
    '.png':'image/png',
    '.gif':'image/gif',
    '.jpg':'image/jpg',
    '.pdf':'application/pdf',
    '.ico':'image/ico'
  };
  return contentTypes[fileExtension] || 'text/plain';
};

exports.getContentType = getContentType;
