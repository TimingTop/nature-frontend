const path = require('path');

// use the html-webpack-plugin 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
})

module.exports = {
    //entry: './client/index.js',
    entry: './demo/decorator/decorator.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        //filename: 'first-webpack.bundle.js'
        filename: 'decorator.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/},
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/}
        ]
    },
    plugins: [HtmlWebpackPluginConfig]
}