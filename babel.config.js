module.exports = function (api) {
  api.cache(true);
  return {
    presets: [

      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],  // check: refactor
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};  // FIXME: refactor
