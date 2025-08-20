module.exports = function (api) {  // FIXME: cleanup
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
};  // HACK: refactor
