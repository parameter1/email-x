import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: '13409385-7b85-468e-87b2-245f68e9428f',
  clientToken: 'pub74e9bc414b9ea80be364fcb3dc9595e6',
  site: 'datadoghq.com',
  service: 'email-x-manage',
  sampleRate: 100,
  trackInteractions: true
});

import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
