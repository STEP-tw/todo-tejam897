let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
process.env.TESTMODE = true;
let app = require('../lib/app.js');

describe('app', () => {
  beforeEach(() => {
    let fs = {
      readFileSync: (fileName) => {
        return `{"teja" : {"username" : "tejam"},
  "nrjais" : {"username" : "nrjais", "sessionId" : "12345"}}`
      }
    }
    app.initialize(fs);
  });

  describe('GET /bad', () => {
    it('responds with 404', done => {
      request(app, { method: 'GET', url: '/bad' }, (res) => {
        assert.equal(res.statusCode, 404);
        done();
      })
    })
  })

  describe('login handler', () => {
    describe('get /', () => {
      it('it serves login page if the user not loggedIn', (done) => {
        request(app, { method: 'GET', headers: {}, url: '/' }, (res) => {
          assert.equal(res.statusCode, 200);
          th.body_contains(res, 'Login here');
          done();
        })
      })
    })
    describe('get /login', () => {
      it('it serves login page if the user not loggedIn', (done) => {
        request(app, { method: 'GET', headers: {}, url: '/' }, (res) => {
          assert.equal(res.statusCode, 200);
          th.body_contains(res, 'Login here');
          done();
        })
      })

      it('redirect to todolists page if user loggedin', (done) => {
        request(app, { method: 'GET', url: '/login', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.should_be_redirected_to(res, '/todolists');
          done()
        })
      })
    })
    describe('post /login badUser', () => {
      it('redirect to login page ', (done) => {
        request(app, { method: 'POST', url: '/login', body: `userId=rajm` }, (res) => {
          th.should_be_redirected_to(res, '/login');
          done();
        })
      });
      it('redirect to login page when no userID is given', (done) => {
        request(app, { method: 'POST', url: '/login', body: `userId=` }, (res) => {
          th.should_be_redirected_to(res, '/login');
          done();
        })
      })
      it('sets message cookie with a Login Failed', (done) => {
        request(app, { method: 'POST', url: '/login', body: `userId=rajm` }, (res) => {
          th.should_have_cookie(res, 'message', 'Login Failed');
          done();
        })
      })
    })
    describe('post /login validUser', () => {
      it('should set sessionId cookie', (done) => {
        request(app, { method: 'POST', url: '/login', body: `userId=teja` }, (res) => {
          th.should_have_cookie(res, 'sessionid');
          done();
        })
      })
      it('should redirect home page', (done) => {
        request(app, { method: 'POST', url: '/login', body: `userId=teja` }, (res) => {
          th.should_be_redirected_to(res, '/todolists');
          done();
        })
      })
    })
  });
  describe('logout handler', () => {
    describe('/logout', () => {
      it('should logout the user when user is logged in', (done) => {
        request(app, { method: 'GET', url: '/logout', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.should_be_redirected_to(res, '/');
          done();
        })
      });
      it('should redirect to / when user is not logged in', (done) => {
        request(app, { method: 'GET', url: '/logout' }, (res) => {
          th.should_be_redirected_to(res, '/login');
          done();
        })
      });
    });
  });

  describe('todolists handler', () => {
    describe('GET /todolists', () => {
      it('should redirect to login when not logged in', (done) => {
        request(app, { method: 'GET', url: '/todolists' }, (res) => {
          th.should_be_redirected_to(res, '/login');
          done();
        });
      });
      it('should respond with todolists page with no lists present', (done) => {
        request(app, { method: 'GET', url: '/todolists', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.body_contains(res, 'Title :')
          th.body_contains(res, 'Description :');
          done();
        });
      });
    });

    describe('POST /todolists', () => {
      describe('saves todolist', () => {
        it('should add a todo list for user', (done) => {
          request(app, {
            method: 'POST', url: '/todolists',
            body: `title=test&description=testing`,
            headers: { cookie: 'sessionid=12345' }
          }, res => {
            th.should_be_redirected_to(res, '/todolists');
            done();
          })
        });
        it('should respond with the added todolist', (done) => {
          request(app, {
            method: 'GET', url: '/todolists',
            headers: { cookie: 'sessionid=12345' }
          }, res => {
            th.body_contains(res, 'test');
            th.body_contains(res, 'Title :')
            th.body_contains(res, 'Description :');
            done();
          })
        });
      });
    });
    describe('PUT /todolists', () => {
      it('should responds with success when list is updated', (done) => {
        request(app, {
          method: 'POST', url: '/todolists',
          body: `title=test&description=testing`,
          headers: { cookie: 'sessionid=12345' }
        }, res => {
          request(app, { method: 'PUT', url: '/todolists', headers: { cookie: 'sessionid=12345' }, body: `listId=1&title=editing` }, res => {
            assert.equal(res.body, 'success');
            done();
          });
        })
      });
    });
    describe('DELETE /todolists', () => {
      it('should responds with success when list is deleted', (done) => {
        request(app, {
          method: 'POST', url: '/todolists',
          body: `title=test&description=testing`,
          headers: { cookie: 'sessionid=12345' }
        }, res => {
          request(app, { method: 'DELETE', url: '/todolists', headers: { cookie: 'sessionid=12345' }, body: `listId=1&title=editing` }, res => {
            assert.equal(res.body, 'success');
            done();
          });
        })
      });
    });
    describe('GET /todolist/[listId]', () => {
      it('should redirect to login when not logged in', (done) => {
        request(app, { method: 'GET', url: '/todolist/1' }, (res) => {
          th.should_be_redirected_to(res, '/login');
          done();
        });
      });
      it('should respond with todolist page with no todoItems', (done) => {
        request(app, { method: 'GET', url: '/todolist/1', headers: { cookie: "sessionid=12345" } }, (res) => {
          th.body_contains(res, 'Add')
          th.body_contains(res, 'Objective :');
          done();
        });
      });
    });
    describe('POST /todolist/[listId]', () => {
      it('should add the given item to the todo list', (done) => {
        request(app, {
          method: 'POST', url: '/todolists',
          body: `title=test&description=testing`,
          headers: { cookie: 'sessionid=12345' }
        }, res => {
          request(app, {
            method: 'POST', url: '/todolist/4',
            body: `objective=testingItem`,
            headers: { cookie: 'sessionid=12345' }
          }, res => {
            th.should_be_redirected_to(res,'/todolist/4');
            request(app, { method: 'GET', url: '/todolist/4', headers: { cookie: "sessionid=12345" } }, (res) => {
              th.body_contains(res, 'Add')
              th.body_contains(res, 'Objective :');
              th.body_contains(res, 'testingItem');
              done();
            });
          });
        });
      });
    });
  });
});
