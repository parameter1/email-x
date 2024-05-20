const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  ad(input: AdQueryInput!): Ad @requiresAuth @retrieve(modelName: "ad")
  ads(input: AdsQueryInput = {}): AdConnection! @requiresAuth @retrieveMany(modelName: "ad")
  matchAds(input: MatchAdsQueryInput!): AdConnection! @requiresAuth @matchMany(modelName: "ad")

  adsForLineItem(input: AdsForLineItemQueryInput!): AdConnection! @requiresAuth @retrieveMany(modelName: "ad", using: { lineitemId: "lineitemId" })
  matchAdsForLineItem(input: MatchAdsForLineItemQueryInput!): AdConnection! @requiresAuth @matchMany(modelName: "ad", using: { lineitemId: "lineitemId" })
}

extend type Mutation {
  createAd(input: CreateAdMutationInput!): Ad! @requiresAuth @readOnly
  updateAd(input: UpdateAdMutationInput!): Ad! @requiresAuth @update(modelName: "ad") @readOnly
  deleteAd(input: DeleteAdMutationInput!): Ad! @requiresAuth @delete(modelName: "ad") @readOnly
  cloneAd(input: CloneAdMutationInput!): Ad! @requiresAuth @clone(modelName: "ad") @readOnly

  adName(input: AdNameMutationInput!): Ad! @requiresAuth @setAndUpdate(modelName: "ad", path: "name") @readOnly
  adWidth(input: AdWidthMutationInput!): Ad! @requiresAuth @setAndUpdate(modelName: "ad", path: "width") @readOnly
  adHeight(input: AdHeightMutationInput!): Ad! @requiresAuth @setAndUpdate(modelName: "ad", path: "height") @readOnly
  adUrl(input: AdUrlMutationInput!): Ad! @requiresAuth @setAndUpdate(modelName: "ad", path: "url") @readOnly
  adPaused(input: AdPausedMutationInput!): Ad! @requiresAuth @setAndUpdate(modelName: "ad", path: "paused") @readOnly
  adImage(input: AdImageMutationInput!): Ad! @requiresAuth @readOnly
}

enum AdStatus {
  Deleted
  Incomplete
  Paused
  Active
}

type Ad implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  fullName: String!
  paused: Boolean!
  status: AdStatus!
  requires: String
  width: Int!
  height: Int!
  size: String!
  url: String!
  lineitem: LineItem! @refOne(modelName: "lineitem", localField: "lineitemId", foreignField: "_id")
  image: Image
}

type AdConnection {
  totalCount: Int!
  edges: [AdEdge]!
  pageInfo: PageInfo!
}

type AdEdge {
  node: Ad!
  cursor: String!
}

enum AdSortField {
  id
  name
  size
  advertiserName
  createdAt
  updatedAt
}

input CreateAdMutationInput {
  name: String!
  width: Int!
  height: Int!
  url: String!
  image: AdImagePayloadInput!
  lineitemId: ObjectID!
}

input UpdateAdMutationInput {
  id: ObjectID!
  payload: UpdateAdPayloadInput!
}

input CloneAdMutationInput {
  id: ObjectID!
}

input DeleteAdMutationInput {
  id: ObjectID!
}

input UpdateAdPayloadInput {
  name: String!
  width: Int!
  height: Int!
  url: String!
  paused: Boolean = false
}

input AdQueryInput {
  id: ObjectID!
}

input AdsQueryInput {
  sort: AdSortInput = {}
  pagination: PaginationInput = {}
}

input AdSortInput {
  field: AdSortField = id
  order: SortOrder = desc
}

input MatchAdsQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  excludeIds: [ObjectID!] = []
  position: MatchPosition = contains
}

input AdNameMutationInput {
  id: ObjectID!
  value: String!
}

input AdWidthMutationInput {
  id: ObjectID!
  value: Int!
}

input AdHeightMutationInput {
  id: ObjectID!
  value: Int!
}

input AdUrlMutationInput {
  id: ObjectID!
  value: String!
}

input AdPausedMutationInput {
  id: ObjectID!
  value: Boolean!
}

input AdImageMutationInput {
  id: ObjectID!
  file: Upload!
  bytes: String!
  width: Int!
  height: Int!
}

input AdImagePayloadInput {
  file: Upload!
  bytes: String!
  width: Int!
  height: Int!
}

input AdsForLineItemQueryInput {
  lineitemId: ObjectID!
  sort: AdSortInput = {}
  pagination: PaginationInput = {}
}

input MatchAdsForLineItemQueryInput {
  lineitemId: ObjectID!
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

`;
