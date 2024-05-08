<template>
  <div class="g-container-layout" :class="classObj">
    <MusicControl v-if="show" />
    <div v-if="device === 'mobile' && !isCollapse" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" v-if="mode === 'vertical'" />
    <div
      class="main-container"
      :class="{
        hideSliderLayout: mode === 'horizontal',
      }"
    >
      <div
        :style="{ height: `${showTag ? 90 : 50}px` }"
        v-if="SettingStore.themeConfig.fixedHeader"
      ></div>
      <u-header />
      <div class="m-container-content" :class="{ 'app-main-hide-tag': !showTag }">
        <Main />
      </div>
    </div>
  </div>
</template>

<script lang="js" setup>
  import { computed, defineComponent, ref } from 'vue'
  import useSettingStore from '@/store/modules/setting'
  import { useResizeHandler } from './hooks/useResizeHandler'

  import Main from './Main/index.vue'
  import Sidebar from './Sidebar/index.vue'
  import uHeader from './Header/index.vue'
  import MusicControl from '@/components/MusicControl/index.vue'
  import useMusicStore from '@/store/modules/music'

  const SettingStore = useSettingStore()
  const musicStore = useMusicStore()
  // 是否展示音乐播放器
  const show = computed(() => musicStore.musicList.length > 0)
  // 是否折叠
  const isCollapse = computed(() => {
    return !SettingStore.isCollapse
  })
  let { device } = useResizeHandler()
  // 当屏幕切换的时候进行变换
  const classObj = computed(() => {
    return {
      hideSidebar: !SettingStore.isCollapse,
      openSidebar: SettingStore.isCollapse,
      withoutAnimation: SettingStore.withoutAnimation,
      mobile: device.value === 'mobile',
    }
  })
  // 移动端点击
  const handleClickOutside = () => {
    SettingStore.closeSideBar({ withoutAnimation: false })
  }
  const showTag = computed(() => SettingStore.themeConfig.showTag)

  const mode = computed(() => SettingStore.themeConfig.mode)
</script>

<style lang="scss" scoped>
  .g-container-layout {
    //display: flex;
    height: 100%;
    width: 100%;
    .main-container {
      //overflow: auto;
      display: flex;
      flex: 1;
      box-sizing: border-box;
      flex-direction: column;
    }
    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }
  .sidebar-container {
    display: flex;
    flex-direction: column;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 90;
  }
  .m-container-content {
    display: flex;
    flex: 1;
    position: relative;
    box-sizing: border-box;
  }
</style>
