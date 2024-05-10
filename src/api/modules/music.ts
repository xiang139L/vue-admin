import request from '../request'
// 获取yo音乐列表
export function getMusicList(data: Object) {
  return request({
    url: '/songslist',
    method: 'get',
    params: data,
  })
}

// 获取歌手列表
export function getSingerList(data: Object) {
  return request({
    url: '/singers',
    method: 'get',
    params: data,
  })
}

// 删除音乐
export function deleteMusicById(data: Object) {
  return request({
    url: '/SongDeleteView',
    method: 'post',
    data,
  })
}

// 编辑音乐
export function editMusicById(data: Object) {
  return request({
    url: '/SongUpdateView',
    method: 'post',
    data,
  })
}

//搜索接口
export function searchinfoMusic(data: Object) {
  return request({
    url: '/SongSearchinfo',
    method: 'get',
    params: data,
  })
}
//编辑歌手
export function editSingerById(data: Object) {
  return request({
    url: '/UpdateSingerView',
    method: 'post',
    data,
  })
}

// 删除歌手
export function deleteSingerById(data: Object) {
  return request({
    url: '/deleteSingerView',
    method: 'delete',
    data,
  })
}