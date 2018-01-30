const TodoList = require('./todoList');

class User {
  constructor(name, userId, todoLists = {}, listId = 0) {
    this._name = name;
    this._userId = userId;
    this._todoLists = todoLists;
    this._listId = listId;
  }

  get name(){
    return this._name;
  }

  addTodoList(title, description) {
    const id = ++this._listId;
    const todoList = new TodoList(id, title, description);
    this._todoLists[id] = todoList;
    return todoList;
  }

  getAllTodoLists() {
    const todoListIds = Object.keys(this._todoLists);
    const allTodoLists = todoListIds.map((listId) => {
      const todoList = this._todoLists[listId];
      return { title: todoList.title, id: todoList.listId };
    });
    return allTodoLists;
  }

  addTodoItemTo(listId, objective) {
    const todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.addTodoItem(objective);
    }
  }

  getAllTodoItems(listId) {
    const todoList = this._todoLists[listId];
    if (todoList) {
      return this._todoLists[listId].getAllTodoItems();
    }
  }

  updateTodoList(listId, newTitle) {
    const todoList = this._todoLists[listId];
    if (todoList) {
      todoList.updateTitle(newTitle);
      return true;
    }
    return false;
  }

  deleteTodoList(listId) {
    const todoList = this._todoLists[listId];
    if (todoList) {
      return delete this._todoLists[listId];
    }
    return false;
  }
  changeStatus(listId, itemId) {
    const todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.changeStatus(itemId);
    }
    return false;
  }
  editTodoItemObjective(listId,itemId,newObjective){
    const todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.editItemObjective(itemId,newObjective);
    }
    return false;
  }
  deleteTodoItem(listId, itemId) {
    const todoList = this._todoLists[listId];
    if (todoList) {
      return todoList.deleteTodoItem(itemId);
    }
    return false;
  }
  getTitleOfList(listId){
    let todo = this._todoLists[listId];
    return todo && todo.title;
  }
  getDescriptionOfList(listId){
    let todo = this._todoLists[listId];
    return todo && todo.description;
  }
}

module.exports = User;
