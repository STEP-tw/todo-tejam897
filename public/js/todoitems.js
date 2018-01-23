const changeStatus = function(event){
  let itemDiv = event.target.parentNode;
  let checkbox = event.target;
  let itemId = itemDiv.id;
  let status = event.target.checked;
  let url = window.location.pathname;
  let data = `itemId=${itemId}&action=changeStatus`
  sendRequest('PUT', url, data, res => {
    if (res !== 'success') checkbox.checked = !status;
  });
}

const deleteTodoItem = function(event){
  let targetItem = event.target.parentNode;
  let itemId = targetItem.id;
  let url = window.location.pathname;
  let data = `itemId=${itemId}`;
  sendRequest('DELETE', url, data, res=>{
    if(res == 'success') targetItem.remove();
  });
}

const editTodoItem = function (event) {
  let itemDiv = event.target.parentNode;
  let itemId = itemDiv.id;
  let objective = itemDiv.innerText;
  let editingDiv = document.createElement('div');
  editingDiv.id = itemId;
  editingDiv.innerHTML = `<input value=${objective} id='obj-${itemId}'>
   <button onclick='saveEditedTodoItem(event)'>Save</button>`;
  itemDiv.replaceWith(editingDiv);
}

const saveEditedTodoItem = function (event) {
  let itemId = event.target.parentNode.id;
  let url = window.location.pathname;
  let objective = document.getElementById(`obj-${itemId}`).value;
  let data = `itemId=${itemId}&objective=${objective}&action=editItemObjective`;
  sendRequest('PUT', url, data, res =>{
    if(res=='success')
    window.location.reload();
  })
}

const sendRequest = function (method, url, data, onLoad) {
  let req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load', function () {
    onLoad(this.response);
  });
  req.send(data || '');
}