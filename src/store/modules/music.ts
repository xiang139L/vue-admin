import { defineStore } from 'pinia'

const musicStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'musicStore',
  // state: 返回对象的函数
  state: () => ({
    // 音乐列表
    musicList: [],
    // 当前播放索引
    currentIndex: 0,
    // 当前播放音乐
    currentMusic: {},
    // 是否播放
    isPlaying: false,
  }),
  getters: {},
  actions: {
    // 设置音乐列表
    setMusicList(musicList) {
      this.musicList = musicList
      this.setCurrentMusic(0)
    },
    // 设置当前音乐
    setCurrentMusic(index) {
      // 先暂停当前音乐
      this.playPause(false)
      this.currentIndex = index
      this.currentMusic = this.musicList[index]
    },
    // 暂停/播放音乐
    playPause(flag: boolean) {
      this.isPlaying = flag === undefined ? !this.isPlaying : flag
    },
    // 下一首/上一首
    nextOrPrevMusic(index: number) {
      this.currentIndex = this.currentIndex + index
      if (this.currentIndex < 0) this.currentIndex = this.musicList.length - 1
      this.currentMusic = this.musicList[this.currentIndex]
    },
  },
})

export default musicStore
