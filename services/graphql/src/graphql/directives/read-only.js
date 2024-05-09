const { SchemaDirectiveVisitor } = require('graphql-tools');
const { ApolloError } = require('apollo-server-express');

class ReadOnlyDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  // eslint-disable-next-line class-methods-use-this
  visitFieldDefinition(field) {
    const { resolve } = field;

    // eslint-disable-next-line no-param-reassign
    field.resolve = (...args) => {
      const [, , { locked }] = args;
      if (locked) throw new ApolloError('This EmailX instance is inactive. Changes cannot be saved.');
      if (typeof resolve === 'function') {
        return resolve(...args);
      }
      return null;
    };
  }
}

module.exports = ReadOnlyDirective;
