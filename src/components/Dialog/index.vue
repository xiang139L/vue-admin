<template>
  <el-dialog v-model="visible" title="编辑信息" width="40%" style="padding: 50px">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
      class="demo-ruleForm"
      :size="formSize"
    >
      <el-form-item label="id">
        <el-input v-model="ruleForm.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="ruleForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload
          action="#"
          :auto-upload="false"
          :on-change="onChange"
          :show-file-list="false"
          accept="image/*"
          class="avatar-uploader"
        >
          <img v-if="ruleForm.avatar_link" :src="ruleForm.avatar_link" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="名称" prop="nickname">
        <el-input v-model="ruleForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio value="0">女</el-radio>
          <el-radio value="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
  import { ref, defineExpose, reactive, toRefs } from 'vue'
  import type { ElForm } from 'element-plus'
  import { deepClone } from '@/utils/index'

  const props = defineProps({
    onConfirm: {
      type: Function,
      default: () => {},
    },
  })
  const { onConfirm } = props
  const ruleForm: any = ref(null)
  const visible = ref(false)
  const show = (data) => {
    ruleForm.value = deepClone(data)
    console.log(ruleForm.value)
    visible.value = true
  }
  const hide = () => {
    visible.value = false
  }
  type FormInstance = InstanceType<typeof ElForm>

  const formSize = ref('')
  const ruleFormRef = ref<FormInstance>()

  const rules = {
    nickname: [
      {
        required: true,
        message: '请输入昵称',
        trigger: 'blur',
      },
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change '] },
    ],
    sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
  }

  const onChange = (file: any) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file.raw)
    fileReader.onload = () => {
      ruleForm.value.avatar_link = fileReader.result as string
    }
  }
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        onConfirm(deepClone(ruleForm.value))
      } else {
        console.log('error submit!')
        return false
      }
    })
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }

  defineExpose({
    show,
    hide,
  })
</script>

<style scoped lang="scss">
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  .avatar-uploader {
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    :deep(.el-upload:hover) {
      border-color: var(--el-color-primary);
    }
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
  }
</style>
