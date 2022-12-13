const db = require('../db');
const dayjs = require('../dayjs');

const getAdIds = async (adId) => {
  const ad = await db.findById('ads', adId, { projection: { lineitemId: 1, advertiserId: 1 } });
  const lineitem = await db.findById('lineitems', ad.lineitemId, { projection: { orderId: 1 } });
  return {
    adId: ad._id,
    lineitemId: lineitem._id,
    orderId: lineitem.orderId,
    advertiserId: ad.advertiserId,
  };
};

const aggregateEvent = async ({
  action,

  adId,
  lineitemId,
  orderId,
  advertiserId,

  adunitId,
  deploymentId,
  publisherId,

  now,
}) => {
  const day = dayjs.tz(now, 'America/Chicago').format('YYYY-MM-DD');
  const _id = {
    ad: adId,
    adunit: adunitId,
    day,
  };

  return db.collection('events/aggregated').updateOne({ _id }, {
    $setOnInsert: { _id },
    $set: {
      lineitemId,
      orderId,
      advertiserId,
      deploymentId,
      publisherId,
    },
    $inc: { [`actions.${action}`]: 1 },
  }, { upsert: true });
};

module.exports = {
  async view(adunit, correlator, adId, {
    now,
    email,
    send,
    ip,
    ua,
  }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;
    const ids = await getAdIds(adId);

    return Promise.all([
      // aggregated
      aggregateEvent({
        action: 'view',
        ...ids,
        adunitId,
        deploymentId,
        publisherId,
        now,
      }),

      db.insertOne('events', {
        ...ids,
        type: 'view',
        adunitId,
        deploymentId,
        publisherId,
        date: now,
        email,
        send,
        correlator,
        ip,
        ua,
      }),
    ]);
  },

  async click(adunit, correlator, adId, {
    now,
    email,
    send,
    ip,
    ua,
  }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;

    const view = await db.findOne('events', { adId, type: 'view', correlator }, { projection: { _id: 1 } });
    if (!view) await this.view(adunit, correlator, adId, { now, email, send });

    const ids = await getAdIds(adId);
    // add ttl to the events collection of 24-48 hours?
    return Promise.all([
      // aggregated
      aggregateEvent({
        action: 'click',
        ...ids,
        adunitId,
        deploymentId,
        publisherId,
        now,
      }),

      db.insertOne('events', {
        ...ids,
        type: 'click',
        adunitId,
        deploymentId,
        publisherId,
        date: now,
        email,
        send,
        ip,
        ua,
      }),
    ]);
  },

  request(adunit, {
    now,
    email,
    send,
    ip,
    ua,
  }) {
    const { _id: adunitId, deploymentId, publisherId } = adunit;
    return Promise.all([
      // pre-aggregated
      (async () => {
        const month = dayjs.tz(now, 'America/Chicago').format('YYYY-MM');
        const _id = { adunit: adunitId, month };
        await db.collection('requests').updateOne({ _id }, {
          $setOnInsert: { _id },
          ...((deploymentId || publisherId) && {
            $set: { deploymentId, publisherId },
          }),
          $inc: { n: 1 },
        }, { upsert: true });
      })(),

      // single event
      db.insertOne('events', {
        type: 'request',
        adunitId,
        deploymentId,
        publisherId,
        date: now,
        email,
        send,
        ip,
        ua,
      }),
    ]);
  },
};
