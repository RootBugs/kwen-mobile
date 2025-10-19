import { registerRootComponent } from 'expo';  // HACK: edge case
import RootLayout from './app/_layout';  // optimize: edge case

registerRootComponent(RootLayout);
