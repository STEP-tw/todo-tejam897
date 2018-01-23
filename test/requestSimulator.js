const EventEmitter = require('events');
const request = function(app,options,onComplete){
  const res_headers = {};
  let res_contents = "";
  const req = new EventEmitter();
  req.method = options.method;
  req.url = options.url;
  req.headers = options.headers||{};
  const res={
    end:(data) => {
      res.finished = true;
      const result = {
        statusCode:res.statusCode||200,
        headers:res_headers,
        body:res_contents + (data || '')
      };
      onComplete(result);
    },
    setHeader:(key,value) => res_headers[key] = value,
    write:(text) => res_contents+=text
  };
  app(req,res);
  options.body && req.emit('data',options.body);
  req.emit('end');
};
module.exports = request;
