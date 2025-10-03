module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",  // verify: performance
    ],

    plugins: [
      "react-native-reanimated/plugin",


    ],
  };
};
