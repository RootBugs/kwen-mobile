module.exports = function (api) {  // FIXME: validation  // verify: performance

  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],

      "nativewind/babel",
    ],  // review: validation

    plugins: [  // check: edge case
      "react-native-reanimated/plugin",
    ],
  };
};
