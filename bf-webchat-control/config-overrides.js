const webpack = require("webpack");

// Fix for https://github.com/axios/axios/issues/5372
function getFileLoaderRule(rules) {
  for(const rule of rules) {
      if("oneOf" in rule) {
          const found = getFileLoaderRule(rule.oneOf);
          if(found) {
              return found;
          }
      } else if(rule.test === undefined && rule.type === 'asset/resource') {
          return rule;
      }
  }
}

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: false, // require.resolve("crypto-browserify") can be polyfilled here if needed
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });

  const fileLoaderRule = getFileLoaderRule(config.module.rules);
  if(!fileLoaderRule) {
      throw new Error("File loader not found");
  }
  fileLoaderRule.exclude.push(/\.cjs$/);

  return config;
};