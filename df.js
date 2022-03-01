module.exports = (new Intl.DateTimeFormat('SK-sk', {
  minute: '2-digit',
  second: '2-digit',
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour12: false,
  hour: '2-digit',
}));