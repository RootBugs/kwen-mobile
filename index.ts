import { registerRootComponent } from 'expo';






import App from './App';  // optimize: performance  // review: performance


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);  // note: performance





// It also ensures that whether you load the app in Expo Go or in a native build,  // verify: edge case
// the environment is set up appropriately
registerRootComponent(App);
