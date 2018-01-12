let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
let th = require('./testHelper.js');
let app = require('../app.js');
const staticFileHandler = require('../staticFileHandler.js').staticFileHandler;
const setResourcePath = require('../staticFileHandler.js').setResourcePath;
const serveAsStaticFile = require('../staticFileHandler.js').serveAsStaticFile;
const isStaticFileRequest =require('../staticFileHandler.js').isStaticFileRequest;



describe('staticFileHandler',()=>{
  describe('isStaticFileRequest',()=>{
    it('checks the given method is get and file exists or not',()=>{
      assert.isTrue(isStaticFileRequest('server.js','GET'))
    })
  })
  describe('setResourcePath ',()=>{
    it('sets source path to ./public/html/index.html if source is /',()=>{
      let source = setResourcePath('/');
      assert.deepEqual(source,'./public/html/index.html')
    })
    it('adds ./public for any given source',()=>{
      let source = setResourcePath('/index.html');
      assert.deepEqual(source,'./public/index.html')
    })
  })
  describe('serveAsStaticFile',()=>{
    let res = {headers:'',finished:false};
    res.setHeader = function(key,val){
      res[key] = val;
    }
    res.write = function(content){
      res.body = content;
    }
    res.end = function(){
      res.finished = true;
    }
    let fs = {};
    fs.readFileSync=(file)=>{return file}
    it('it sets contentType to response headers',()=>{
      serveAsStaticFile('./public/html/index.html',res);
      assert.deepEqual(res['Content-Type'],'text/html')
    })
  })
})

describe('response',()=>{
  let res = {headers:'',finished:false};
  res.setHeader = function(key,val){
    res[key] = val;
  }
  res.write = function(content){
    res.body = content;
  }
  res.end = function(){
    res.finished = true;
  }
  describe('setHeader',()=>{
    it('sets the given key value as response headers',()=>{
      res.setHeader('contentType','html');
      console.log(res);
      assert.deepEqual(res.contentType,'html')
    })
  })
  describe('res.write',()=>{
    it('writes given file content to response body',()=>{
      res.write('hii')
      console.log(res.body);
      assert.include(res.body,'hii')
    })
  })
  describe('res.end',()=>{
    it('sets the value of finished key of response to true',()=>{
      assert.isFalse(res.finished)
      res.end();
      assert.isTrue(res.finished);
    })
  })
})


describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('POST /registerForm redirect to login page',()=>{
    it('redirects to login page',done=>{
      request(app,{method:'POST',url:'/registerForm'},(res)=>{
        th.should_be_redirected_to(res,'html/login.html');
        done();
      })
    })
  })
  describe.skip('get /home ',()=>{
    it('shows user home page ',done=>{
      request(app,{method:'GET',url:'/home'},(res)=>{
        th.body_contains('addNew');
      })
    })
  })
});
