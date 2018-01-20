let chai = require('chai');
let assert = chai.assert;

const TodoList = require('../lib/models/todoList');

let todoList;

describe('TodoList', () => {
  beforeEach(() => {
    todoList = new TodoList(3, 'test', 'in progress');
  });
  describe('getter title', () => {
    it('should return title of todoList', () => {
      assert.equal(todoList.title, 'test')
    });
  });
  describe('getter description', () => {
    it('should return description of todoList', () => {
      assert.equal(todoList.description, 'in progress')
    });
  });
  describe('getter listId', () => {
    it('should return listId of todoList', () => {
      assert.equal(todoList.listId, 3)
    });
  });
  describe('addTodoItem', () => {
    it('should return id of newly added item', () => {
      let newItemId = todoList.addTodoItem('testing');
      assert.equal(newItemId, 1)
      newItemId = todoList.addTodoItem('testing 2');
      assert.equal(newItemId, 2);
    });
  });
  describe('getAllTodoItems', () => {
    it('should return an empty array when no items are present', () => {
      assert.isEmpty(todoList.getAllTodoItems())
    });
    it('should return todoItems when a item is present', () => {
      todoList.addTodoItem('testing');
      let expected = [{ objective: 'testing', id: 1, done: false }];
      assert.deepEqual(todoList.getAllTodoItems(), expected);
    });
  });
});