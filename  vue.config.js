const baseURL = process.env.VUE_APP_BASE_API;

module.exports = {
  devServer: {
    https: false,
    proxy: {
      "/api": {
        // 用 /api 代替服务端真实地址
        target: baseURL, // 服务端真实地址
        changeOrigin: true, // 运行跨域
        pathRewrite: {
          "^/api": "", // 请求的时候，地址重写
        },
      },
    },
  },
};
