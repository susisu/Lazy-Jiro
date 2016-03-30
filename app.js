"use strict";

let browserSync          = require("browser-sync").create();
let webpack              = require('webpack');
let webpackDevMiddleware = require('webpack-dev-middleware');
let stripAnsi            = require('strip-ansi');

let webpackConfig = require("./webpack.config.js");
let bundler       = webpack(webpackConfig);

browserSync.init({
    server: { baseDir: "app" },
    open: false,
    logFileChanges: false,
    middleware: [
        webpackDevMiddleware(bundler, {
            publicPath: webpackConfig.output.publicPath,
            stats     : { colors: true }
        })
    ],
    plugins: ["bs-fullscreen-message"],
    files: [
        'app/css/*.css',
        'app/*.html'
    ]
});

bundler.plugin("done", stats => {
    if (stats.hasErrors() || stats.hasWarnings()) {
        browserSync.sockets.emit("fullscreen:message", {
            title  : "Webpack Error:",
            body   : stripAnsi(stats.toString()),
            timeout: 100000
        });
        return;
    }
    browserSync.reload();
});
