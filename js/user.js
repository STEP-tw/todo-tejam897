class User {
  constructor(userId,todos) {
    this.userId = userId;
    this.todos = todos||{};
  }
  addTodo(todo){
    let todoId = todo.title;
    return this.todos[todoId] = todo;
  }
  get getTodos(){
    return this.todos;
  }
}

module.exports = User;
