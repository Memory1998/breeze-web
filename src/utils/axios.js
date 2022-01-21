import axios from "axios";
import {Message} from "element-ui";

const baseURL = process.env.VUE_APP_BASE_API;
const http = axios.create({baseURL: baseURL, timeout: 10000})

/**
 * 请求拦截器
 */
http.interceptors.request.use((config) => {
        /**
         * 如果存在token，请求携带token
         */
        if (window.sessionStorage.getItem("token")) {
            config.headers["Authorization"] = window.sessionStorage.getItem("token");
        }
        return config;
    }, (error) => {
        Message.error({message: error});
    }
);

/**
 * 响应拦截器
 */
http.interceptors.response.use((success) => {
        /**
         * 判断业务逻辑错误
         */
        if (success.status && status == 200) {
            if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
                Message.error({message: success.data.message});
                return;
            }
            if (success.data.message) {
                Message.success({message: success.data.message});
            }
        }
        return success.data;
    }, (error) => {
        if (error.response.code == 504 || error.response.code == 404) {
            Message.error({message: "服务器被吃了~~~"});
        } else if (error.response.code == 403) {
            Message.error({message: "权限不足"});
        } else if (error.response.code == 401) {
            Message.error({message: "尚未登录，请登录"});
        } else {
            if (error.response.data.message) {
                Message.error({message: error.response.data.message});
            } else {
                Message.error({message: "未知错误"});
            }
        }
        return;
    }
);

export default http
