const click = require('./click');
const data = require('./data');
const event = require('./event');
const image = require('./image');

module.exports = (app) => {
  click(app);
  data(app);
  event(app);
  image(app);
};
