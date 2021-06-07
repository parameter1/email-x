import Route from '@ember/routing/route';
import ListRouteMixin from '@parameter1/email-x-manage/mixins/list-route-mixin';

import query from '@parameter1/email-x-manage/gql/queries/advertiser/list';
import search from '@parameter1/email-x-manage/gql/queries/advertiser/match';

export default Route.extend(ListRouteMixin, {
  /**
   *
   * @param {object} params
   */
  model({ limit, field, order, phrase, searchType, searchBy }) {
    return this.getResults({
      query,
      queryKey: 'advertisers',
      search,
      searchKey: 'matchAdvertisers',
    }, { limit, field, order, phrase, searchType, searchBy });
  },
});
