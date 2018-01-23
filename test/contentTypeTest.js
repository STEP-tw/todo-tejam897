const chai = require('chai');
const assert = chai.assert;
const getContentType = require('../lib/contentType.js').getContentType;


describe('getContentType',() => {
  it('should return the contentType of a known file type',() => {
    assert.equal('text/html',getContentType('index.html'));
  });
  it('should return text/plain for unknown file types',() => {
    assert.equal('text/plain',getContentType('index.ht'));
  });
});
