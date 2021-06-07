import Route from '@ember/routing/route';
import ListRouteMixin from '@parameter1/email-x-manage/mixins/list-route-mixin';

import query from '@parameter1/email-x-manage/gql/queries/adunit/list-for-deployment';
import search from '@parameter1/email-x-manage/gql/queries/adunit/match-for-deployment';

export default Route.extend(ListRouteMixin, {
  /**
   *
   * @param {object} params
   */
  model({ limit, field, order, phrase, searchType, searchBy }) {
    const input = {
      deploymentId: this.modelFor('manage.deployments.edit').id,
    };
    return this.getResults({
      query,
      queryKey: 'adunitsForDeployment',
      queryInput: input,
      search,
      searchKey: 'matchAdUnitsForDeployment',
      searchInput: input,
    }, { limit, field, order, phrase, searchType, searchBy });
  },
});
