'use strict'
// Template version: 1.2.7
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/apis': {
        // target: 'http://3.112.190.40:8000', //新测试环境1
        // target: 'http://3.112.190.40:8080', //新测试环境1
        // target: 'https://www.highdefi.com', //新测试环境1
        // target: 'https://www.2020.exchange', //新测试环境2
        target: 'https://app.eunex.group', //新测试环境2
        // target: 'http://2020.highdefi.com', //新测试环境2
        // target: 'http://10.113.11.89:8000', //新测试环境2
        // target: 'http://10.113.11.197:8000', //新测试环境2
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        }
      },
      '/crypto': {
        // target: 'http://192.168.2.163', //新测试环境1
        // target: 'http://www.2020.exchange', //新测试环境2
        target:'https://www.2020.exchange',
        changeOrigin: true,
        pathRewrite: {
          '^/crypto': ''
        }
      },
      '/v1': {
        target: 'http://192.168.2.70:8080/',
        changeOrigin: true,
        pathRewrite: {
          '^/v1': '/v1'
        }
      },
      '/socket': {
        target: 'ws://staging-node.2020.exchange/',
        changeOrigin: true,
        pathRewrite: {
          '^/socket': ''
        }
      },
      // 连欧时需要打开
      // '/user': {
      //   target: 'http://192.168.2.117:8080/', //欧
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/user': '/user'
      //   }
      // },
    },

    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST
    // host: '0.0.0.0', // can be overwritten by process.env.HOST
    // host: 'b.2020.exchange', // can be overwritten by process.env.HOST
    port: 8084, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
