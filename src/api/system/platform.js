import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function list (data) {
  return request({
    url: servicePath.system + '/platform/list',
    method: 'post',
    data: data,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 删除
 *
 * @param ids
 * @returns {AxiosPromise}
 */
export function del (ids) {
  return request({
    url: servicePath.system + '/platform/delete',
    method: 'delete',
    data: ids
  })
}

/**
 * 新增
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/platform/create',
    method: 'post',
    data: data
  })
}

/**
 * 修改
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function modify (data) {
  return request({
    url: servicePath.system + '/platform/modify',
    method: 'put',
    data: data
  })
}

/**
 * 校验平台编码是否重复
 *
 * @param platformCode
 * @param platformId
 * @returns {AxiosPromise}
 */
export function checkPlatformCode (platformCode, platformId) {
  return request({
    url: servicePath.system + '/platform/checkPlatformCode',
    method: 'get',
    params: {
      platformId: platformId || '',
      platformCode: platformCode
    }
  })
}
