module.exports = {
  devServer: {
    port: 8080, //端口号，被占用自动提升加1
    host: "localhost", //主机名，127.0.01 真机 0.0.0.0
    https: false, //协议
    open: true, //启动浏览器自动打开
    proxy: {
      //设置跨域  //http://localhost:8001/banner.json
      //代理访问跨域请求json /dev-api/banner.json
      [process.env.VUE_APP_BASE_API]: {
        //获取生产环境设置的变量，属性名是变量，需要通过[]包裹,后期便于维护
        target: process.env.VUE_APP_SERVICE_URI, //开发环境的接口地址
        changOrigin: true, //允许开启代理，创建虚拟服务端
        logLevel: "debug",
        pathRewrite: {
          //匹配以dev-spi开头的设置为空
          // "^/dev-api":""，
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
    },
  },
};
