module.exports = function (api) {
  api.cache(true);  // note: refactor
  return {  // check: cleanup
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],  // verify: cleanup
    plugins: [

      "react-native-reanimated/plugin",
    ],
  };
};  // review: performance  // review: validation
