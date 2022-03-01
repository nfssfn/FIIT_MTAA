const sip = require('sip');
const loggerFactory = require('../logger');

const REGISTRY = {};
const actLog = loggerFactory('activity');

function registrator(req, proxy) {
  // Parsing user
  const user = sip.parseUri(req.headers.from.uri).user;
  actLog.register(`Attempting to register ${req.headers.from.uri} as ${user}`);

  // Checking registration
  if (REGISTRY[user]) {
    actLog.registered(`User is already registered (${user}), so replacing old registration`);
    // proxy.send(sip.makeResponse(req, 409, 'User already registered'));
    // return false;
  }

  // Register user
  REGISTRY[user] = req.headers.contact;
  proxy.send(sip.makeResponse(req, 200, 'OK'));
  actLog.registered(`User successfully registered (${user})`);
  return false;
};

function checkRegister(req, proxy) {
  if (req.method === 'REGISTER')
    return;

  const user = sip.parseUri(req.uri).user;
  if (Array.isArray(REGISTRY[user]) && REGISTRY[user].length > 0) {
    req.uri = REGISTRY[user][0].uri;      
    proxy.send(sip.makeResponse(req, 100, 'Trying'));
  } else {
    proxy.send(sip.makeResponse(req, 404, 'User is not registered yet'));
    return false;
  }
};

module.exports = {
  registrator,
  checkRegister,
  hashmap: REGISTRY
}