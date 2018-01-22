const editTodoList = function(event){
  let listDiv =event.target.parentNode;
  let todoListId = listDiv.id;
  let title = document.getElementById(`title-${todoListId}`).innerText;
  let editingDiv = document.createElement('div');
  editingDiv.id = todoListId;
  editingDiv.innerHTML = `<input value=${title} id='title-${todoListId}'>
   <button onclick='saveEditedTodoList(event)'>Save</button>`;
  listDiv.replaceWith(editingDiv);
}

const saveEditedTodoList = function(event){
  let editedList = event.target.parentNode;
  let listId = editedList.id;
  let title = document.getElementById(`title-${listId}`).value;
  let data = `listId=${listId}&title=${title}`;
  sendRequest('PUT', '/todolists', data, res=>window.location.reload());
}

const deleteTodoList = function(event){
  let targetList = event.target.parentNode;
  let listId = targetList.id;
  let data = `listId=${listId}`;
  sendRequest('DELETE', '/todolists', data, res=>{
    if(res == 'success') targetList.remove();
  });
}

const sendRequest = function(method, url, data, onLoad){
  let req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load',function(){
    let res = this.response;
    onLoad(res);
  });
  req.send(data || '');
}