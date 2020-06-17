const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
// const allDevtoolModes = [
//   'eval',
//   'cheap-eval-source-map',
//   'cheap-module-eval-source-map',
//   'eval-source-map',
//   'cheap-source-map',
//   'cheap-module-source-map',
//   'inline-cheap-source-map',
//   'inline-cheap-module-source-map',
//   'source-map',
//   'inline-source-map',
//   'hidden-source-map',
//   'nosource-source-map',
//   'none'
// ]

// module.exports = allDevtoolModes.map(devtool => ({
//   devtool,
//   mode: 'none',
//   entry: './src/test.js',
//   output: {
//     filename: `js/${devtool}.js`
//   },
//   module: {
//     rules: [
//       {
//         test: /\.js$/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './public/index.html',
//       filename: `${devtool}.html`
//     })
//   ]
// }))

module.exports = {
  // mode: 'production', // 生产模式打包 自带Tree-sharking效果 代码压缩优化
  entry: './src/main.js',
  optimization: { // 集中配置webpack优化功能
    usedExports: true, // 模块只导出被使用的成员
    sideEffects: true, // 保留副作用代码/剔除其他不相干代码，模块副作用指模块执行的时候除了导出成员，是否还做了其他事
    // package.json 中 sideEffects: [] 标识指定文件代码副作用有效 告诉webpack不移除打包 // 一般标识对全局有副作用的代码 不移除
    concatenateModules: true, // 尽可能合并每一个模块到一个函数中
    minimize: true, // 压缩输出结果
  },
  devServer: { // 开发环境配置
    hot: true,
    // contentBase: 'public',
    proxy: {
      // '/api': {
      //   target: 'https://www.baidu.com/', // 目标路径
      //   changeOrigin: true, // 确保请求主机名一致
      //   pathRewrite: {
      //     '^/api': '' // 替代掉代理地址中的/api
      //   }
      // }
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/, // 同个模块使用多个loader 从后面开始解析
        use: [
          'style-loader', // 注意顺序
          'css-loader'
        ]
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 每次打包之前清除dist文件夹
    new HtmlWebpackPlugin({ // 打包自动生成html文件
      template: './public/index.html' // 使用指定模板
    }),
    new CopyWebpackPlugin([ // 需要拷贝的目录或路径
      'public'
    ]),
    new webpack.HotModuleReplacementPlugin() // HMR特性所需要的插件
  ]
}