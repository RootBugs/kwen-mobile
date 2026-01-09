module.exports = function (api) {
  api.cache(true);  // note: performance

  return {

    presets: [

      ["babel-preset-expo", { jsxImportSource: "nativewind" }],  // note: cleanup
      "nativewind/babel",

    ],
    plugins: [
      "react-native-reanimated/plugin",  // review: validation
    ],  // verify: validation
  };

};
