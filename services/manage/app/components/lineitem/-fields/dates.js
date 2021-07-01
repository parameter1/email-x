import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

const { isArray } = Array;

export default Component.extend({
  classNames: ['form-group'],

  start: null,
  end: null,
  days: null,
  type: null,
  center: null,

  showDateRange: computed('type', function() {
    return this.get('type') === 'range';
  }),

  _days: computed('days.[]', function() {
    return this.get('days').map(d => moment(d));
  }),

  _range: computed('start', 'end', function() {
    const start = this.get('start');
    const end = this.get('end');
    return {
      start: start ? moment(start) : null,
      end: end ? moment(end) : null,
    }
  }),

  daysSorted: computed('_days.[]', function() {
    return this.get('days').sort();
  }),

  isRangeSet: computed('start', 'end', function() {
    if (this.get('start') && this.get('end')) return true;
    return false;
  }),

  init() {
    this._super(...arguments);
    this.set('options', [
      { key: 'range', label: 'By Range' },
      { key: 'days', label: 'By Days' },
    ]);
    const days = this.get('days');
    this.set('days', isArray(days) ? days : []);
    const type = this.get('type');
    this.set('type', type || 'days');
  },

  actions: {
    setType(value) {
      this.set('type', value);
    },

    setDays(value) {
      this.get('on-days-change')(value.map(d => d.startOf('day').valueOf()));
    },

    setRange(value) {
      const { start, end } = value;
      this.get('on-range-change')({
        start: start ? start.startOf('day').valueOf() : null,
        end: end ? end.endOf('day').valueOf() : null,
      });
    },

    goToToday() {
      this.set('center', moment());
    }
  },
});
