class staticFileHandler {
  constructor(staticFolder) {
    this.staticFolder = staticFolder;
  }
  getStaticFile(file){
    if(file == '/') return `${this.staticFolder}/index.html`;
    return this.staticFolder+file;
  }
}
module.exports = staticFileHandler;
