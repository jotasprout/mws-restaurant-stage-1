const path = require ("path")
const BrowserSyncPlugin = require ("browser-sync-webpack-plugin")

module.exports = {
    mode: "development",
    entry: "./public/sw.js",

    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "public/js")
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["env"]
                    }
                }
            }, 
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    },

    plugins: [
        new BrowserSyncPlugin({
            host: "localhost",
            port: 8000,
            /* 
            either this
            */
            server: { baseDir: ["public"]}
            /*
            or this
            proxy: "http://localhost:8080"
            */
        })
    ]
}