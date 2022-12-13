const { Schema } = require('mongoose');

const schema = new Schema({
  createdAt: Date,
  value: String,
  adId: Schema.Types.ObjectId,
  lineitemId: Schema.Types.ObjectId,
});

schema.index({ value: 1 }, { unique: true });
schema.index({ adId: 1 });
schema.index({ lineitemId: 1 });
schema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

module.exports = schema;
