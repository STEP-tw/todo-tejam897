const chai = require('chai');
const assert = chai.assert;
const User = require('../lib/models/user.js');
const TodoList = require('../lib/models/todoList.js');

let user;
describe('user', () => {
  beforeEach(() => {
    user = new User('test', 'test');
  });
  describe('getter name', () => {
    it('should return user name', () => {
      assert.equal(user.name,'test')
    });
  });
  describe('addTodoList', () => {
    it('should return the newly added todoList', () => {
      const todoList = user.addTodoList('test', 'testing');
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
      const expected = [{ title: 'test', id: 1, description:"testing" }];
      assert.deepEqual(user.getAllTodoLists(), expected);
    });
  });

  describe('addTodoItemTo', () => {
    it('should return id of newly added item', () => {
      user.addTodoList('test', 'testing');
      const itemId = user.addTodoItemTo(1, 'testing');
      assert.equal(itemId, 1);
    });
    it('should return umdefined if given list is not present', () => {
      const itemId = user.addTodoItemTo(1, 'testing');
      assert.isUndefined(itemId);
    });
  });
  describe('getAllTodoItems', () => {
    it('should return undefined when no list is present with given id', () => {
      const items = user.getAllTodoItems();
      assert.isUndefined(items);
    });
    it('should return empty array when no todoItems are present in given list', () => {
      user.addTodoList('test', 'testing');
      const items = user.getAllTodoItems(1);
      assert.isEmpty(items);
    });

    it('should return empty array when no todoItems are present in given list', () => {
      user.addTodoList('test', 'testing');
      const itemId = user.addTodoItemTo(1, 'testing');
      assert.equal(itemId, 1);
      const items = user.getAllTodoItems(1);
      const expected = [{ objective: 'testing', id: 1, done: false }];
      assert.deepEqual(items, expected);
    });
  });

  describe('updateTodoList', () => {
    it('should return false if the list is not present with given id', () => { 
      assert.isFalse(user.updateTodoList(12,'failingtest'));
    });
    it('should update title of todoList of given id', () => {
      user.addTodoList('test','testing');
      assert.isTrue(user.updateTodoList(1,'edited'));
      assert.equal(user._todoLists[1]._title,'edited');
    });
  });
  
  describe('deleteTodoList', () => {
    it('should return false if the list is not present with given id', () => {
      assert.isFalse(user.deleteTodoList(12));
    });
    it('should delete todoList of given id', () => {
      user.addTodoList('test','testing');
      assert.isTrue(user.deleteTodoList(1));
      assert.isUndefined(user._todoLists[1]);
      assert.doesNotHaveAnyKeys(user._todoLists, 1);
    });
  });
  describe('changeStatus', () => {
    it('should return false if list is not present with givenId', () => {
      assert.isFalse(user.changeStatus(2,3));
    });
    it('should return false if list is present but not the item', () => {
      user.addTodoList('testing','itemStatus');
      assert.isFalse(user.changeStatus(1,3));
    });
    it('should return true if list and item are present', () => {
      user.addTodoList('testing','itemStatus');
      user.addTodoItemTo(1,'marking status');
      assert.isTrue(user.changeStatus(1,1));
      assert.isTrue(user._todoLists[1]._todoItems[1].isDone());
    });
  });
  describe('deleteTodoItem', () => {
    it('should return false if list is not present with givenId', () => {
      assert.isFalse(user.deleteTodoItem(2, 3));
    });
    it('should return false if list is present but not the item', () => {
      user.addTodoList('testing', 'itemStatus');
      assert.isFalse(user.deleteTodoItem(1, 3));
    });
    it('should return true if list and item are present', () => {
      user.addTodoList('testing', 'itemStatus');
      user.addTodoItemTo(1, 'marking status');
      assert.isTrue(user.deleteTodoItem(1, 1));
      assert.isUndefined(user._todoLists[1]._todoItems[1]);
      assert.doesNotHaveAnyKeys(user._todoLists[1]._todoItems, 1);
    });
  });
  describe('editTodoItemObjective', () => {
    it('should return false if list is not present with givenId', () => {
      assert.isFalse(user.editTodoItemObjective(2, 3,'listIdTesting'));
    });
    it('should return false if list is present but not the item', () => {
      user.addTodoList('testing', 'itemStatus');
      assert.isFalse(user.editTodoItemObjective(1, 3,'itemIdTesting'));
    });
    it('should return true and change objective if list and item are present', () => {
      user.addTodoList('testing', 'itemStatus');
      user.addTodoItemTo(1, 'marking status');
      assert.isTrue(user.editTodoItemObjective(1, 1,'itemTest'));
      assert.equal(user._todoLists[1]._todoItems[1]._objective,'itemTest');
    });
  });
  
  describe('getTitleOfList', () => {
    it('should return undefined when no list is present with given id', () => {
      assert.isUndefined(user.getTitleOfList(3));
    });
    it('should return title of the list of given id', () => {
      user.addTodoList('testing', 'itemStatus');
      assert.equal(user.getTitleOfList(1), 'testing');
    });
  });
  describe('getDescriptionOfList', () => {
    it('should return undefined when no list is present with given id', () => {
      assert.isUndefined(user.getDescriptionOfList(3));
    });
    it('should return description of the list of given id', () => {
      user.addTodoList('testing', 'itemStatus');
      assert.equal(user.getDescriptionOfList(1), 'itemStatus');
    });
  });
});
