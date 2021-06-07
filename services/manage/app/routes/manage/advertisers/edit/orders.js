import Route from '@ember/routing/route';
import ListRouteMixin from '@parameter1/email-x-manage/mixins/list-route-mixin';

import query from '@parameter1/email-x-manage/gql/queries/order/list-for-advertiser';
import search from '@parameter1/email-x-manage/gql/queries/order/match-for-advertiser';

export default Route.extend(ListRouteMixin, {
  /**
   *
   * @param {object} params
   */
  model({ limit, field, order, phrase, searchType, searchBy }) {
    const input = {
      advertiserId: this.modelFor('manage.advertisers.edit').id,
    };
    return this.getResults({
      query,
      queryKey: 'ordersForAdvertiser',
      queryInput: input,
      search,
      searchKey: 'matchOrdersForAdvertiser',
      searchInput: input,
    }, { limit, field, order, phrase, searchType, searchBy });
  },
});
