class TodoItem{
  constructor(id,obj){
    this._itemId = id;
    this._objective = obj;
    this._done = false;
  }
  get itemId(){
    return this._itemId;
  }
  get objective(){
    return this._objective;
  }
  isDone(){
    return this._done;
  }
  changeStatus(){
    this._done = !this._done;
    return true;
  }
}

module.exports = TodoItem;