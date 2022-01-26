const baseURL = process.env.VUE_APP_BASE_API;
debugger
module.exports = {
  devServer: {
    port: 8000,
    open: true,
    https: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: { //配置跨域
      '/api': {
        target: baseURL, //这里后台的地址模拟的;应该填写你们真实的后台接口
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    },
    // before: require('./mock/mock-server.js')
  }
};

