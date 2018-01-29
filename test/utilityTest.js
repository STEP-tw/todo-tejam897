const chai = require('chai');
const assert = chai.assert;
const timeStamp = require('../lib/time').timeStamp;
const logRequest = require('../lib/logger');

describe('timeStamp', () => {
  it('should return current date', () => {
    const expected = new Date().toDateString();
    assert.include(timeStamp(), expected);
  });
});

describe('logRequest', () => {
  it('should return current date', (done) => {
    const fs = {
      appendFile (filename, data) {
        assert.equal(filename,'request.log');
        assert.include(data, 'path');
        assert.include(data, 'get');
        assert.include(data, 'some Headers');
        assert.include(data, 'some cookies');
        assert.include(data, 'some text');
        done();
      }
    };
    const req = {
      url : 'path',
      method : 'get',
      headers  : 'some Headers',
      cookies  : 'some cookies',
      body  : 'some text'
    };
    logRequest(req,null,() => {},fs);
  });
});
