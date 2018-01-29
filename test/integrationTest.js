const app = require('../lib/app.js');
const request = require('supertest');

describe('app', () => {
  beforeEach(() => {
    const users = {
      "teja": { "username": "tejam", "name": "Teja" },
      "nrjais": { "username": "nrjais", "sessionId": "12345", "name": "Neeraj" }
    };
    app.saveData = ()=>{};
    app.initializeApp(users,{});
  });

  describe('GET /bad', () => {
    it('responds with 404', (done) => {
      request(app)
        .get('/bad')
        .expect(404)
        .end(done);
    });
  });

  describe('login handler', () => {
    describe('get /', () => {
      it('it serves login page if the user not loggedIn', (done) => {
        request(app)
          .get('/')
          .expect(200)
          .expect(/Login here/)
          .end(done);
      });
    });
    describe('get /login', () => {
      it('it serves login page if the user not loggedIn', (done) => {
        request(app)
          .get('/login')
          .expect(200)
          .expect(/Login here/)
          .end(done);
      });

      it('redirect to todolists page if user loggedin', (done) => {
        request(app)
          .get('/')
          .set('cookie', "sessionid=12345")
          .expect(302)
          .expect('Location', '/todolists')
          .end(done);
      });
    });
    describe('post /login badUser', () => {
      it('redirect to login page ', (done) => {
        request(app)
          .post('/login')
          .send('userId=rajm')
          .redirectsTo('/login')
          .end(done);
      });
      it('redirect to login page when no userID is given', (done) => {
        request(app)
          .post('/login')
          .send('userId=')
          .redirectsTo('/login')
          .end(done);
      });
      it('sets message cookie with a Login Failed', (done) => {
        request(app)
          .post('/login')
          .send('userId=rajm')
          .expect(302)
          .expect('Set-Cookie', /message=Login Failed/)
          .redirectsTo('/login')
          .end(done);
      });
    });
    describe('post /login validUser', () => {
      it('should set sessionId cookie', (done) => {
        request(app)
          .post('/login')
          .send(`userId=teja`)
          .cookie.isDefined('sessionid')
          .end(done);
      });
      it('should redirect home page', (done) => {
        request(app)
          .post('/login')
          .send(`userId=teja`)
          .redirectsTo('/todolists')
          .end(done);
      });
    });
  });

  describe('logout handler', () => {
    describe('/logout', () => {
      it('should logout the user when user is logged in', (done) => {
        request(app)
          .post('/logout')
          .set('cookie', "sessionid=12345")
          .redirectsTo('/')
          .end(done);
      });
      it('should redirect to / when user is not logged in', (done) => {
        request(app)
          .post('/logout')
          .redirectsTo('/login')
          .end(done);
      });
    });
  });

  describe('GET /todolists', () => {
    it('should redirect to login when not logged in', (done) => {
      request(app)
        .get('/todolists')
        .redirectsTo('/login')
        .end(done);
    });
    it('should respond with todolists page with no lists present', (done) => {
      request(app)
        .get('/todolists')
        .set('cookie', "sessionid=12345")
        .body.include('Title :')
        .body.include('Description :')
        .end(done);
    });
  });

  describe('todolists handler', () => {
    beforeEach((done) => {
      request(app)
        .post('/todolists')
        .set('cookie', "sessionid=12345")
        .send(`title=test&description=testing`)
        .end(done);
    });

    describe('POST /todolists', () => {
      describe('saves todolist', () => {
        it('should add a todo list for user', (done) => {
          request(app)
            .get('/todolists')
            .set('cookie', "sessionid=12345")
            .send(`title=test&description=testing`)
            .body.include('test')
            .body.include('Title :')
            .body.include('Description :')
            .end(done);
        });
      });
    });

    describe('PUT /todolists', () => {
      it('should responds with success when list is updated', (done) => {
        request(app)
          .put('/todolists')
          .set('cookie', 'sessionid=12345')
          .send(`listId=1&title=editing`)
          .body.equal('success')
          .end(done);
      });
    });

    describe('DELETE /todolists', () => {
      it('should responds with success when list is deleted', (done) => {
        request(app)
          .delete('/todolists')
          .set('cookie', 'sessionid=12345')
          .send(`listId=1&title=editing`)
          .body.equal('success')
          .end(done);
      });
    });
  });


  describe('GET /todolist/[listId]', () => {
    it('should redirect to login when not logged in', (done) => {
      request(app)
        .get('/todolist/1')
        .redirectsTo('/login')
        .end(done);
    });
    it('should respond with todolist page with no todoItems', (done) => {
      request(app)
        .get('/todolist/1')
        .set('cookie', 'sessionid=12345')
        .body.include('Add')
        .body.include('Objective :')
        .end(done);
    });
  });

  describe('todoitems handler', () => {
    beforeEach((done) => {
      request(app)
        .post('/todolists')
        .set('cookie', "sessionid=12345")
        .send(`title=test&description=testing`)
        .end(() => {
          request(app)
            .post('/todolist/1')
            .send(`objective=testingItem`)
            .set('cookie', 'sessionid=12345')
            .redirectsTo('/todolist/1')
            .end(done);
        });
    });

    describe('POST /todolist/[listId]', () => {
      it('should add the given item to the todo list', (done) => {
        request(app)
          .get('/todolist/1')
          .set('cookie', "sessionid=12345")
          .body.include('Add')
          .body.include('Objective :')
          .body.include('testingItem')
          .end(done);
      });
    });

    describe('PUT /todolist/[listId]', () => {
      it('should respond with failed when action is wrong', (done) => {
        request(app)
          .put('/todolist/1')
          .set('cookie', "sessionid=12345")
          .send("itemId=1&action=change")
          .body.equal('failed')
          .end(done);
      });
      it('should respond with success message when status is changed', (done) => {
        request(app)
          .put('/todolist/1')
          .set('cookie', "sessionid=12345")
          .send("itemId=1&action=changeStatus")
          .body.equal('success')
          .end(done);
      });
      it('should respond with page with checked checkbox when status is changed', (done) => {
        request(app)
          .put('/todolist/1')
          .set('cookie', "sessionid=12345")
          .send("itemId=1&action=changeStatus")
          .body.equal('success')
          .end(() => {
            request(app)
              .get('/todolist/1')
              .set('cookie', "sessionid=12345")
              .body.include('checked')
              .body.include('testingItem')
              .end(done);
          });
      });
    });

    describe('DELETE /todolist/[listId]', () => {
      it('should respond with success message when item is deleted', (done) => {
        request(app)
          .delete('/todolist/1')
          .set('cookie', "sessionid=12345")
          .send("itemId=1")
          .body.equal('success')
          .end(done);
      });

      it('should respond with page without the deleted item', (done) => {
        request(app)
          .delete('/todolist/1')
          .set('cookie', "sessionid=12345")
          .send("itemId=1")
          .expect(200)
          .end(() => {
            request(app)
              .get('/todolist/1')
              .set('cookie', "sessionid=12345")
              .body.notInclude('testingItem')
              .end(done);
          });
      });
      
    });

    describe('PUT /todolist/[listId]', () => {
      it('should respond with success message when item objective is changed', (done) => {
        request(app)
          .put('/todolist/1')
          .set('cookie','sessionid=12345')
          .send("itemId=1&objective=editingItem&action=editItemObjective")
          .expect(200)
          .body.equal('success')
          .end(done);
      });

      it('should respond with page with the edited todo item', (done) => {
        request(app)
          .put('/todolist/1')
          .set('cookie', 'sessionid=12345')
          .send("itemId=1&objective=editingItem&action=editItemObjective")
          .expect(200)
          .end(() => {
            request(app)
              .get('/todolist/1')
              .set('cookie', 'sessionid=12345')
              .expect(200)
              .body.include('editingItem')
              .end(done);
          });
      });
    });
  });
});
