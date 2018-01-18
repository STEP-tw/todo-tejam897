const chai = require('chai');
let assert = chai.assert;
let User = require('../js/user.js');
describe('user',()=>{
  describe('getTodos',()=>{
    it('should give the all todos of user',()=>{
      let user = new User('teja','tejam',{cricket:{title:'playCricket',item1:'go for toss'}});
      let expected = {cricket:{title:'playCricket',item1:'go for toss'}};
      assert.deepEqual(expected,user.getTodos())
    })
  })
  describe('addTodo',()=>{
    it('should add the given todo to user todos',()=>{
      let user = new User('teja','tejam');
      user.addTodo({title:'playCricket',item1:'go for toss'});
      let expected = {playCricket:{title:'playCricket',item1:'go for toss'}};
      assert.deepEqual(expected,user.todos)
    })
  })
})
