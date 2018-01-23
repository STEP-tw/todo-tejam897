const qs = require('querystring');

const toKeyValue = (kv) => {
  const parts = kv.split('=');
  return { key: parts[0].trim(), value: parts[1].trim() };
};

const accumulate = (o, kv) => {
  o[kv.key] = kv.value;
  return o;
};

const redirect = function (path) {
  this.statusCode = 302;
  this.setHeader('location', path);
  this.end();
};

const parseCookies = (text) => {
  return text && text.split(';').map(toKeyValue).reduce(accumulate, {}) || {};
};

const invoke = function (req, res) {
  const handler = this._handlers[req.method][req.url];
  handler && handler(req, res);
};

const initialize = function () {
  this._handlers = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
  this._preprocess = [];
  this._postprocess = [];
};

const get = function (url, handler) {
  this._handlers.GET[url] = handler;
};

const post = function (url, handler) {
  this._handlers.POST[url] = handler;
};

const put = function (url, handler) {
  this._handlers.PUT[url] = handler;
};

const onDelete = function (url, handler) {
  this._handlers.DELETE[url] = handler;
};

const use = function (handler) {
  this._preprocess.push(handler);
};

const postUse = function (handler) {
  this._postprocess.push(handler);
};

const urlIsOneOf = function (urls) {
  return urls.includes(this.url);
};

const main = function (req, res) {
  res.redirect = redirect.bind(res);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  req.cookies = parseCookies(req.headers.cookie || '');
  let content = "";
  req.on('data', (data) => content += data.toString());
  req.on('end', () => {
    req.body = qs.parse(content);
    content = "";
    runMiddlewares(this._preprocess, req, res);
    if (res.finished) {return;}
    invoke.call(this, req, res);
    runMiddlewares(this._postprocess, req, res);
    if (!res.finished) {sendResourceNotFound(res, req.url);}
  });
};

const runMiddlewares = function (middlewares, req, res) {
  if (res.finished) {return;}
  middlewares.forEach((middleware) => {
    if (res.finished) {return;}
    middleware(req, res);
  });
};

const sendResourceNotFound = function (res, url) {
  res.statusCode = 404;
  res.write(`${url} File not found!`);
  res.end();
};

const create = () => {
  const rh = (req, res) => {
    main.call(rh, req, res);
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  rh.put = put;
  rh.delete = onDelete;
  rh.postUse = postUse;
  return rh;
};

exports.create = create;
