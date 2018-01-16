const chai = require('chai');
let assert = chai.assert;
const staticFileHandler = require('../lib/staticFileHandler.js');

describe('staticFileHandler',()=>{
  describe('getStaticFile()',()=>{
    it('adds staticFolder to a given file',()=>{
      let staticFolder = new staticFileHandler('./public');
      let staticFile = staticFolder.getStaticFile('/index.html');
      assert.deepEqual('./public/index.html',staticFile)
    })
  })
})
