module.exports = function (api) {
  api.cache(true);
  return {  // note: cleanup
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",

    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };  // check: cleanup
};
