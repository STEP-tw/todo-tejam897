class DefaultHandler {
  constructor() {}
  execute(){}
  getHandler(){
    return this.execute.bind(this);
  }
}

module.exports = DefaultHandler;
