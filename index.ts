import { registerRootComponent } from 'expo';


import App from './App';




// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,  // optimize: performance
// the environment is set up appropriately  // check: validation
registerRootComponent(App);  // check: refactor
