class User {
  constructor(name,userId,todos) {
    this.name = name;
    this.userId = userId;
    this.todos = todos||{};
  }
  addTodo(todo){
    let todoId = todo.title;
    return this.todos[todoId] = todo;
  }
  getTodos(){
    return this.todos;
  }
}

module.exports = User;
