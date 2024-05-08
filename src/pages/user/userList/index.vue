<template>
  <div class="app-container">
    <!-- <div class="header">
      <el-form :inline="true" :model="formInline1">
        <el-form-item label="姓名">
          <el-input v-model="formInline1.username" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div> -->
    <div class="footer">
      <el-table v-loading="loading" :data="data" style="width: 100%" :border="true">
        <el-table-column prop="id" width="120" label="id" align="center" />
        <el-table-column prop="username" width="120" label="账号" align="center" />
        <el-table-column prop="nickname" label="名称" width="80" align="center" />
        <el-table-column prop="email" label="邮箱" width="200" align="center" />
        <el-table-column prop="created_at" label="注册日期" width="300" align="center" />
        <el-table-column prop="last_login" label="最后登录时间" align="center" />
        <el-table-column prop="operator" label="操作" width="180px" fixed="right" align="center">
          <template #default="scope">
            <el-button type="primary" size="small" icon="Edit" @click="editUserInfo(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" icon="Delete" @click="deleteAction(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
        <el-button :disabled="!hasNextOrPrev[0]" type="primary" @click="handlePageChange(-1)"
          >上一页</el-button
        >
        <el-button :disabled="!hasNextOrPrev[1]" type="success" @click="handlePageChange(+1)"
          >下一页</el-button
        >
      </div>
    </div>
    <PersonalDialog ref="person" :onConfirm="confirmEdit" />
  </div>
</template>
<script lang="ts" setup name="inline-table">
  import { computed, ref, onMounted, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getUserList } from '@/api/modules/user'
  import PersonalDialog from '@/components/Dialog/index.vue'
  import { updateUserInfo, uploadUserPhoto, deleteUser } from '@/api/modules/user'
  import useUserStore from '@/store/modules/user'
  const data = ref([])
  const currentPage = ref(1)
  const pageSize = 10
  const hasNextOrPrev = ref([false, false])
  onMounted(() => {
    getUserListData()
  })

  const getUserListData = async () => {
    loading.value = true
    let params = {
      page: currentPage.value,
      page_size: pageSize,
    }
    const res: any = await getUserList(params)
    loading.value = false
    if (res.code != 200) return
    hasNextOrPrev.value = [res.data.previous, res.data.next]
    data.value = [...res.data.results]
  }

  const handlePageChange = (val: number) => {
    let page = currentPage.value + val
    if (page < 1) page = 1
    currentPage.value = page
  }

  watch(
    () => currentPage.value,
    () => {
      getUserListData()
    },
  )

  const transData = ref(data)
  const loading = ref(false)
  const person = ref(null)
  const UserStore = useUserStore()
  import { reactive } from 'vue'

  const formInline1 = reactive({
    username: '',
  })

  const onSubmit = () => {
    console.log('submit!')
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 500)
  }
  // 编辑用户信息
  const editUserInfo = async (row) => {
    person.value.show(row)
  }
  const confirmEdit = async (data) => {
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
  const deleteAction = (row) => {
    ElMessageBox.confirm('你确定要删除当用户吗?', '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: true,
    })
      .then(async () => {
        await deleteUser({ user_id: row.id })
          .then(() => {
            getUserListData()
            ElMessage.success('删除成功')
          })
          .catch((err) => {
            ElMessage.error('删除失败')
          })
      })
      .catch(() => {})
  }
</script>

<style scoped lang="scss">
  .header {
    display: flex;
    padding: 16px 16px 0px 16px;
    margin-bottom: 16px;
    border-radius: 4px;
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  }
  .footer {
    flex: 1;
    display: flex;
    padding: 16px;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    background: white;
    box-shadow: 0 0 12px rgb(0 0 0 / 5%);
  }
</style>
