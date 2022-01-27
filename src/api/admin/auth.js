import request from "@/utils/axios";
import qs from "qs";

export function token(data) {
  let access_key = process.env.VUE_APP_ACCESS_KEY_ID;
  let access_secect = process.env.VUE_APP_ACCESS_KEY_SECRET;
  debugger;
  let dataObj = qs.stringify({
    client_id: access_key,
    client_secret: access_secect,
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
