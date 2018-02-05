const TodoItem = require('./todoItem');
class TodoList {
  constructor(id, title, description, todoItems = {}, itemId = 0) {
    this._listId = id;
    this._title = title;
    this._description = description;
    this._todoItems = todoItems;
    this._itemId = itemId;
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
    const todoItemIds = Object.keys(this._todoItems);
    const allTodoItems = todoItemIds.map((listId) => {
      const todoItem = this._todoItems[listId];
      return { objective: todoItem.objective,
        id: todoItem.itemId,
        done: todoItem.isDone() };
    });
    return allTodoItems;
  }
  
  addTodoItem(objective){
    const itemId = ++this._itemId;
    this._todoItems[itemId] = new TodoItem(itemId,objective);
    return itemId;
  }
  updateTitleAndDes(newTitle, newDescription){
    this._title = newTitle;
    this._description = newDescription;
  }
  changeStatus(itemId){
    const todoItem = this._todoItems[itemId];
    if (todoItem) {
      return todoItem.changeStatus();
    }
    return false;
  }
  editItemObjective(itemId,newObjective){
    const todoItem = this._todoItems[itemId];
    if (todoItem) {
      return todoItem.changeObjective(newObjective);
    }
    return false;
  }
  deleteTodoItem(itemId){
    const todoItem = this._todoItems[itemId];
    if (todoItem) {
      return delete this._todoItems[itemId];
    }
    return false;
  }
}

module.exports = TodoList;
