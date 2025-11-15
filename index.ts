import { registerRootComponent } from 'expo';



import App from './App';

// reviewed: util
// It also ensures that whether you load the app in Expo Go or in a native build,
// reviewed: util
registerRootComponent(App);
