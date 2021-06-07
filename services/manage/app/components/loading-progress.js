import Component from '@ember/component';
import { computed } from '@ember/object';
import LoadingMixin from '@parameter1/email-x-manage/mixins/loading-mixin';

export default Component.extend(LoadingMixin, {
  classNames: ['loading', 'progress'],
  progressBackground: 'bg-primary',
  show: computed.readOnly('loadingDisplay.isShowing'),
});
