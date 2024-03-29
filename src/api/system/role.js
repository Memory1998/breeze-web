import { request } from '@/axios'
import JSONBigInt from 'json-bigint'
import { servicePath } from '@/settings'

const JSONBigInt2Str = JSONBigInt({ storeAsString: true })

/**
 * 列表
 *
 * @params params
 * @returns {AxiosPromise}
 */
export function list (params) {
  return request({
    url: servicePath.system + '/role',
    method: 'get',
    params: params,
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 添加
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function save (data) {
  return request({
    url: servicePath.system + '/role',
    method: 'post',
    data: data
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
    url: servicePath.system + '/role',
    method: 'delete',
    data: ids
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
    url: servicePath.system + '/role',
    method: 'put',
    data: data
  })
}

/**
 * 修改角色权限
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function modifyPermission (data) {
  return request({
    url: servicePath.system + '/role/modifyPermission',
    method: 'put',
    data: data
  })
}

/**
 * 获取角色权限
 *
 * @param roleId
 * @returns {AxiosPromise}
 */
export function listRolesPermission (roleId) {
  return request({
    url: servicePath.system + '/role/listRolesPermission',
    method: 'get',
    params: { roleId: roleId },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 获取用户角色
 *
 * @param userId
 * @returns {AxiosPromise}
 */
export function listUserRoles (userId) {
  return request({
    url: servicePath.system + '/role/listUserRoles',
    method: 'get',
    params: { userId: userId },
    transformResponse: [(data) => {
      return JSONBigInt2Str.parse(data)
    }]
  })
}

/**
 * 校验角色编码是否重复
 *
 * @param roleCode
 * @param roleId
 * @returns {AxiosPromise}
 */
export function checkRoleCode (roleCode, roleId) {
  return request({
    url: servicePath.system + '/role/checkRoleCode',
    method: 'get',
    params: {
      roleId: roleId || '',
      roleCode: roleCode
    }
  })
}
