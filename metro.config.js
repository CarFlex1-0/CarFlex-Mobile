const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add this to ensure proper handling of source files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'js', 'jsx', 'json', 'ts', 'tsx'];
config.resolver.assetExts = [...config.resolver.assetExts, 'ttf', 'otf'];

// Ensure the watchFolders includes your src directory
config.watchFolders = [...(config.watchFolders || []), './src'];

module.exports = withNativeWind(config, { 
  input: './global.css',
  configPath: './tailwind.config.js'
});