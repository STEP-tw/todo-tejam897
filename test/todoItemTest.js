let chai = require('chai');
let assert = chai.assert;

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
      assert.isFalse(todoItem.isDone())
    });
  });
});