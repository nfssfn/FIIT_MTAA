const sip = require('sip');
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


module.exports = function (m, direction) {
  if (m.method === 'INVITE' && direction === 'in')
    startCallLogger(m);

  if (m.reason === 'Ringing' && direction === 'in')
    ringCallLogger(m);

  if (m.reason === 'Decline' && direction === 'in')
    declineCallLogger(m);

  if (m.reason === 'Ok' && direction === 'in')
    acceptedCallLogger(m);

  if (m.method === 'CANCEL' && direction === 'in')
    cancelCallLogger(m);

  if (m.status === 486 && direction === 'in')
    busyCallLogger(m);
}