const { asyncRoute, getAdUnit } = require('../utils');
const events = require('../deliver/events.js');
const { EXTERNAL_EVENT_API_KEY } = require('../env.js');

module.exports = (app) => {
  app.get('/event/:action(click|view)', asyncRoute(async (req, res) => {
    const apiKey = req.get('x-api-key');
    if (!EXTERNAL_EVENT_API_KEY) {
      const error = new Error('No event API key has been configured.');
      error.statusCode = 500;
      throw error;
    }
    if (!apiKey) {
      const error = new Error('No API key was provided.');
      error.statusCode = 400;
      throw error;
    }
    if (EXTERNAL_EVENT_API_KEY !== apiKey) {
      const error = new Error('The provided API key is invalid.');
      error.statusCode = 403;
      throw error;
    }

    const { action } = req.params;
    const { adId, adUnitId, date } = req.query;

    const [adUnit, ids] = await Promise.all([
      getAdUnit(adUnitId),
      events.getAdIds(adId),
    ]);

    const { _id: adunitId, deploymentId, publisherId } = adUnit;
    await events.aggregateEvent({
      action,
      ...ids,
      adunitId,
      deploymentId,
      publisherId,
      now: date,
      external: true,
    });

    return res.send('OK');
  }));
};
