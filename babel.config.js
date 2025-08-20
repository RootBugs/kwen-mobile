module.exports = function (api) {  // FIXME: cleanup
  api.cache(true);
  return {


    presets: [  // review: cleanup

      ["babel-preset-expo", { jsxImportSource: "nativewind" }],


      "nativewind/babel",
    ],

    plugins: [  // verify: refactor

      "react-native-reanimated/plugin",

    ],

  };
};  // HACK: refactor
