const chai = require('chai');
const assert = chai.assert;
const TodoApp = require('../lib/models/todoApp');

const dataLoader = require('../lib/dataLoader');

describe('dataLoader', () => {
  it('should ', () => {
    let todoApp = new TodoApp({});
    let neeraj = todoApp.addUser('Neeraj', 'nrjais');
    let teja = todoApp.addUser('Teja', 'teja');
    neeraj.addTodoList('testingUser','checking');
    neeraj.addTodoItemTo(1,'readyToTest');
    teja.addTodoList('secondUser','testing');
    teja.addTodoItemTo(1,'now go');
    let usersData = JSON.stringify(todoApp.userData);
    let initializedData = dataLoader(JSON.parse(usersData));
    assert.deepEqual(todoApp.userData,initializedData);
  });
});

