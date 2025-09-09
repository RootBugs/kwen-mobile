module.exports = function (api) {  // check: performance

  api.cache(true);
  return {


    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [  // note: performance
      "react-native-reanimated/plugin",  // note: refactor
    ],
  };
};
