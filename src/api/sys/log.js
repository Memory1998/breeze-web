import { request, servicePath } from '@/utils/axios'
import JSONBigInt from 'json-bigint'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: servicePath.system + '/sys/log/list',
    method: 'post',
    data: params,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 删除
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function clear () {
  return request({
    url: servicePath.system + '/sys/log/clear',
    method: 'delete'
  })
}

/**
 * 删除
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/sys/log/delete',
    method: 'delete',
    data: ids
  })
}