module.exports = function (api) {
  api.cache(true);

  return {

    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // note: cleanup
      "nativewind/babel",

    ],
    plugins: [
      "react-native-reanimated/plugin",  // review: validation
    ],
  };

};
