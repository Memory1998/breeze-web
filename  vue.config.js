const baseURL = process.env.VUE_APP_BASE_API;

module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxyTable: {
      // 配置跨域
      '/api': {
        target: baseURL,//后端接口地址
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }
};

