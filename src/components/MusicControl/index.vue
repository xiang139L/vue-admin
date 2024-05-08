<template>
  <div class="wrz_blog_music_player" :style="openPlayerStyle">
    <div class="wrz_blog_music_player-content">
      <audio
        ref="audio"
        :src="currentSong.SongURL"
        @ended="playNext"
        @timeupdate="updateTime"
      ></audio>
      <span class="cover" :class="{ rotate: isPlaying }">
        <img :src="currentSong.img || changpian" alt="undefined" />
      </span>

      <div class="wrz_blog_music_player-tools">
        <div class="music-title">
          <strong>{{ currentSong.SongName || '歌曲标题' }}</strong>
          <span> - </span>
          <span>{{ currentSong.artist || '作者' }}</span>
        </div>
        <div class="player-controls">
          <div class="song-time"
            >{{ formatTime(currentTime) }} /
            <template v-if="totalTime">
              {{ formatTime(totalTime) }}
            </template>
            <template v-else> 0:00 </template>
          </div>
          <div class="controls-button">
            <div class="playPrev" @click="playPrev"></div>
            <div :class="[isPlaying ? 'playPause' : 'playing']" @click="playPause()"></div>
            <div class="playNext" @click="playNext"></div>
          </div>
          <!-- <div class="playList" @click="togglePlaylist">
            <el-icon><Expand /></el-icon>
          </div> -->
        </div>
      </div>
    </div>
    <div class="wrz_blog_music_player-switch" @click="togglePlayer">
      <div class="switch-pointing" :style="openIconStyle"></div>
    </div>

    <!-- <ol class="wrz_blog_music_list" v-if="showPlaylist">
      <li
        v-for="(item, index) in songs"
        @click="selectSong(index)"
        :class="{ active: index === selectedSongIndex }"
      >
        <strong style="margin-left: 5px">{{ item.title }}</strong>
        <span style="float: right" class="artist">{{ item.artist }}</span>
      </li>
    </ol> -->
  </div>
</template>

<script setup>
  import { ref, watchEffect, onMounted, computed, watch } from 'vue'
  import useMusicStore from '@/store/modules/music'
  import changpian from '@/assets/changpian.png'
  const isPlaying = computed(() => musicStore.isPlaying)
  const currentSongIndex = ref(0)
  const musicStore = useMusicStore()

  const currentSong = computed(() => musicStore.currentMusic)
  const showPlaylist = ref(false)
  const currentTime = ref(0)
  const totalTime = ref(0)
  const openPlayerStyle = ref({ transform: 'translateX(250px)' })
  const openIconStyle = ref({ transform: 'rotate(360deg)' })

  const togglePlayer = () => {
    openPlayerStyle.value =
      openPlayerStyle.value.transform === 'translateX(0px)'
        ? { transform: 'translateX(250px)' }
        : { transform: 'translateX(0px)' }
    openIconStyle.value =
      openIconStyle.value.transform === 'rotate(360deg)'
        ? { transform: 'rotate(180deg)' }
        : { transform: 'rotate(360deg)' }
  }
  const playPauseBackgroundPosition = ref('0px 0px !important')
  const playPause = () => {
    const audio = document.querySelector('audio')
    isPlaying.value ? audio.pause() : audio.play()
    musicStore.playPause(!isPlaying.value)
    if (isPlaying.value) {
      playPauseBackgroundPosition.value = '-36px -63px !important'
    } else {
      playPauseBackgroundPosition.value = '0 0 !important'
    }
  }

  const playNext = () => {
    musicStore.nextOrPrevMusic(1)
    musicStore.playPause(true)
    playSong()
  }

  const playPrev = () => {
    musicStore.nextOrPrevMusic(-1)
    musicStore.playPause(true)
    playSong()
  }
  watch(
    () => musicStore.isPlaying,
    () => {
      if (isPlaying.value) {
        playSong()
      }
    },
  )
  const playSong = () => {
    const audio = document.querySelector('audio')
    audio.src = currentSong.value.SongURL

    // 等待音频元素加载新源后再播放
    audio.oncanplaythrough = () => {
      audio.play()
      audio.oncanplaythrough = null // 播放后移除事件监听器
    }
  }

  const selectedSongIndex = ref(null)
  const togglePlaylist = () => {
    if (showPlaylist.value === true) {
      selectedSongIndex.value = currentSongIndex.value
    }
    showPlaylist.value = !showPlaylist.value
  }

  const selectSong = (index) => {
    if (selectedSongIndex.value !== null) {
      // 取消之前选中的样式
      document
        .querySelectorAll('.wrz_blog_music_list li')
        [selectedSongIndex.value].classList.remove('active')
    }

    currentSongIndex.value = index
    playSong()
    // showPlaylist.value = false;

    // 更新当前选中的索引
    selectedSongIndex.value = index

    // 为当前选中的 li 添加 active 类
    document.querySelectorAll('.wrz_blog_music_list li')[index].classList.add('active')
    playPauseBackgroundPosition.value = '-36px -63px !important'
  }

  const updateTime = () => {
    const audio = document.querySelector('audio')
    currentTime.value = audio.currentTime
    totalTime.value = audio.duration
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }
</script>

