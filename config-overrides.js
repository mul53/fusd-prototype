const webpack = require('webpack')

module.exports = {
  webpack: (config, env) => {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        buffer: require.resolve("buffer")
    };

    config.ignoreWarnings = [/Failed to parse source map/]; // gets rid of a billion source map warnings

    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]

    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
        new webpack.ProvidePlugin({
            process: 'process/browser'
        })
    ]

    return config;
  },
};
