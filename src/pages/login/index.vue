<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <img src="@/assets/image/login/side-logo.png" />
      </div>
      <div class="rollbox" :class="{ box_rolling: isRolling }">
        <div class="login-form rollbox_front">
          <div class="login-title">
            <!-- <img class="icon" src="@/assets/logo.svg" alt="logo" /> -->
            <h2 class="title">登录</h2>
          </div>
          <LoginForm />
          <el-text type="primary" style="cursor: pointer" @click="isRolling = !isRolling" tag="ins">
            <el-icon>
              <Plus />
            </el-icon>
            没有账号?注册一个
          </el-text>
        </div>
        <div class="login-form rollbox_behind" style="height: 400px">
          <div class="login-title">
            <h2 class="title">注册</h2>
          </div>
          <RegisterForm />
          <el-text type="success" style="cursor: pointer" @click="isRolling = !isRolling" tag="ins">
            <el-icon>
              <Select />
            </el-icon>
            已有账号?登录
          </el-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import LoginForm from './components/LoginForm.vue'
  import RegisterForm from './components/RegisterForm.vue'
  import SwitchDark from '@/components/SwitchDark/index.vue'
  import { ref } from 'vue'
  const isRolling = ref(false)
</script>
<style lang="scss" scoped>
  @import './index';
</style>
