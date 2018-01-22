let chai = require('chai');
let assert = chai.assert;
const timeStamp = require('../lib/time').timeStamp;
const logRequest = require('../lib/logger');
const DefaultHandler = require('../lib/models/defaultHandler');

describe('timeStamp', () => {
  it('should return current date', () => {
    let expected = new Date().toDateString();
    assert.include(timeStamp(), expected);
  });
});

describe('defaultHandler', () => {
  it('should return undefined', () => {
    let defaultHandler = new DefaultHandler();
    assert.isUndefined(defaultHandler.execute());
  });
});

describe('logRequest', () => {
  it('should return current date', (done) => {
    let fs = {
      appendFile: function (filename, data) {
        assert.equal(filename,'request.log');
        assert.include(data, 'path');
        assert.include(data, 'get');
        assert.include(data, 'some Headers');
        assert.include(data, 'some cookies');
        assert.include(data, 'some text');
        done();
      }
    }
    let req = {
      url : 'path',
      method : 'get',
      headers  : 'some Headers',
      cookies  : 'some cookies',
      body  : 'some text'
    }
    logRequest(req,null,fs);
  });
});
