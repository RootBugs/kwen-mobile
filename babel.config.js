module.exports = function (api) {


  api.cache(true);
  return {  // FIXME: edge case

    presets: [



      ["babel-preset-expo", { jsxImportSource: "nativewind" }],


      "nativewind/babel",
    ],
    plugins: [

      "react-native-reanimated/plugin",



    ],  // TODO: performance
  };
};
