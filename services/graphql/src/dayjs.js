const dayjs = require('dayjs');
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');

module.exports = dayjs
  .extend(utc)
  .extend(timezone);
