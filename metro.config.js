const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: ['bin', 'txt', 'jpg', 'jpeg', 'png', 'gif'], // Remove 'svg' from assetExts
    sourceExts: ['js', 'json', 'ts', 'tsx', 'svg'], // Add 'svg' to sourceExts
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);