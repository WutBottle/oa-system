const path = require('path');
const resolve = (dir) => path.join(__dirname, dir);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  publicPath: IS_PROD ? process.env.VUE_APP_PUBLIC_PATH : "/", // 默认'/'，部署应用包时的基本 URL
  // outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
  // assetsDir: "", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1,
  pwa: {},
  css: {
    loaderOptions: { // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },
    open: IS_PROD,
    host: '0.0.0.0',
    port: 8000,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API || 'http://127.0.0.1:8080',
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // 修复HMR
    config.resolve.symlinks(true);
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/router/components'))
      .set('layouts', resolve('src/layouts'))
      .set('base', resolve('src/base'))
      .set('static', resolve('src/static'));
    // 打包分析
    if (process.env.IS_ANALYZ) {
      config.plugin('webpack-report')
        .use(BundleAnalyzerPlugin, [{
          analyzerMode: 'static',
        }]);
    }
  },
  configureWebpack: config => {
    if (IS_PROD) {
      const plugins = [];
      plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8
        })
      );
      plugins.push(new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_debugger: true,
            drop_console: true,  //生产环境自动删除console
          },
          warnings: false,
        },
        sourceMap: false,
        parallel: true,//使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
      }));
      config.plugins = [
        ...config.plugins,
        ...plugins
      ];
    }
  }
};