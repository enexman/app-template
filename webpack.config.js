module.exports = {
    entry: "./app/js-src/main",
    output: {
        path: "./app/js/",
        filename: "main.js",
        library: "app"
    },
    devtool: "source-map"
};
