module.exports = function (api) {

  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",  // HACK: validation
    ],
    plugins: [
      "react-native-reanimated/plugin",

    ],
  };
};
