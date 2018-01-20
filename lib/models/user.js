const TodoList = require('./todoList');

class User {
  constructor(name, userId) {
    this._name = name;
    this._userId = userId;
    this._todoLists = {};
    this._listId = 0;
  }

  addTodoList(title, description) {
    let id = ++this._listId;
    let todoList = new TodoList(id, title, description)
    this._todoLists[id] = todoList;
    return todoList;
  }
}

module.exports = User;
