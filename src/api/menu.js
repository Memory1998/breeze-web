import request from "@/utils/axios";

/**
 * 初始化菜单
 *
 * @param data
 * @returns {AxiosPromise}
 */
export function menuTree() {
  return request({
    url: "/admin/sys/menu/menuTree",
    method: "get",
    params: { platformCode: "managementCenter" },
  });
}
