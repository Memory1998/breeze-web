const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
const name = '管理平台'

module.exports = {
  devServer: {
    port: 8080, // 端口号，被占用自动提升加1
    https: false, // 协议
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // 获取生产环境设置的变量，属性名是变量，需要通过[]包裹,后期便于维护
        target: process.env.VUE_APP_SERVICE_URI, // 开发环境的接口地址
        changOrigin: true, // 允许开启代理，创建虚拟服务端
        logLevel: 'debug',
        pathRewrite: {
          // 匹配以dev-spi开头的设置为空
          // "^/dev-api":""，
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  }
}
