"use strict";

let path = require("path");
let webpack = require("webpack");

const DEBUG = process.env.DEBUG === "true";

module.exports = {
    debug: DEBUG,
    devtool: DEBUG ? "#source-map" : "",
    context: __dirname,
    entry: {
        main: "./src/js/main.js",
        worker: "./src/js/worker.js"
    },
    output: {
        path      : path.join(__dirname, "app"),
        publicPath: "/",
        filename  : "js/[name].bundle.js",
        pathInfo  : DEBUG
    },
    externals: {
        "ace": true
    },
    plugins:
        DEBUG ? [] : [
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ],
    module: {
        loaders: [
            {
                loader: "babel-loader",
                test  : /\.js$/,
                query : {
                    plugins: [],
                    presets: ["es2015"]
                }
            }
        ]
    }
};
