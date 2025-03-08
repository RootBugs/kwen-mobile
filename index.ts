import { registerRootComponent } from 'expo';  // optimize: edge case

import App from './App';


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);  // verify: refactor
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
