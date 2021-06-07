import Controller from '@ember/controller';
import ActionMixin from '@parameter1/email-x-manage/mixins/action-mixin';
import { ObjectQueryManager } from 'ember-apollo-client';

import advertiserName from '@parameter1/email-x-manage/gql/mutations/advertiser/name';
import advertiserWebsite from '@parameter1/email-x-manage/gql/mutations/advertiser/website';
import advertiserExternalId from '@parameter1/email-x-manage/gql/mutations/advertiser/external-id';
import deleteAdvertiser from '@parameter1/email-x-manage/gql/mutations/advertiser/delete';

export default Controller.extend(ObjectQueryManager, ActionMixin, {
  actions: {
    /**
     *
     * @param {string} params.value
     */
    async setName({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: advertiserName, variables }, 'advertiserName');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     * @param {string} params.value
     */
    async setWebsite({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: advertiserWebsite, variables }, 'advertiserWebsite');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     * @param {string} params.value
     */
    async setExternalId({ value }) {
      this.startAction();
      const input = { id: this.get('model.id'), value };
      const variables = { input };
      try {
        await this.get('apollo').mutate({ mutation: advertiserExternalId, variables }, 'advertiserExternalId');
      } catch (e) {
        throw this.get('graphErrors').handle(e);
      } finally {
        this.endAction();
      }
    },

    /**
     *
     */
    async delete() {
      this.startAction();
      this.set('isDeleting', true);
      const id = this.get('model.id');
      const variables = { input: { id } };
      const mutation = deleteAdvertiser;
      try {
        await this.get('apollo').mutate({ mutation, variables }, 'deleteCampaign');
        await this.transitionToRoute('manage.advertisers.index');
      } catch (e) {
        this.get('graphErrors').show(e);
      } finally {
        this.endAction();
        this.set('isDeleting', false);
      }
    },
  },
});
