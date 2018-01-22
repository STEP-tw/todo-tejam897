const TodoItem = require('./todoItem');
class TodoList {
  constructor(id, title, description) {
    this._listId = id;
    this._title = title;
    this._description = description;
    this._todoItems = {};
    this._itemId = 0;
  }

  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get listId() {
    return this._listId;
  }

  getAllTodoItems() {
    let todoItemIds = Object.keys(this._todoItems);
    let allTodoItems = todoItemIds.map(listId => {
      let todoItem = this._todoItems[listId];
      return { objective: todoItem.objective,
          id: todoItem.itemId,
          done: todoItem.isDone() }
    });
    return allTodoItems;
  }
  
  addTodoItem(objective){
    let itemId = ++this._itemId;
    this._todoItems[itemId] = new TodoItem(itemId,objective);
    return itemId;
  }
  updateTitle(newTitle){
    this._title = newTitle;
  }
  changeStatus(itemId){
    let todoItem = this._todoItems[itemId];
    if (todoItem) {
      return todoItem.changeStatus();
    }
    return false;
  }
  deleteTodoItem(itemId){
    let todoItem = this._todoItems[itemId];
    if (todoItem) {
      return delete this._todoItems[itemId];
    }
    return false;
  }
}

module.exports = TodoList;