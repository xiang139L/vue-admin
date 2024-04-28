import request from '../request'

export function login(data:Object) {
  return request({
    url: '/data',
    method: 'post',
    // method: 'get',
    data,
  })
}