import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import ActionMixin from '@parameter1/email-x-manage/mixins/action-mixin';

import createDeployment from '@parameter1/email-x-manage/gql/mutations/deployment/create';

export default Controller.extend(ActionMixin, ObjectQueryManager, {
  actions: {
    /**
     *
     * @param {object} fields
     */
    async create() {
      this.startAction();
      const publisherId = this.get('publisher.id');
      const { name } = this.get('model');
      const input = { name, publisherId };
      const variables = { input };
      const refetchQueries = ['DeploymentListForPublisher', 'MatchDeploymentListForPublisher', 'PublisherEdit'];
      try {
        await this.get('apollo').mutate({ mutation: createDeployment, variables, refetchQueries }, 'createDeployment');
        await this.transitionToRoute('manage.publishers.edit.deployments');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
      }
    },

    setFieldValue({ name, value }) {
      this.set(`model.${name}`, value);
    },
  },
});
