const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude React DevTools for web
config.resolver.blockList = [
  /.*\/node_modules\/react-native\/Libraries\/Core\/setUpReactDevTools\.js$/,
];

// Add web support
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native$': 'react-native-web',
};

module.exports = config; 