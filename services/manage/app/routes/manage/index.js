import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';

import query from '@parameter1/email-x-manage/gql/ping';

export default Route.extend(RouteQueryManager, {
  model() {
    return this.get('apollo').watchQuery({ query });
  },
});
