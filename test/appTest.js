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

  describe('login handler', () => {
    describe('get /', () => {
      it('it serves login if the user not loggedIn', () => {
        request(app, { method: 'GET', headers: {}, url: '/' }, (res) => {
          assert.equal(res.statusCode, 200);
          th.body_contains(res, 'Login here');
        })
      })
    })
    describe('get /login', () => {
      it('it serves login if the user not loggedIn', () => {
        request(app, { method: 'GET', headers: {}, url: '/' }, (res) => {
          assert.equal(res.statusCode, 200);
          th.body_contains(res, 'Login here');
        })
      })

      
    })
    describe('post /login badUser', () => {
      it('redirect to login page ', () => {
        request(app, { method: 'POST', url: '/login', body: `name=raj&userId=rajm` }, (res) => {
          th.should_be_redirected_to(res, '/login');
        })
      })
      it('sets logInFailed cookie with a truthy value', () => {
        request(app, { method: 'POST', url: '/login', body: `name=raj&userId=rajm` }, (res) => {
          th.should_have_cookie(res, 'message', 'Login Failed');
        })
      })
    })
    describe('post /login validUser', () => {
      it('should set sessionId cookie', () => {
        request(app, { method: 'POST', url: '/login', body: `name=teja&userId=tejam` }, (res) => {
          th.should_have_cookie(res, 'sessionid');
        })
      })
      it('should redirect home page', () => {
        request(app, { method: 'POST', url: '/login', body: `name=teja&userId=tejam` }, (res) => {
          th.should_be_redirected_to(res, '/todolists');
        })
      })
    })

  });
});
