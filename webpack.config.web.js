const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const fs = require('fs');

class CopyAndConcatPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('after-emit', (compilation, callback) => {
            const { filesToCopy, outputFile } = this.options;
            const concatenatedContent = filesToCopy.map(filePath => fs.readFileSync(filePath, 'utf-8')).join('\n');

            const outputPath = path.dirname(outputFile);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }

            if (fs.existsSync(outputFile)) {
                console.warn(`Bundle file "${outputFile}" already exists. Skipping concatenation.`);
            } else {
                fs.writeFileSync(outputFile, concatenatedContent, 'utf-8');
                console.log(`Bundle file "${outputFile}" created successfully.`);
            }

            callback();
        });
    }
}

const production = process.env.NODE_ENV === 'production';

const plugins = [
    new Dotenv(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
    }),
    new CopyAndConcatPlugin({
        filesToCopy: [
            './node_modules/blockly/blockly_compressed.js',
            './node_modules/blockly/blocks_compressed.js',
            './node_modules/blockly/javascript_compressed.js',
            './node_modules/blockly/msg/messages.js',
        ],
        outputFile: 'www/js/bundle.js',
    }),
];

const productionPlugins = () => {
    const args = {};
    if (process.env.ARGS.indexOf('--test')) {
        args.BRANCH = JSON.stringify(process.env.BRANCH);
        args.ARGS = JSON.stringify(process.env.ARGS);
    }
    if (process.env.NODE_ENV === 'production') {
        return [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                    ...args,
                },
            }),
            new webpack.optimize.UglifyJsPlugin({
                include: /\.js$/,
                minimize: true,
                sourceMap: true,
                compress: {
                    warnings: false,
                },
            }),
        ];
    }
    return [];
};

module.exports = {
    entry: {
        bot: path.join(__dirname, 'src/index.js'),
        index: path.join(__dirname, 'src', 'indexPage'),
    },
    output: {
        filename: production ? '[name].min.js' : '[name].js',
        sourceMapFilename: production ? '[name].min.js.map' : '[name].js.map',
    },
    devtool: 'source-map',
    watch: !production,
    target: 'web',
    externals: {
        CIQ: 'CIQ',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    plugins: plugins.concat(productionPlugins()),
    resolve: {
        alias: {
            config: path.join(__dirname, 'src/config.js'),
        },
    },
};
