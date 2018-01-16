let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let app = require('../lib//app.js');
const user = require('../js/user.js');

let res = {headers:'',finished:false};
res.setHeader = function(key,val){
  res[key] = val;
}
res.write = function(content){
  res.body = content;
}
res.end = function(){
  res.finished = true;
}

describe('response',()=>{
  describe('setHeader',()=>{
    it('sets the given key value as response headers',()=>{
      res.setHeader('contentType','html');
      console.log(res);
      assert.deepEqual(res.contentType,'html')
    })
  })
  describe('res.write',()=>{
    it('writes given file content to response body',()=>{
      res.write('hii')
      console.log(res.body);
      assert.include(res.body,'hii')
    })
  })
  describe('res.end',()=>{
    it('sets the value of finished key of response to true',()=>{
      assert.isFalse(res.finished)
      res.end();
      assert.isTrue(res.finished);
    })
  })
})


describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('POST /registerForm redirect to login page',()=>{
    it('redirects to login page',done=>{
      request(app,{method:'POST',url:'/registerForm'},(res)=>{
        th.should_be_redirected_to(res,'html/login.html');
        done();
      })
    })
  })
  describe('get /home ',()=>{
    it('shows user home page ',done=>{
      request(app,{method:'GET',url:'/home',user:{userId:'tejam'}},(res)=>{
        th.body_contains(res,'addNew');
        done();
      })
    })
  })
});
