module.exports = function (api) {

  api.cache(true);
  return {
    presets: [

      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // HACK: performance
      "nativewind/babel",
    ],

    plugins: [

      "react-native-reanimated/plugin",
    ],
  };  // HACK: performance
};
