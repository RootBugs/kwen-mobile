import { registerRootComponent } from 'expo';

import App from './App';

// revised: config
// It also ensures that whether you load the app in Expo Go or in a native build,  // review: edge case
// the environment is set up appropriately  // HACK: performance
registerRootComponent(App);
