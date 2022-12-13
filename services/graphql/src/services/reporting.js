const dayjs = require('../dayjs');
const connection = require('../mongoose/connections/account');

const { isArray } = Array;

// update this to use new aggregated collection
const aggregate = async (collection, $match) => {
  const pipeline = [
    { $match },
    {
      $group: {
        _id: {
          advertiserId: '$advertiserId',
          orderId: '$orderId',
          lineitemId: '$lineitemId',
          adId: '$_id.ad',
          publisherId: '$publisherId',
          deploymentId: '$deploymentId',
          adunitId: '$_id.adunit',
        },
        clicks: { $sum: { $ifNull: ['$actions.click', 0] } },
        views: { $sum: { $ifNull: ['$actions.view', 0] } },
      },
    },
    {
      $project: {
        advertiserId: '$_id.advertiserId',
        orderId: '$_id.orderId',
        lineitemId: '$_id.lineitemId',
        adId: '$_id.adId',
        publisherId: '$_id.publisherId',
        deploymentId: '$_id.deploymentId',
        adunitId: '$_id.adunitId',
        clicks: '$clicks',
        impressions: '$views',
        ctr: { $cond: [{ $eq: ['$views', 0] }, 0.00, { $divide: ['$clicks', '$views'] }] },
        _id: false,
      },
    },
  ];
  const rows = await collection.aggregate(pipeline).toArray();
  return { rows: rows || [] };
};

module.exports = (input) => {
  const startDay = dayjs.tz(input.start, 'America/Chicago').format('YYYY-MM-DD');
  const endDay = dayjs.tz(input.end, 'America/Chicago').format('YYYY-MM-DD');

  const { db } = connection;
  const collection = db.collection('events/aggregated');

  const map = [
    { key: '_id.ad', field: 'adIds' },
    { key: '_id.adunit', field: 'adunitIds' },
    { key: 'advertiserId', field: 'advertiserIds' },
    { key: 'deploymentId', field: 'deploymentIds' },
    { key: 'lineitemId', field: 'lineitemIds' },
    { key: 'orderId', field: 'orderIds' },
    { key: 'publisherId', field: 'publisherIds' },
  ];
  const $match = map.reduce((o, { key, field }) => {
    const value = input[field];
    if (!isArray(value) || !value.length) return o;
    return { ...o, [key]: { $in: value } };
  }, {
    '_id.day': { $gte: startDay, $lte: endDay },
  });
  return aggregate(collection, $match);
};
