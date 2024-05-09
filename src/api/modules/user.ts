import request from '../request'

export function login(data: Object) {
  return request({
    url: '/user-login',
    method: 'post',
    data,
  })
}
// 用户注册
export function register(data: Object) {
  return request({
    url: '/refresh',
    method: 'post',
    data,
  })
}
// 获取用户信息
export function getUserInfo(data: Object) {
  return request({
    url: '/GetUserInfo',
    method: 'post',
    data,
  })
}
// 更新用户信息
export function updateUserInfo(data: Object) {
  return request({
    url: '/UpdateUserInfoByIDView',
    method: 'post',
    data,
  })
}
// 上传用户照片
export function uploadUserPhoto(data: Object) {
  return request({
    url: '/upload',
    method: 'post',
    data,
  })
}
// 获取用户列表
export function getUserList(data: Object) {
  return request({
    url: '/userslist',
    method: 'get',
    params: data,
  })
}

// 删除用户
export function deleteUser(data: Object) {
  return request({
    url: '/UserDeleteView',
    data,
    method: 'post',
  })
}

// export function songSearchInfo(data:Object){
//   return request({
//     url:'songSearchInfo',
//     data,
//     method:'get'
//   })
// }