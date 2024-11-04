module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@Fonts": "./assets/fonts",
            "@Assets": "./assets/images",
            "@Music": "./assets/music",
            "@Components/*": "./components/*",
            "@": "./",
          },
        },
      ],
    ],
  };
};
