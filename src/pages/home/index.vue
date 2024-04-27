<template>
  <div class="home">
    <header :class="headerClass">
      <img
        class="logo"
        src="../../assets/logo.svg"
        alt="logo"
      />
    </header>
    <div class="container">
      <video
        aria-hidden="true"
        muted
        loop
        autoplay
        playsinline
      >
        <source
          src="../../assets/paper-planes.mp4"
          type="video/mp4"
        />
      </video>
      <div class="mask"></div>
    </div>
    <ul class="footer">
      <li>
        <h3>Pioneering research on the path to AGI</h3>
      </li>
      <li>
        <h3>Transforming work and creativity with AI - Explore our products</h3>
      </li>
      <li>
        <h3>Join us in shaping the future of technology - View careers</h3>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const headerClass = ref('')

onMounted(() => {
  document.addEventListener('scroll', classTrigger)
})
function classTrigger(e) {
  let scrollTop = document.documentElement.scrollTop
  if (scrollTop > 30) {
    headerClass.value = 'transparent'
  } else {
    headerClass.value = ''
  }
}
onUnmounted(() => {
  document.removeEventListener('scroll', classTrigger)
})
</script>
<style scoped lang="scss">
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  header {
    width: 100%;
    position: fixed;
    color: white;
    padding: 20px;
    background: rgba(0, 0, 0);
    transition: background 0.5s;
    z-index: 3;
    .logo {
      color: white;
      width: 126px;
      height: 32px;
    }
  }
  .transparent {
    background-color: transparent;
  }
  .container {
    position: relative;
    video {
      @include full-container;
      width: 100%;
      height: 100%;
      object-fit: cover;
      vertical-align: middle;
    }
    .mask {
      @include full-container(absolute);
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 2;
    }
  }
  .footer {
    @include flex(row, center, center);
    background-color: rgb(0, 0, 0);
    display: flex;
    padding: 20px;
    li {
      line-height: 35px;
      color: white;
      font-size: 20px;
    }
  }
}
</style>
