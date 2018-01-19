class Todo {
  constructor(title,desc,items) {
    this.title = title;
    this.desc = desc;
    this.totalItems = 0;
    this.items = this.setItems(items);
  }
  addItem(item){
    let currentItem = this.totalItems++;
    this.items[`item${this.totalItems}`] = item;
  }
  setItems(items){
    let allItems = Object.keys(items);
    let todo = this;
    let todoItems = {}
    this.items = allItems.reduce((todoItems,item)=>{
      let currentItem = items[item];
      todo.totalItems++;
      todoItems[`item${this.totalItems}`] = currentItem;
      return todoItems;
    },todoItems)
  }
}
