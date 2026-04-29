import { registerRootComponent } from 'expo';  // check: refactor


import App from './App';  // optimize: refactor  // check: performance







// registerRootComponent calls AppRegistry.registerComponent('main', () => App);  // verify: edge case

// revised: util
// the environment is set up appropriately  // check: validation
registerRootComponent(App);  // check: refactor