<style scoped>
  .wrz_blog_music_player {
    position: fixed;
    overflow: hidden;
    bottom: 162px;
    left: -250px;
    transition: transform 0.5s ease;
    z-index: 2002;
  }
  .wrz_blog_music_player-content {
    float: left;
    width: 250px;
    height: 60px;
    margin: 0 auto;
    position: relative;
    background: rgb(255, 255, 255);
    box-sizing: border-box;
  }
  .wrz_blog_music_player-content .cover img {
    border: 0px solid #333;
    position: absolute;
    left: 0px;
    overflow: hidden;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    -o-border-radius: 50%;
    -ms-border-radius: 50%;
    -khtml-border-radius: 50%;
    width: 60px;
    height: 60px;
    -moz-box-shadow: 0 2px 2px #111;
    -webkit-box-shadow: 0 2px 2px #111;
    -o-box-shadow: 0 2px 2px #111;
    box-shadow: 0 2px 2px rgba(17, 17, 17, 0);
  }
  .wrz_blog_music_player-content .rotate {
    transition: transform 0.5s ease;
  }
  .wrz_blog_music_player-content .rotate img {
    animation: rotateAnimation 10s linear infinite;
  }
  @keyframes rotateAnimation {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }
  .wrz_blog_music_player-tools {
    margin-left: 60px;
    line-height: 14px;
    font-size: 14px;
    margin-top: 0px;
    color: #636363;
    padding: 8px;
  }
  .wrz_blog_music_player-tools .music-title {
    overflow: hidden;
    cursor: ew-resize;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .wrz_blog_music_player-tools .music-title strong {
    display: inline;
    font-size: 85%;
    text-overflow: ellipsis;
    width: 80%;
    white-space: nowrap;
  }
  .wrz_blog_music_player-tools .music-title span {
    font-size: 12px;
    margin-top: 5px;
    color: #757575;
    display: inline;
    text-overflow: ellipsis;
    width: 80%;
    white-space: nowrap;
  }
  .wrz_blog_music_player-tools .player-controls {
    margin-top: 12px;
  }
  .wrz_blog_music_player-tools .player-controls .song-time {
    font-size: 12px;
    color: #5f5f5f;
    margin: 0;
    vertical-align: middle;
    line-height: 18px;
    float: left;
  }
  .wrz_blog_music_player-tools .player-controls .controls-button {
    text-align: center;
    margin-top: 8px;
    position: relative;
    color: #636363;
    line-height: 14px;
    font-size: 14px;
    width: 3px !important;
    margin-left: 15px;
  }
  .wrz_blog_music_player-tools .player-controls .controls-button .playPrev {
    transition: 0.2s;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    opacity: 1;
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
    background: url('@/assets/shangyiqu.png') no-repeat center;
    background-size: 100%;
    width: 9px;
    height: 10px;
    position: absolute;
    margin-top: 4px;
    left: 70px;
  }
  .wrz_blog_music_player-tools .player-controls .controls-button .playPause,
  .playing {
    transition: 0.2s;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    opacity: 1;
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
    background: url('@/assets/zanting.png') no-repeat center;
    background-size: 100%;
    width: 14px;
    height: 14px;
    position: absolute;
    left: 90px;
  }
  .playing {
    background-image: url('@/assets/bofang.png') !important;
  }
  .wrz_blog_music_player-tools .player-controls .controls-button .playNext {
    transition: 0.2s;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    opacity: 1;
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
    background: url('@/assets/xiayiqu.png') no-repeat center;
    background-size: 100%;
    width: 9px;
    height: 10px;
    margin-top: 4px;
    position: absolute;
    left: 118px;
  }
  .wrz_blog_music_player-tools .player-controls .playList {
    float: right;
  }
  .wrz_blog_music_player-tools .player-controls .playList .playList-icon {
    transition: 0.2s;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    opacity: 1;
    cursor: pointer;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
    background: url('@/assets/logo.png') no-repeat center;
    background-size: 100%;
    width: 13px;
    height: 10px;
    position: absolute;
    left: 229px;
    top: 38px;
  }
  .wrz_blog_music_player-tools .player-controls .playList .playList-icon:hover {
    color: #409eff;
  }
  .wrz_blog_music_player .wrz_blog_music_player-switch {
    width: 20px;
    height: 60px;
    background: #1abc9c none repeat scroll 0% 0%;
    position: relative;
    right: 0px;
    bottom: 0px;
    box-sizing: border-box;
    border-left: none;
    cursor: pointer;
    float: right;
  }
  .wrz_blog_music_player .wrz_blog_music_player-switch .switch-pointing {
    -webkit-transition: all 0.3s ease-out;
    -moz-transition: all 0.3s ease-out;
    -ms-transition: all 0.3s ease-out;
    -o-transition: all 0.3s ease-out;
    transition: all 0.3s ease-out;
    float: left;
    width: 20px;
    height: 20px;
    top: 20px;
    position: relative;
    background: transparent url('~@/assets/pointing.png') repeat scroll 0% 0%;
  }
  .wrz_blog_music_player .wrz_blog_music_list {
    display: block;
    clear: both;
    overflow: auto;
    max-height: 360px !important;
    transition: max-height 0.5s ease 0s;
    border: 1px solid rgb(222, 222, 222);
    float: left;
    background: rgb(255, 255, 255);
    width: 250px;
    margin: 0;
    padding: 0;
    position: relative;
    max-height: 0;
    overflow: hidden;
  }
  .wrz_blog_music_player .wrz_blog_music_list li {
    transition: 0.2s;
    -webkit-font-smoothing: antialiased;
    color: #989898;
    font-size: 11px;
    line-height: 2;
    padding: 3px 15px;
    cursor: pointer;
    text-overflow: ellipsis;
    list-style-position: inside;
    list-style-type: decimal;
    overflow: hidden;
    background: rgba(246, 246, 246, 0.5);
  }
  .wrz_blog_music_player .wrz_blog_music_list li:after {
    transition: 0.2s;
    -webkit-font-smoothing: antialiased;
  }
  .wrz_blog_music_player .wrz_blog_music_list .active {
    color: #716e6e;
    font-weight: bold;
    border-left: 3px solid #1abc9c;
    padding: 3px 15px 3px 11px;
  }
</style>
