const { asyncRoute, getAdUnit } = require('../utils');
const deliver = require('../deliver');
const db = require('../db');

const getAdvertiser = id => db.findById('advertisers', id);

module.exports = (app) => {
  app.get('/data/:adunitid', asyncRoute(async (req, res) => {
    const { params, query } = req;
    const { adunitid } = params;
    const adunit = await getAdUnit(adunitid);

    const correlated = await deliver(adunit, query, 'data', req);
    if (!correlated) return res.status(204).send();

    const [deployment, ad] = await Promise.all([
      db.findById('deployments', adunit.deploymentId),
      db.findById('ads', correlated.adId),
    ]);

    // Only query the advertiser if requested.
    const advertiser = query.incAdv !== undefined
      ? await getAdvertiser(ad.advertiserId) : undefined;

    return res.json({
      deployment,
      ad,
      advertiser,
      correlated,
    });
  }));
};
