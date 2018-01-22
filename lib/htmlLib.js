const convertAllTodoListsToHtml = function (todoLists) {
  return todoLists.reduce((htmlContent, todoList) => {
    htmlContent += `<div id='${todoList.id}'>
    <a href="todolist/${todoList.id}" id='title-${todoList.id}'>
    ${todoList.title}</a>
    <button onclick='editTodoList(event)'>Edit</button>
    <button onclick='deleteTodoList(event)'>Delete</button><br></div>`;
    return htmlContent;
  }, '');
};

const convertAllTodoItemsToHtml = function (todoItems) {
  return todoItems.reduce((htmlContent, todoItem) => {
    htmlContent += `<div id='${todoItem.id}'>
    <input type='checkbox' ${todoItem.done ? 'checked' : ''} 
    onclick='changeStatus(event)'>
    ${todoItem.objective}
    <button onclick='deleteTodoItem(event)'>Delete</button></div>`
    return htmlContent;
  }, '');
};

module.exports = {
  convertAllTodoListsToHtml,
  convertAllTodoItemsToHtml
}