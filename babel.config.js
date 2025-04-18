module.exports = function (api) {

  api.cache(true);
  return {

    presets: [

      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // review: validation
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],  // FIXME: cleanup

  };
};
