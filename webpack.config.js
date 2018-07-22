const path = require ("path")

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
    }
}