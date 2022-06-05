import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRequestDataOnPermission() {
  let user = JSON.parse(sessionStorage.getItem('user'))
  let rdata = {
    category: user.category
  }
  switch(user.category) {
    case '0':
      rdata.province = user.permission_range
      break
    case '1':
      rdata.parent_location = user.permission_range
      break
    case '2':
      rdata.location = user.permission_range
      break
    case '3':
      rdata.station_id = user.permission_range
      break
    case '4':
      rdata.group_id = user.permission_range
      break
    case '5':
      rdata.device_id = user.permission_range
      break
  }
  return rdata
}
