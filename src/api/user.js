import request from '@/utils/request'

export function login(data) {
  console.log('request data', data)
  return request({
    url: '/api/user/login',
    // url: '//LoginPage/Login',
    // url: '/api/LoginPage/Login',
    // url: '/api/user/login',
    // url: '/api/loginPage/login',
    method: 'post',
    data
  })
}

export function userRegister(data) {
  return request({
    url: '/api/user/register',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post'
  })
}

// export function changeUserInfo(id, data) {
//   return request({
//     url: `api/user/${id}`,
//     method: 'put',
//     data
//   })
// }

export function changeUserInfo(data) {
  return request({
    url: `api/user/alterUserInfo/`,
    method: 'post',
    data
  })
}

export function changeUserPwd(id, data) {
  return request({
    url: `api/user/${id}`,
    method: 'put',
    data
  })
}

export function getUsersData(params) {
  return request({
    url: `api/user/findByUserIdOrPhone`,
    method: 'get',
    params: params
  })
}