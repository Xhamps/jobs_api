const getTimezoneOffset = () => (new Date()).getTimezoneOffset() / 60;

const parseDate = function (date) {
  const parsedDate = /^(\d{4})-(\d{1,2})(-(\d{1,2}))?$/.exec(date);
  if(!parsedDate) throw new Error('The date format is invalid.');
  return {
    year: parsedDate[1],
    month: parsedDate[2],
    day: parsedDate[4],
  };
}

const parseStartDate = function (date) {
  let { year, month, day} = parseDate(date);
  const hours = -getTimezoneOffset();
  const minutes = 0;
  const seconds = 0;
  if(!day) day = 1;
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

const parseEndDate = function (date) {
  let { year, month, day} = parseDate(date);
  const hours = 23 - getTimezoneOffset();
  const minutes = 59;
  const seconds = 59;
  if(!day) {
    day = 0
    month++
  };
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

module.exports = { parseStartDate, parseEndDate }
