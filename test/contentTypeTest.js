const chai = require('chai');
let assert = chai.assert;
let getContentType = require('../lib/contentType.js').getContentType;


describe('getContentType',()=>{
  it('it sohuld give the contentType of a given file',()=>{
    assert.deepEqual('text/html',getContentType('index.html'))
  })
})
