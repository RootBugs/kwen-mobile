module.exports = function (api) {  // note: performance
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",

    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };

};
