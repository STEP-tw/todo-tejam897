const chai = require('chai');
let assert = chai.assert;
let User = require('../lib/models/user.js');
let TodoList = require('../lib/models/todoList.js');

let user;
describe('user', () => {
  beforeEach(() => {
    user = new User('test', 'test');
  });

  describe('addTodoList', () => {
    it('should return the newly added todoList', () => {
      let todoList = user.addTodoList('test', 'testing');
      let expected = new TodoList(1, 'test', 'testing');
      assert.deepEqual(todoList, expected);
      expected = { '1': todoList };
      assert.deepEqual(user._todoLists, expected);
    });
  });

  describe('getAllTodoLists', () => {
    it('should return empty array when no todoLists are present', () => {
      assert.isEmpty(user.getAllTodoLists());
    });
    it('should return array with all todoLists(title,id) when present', () => {
      user.addTodoList('test', 'testing');
      let expected = [{ title: 'test', id: 1 }];
      assert.deepEqual(user.getAllTodoLists(), expected);
    });
  });

  describe('addTodoItemTo', () => {
    it('should return id of newly added item', () => {
      user.addTodoList('test', 'testing');
      let itemId = user.addTodoItemTo(1, 'testing');
      assert.equal(itemId, 1);
    });
    it('should return umdefined if given list is not present', () => {
      let itemId = user.addTodoItemTo(1, 'testing');
      assert.isUndefined(itemId);
    });
  });
  describe('getAllTodoItems', () => {
    it('should return undefined when no list is present with given id', () => {
      let items = user.getAllTodoItems();
      assert.isUndefined(items);
    });
    it('should return empty array when no todoItems are present in given list', () => {
      user.addTodoList('test', 'testing');
      let items = user.getAllTodoItems(1);
      assert.isEmpty(items);
    });

    it('should return empty array when no todoItems are present in given list', () => {
      user.addTodoList('test', 'testing');
      let itemId = user.addTodoItemTo(1, 'testing');
      assert.equal(itemId, 1);
      let items = user.getAllTodoItems(1);
      let expected = [{ objective: 'testing', id: 1, done: false }];
      assert.deepEqual(items, expected);
    });
  });
});
