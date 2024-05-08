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
        <el-table-column prop="id" label="id" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="singer_category" label="类别" align="center" />
        <el-table-column prop="operator" label="操作" width="180px" fixed="right" align="center">
          <template #default="scope">
            <el-button
              v-if="scope.row.edit"
              type="success"
              size="small"
              icon="CircleCheckFilled"
              @click="confirmEdit(scope.row)"
            >
              保存
            </el-button>
            <el-button
              v-else
              type="primary"
              size="small"
              icon="Edit"
              @click="scope.row.edit = !scope.row.edit"
            >
              编辑
            </el-button>

            <el-button type="danger" size="small" icon="Delete" @click="deleteAction(scope.row)">
              删除
            </el-button>
          </template>
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
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getSingerList } from '@/api/modules/music'

  // 获取歌手列表
  const songerList = ref([])
  const loading = ref(false)
  const currentPage = ref(1)
  const pageSize = 10
  const total = ref(10)
  const hasNextOrPrev = ref([false, false])

  const getSingerListData = async () => {
    loading.value = true

    const res: any = await getSingerList({
      page: currentPage.value,
      page_size: pageSize,
    })
    loading.value = false
    if (res.code != 200) return
    songerList.value = [...res.data]
    total.value = res.total
  }
  const handleCurrentChange = (val: number) => {
    currentPage.value = val
    getSingerListData()
  }
  onMounted(() => {
    getSingerListData()
  })
</script>
<style scoped lang="scss"></style>
