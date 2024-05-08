<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0">
    <el-form-item label="" prop="username">
      <el-input
        placeholder="请输入账户名"
        autoComplete="on"
        style="position: relative"
        v-model="ruleForm.username"
        @keyup.enter.native="submitForm(ruleFormRef)"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><UserFilled /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="password">
      <el-input
        placeholder="请输入密码"
        autoComplete="on"
        @keyup.enter.native="submitForm(ruleFormRef)"
        v-model="ruleForm.password"
        :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="" prop="confirmPassword">
      <el-input
        placeholder="请确认密码"
        autoComplete="on"
        @keyup.enter.native="submitForm(ruleFormRef)"
        v-model="ruleForm.confirmPassword"
        :type="passwordType"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><GoodsFilled /></el-icon>
        </template>
        <template #suffix>
          <div class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button
        :loading="loading"
        class="login-btn"
        type="success"
        @click="submitForm(ruleFormRef)"
        >注册</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElNotification } from 'element-plus'
  import { useRouter, useRoute } from 'vue-router'
  import useUserStore from '@/store/modules/user'
  import { getTimeState } from '@/utils/index'
  import { register } from '@/api/modules/user'

  const ruleFormRef = ref(null)
  const router = useRouter()
  const route = useRoute()
  const UserStore = useUserStore()

  const passwordType = ref('password')
  const loading = ref(false)
  const validateConfirmPassword = (rule, value, callback) => {
    console.log(value, 'value')
    if (value !== ruleForm.password) {
      callback(new Error('两次输入密码不一致!'))
    } else {
      callback()
    }
  }
  // 表单验证规则
  const rules = reactive({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      { validator: validateConfirmPassword, trigger: 'submit' },
    ],
  })
  // 表单数据
  const ruleForm = reactive({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const showPwd = () => {
    if (passwordType.value === 'password') {
      passwordType.value = ''
    } else {
      passwordType.value = 'password'
    }
  }
  const submitForm = (formEl) => {
    loading.value = true
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        // 注册
        register({
          username: ruleForm.username,
          password: ruleForm.password,
        })
          .then(async (res) => {
            await UserStore.login(ruleForm)
            await router.push({
              path: route.query.redirect?.toString() || '/',
            })
            ElNotification({
              title: getTimeState(),
              message: '欢迎登录 Vue Admin Perfect',
              type: 'success',
              duration: 3000,
            })
            // router.push('/')
            loading.value = false
          })
          .catch((e) => {
            console.log(e)
            loading.value = false
          })
      } else {
        console.log('error submit!')
        loading.value = false
        return false
      }
    })
  }
</script>

<style lang="scss" scoped>
  @import '../index.scss';
</style>
