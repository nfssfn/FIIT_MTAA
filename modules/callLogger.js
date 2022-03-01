const sip = require('sip');
const REDIRECTOR = require('./redirector');
const loggerFactory = require('../logger');

const callHistory = loggerFactory('calls');

const activeCalls = new Map();

function startCallLogger(m) {
  const userFrom = sip.parseUri(m.headers.from.uri).user;
  const userTo = sip.parseUri(m.uri).user;
  activeCalls.set(m.headers['call-id'], [m.headers.from.uri, m.headers.to.uri, Date.now()]);
  callHistory.CALL_INVITE(`Call invitation sent from ${userFrom} to ${userTo}`);
};

function ringCallLogger(m) {
  const userTo = sip.parseUri(m.headers.to.uri).user;
  callHistory.CALL_RING(`User ${userTo} got the ring`);
};

function declineCallLogger(m) {
  const userFrom = sip.parseUri(m.headers.to.uri).user;
  callHistory.CALL_DECLINED(`User ${userFrom} declined the call`);
};

function cancelCallLogger(m) {
  const userFrom = sip.parseUri(m.headers.from.uri).user;
  const userTo = sip.parseUri(m.headers.to.uri).user;
  callHistory.CALL_CANCELED(`Invitation for the call between ${userFrom} and ${userTo} has been revoked`);
};

function acceptedCallLogger(m) {
  if (!activeCalls.has(m.headers['call-id']))
    return;

  const userFrom = sip.parseUri(m.headers.from.uri).user;
  const userTo = sip.parseUri(m.headers.to.uri).user;
  callHistory.CALL_ACCEPTED(`Call between ${userFrom} and ${userTo} has been accepted`);
  activeCalls.delete(m.headers['call-id']);
}

function busyCallLogger(m) {
  if (!activeCalls.has(m.headers['call-id']))
    return;

  const userFrom = sip.parseUri(m.headers.from.uri).user;
  const userTo = sip.parseUri(m.headers.to.uri).user;
  callHistory.CALL_BUSY(`Is seems ${userTo} is too BUSY to accept call from ${userFrom}`);
  activeCalls.delete(m.headers['call-id']);
}

function redirectCallLogger(m) {
  const userFrom = sip.parseUri(m.headers.from.uri).user;
  const userTo = sip.parseUri(m.headers.to.uri).user;
  callHistory.CALL_REDIRECT(`Call from ${userFrom} directed to the ${userTo} was redirected by routing table to ${REDIRECTOR.fromTo(userTo)}`);
}


module.exports = function (m, direction = 'in') {
  if (direction === 'in') {
    if (m.method === 'INVITE')
      startCallLogger(m);

    if (m.reason === 'Ringing')
      ringCallLogger(m);

    if (m.reason === 'Decline')
      declineCallLogger(m);

    if (m.reason === 'Ok')
      acceptedCallLogger(m);

    if (m.method === 'CANCEL')
      cancelCallLogger(m);

    if (m.status === 486)
      busyCallLogger(m);
  } else if (direction === 'redirect') {
    redirectCallLogger(m);
  }
}