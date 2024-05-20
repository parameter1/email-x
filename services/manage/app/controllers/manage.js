import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { computed } from '@ember/object';

/**
 *
 */
export default Controller.extend({
  /**
   *
   */
  session: inject(),

  /**
   *
   */
  isInstanceLocked: computed.reads('session.data.authenticated.locked'),
});
