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

  getAllTodoLists() {
    let todoListIds = Object.keys(this._todoLists);
    let allTodoLists = todoListIds.map(listId => {
      let todoList = this._todoLists[listId];
      return { title: todoList.title, id: todoList.listId }
    });
    return allTodoLists;
  }

  addTodoItemTo(listId, objective) {
    let todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.addTodoItem(objective);
    }
  }

  getAllTodoItems(listId) {
    let todoList = this._todoLists[listId];
    if (todoList) {
      return this._todoLists[listId].getAllTodoItems();
    }
  }

  updateTodoList(listId, newTitle) {
    let todoList = this._todoLists[listId];
    if (todoList) {
      todoList.updateTitle(newTitle);
      return true;
    }
    return false;
  }

  deleteTodoList(listId) {
    let todoList = this._todoLists[listId];
    if (todoList) {
      return delete this._todoLists[listId];
    }
    return false;
  }
  changeStatus(listId, itemId) {
    let todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.changeStatus(itemId);
    }
    return false;
  }
  deleteTodoItem(listId, itemId) {
    let todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.deleteTodoItem(itemId);
    }
    return false;
  }
}

module.exports = User;
