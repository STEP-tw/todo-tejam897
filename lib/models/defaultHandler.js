class DefaultHandler {
  constructor() {}
  execute(req,res){}
  getHandler(){
    return this.execute.bind(this);
  }
}

module.exports = DefaultHandler;
