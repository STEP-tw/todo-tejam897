let chai = require('chai');
let assert = chai.assert;
let SessionHandler = require('../lib/models/sessionHandler');
let fs = {
  readFileSync: (fileName) => {
    return `{"teja" : {"username" : "tejam"},
  "nrjais" : {"username" : "nrjais", "sessionId" : "12345"}}`
  }
}
let sessionHandler;

describe('SessionHandler', () => {
  beforeEach(() => {
    sessionHandler = new SessionHandler('', fs);
    sessionHandler.loadSessionData();
  });
  describe('loadSessionData', () => {
    it('should parse and loads all users data', () => {
      let expected = {
        "teja": { "username": "tejam" },
        "nrjais": { "username": "nrjais", "sessionId": "12345" }
      }
      assert.deepEqual(sessionHandler.users, expected);
    });
  });
  describe('isValidUser', () => {
    it('should return true for valid user', () => {
      assert.isTrue(sessionHandler.isValidUser('teja'));
    });
    it('should return false for inValid user', () => {
      assert.isFalse(sessionHandler.isValidUser('te'));
    });
    it('should return false when no user is provided', () => {
      assert.isFalse(sessionHandler.isValidUser());
      assert.isFalse(sessionHandler.isValidUser(''));
    });
  });
  describe('getUserByUserName', () => {
    it('should return a user when user is present', () => {
      let expected = { username: 'tejam' };
      assert.deepEqual(sessionHandler.getUserByUserName('teja'), expected);
    });
    it('should return undefined when user is not present', () => {
      assert.isUndefined(sessionHandler.getUserByUserName('t'));
    });
  });
  describe('getUserBySessionId', () => {
    it('should return a user when user is present with given valid sessionId', () => {
      let expected = { username: 'nrjais',sessionId:'12345' };
      assert.deepEqual(sessionHandler.getUserBySessionId('12345'), expected);
    });
    it('should return false when sessionID is invalid', () => {
      assert.isUndefined(sessionHandler.getUserBySessionId('t'));
      assert.isUndefined(sessionHandler.getUserBySessionId(''));
      assert.isUndefined(sessionHandler.getUserBySessionId());
    });
  });


  describe('loginUser', () => {
    it('should return a sessionId when the user is present', () => {
      assert.isString(sessionHandler.logInUser('teja'));
    });
    it('should return false when the user is not present', () => {
      assert.isFalse(sessionHandler.logInUser('te'));
    });
    it('should return false when no user is given', () => {
      assert.isFalse(sessionHandler.logInUser());
    });
  });
  describe('logoutUser', () => {
    it('should delete sessionId of user if loggedIn', () => {
      assert.isTrue(sessionHandler.logoutUser('12345'));
    });
    it('should return false  when sessionId is inValid', () => {
      assert.isFalse(sessionHandler.logoutUser('123'));
    });
    it('should return false  when sessionId is not provided', () => {
      assert.isFalse(sessionHandler.logoutUser());
    });
  });
});