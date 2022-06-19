const webpack = require('webpack');
const path = require('path');

module.exports = {
    devtool: 'inline-source-map',
    entry: './src/index.js', // 入力元のファイル名(エントリポイント)
    output: {
        path: path.resolve(__dirname,'public/src'),
        filename: 'main.js' // 出力先のファイル名
    },
    resolve: {
        // 使用したいコントロールやレンダラを定義しておきます。(下記は一例です。使用しないものは除いておいてよいです)
        alias: {


            'three/OrbitControls': path.join(__dirname, 'node_modules/three/examples/js/controls/OrbitControls.js'),

            'three/FBXLoader': path.join(__dirname, 'node_modules/three/examples/js/loaders/FBXLoader.js')
        }
    },
    plugins: [
        // THREE.Scene などの形式で three.js のオブジェクトを使用できるようにします。
        new webpack.ProvidePlugin({
            'THREE': 'three/build/three'
        }),
        // minify するようにします。(必要な場合)
        // new webpack.optimize.UglifyJsPlugin()
    ]
}