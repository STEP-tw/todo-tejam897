const chai = require('chai');
const assert = chai.assert;
const TodoApp = require('../lib/models/todoApp');
let todoApp;

describe('todoApp', () => {
  beforeEach(() => {
    todoApp = new TodoApp({});
  });
  describe('addUser', () => {
    it('should add a new user with given detail s', () => {
      const expected = { tejam: { _name: 'teja', _userId: 'tejam', _todoLists: {}, _listId: 0 } };
      todoApp.addUser('teja', 'tejam');
      assert.deepEqual(todoApp._users, expected);
    });
  });
  describe('getUser', () => {
    it('should give the user with given userName', () => {
      todoApp.addUser('teja', 'tejam');
      const expected = { _name: 'teja', _userId: 'tejam', _todoLists: {}, _listId: 0 };
      assert.deepEqual(todoApp.getUser('tejam'), expected);
    });
  });
});
