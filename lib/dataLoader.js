const User = require('./models/user');
const TodoList = require('./models/todoList');
const TodoItem = require('./models/todoItem');

module.exports = function (data) {
  let users = Object.keys(data);
  return users.reduce((initializedData, userName) => {
    let user = data[userName];
    initializedData[userName] = initializeUser(user);
    return initializedData;
  }, {})
};


const initializeUser = function (user) {
  let userId = user._userId;
  let name = user._name;
  let todoLists = Object.keys(user._todoLists);
  let allLists = todoLists.reduce((initializedTodos, todoId) => {
    let todo = user._todoLists[todoId];
    initializedTodos[todoId] = initializeTodo(todo);
    return initializedTodos;
  }, {})
  let listId = user._listId;
  return new User(name, userId, allLists, listId);
}

const initializeTodo = function (todo) {
  let listId = todo._listId;
  let title = todo._title;
  let description = todo._description;
  let todoItems = Object.keys(todo._todoItems);

  let items = todoItems.reduce((initializedItems, itemId) => {
    let item = todo._todoItems[itemId];
    initializedItems[itemId] = initializeItem(item);
    return initializedItems;
  }, {})
  let itemId = todo._itemId;
  return new TodoList(listId, title, description, items, itemId);
}

const initializeItem = function (item) {
  let id = item._id;
  let objective = item._objective;
  let status = item._done;
  return new TodoItem(id, objective, status);
}
