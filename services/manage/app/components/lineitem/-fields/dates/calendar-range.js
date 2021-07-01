import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  center: null,
  range: null,

  init() {
    this._super(...arguments);
    const start = this.get('range.start');
    this.set('center', start || moment());
  },
  didReceiveAttrs() {
    this._super(...arguments);
    const centerVal = this.get('center');
    if(centerVal){
      this.set('center', centerVal)
    }
  }
});
