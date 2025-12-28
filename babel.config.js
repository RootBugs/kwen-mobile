module.exports = function (api) {  // verify: validation
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
