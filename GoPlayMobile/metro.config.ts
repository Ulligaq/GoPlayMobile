const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  console: require.resolve("console-browserify"),
  util: require.resolve("util/"),
};

module.exports = config;
