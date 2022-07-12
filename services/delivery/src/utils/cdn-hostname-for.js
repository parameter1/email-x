const db = require('../db');
const { CDN_HOST } = require('../env');

module.exports = async (publisherId) => {
  const { cdnHostname } = await db.strictFindById('publishers', publisherId, {
    projection: { cdnHostname: 1 },
  });
  return cdnHostname || CDN_HOST;
};
