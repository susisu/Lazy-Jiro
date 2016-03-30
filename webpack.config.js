"use strict";

let path = require("path");
let webpack = require("webpack");

const DEBUG = process.env.DEBUG === "true";

module.exports = {
    debug: DEBUG,
    devtool: DEBUG ? "#source-map" : "",
    context: __dirname,
    entry: "./src/js/main.js",
    output: {
        path      : path.join(__dirname, "app"),
        publicPath: "/",
        filename  : "js/main.js",
        pathInfo  : DEBUG
    },
    externals: {
        "loquat": true,
        "ace"   : true
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
                loader : "babel-loader",
                test   : /\.js$/,
                exclude: /node_modules/,
                query  : {
                    plugins: ["transform-runtime"],
                    presets: ["es2015"]
                }
            }
        ]
    }
};
