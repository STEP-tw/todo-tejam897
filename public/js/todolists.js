/* eslint-disable */
const editTodoList = function(event){
  const listDiv =event.target.parentNode;
  const todoListId = listDiv.id;
  const title = document.getElementById(`title-${todoListId}`).innerText;
  const description = document.getElementById(`des-${todoListId}`).innerText;
  const editingDiv = document.createElement('div');
  editingDiv.id = todoListId;
  editingDiv.innerHTML = `<input value=${title} id='title-${todoListId}' class="title">
  <input value='${description}' id='des-${todoListId}' class="des">
   <button onclick='saveEditedTodoList(event)'>Save</button>`;
  listDiv.replaceWith(editingDiv);
};

const saveEditedTodoList = function(event){
  const editedList = event.target.parentNode;
  const listId = editedList.id;
  const title = document.getElementById(`title-${listId}`).value;
  const description = document.getElementById(`des-${listId}`).value;
  const data = `listId=${listId}&title=${title}&description=${description}`;
  sendRequest('PUT', '/todolists', data, (res) => window.location.reload());
};

const deleteTodoList = function(event){
  const targetList = event.target.parentNode;
  const listId = targetList.id;
  const data = `listId=${listId}`;
  sendRequest('DELETE', '/todolists', data, (res) => {
    if(res == 'success') {targetList.remove();}
  });
};

const sendRequest = function(method, url, data, onLoad){
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load',function(){
    const res = this.response;
    onLoad(res);
  });
  req.send(data || '');
};
