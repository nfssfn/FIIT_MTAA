const os = require('os');
const proxy = require('sip/proxy');
const loggerFactory = require('./logger');

const dbg = loggerFactory('debug.log', false);

const REGISTRY = require('./modules/registerUser');
const callLogger = require('./modules/callLogger');

proxy.start({
  logger: {
    recv(m) {
      dbg.incoming(m);
      callLogger(m, 'in');
    },
    send(m) {
      dbg.outcoming(m);
      callLogger(m, 'out');
    },
    error: dbg.error
  }
}, function(req) {
  try {

    // Registering user
    if (req.method === 'REGISTER' && REGISTRY.registrator(req, proxy) === false)
      return;
    
    // Checking if user is registered
    if (REGISTRY.checkRegister(req, proxy) === false)
      return;

    // Applying custom status text
    proxy.send(req, (res) => {
      if (res.status === 486)
        res.reason = 'Obsadené';
      res.headers.via.shift();
      proxy.send(res);
    });

  } catch (ex) {
    console.error(ex);
    throw ex;
  }
});

console.log(`${os.hostname()} > SIP Proxy is running on ${Object.values(os.networkInterfaces()).flat().find(i => i.family == 'IPv4' && !i.internal).address}`);