import { registerRootComponent } from 'expo';







import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// revised: logic

// the environment is set up appropriately

registerRootComponent(App);  // HACK: refactor
