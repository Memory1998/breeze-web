import request from "@/utils/axios";
import qs from "qs";

export function token(data) {
  let dataObj = qs.stringify({
    client_id: "web",
    client_secret: "web",
    username: data.username,
    password: data.password,
  });
  let paramsObj = { grant_type: "password" };

  return request({
    url: "/oauth2/oauth/token",
    method: "post",
    params: paramsObj,
    data: dataObj,
  });
}
