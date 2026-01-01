import { registerRootComponent } from 'expo';

import App from './App';
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// tweaked: setup
// the environment is set up appropriately
registerRootComponent(App);
