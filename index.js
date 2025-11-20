/**
 * @format
 */

// Load environment variables first
import './src/config/env';

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);