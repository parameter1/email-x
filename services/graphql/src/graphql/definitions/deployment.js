const gql = require('graphql-tag');

module.exports = gql`

extend type Query {
  deployment(input: DeploymentQueryInput!): Deployment @requiresAuth @retrieve(modelName: "deployment")
  deployments(input: DeploymentsQueryInput = {}): DeploymentConnection! @requiresAuth @retrieveMany(modelName: "deployment")
  matchDeployments(input: MatchDeploymentsQueryInput!): DeploymentConnection! @requiresAuth @matchMany(modelName: "deployment")

  deploymentsForPublisher(input: DeploymentsForPublisherQueryInput!): DeploymentConnection! @requiresAuth @retrieveMany(modelName: "deployment", using: { publisherId: "publisherId" })
  matchDeploymentsForPublisher(input: MatchDeploymentsForPublisherQueryInput!): DeploymentConnection! @requiresAuth @matchMany(modelName: "deployment", using: { publisherId: "publisherId" })
}

extend type Mutation {
  createDeployment(input: CreateDeploymentMutationInput!): Deployment! @requiresAuth @create(modelName: "deployment") @readOnly
  updateDeployment(input: UpdateDeploymentMutationInput!): Deployment! @requiresAuth @update(modelName: "deployment") @readOnly
  deleteDeployment(input: DeleteDeploymentMutationInput!): Deployment! @requiresAuth @delete(modelName: "deployment") @readOnly

  deploymentName(input: DeploymentNameMutationInput!): Deployment! @requiresAuth @setAndUpdate(modelName: "deployment", path: "name") @readOnly
  deploymentPublisher(input: DeploymentPublisherMutationInput!): Deployment! @requiresAuth @setAndUpdate(modelName: "deployment", path: "publisherId") @readOnly
}

type Deployment implements Timestampable & UserAttributable @applyInterfaceFields {
  id: ObjectID!
  name: String!
  fullName: String!
  publisher: Publisher! @refOne(modelName: "publisher", localField: "publisherId", foreignField: "_id")
  adunits(input: DeploymentAdUnitsInput = {}): AdUnitConnection! @refMany(modelName: "adunit", localField: "_id", foreignField: "deploymentId")
}

type DeploymentConnection {
  totalCount: Int!
  edges: [DeploymentEdge]!
  pageInfo: PageInfo!
}

type DeploymentEdge {
  node: Deployment!
  cursor: String!
}

enum DeploymentSortField {
  id
  name
  publisherName
  createdAt
  updatedAt
}

input CreateDeploymentMutationInput {
  name: String!
  publisherId: ObjectID!
}

input UpdateDeploymentMutationInput {
  id: ObjectID!
  payload: UpdateDeploymentPayloadInput!
}

input DeleteDeploymentMutationInput {
  id: ObjectID!
}

input UpdateDeploymentPayloadInput {
  name: String!
  publisherId: ObjectID!
}

input DeploymentQueryInput {
  id: ObjectID!
}

input DeploymentsQueryInput {
  sort: DeploymentSortInput = {}
  pagination: PaginationInput = {}
}

input DeploymentSortInput {
  field: DeploymentSortField = id
  order: SortOrder = desc
}

input DeploymentNameMutationInput {
  id: ObjectID!
  value: String!
}

input DeploymentPublisherMutationInput {
  id: ObjectID!
  value: ObjectID!
}

input MatchDeploymentsQueryInput {
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  excludeIds: [ObjectID!] = []
  position: MatchPosition = contains
}

input DeploymentsForPublisherQueryInput {
  publisherId: ObjectID!
  sort: DeploymentSortInput = {}
  pagination: PaginationInput = {}
}

input MatchDeploymentsForPublisherQueryInput {
  publisherId: ObjectID!
  pagination: PaginationInput = {}
  field: String!
  phrase: String!
  position: MatchPosition = contains
}

input DeploymentAdUnitsInput {
  sort: AdUnitSortInput = {}
  pagination: PaginationInput = {}
}

`;
