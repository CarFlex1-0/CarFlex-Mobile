module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          '@tamagui/babel-plugin',
          {
            components: ['tamagui'],
            config: './tamagui.config.js',
          },
        ],
        [
          'transform-inline-environment-variables',
          {
            include: ['TAMAGUI_TARGET', 'EXPO_ROUTER_APP_ROOT'],
          },
        ],
        'react-native-reanimated/plugin',
        ["module:react-native-dotenv", {
          "moduleName": "@env",
          "path": ".env",
          "blacklist": null,
          "whitelist": null,
          "safe": false,
          "allowUndefined": true
        }]
      ],
    };
  };