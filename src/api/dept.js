import request from '@/utils/axios'
import JSONBigInt from 'json-bigint'

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: '/admin/sys/dept/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt.parse(data)
    }]
  })
}

/**
 * 添加
 * @returns {AxiosPromise}
 */
export function add (data) {
  return request({
    url: '/admin/sys/dept/save',
    method: 'post',
    data: data
  })
}

/**
 * 删除
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function del (data) {
  return request({
    url: '/admin/sys/dept/delete',
    method: 'delete',
    data: data
  })
}

/**
 * 修改
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function edit (data) {
  return request({
    url: '/admin/sys/dept/update',
    method: 'put',
    data: data
  })
}
