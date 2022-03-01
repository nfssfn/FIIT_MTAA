const fs = require('fs');
const path = require('path');
const df = require('./df');

const LOGGERS = new Map();

module.exports = (fileName = Date.now().toString(), logToConsole = process.env.LTC === '1' || process.env.LTC?.includes(fileName)) => {
  const logPath = path.join(__dirname, './logs', fileName + '.log');
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });

  const logFactory = (_note) => {
    if (LOGGERS.has(_note))
      return LOGGERS.get(_note);

    const note = _note ? `[${_note}]` : '';
    const logger = (message) => {
      const messageFormatted = `${note}[${df.format(new Date())}] ${typeof message === 'string' ? message : JSON.stringify(message)}\n`;
      if (logToConsole)
        console.log(messageFormatted)
      logStream.write(messageFormatted);
    };
    LOGGERS.set(_note, logger);
    return logger;
  };

  return new Proxy({}, { get() { return logFactory(arguments[1].toString().toUpperCase()) } });
}