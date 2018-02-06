/* eslint-disable */
const changeStatus = function(event){
  const itemDiv = event.target.parentNode;
  const checkbox = event.target;
  const itemId = itemDiv.id;
  const status = event.target.checked;
  const url = window.location.pathname;
  const data = `itemId=${itemId}&action=changeStatus`;
  sendRequest('PUT', url, data, (res) => {
    if (res !== 'success') {checkbox.checked = !status;}
  });
};

const deleteTodoItem = function(event){
  const targetItem = event.target.parentNode;
  const itemId = targetItem.id;
  const url = window.location.pathname;
  const data = `itemId=${itemId}`;
  sendRequest('DELETE', url, data, (res) => {
    if(res == 'success') {targetItem.remove();}
  });
};

const editTodoItem = function (event) {
  const itemDiv = event.target.parentNode;
  const itemId = itemDiv.id;
  const objective = itemDiv.querySelector('label').innerText;
  const editingDiv = document.createElement('div');
  editingDiv.id = itemId;
  editingDiv.innerHTML = `<input value='${objective}' id='obj-${itemId}'>
   <button onclick='saveEditedTodoItem(event)'>Save</button>`;
  itemDiv.replaceWith(editingDiv);
};

const saveEditedTodoItem = function (event) {
  const itemId = event.target.parentNode.id;
  const url = window.location.pathname;
  const objective = document.getElementById(`obj-${itemId}`).value;
  const data = `itemId=${itemId}&objective=${objective}&action=editItemObjective`;
  sendRequest('PUT', url, data, (res) => {
    if(res=='success')
    {window.location.reload();}
  });
};

const sendRequest = function (method, url, data, onLoad) {
  const req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load', function () {
    onLoad(this.response);
  });
  req.send(data || '');
};
