const sip = require('sip');

const REDIRECTS = {
  'nowhere': 'laptop'
};

function redirector(req, REGISTRY) {
  const callee = sip.parseUri(req.uri).user;
  const forwardTo = fromTo(callee);

  if (!forwardTo)
    return;
  
  const reg = REGISTRY[forwardTo];
  if (!reg || !Array.isArray(reg) || reg.length < 1)
    return;

  const res = sip.makeResponse(req, 302, 'Moved');
  res.headers.contact = reg;
  sip.send(res);
  return false;
}

function fromTo(to) {
  return REDIRECTS[to];
}

module.exports = {
  transform: redirector,
  fromTo
};