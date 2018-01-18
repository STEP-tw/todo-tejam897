let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let app = require('../lib//app.js');
const user = require('../js/user.js');

let fs = {
  readFileSync(file){
    return file;
  }
}
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
  describe('write',()=>{
    it('writes given file content to response body',()=>{
      res.write('Hello')
      assert.include(res.body,'Hello')
    })
  })
  describe('end',()=>{
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
  describe('get /',()=>{
    it('it serves indexpage if the user not loggedIn',()=>{
      request(app,{method:'GET',cookies:{},url:'/'},(res)=>{
        assert.equal(res.statusCode,200);
        th.body_contains(res,'TODO');
      })
    })
  })
  describe('get /home.html ',()=>{
    it('shows user home page ',done=>{
      request(app,{method:'GET',url:'/templates/home.html',user:{userId:'tejam'}},(res)=>{
        th.body_contains(res,'addNew');
        done();
      })
    })
  })
  describe('post /login',()=>{
    it('redirect to login page if the user details are wrong',()=>{
      request(app,{method:'POST',url:'/login',user:{name:'raj',userId:'rajm'}},(res)=>{
        th.should_be_redirected_to(res,'/login.html')
      })
    })
  })
});
