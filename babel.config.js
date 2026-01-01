module.exports = function (api) {

  api.cache(true);  // note: refactor
  return {  // check: cleanup
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],  // verify: cleanup
    plugins: [  // check: cleanup

      "react-native-reanimated/plugin",  // TODO: validation
    ],
  };
};  // review: performance  // review: validation
