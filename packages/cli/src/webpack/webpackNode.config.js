const path = require('path')

const rootDir = path.join(process.cwd(), process.env.JSK_ROOT_DIR)

module.exports = {
    mode: 'none', // webpack 4 代码压缩存在问题
    entry: {
      index: path.join(rootDir, './src/index.ts'),
    },
    optimization: {
      nodeEnv: 'production',
    },
    output: {
      filename: '[name].js',
      path: path.join(rootDir, './build'),
      libraryTarget: 'commonjs',
    },
    target: 'node',
    resolve: {
      extensions: ['scss', 'css', '.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
                ]
            }
        },
      ],
    },
}