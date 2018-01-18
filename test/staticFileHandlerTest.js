const chai = require('chai');
let assert = chai.assert;
const staticFileHandler = require('../lib/staticFileHandler.js');
let fs = {};
fs.existsSync = function(file){
  return file == './public/index.html'
}

describe('staticFileHandler',()=>{
  describe('getStaticFile()',()=>{
    it('adds staticFolder to a given file',()=>{
      let staticFolder = new staticFileHandler('./public');
      let staticFile = staticFolder.getStaticFile('/index.html');
      assert.deepEqual('./public/index.html',staticFile)
    })
  })
  describe('execute()',()=>{
    it('will not serve the given file if the method is not the get',()=>{
      let staticFolder = new staticFileHandler('./public');
      let req = {method:'POST'};
      let res = {};
      let handler = staticFolder.getHandler()
      assert.isUndefined(handler(req,res));
    })
    it('will serve the files which are exist',()=>{
      let staticFolder = new staticFileHandler('./public');
      let req = {method:'GET',url:'/index.html'};
      let res = {}
      res.sendFile = function(file){
        return file
      }
      let handler = staticFolder.getHandler();
      assert.deepEqual(handler(req,res),'./public/index.html');
    })
  })
})
