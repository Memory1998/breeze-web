let proxyObj = {};

const baseURL = process.env.VUE_APP_BASE_API;

proxyObj["/"] = {
    ws:false, // 关闭 webSocket
    target: baseURL, // 后端的地址
    changeOrigin: true,
    pathRewrite: {
        '^/':''
    }
}

module.exports = {
    devServer:{
        host: "localhost",
        port: 8080,
        proxy: proxyObj
    }
}
