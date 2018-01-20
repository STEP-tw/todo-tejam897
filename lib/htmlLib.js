const convertAllTodoListsToHtml = function (todoLists) {
  return todoLists.reduce((htmlContent, todoList) => {
    htmlContent += `<div><a href="todolist/${todoList.id}">${todoList.title}</a><br></div>`
    return htmlContent;
  }, '');
};
const convertAllTodoItemsToHtml = function (todoItems) {
  return todoItems.reduce((htmlContent, todoItem) => {
    htmlContent += `<div>${todoItem.objective}</div>`
    return htmlContent;
  }, '');
};

module.exports = {
  convertAllTodoListsToHtml,
  convertAllTodoItemsToHtml
}