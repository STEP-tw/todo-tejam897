const chai = require('chai');
const assert = chai.assert;
const StaticFileHandler = require('../lib/models/staticFileHandler.js');

const fs = {};
fs.readFileSync = function (file) {
  return file;
};

let staticFolder;
describe('staticFileHandler', () => {
  beforeEach(() => {
    staticFolder = new StaticFileHandler('./public', fs);
  });
  describe('getFilePath()', () => {
    it('adds staticFolder to a given file', () => {
      const staticFile = staticFolder.getFilePath('/index.html');
      assert.equal('./public/index.html', staticFile);
    });
  });
  describe('execute()', () => {
    it('will not serve the given file if the method is not get', () => {
      const req = { method: 'POST' };
      const res = {};
      const handler = staticFolder.getHandler();
      assert.isUndefined(handler(req, res));
    });
    it('will gives file if it exists', (done) => {
      const req = { method: 'GET', url: '/index.html' };
      const res = {
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
      const handler = staticFolder.getHandler();
      handler(req, res);
    });
  });
});
