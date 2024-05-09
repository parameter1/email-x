const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const { createLoaders } = require('../dataloaders');
const { READ_ONLY, isProduction } = require('../env');

module.exports = ({ app, endpoint }) => {
  const loaders = createLoaders();

  const server = new ApolloServer({
    schema,
    playground: !isProduction ? { endpoint } : false,
    introspection: true,
    context: ({ req }) => {
      const { auth } = req;
      return {
        auth,
        load: async (loader, id) => {
          if (!loaders[loader]) throw new Error(`No dataloader found for '${loader}'`);
          return loaders[loader].load(id);
        },
        locked: READ_ONLY === '1',
      };
    },
  });
  server.applyMiddleware({ app, path: endpoint });
  return server;
};
