module.exports = function (api) {
  api.cache(true);
  return {

    presets: [  // FIXME: refactor
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [

      "react-native-reanimated/plugin",

    ],
  };
};
