const chai = require('chai');
const assert = chai.assert;
const SessionManager = require('../lib/models/sessionManager');

let sessionManager;

describe('SessionManager', () => {
  beforeEach(() => {
    const users = {
      "teja": { "username": "tejam" },
      "nrjais": { "username": "nrjais", "sessionId": "12345" }
    };
    sessionManager = new SessionManager(users);
  });

  describe('isValidUser', () => {
    it('should return true for valid user', () => {
      assert.isTrue(sessionManager.isValidUser('teja'));
    });
    it('should return false for inValid user', () => {
      assert.isFalse(sessionManager.isValidUser('te'));
    });
    it('should return false when no user is provided', () => {
      assert.isFalse(sessionManager.isValidUser());
      assert.isFalse(sessionManager.isValidUser(''));
    });
  });
  describe('getUserByUserName', () => {
    it('should return a user when user is present', () => {
      const expected = { username: 'tejam' };
      assert.deepEqual(sessionManager.getUserByUserName('teja'), expected);
    });
    it('should return undefined when user is not present', () => {
      assert.isUndefined(sessionManager.getUserByUserName('t'));
    });
  });
  describe('getUserBySessionId', () => {
    it('should return a user when user is present with given valid sessionId', () => {
      const expected = { username: 'nrjais', sessionId: '12345' };
      assert.deepEqual(sessionManager.getUserBySessionId('12345'), expected);
    });
    it('should return false when sessionID is invalid', () => {
      assert.isUndefined(sessionManager.getUserBySessionId('t'));
      assert.isUndefined(sessionManager.getUserBySessionId(''));
      assert.isUndefined(sessionManager.getUserBySessionId());
    });
  });


  describe('loginUser', () => {
    it('should return a sessionId when the user is present', () => {
      assert.isString(sessionManager.logInUser('teja'));
    });
    it('should return false when the user is not present', () => {
      assert.isFalse(sessionManager.logInUser('te'));
    });
    it('should return false when no user is given', () => {
      assert.isFalse(sessionManager.logInUser());
    });
  });
  describe('logoutUser', () => {
    it('should delete sessionId of user if loggedIn', () => {
      assert.isTrue(sessionManager.logoutUser('12345'));
    });
    it('should return false  when sessionId is inValid', () => {
      assert.isFalse(sessionManager.logoutUser('123'));
    });
    it('should return false  when sessionId is not provided', () => {
      assert.isFalse(sessionManager.logoutUser());
    });
  });
});
