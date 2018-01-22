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

const sendRequest = function (method, url, data, onLoad) {
  let req = new XMLHttpRequest();
  req.open(method, url);
  req.addEventListener('load', function () {
    onLoad(this.response);
  });
  req.send(data || '');
}