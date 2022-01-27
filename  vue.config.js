const baseURL = process.env.VUE_APP_BASE_API;

module.exports = {
  // devServer.proxy适用于本地开发使用，
  // 生产环境请用第三方代理软件，如nginx。
  devServer: {
    port: 8080, // 本机端口号
    host: "localhost", // 本机主机名
    https: false, // 协议
    open: true, // 启动服务器时自动打开浏览器访问
    proxyTable: {
      "/api": {
        ws: false,
        // 目标服务器,代理访问到 http://localhost:9999
        target: baseURL,
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/api": "",
        },
        logLevel: "debug"
      },
    },
  },
};
