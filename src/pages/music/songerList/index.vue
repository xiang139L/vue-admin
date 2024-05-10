<template>
  <div class="app-container">
    <div class="footer">
      <el-table v-loading="loading" :data="songerList" style="width: 100%" :border="true">
        <el-table-column prop="id" label="歌手id" align="center" />
        <el-table-column prop="name" label="姓名" align="center" />
        <el-table-column prop="singer_category" label="类别" align="center" />
        <el-table-column prop="cat_id" label="类别id" align="center" />
        <el-table-column label="操作" width="300" fixed="right" align="center">
          <template #default="{ row }">
            <el-button @click="confirmEdit(row)">编辑</el-button>
            <el-button type="danger" @click="deleteAction(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogFormVisible" title="编辑歌手信息" width="500">
      <el-form :model="templateData" ref="ruleFormRef">
        <el-form-item label="歌手id" prop="id">
          <el-input v-model="templateData.id" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="templateData.name" />
        </el-form-item>
        <el-form-item label="类别" prop="singer_category">
          <el-input v-model="templateData.singer_category" />
        </el-form-item>
        <el-form-item label="类别id" prop="cat_id">
          <el-input v-model="templateData.cat_id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSingerList, editSingerById, deleteSingerById } from '@/api/modules/music'
import { deepClone } from '@/utils/index'
import type { FormInstance } from 'element-plus'

const songerList = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const total = ref(10)

const dialogFormVisible = ref(false)
const templateData = ref({
  id: '',
  name: '',
  singer_category: '',
  cat_id:'',
})
const ruleFormRef = ref<FormInstance | null>(null)

const getSingerListData = async () => {
  loading.value = true
  const res: any = await getSingerList({
    page: currentPage.value,
    page_size: pageSize
  })
  loading.value = false
  if (res.code != 200) return
  songerList.value = res.data.map(item => ({ ...item, edit: false }))
  total.value = res.total
}

const confirmEdit = (row) => {
  dialogFormVisible.value = true
  templateData.value = deepClone(row)
}

const submitForm = async (formRef: FormInstance | null) => {
  if (formRef) {
    formRef.validate(async (valid) => {
      if (valid) {
        try {
          // 将表单数据映射为所需格式
          const requestData = {
            singer_id: templateData.value.id,
            name: templateData.value.name,
            singer_category: templateData.value.singer_category
          }
          await editSingerById(requestData)
          ElMessage.success('编辑成功')
          dialogFormVisible.value = false
          getSingerListData() // 更新列表数据
        } catch (error) {
          ElMessage.error('编辑失败')
        }
      } else {
        ElMessage.warning('请正确填写表单')
      }
    })
  }
}

const deleteAction = (row) => {
  ElMessageBox.confirm('你确定要删除该歌手吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteSingerById(row.id)
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
.dialog-footer {
  text-align: right;
}
</style>
