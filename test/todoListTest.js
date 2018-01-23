const chai = require('chai');
const assert = chai.assert;

const TodoList = require('../lib/models/todoList');

let todoList;

describe('TodoList', () => {
  beforeEach(() => {
    todoList = new TodoList(3, 'test', 'in progress');
  });
  describe('getter title', () => {
    it('should return title of todoList', () => {
      assert.equal(todoList.title, 'test');
    });
  });
  describe('getter description', () => {
    it('should return description of todoList', () => {
      assert.equal(todoList.description, 'in progress');
    });
  });
  describe('getter listId', () => {
    it('should return listId of todoList', () => {
      assert.equal(todoList.listId, 3);
    });
  });
  describe('addTodoItem', () => {
    it('should return id of newly added item', () => {
      let newItemId = todoList.addTodoItem('testing');
      assert.equal(newItemId, 1);
      newItemId = todoList.addTodoItem('testing 2');
      assert.equal(newItemId, 2);
    });
  });
  describe('getAllTodoItems', () => {
    it('should return an empty array when no items are present', () => {
      assert.isEmpty(todoList.getAllTodoItems());
    });
    it('should return todoItems when a item is present', () => {
      todoList.addTodoItem('testing');
      const expected = [{ objective: 'testing', id: 1, done: false }];
      assert.deepEqual(todoList.getAllTodoItems(), expected);
    });
  });
  describe('updateTitle', () => {
    it('should update the list title with given title', () => {
      todoList.updateTitle('update');
      assert.equal(todoList._title,'update');
    });
  });
  describe('changeStatus', () => {
    it('should return false if item is not present', () => {
      assert.isFalse(todoList.changeStatus(12));
    });
    it('should return true if item is present', () => {
      todoList.addTodoItem('status test');
      assert.isTrue(todoList.changeStatus(1));
      assert.isTrue(todoList._todoItems[1].isDone());
    });
  });

  describe('deleteTodoItem', () => {
    it('should return false if the item is not present with given id', () => {
      assert.isFalse(todoList.deleteTodoItem(12));
    });
    it('should delete todoItem of given id', () => {
      todoList.addTodoItem('test');
      assert.isTrue(todoList.deleteTodoItem(1));
      assert.isUndefined(todoList._todoItems[1]);
      assert.doesNotHaveAnyKeys(todoList._todoItems, 1);
    });
  });
  describe('editItemObjective', () => {
    it('should return false if the item is not present with given id', () => {
      assert.isFalse(todoList.editItemObjective(12));
    });
    it('should change todoItemObjective of given id', () => {
      todoList.addTodoItem('test');
      assert.isTrue(todoList.editItemObjective(1,'editItem'));
      assert.equal(todoList._todoItems[1]._objective, 'editItem');
    });
  });
});
