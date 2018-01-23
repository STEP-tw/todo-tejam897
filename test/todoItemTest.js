const chai = require('chai');
const assert = chai.assert;

const TodoItem = require('../lib/models/todoItem');
let todoItem;
describe('TodoItem', () => {
  beforeEach(() => {
    todoItem = new TodoItem(2,'complete test');
  });
  describe('getter itemId', () => {
    it('should return id of the item', () => {
      assert.equal(todoItem.itemId,2);
    });
  });
  describe('getter objective', () => {
    it('should return objective of the item', () => {
      assert.equal(todoItem.objective,'complete test');
    });
  });
  describe('isDone', () => {
    it('should return status of item', () => {
      assert.isFalse(todoItem.isDone());
    });
  });
  describe('changeStatus', () => {
    it('should return true', () => {
      assert.isTrue(todoItem.changeStatus());
    });
    it('should toggle done status', () => {
      todoItem.changeStatus();
      assert.isTrue(todoItem.isDone());
      todoItem.changeStatus();
      assert.isFalse(todoItem.isDone());
    });
  });
  describe('changeObjective', () => {
    it('should return true when objective is changed', () => {
      assert.isTrue(todoItem.changeObjective('editItem'));
    });
    it('should change the objective ', () => {
      todoItem.changeObjective('editItem');
      assert.equal(todoItem._objective,'editItem');
    });
  });
});
