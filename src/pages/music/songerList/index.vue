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
      <el-table v-loading="loading" :data="songerList" style="width: 100%" :border="true">
        <el-table-column prop="id" label="歌手id" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="singer_category" label="类别" align="center" />
        <el-table-column prop="operator" label="操作" width="180px" fixed="right" align="center">
          <el-table-column label="操作" width="300">
        <template #default="{ row, $index }">
          <!-- <el-button text bg type="success" @click="playMusic(row, $index)">播放</el-button> -->
          <el-button @click="confirmEdit(row)">编辑</el-button>
          <el-button type="danger" @click="deleteAction(row)">删除</el-button>
        </template>
      </el-table-column>
        </el-table-column>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
        <el-pagination
          v-model:current-page="currentPage"
          :size-page="pageSize"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSingerList, editMusicById, deleteMusicById} from '@/api/modules/music'

const songerList = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const total = ref(10)

const getSingerListData = async () => {
  loading.value = true
  const res: any = await getSingerList({
    page: currentPage.value,
    page_size: pageSize,
  })
  loading.value = false
  if (res.code != 200) return
  songerList.value = res.data.map(item => ({ ...item, edit: false }))
  total.value = res.total
}

const toggleEdit = (row) => {
  row.edit = !row.edit
}

const confirmEdit = async (row) => {
  try {
    await editMusicById(row)
    ElMessage.success('编辑成功')
    row.edit = false
  } catch (error) {
    ElMessage.error('编辑失败')
  }
}

const deleteAction = (row) => {
  ElMessageBox.confirm('你确定要删除该歌手吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    try {
      await deleteMusicById(row.id)
      songerList.value = songerList.value.filter(item => item.id !== row.id)
      ElMessage.success('删除成功')
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getSingerListData()

}
onMounted(() => {
  getSingerListData()
})
</script>
<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
  .footer {
    width: 100%;
  }
}
</style>
