import axios from 'axios'
import { Message } from 'element-ui'

// 创建的实例返回一个对象,实例对象
const request = axios.create({
  // 请求路径，基础接口路径 请求9999时经过/dev-api相当于请求//http://localhost:8888
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 请求超时时间
})

/**
 * 请求拦截器
 */
request.interceptors.request.use(
  (config) => {
    /**
     * 如果存在token，请求携带token
     */
    if (localStorage.getItem('access_token')) {
      config.headers.Authorization =
        'Bearer ' + localStorage.getItem('access_token')
    }
    return config
  },
  (error) => {
    Message.error({ message: error })
  }
)

/**
 * 响应拦截器
 */
request.interceptors.response.use(
  (success) => {
    /**
     * 判断业务逻辑错误
     */
    if (success.status && success.status === 200) {
      if (
        success.data.code === 500 ||
        success.data.code === 401 ||
        success.data.code === 403
      ) {
        Message.error({ message: success.data.message })
        return
      }
      if (success.data.message) {
        Message.success({ message: success.data.message })
      }
    }
    return success.data
  },
  (error) => {
    if (error.response.status === 504 || error.response.status === 404) {
      Message.error({ message: '服务器被吃了~~~' })
    } else if (error.response.status === 403) {
      Message.error({ message: '权限不足' })
    } else if (error.response.status === 401) {
      Message.error({ message: '尚未登录，请登录' })
    } else {
      if (error.response.data.message) {
        Message.error({ message: error.response.data.message })
      } else {
        Message.error({ message: '未知错误' })
      }
    }
  }
)

export default request
