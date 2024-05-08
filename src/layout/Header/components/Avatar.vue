<template>
  <el-dropdown @command="commandAction">
    <span class="el-dropdown-link">
      <el-avatar :size="30" class="avatar" :src="AvatarLogo" />
      {{ userInfo.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :command="2">
          <el-icon><Edit /></el-icon>编辑信息</el-dropdown-item
        >
        <el-dropdown-item :command="1" divided>
          <el-icon><SwitchButton /></el-icon>退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <PersonalDialog ref="person" :onConfirm="editUserInfo" />
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { computed, ref, toRaw } from 'vue'

  import AvatarLogo from '@/assets/logo.svg'
  import useUserStore from '@/store/modules/user'
  import useTagsViewStore from '@/store/modules/tagsView'
  import PersonalDialog from '@/components/Dialog/index.vue'

  import { updateUserInfo, uploadUserPhoto } from '@/api/modules/user'
  const router = useRouter()
  const UserStore = useUserStore()
  const TagsViewStore = useTagsViewStore()

  // 用户信息
  const userInfo = computed(() => UserStore.userInfo)
  const person = ref()

  const logOut = async () => {
    ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        await UserStore.logout()
        await router.push({ path: '/login' })
        TagsViewStore.clearVisitedView()
        ElMessage({
          type: 'success',
          message: '退出登录成功！',
        })
      })
      .catch(() => {})
  }
  const commandAction = (key: number) => {
    switch (key) {
      case 1:
        logOut()
        break
      case 2:
        person.value.show(userInfo.value)
        break
    }
  }
  // 编辑信息
  const editUserInfo = async (data: any) => {
    let res: any = await uploadUserPhoto({
      image: data.avatar_link,
      user_id: data.id,
    })
    data.avatar_link = res.url || ''

    updateUserInfo(data)
      .then((e) => {
        UserStore.setUserInfo(data)
        ElMessage({
          type: 'success',
          message: '修改成功！',
        })
        person.value.hide()
      })
      .catch((e) => {
        console.log(e)

        ElMessage({
          type: 'error',
          message: '修改失败！',
        })
      })
  }
</script>

<style lang="scss" scoped>
  .avatar {
    margin-right: 6px;
  }
  .el-dropdown-link {
    cursor: pointer;
    //color: var(--el-color-primary);
    display: flex;
    align-items: center;
  }
</style>
