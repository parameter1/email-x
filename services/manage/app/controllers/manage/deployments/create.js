import Controller from '@ember/controller';
import { ObjectQueryManager } from 'ember-apollo-client';
import { get } from '@ember/object';
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
      const { name, publisher } = this.get('model');
      const input = { name, publisherId: get(publisher, 'id') };
      const variables = { input };
      try {
        const response = await this.get('apollo').mutate({ mutation: createDeployment, variables }, 'createDeployment');
        await this.transitionToRoute('manage.deployments.edit', response.id);
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
