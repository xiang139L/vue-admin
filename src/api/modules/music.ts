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
