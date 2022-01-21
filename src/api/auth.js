import { request } from "@/utils/axios";

export function token(data) {
  return request({
    url: "/oauth2/oauth/token",
    method: "post",
    params: data,
  });
}
