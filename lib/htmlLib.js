const convertAllTodoListsToHtml = function (todoLists) {
  return todoLists.reduce((htmlContent, todoList) => {
    htmlContent += `<div id='${todoList.id}'>
    <a href="todolist/${todoList.id}" id='title-${todoList.id}'>
    ${todoList.title}</a>
    <span id='des-${todoList.id}'>
    ${todoList.description}</span>
    <button onclick='editTodoList(event)'>Edit</button>
    <button onclick='deleteTodoList(event)'>Delete</button></div>`;
    return htmlContent;
  }, '');
};

const convertAllTodoItemsToHtml = function (todoItems) {
  return todoItems.reduce((htmlContent, todoItem) => {
    htmlContent += `<div id='${todoItem.id}'>
    <input id='c-${todoItem.id}' type='checkbox' ${todoItem.done ? 'checked' : ''} 
    onclick='changeStatus(event)'>
    <label for='c-${todoItem.id}'>${todoItem.objective}</label>
    <button onclick='editTodoItem(event)'>Edit</button>
    <button onclick='deleteTodoItem(event)'>Delete</button></div>`;
    return htmlContent;
  }, '');
};

module.exports = {
  convertAllTodoListsToHtml,
  convertAllTodoItemsToHtml
};
