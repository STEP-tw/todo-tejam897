let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let app = require('../lib//app.js');

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
      request(app,{method:'GET',url:'/templates/home.html'},(res)=>{
        th.body_contains(res,'addNew');
        done();
      })
    })
  })
  describe('post /login badUser',()=>{
    it('redirect to login page ',()=>{
      request(app,{method:'POST',url:'/login',body:`name=raj&userId=rajm`},(res)=>{
        th.should_be_redirected_to(res,'/login.html');
      })
    })
    it('sets logInFailed cookie with a truthy value',()=>{
      request(app,{method:'POST',url:'/login',body:`name=raj&userId=rajm`},(res)=>{
        th.should_have_cookie(res,'logInFailed','true');
      })
    })
  })
  describe('post /login validUser',()=>{
    it('should set sessionId cookie',()=>{
      request(app,{method:'POST',url:'/login',body:`name=teja&userId=tejam`},(res)=>{
        th.should_have_cookie(res,'sessionid');
      })
    })
    it('should redirect home page',()=>{
      request(app,{method:'POST',url:'/login',body:`name=teja&userId=tejam`},(res)=>{
        th.should_be_redirected_to(res,'./templates/home.html');
      })
    })
  })
});
