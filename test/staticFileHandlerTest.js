const chai = require('chai');
let assert = chai.assert;
const StaticFileHandler = require('../lib/models/staticFileHandler.js');

let fs = {};
fs.readFileSync = function (file) {
  return file;
}

let staticFolder;
describe('staticFileHandler', () => {
  beforeEach(() => {
    staticFolder = new StaticFileHandler('./public', fs);
  });
  describe('getFilePath()', () => {
    it('adds staticFolder to a given file', () => {
      let staticFile = staticFolder.getFilePath('/index.html');
      assert.equal('./public/index.html', staticFile);
    })
  })
  describe('execute()', () => {
    it('will not serve the given file if the method is not the get', () => {
      let req = { method: 'POST' };
      let res = {};
      let handler = staticFolder.getHandler()
      assert.isUndefined(handler(req, res));
    })
    it('will gives file if it exists', (done) => {
      let req = { method: 'GET', url: '/index.html' };
      let res = {
        write: (data) => {
          assert.equal(data, './public/index.html');
        },
        setHeader: (key, value) => {
          assert.equal(key, 'Content-Type');
          assert.equal(value, 'text/html');
        },
        end: () => {
          done();
        }
      };
      let handler = staticFolder.getHandler();
      handler(req, res);
    })
  })
})
