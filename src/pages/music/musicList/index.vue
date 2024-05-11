<template>
  <div class="musicList">
    <div class="header">
      <el-form :inline="true" :model="formInline1">
        <el-form-item label="搜索">
          <el-input v-model="formInline1.query" placeholder="请输入音乐名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="data" style="width: 100%" stripe border v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column v-for="(label, prop) in visibleColumns" :key="prop" :prop="prop" :label="label"
        :formatter="prop === 'Duration' ? formatDuration : undefined"></el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="{ row, $index }">
          <!-- <el-button text bg type="success" @click="playMusic(row, $index)">播放</el-button> -->
          <el-button @click="editMusic(row)">编辑</el-button>
          <el-button type="danger" @click="deleteMusic(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
      <el-pagination v-model:current-page="currentPage" :page-size="pageSize" background layout="prev, pager, next"
        :total="total" @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogFormVisible" width="500" :rule="rule">
      <el-form :model="templateData" ref="ruleFormRef">
        <el-form-item label="音乐地址" prop="SongURL">
          <el-input v-model="templateData.SongURL" />
        </el-form-item>
        <el-form-item label="歌曲名称">
          <el-input v-model="templateData.SongName" prop="SongName" />
        </el-form-item>
        <el-form-item label="翻译名称" prop="TransName">
      ``    <el-input v-model="templateData.TransName" />
        </el-form-item>
        <el-form-item label="别名" prop="Alias">
          <el-input v-model="templateData.Alias" />
        </el-form-item>
        <el-form-item label="时长/ms" prop="Duration">
          <el-input v-model="templateData.Duration" />
        </el-form-item>
        <el-form-item label="歌手ID" prop="SingerID">
          <el-input v-model="templateData.SingerID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { getMusicList, deleteMusicById, editMusicById,searchinfoMusic } from '@/api/modules/music'
import { deleteUser } from '@/api/modules/user' // Import the deleteUser function
import { deepClone, parseTime } from '@/utils/index'
import useMusicStore from '@/store/modules/music'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const pageSize = 10
const currentPage = ref(1)
const data = ref([])
const loading = ref(false)
const musicStore = useMusicStore()
const columns = ref({}) // 声明列值
const total = ref(10)

const formInline1 = ref({ query: '' }) // 搜索表单

onMounted(() => {
  getMusicListData()
})

// 过滤要显示的列，排除 Status 和歌手相关字段
const visibleColumns = computed(() => {
  return columns.value
})

const getMusicListData = async () => {
  loading.value = true
  const params = {
    page: currentPage.value,
    page_size: pageSize,
    query: formInline1.value.query // 加入搜索查询参数
  }
  try {
    let res
    // 如果存在搜索查询条件，使用搜索 API；否则获取默认列表
    if (params.query) {
      res = await searchinfoMusic(params)
    } else {
      res = await getMusicList(params)
    }

    // 确保请求返回的数据有效
    if (res && res.data) {
      total.value = res.count
      columns.value = res.data.songs_columns
      data.value = res.data.songs // 直接赋值数据
    } else {
      ElMessage.warning('未找到相关数据')
    }
  } catch (error) {
    ElMessage.error('无法加载音乐列表数据')
  } finally {
    loading.value = false
  }
}

// 搜索功能
const onSubmit = () => {
  currentPage.value = 1
  getMusicListData()
}

// 时长格式化函数
const formatDuration = (row: any, column: any, cellValue: any) => {
  const durationMs = cellValue
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getMusicListData()
}

const playMusic = (row, index) => {
  musicStore.setCurrentMusic(index)
  nextTick(() => {
    musicStore.playPause(true)
  })
}

const deleteMusic = ({ SongID, SongName }) => {
  ElMessageBox.confirm(`你确定要删除《${SongName}》歌曲吗?`)
    .then(() => {
      deleteMusicById({
        song_id: SongID,
      })
        .then(() => {
          ElMessage.success('删除成功')
          getMusicListData()
        })
        .catch((err) => {
          ElMessage.error(`删除失败: ${err}`)
        })
    })
    .catch(() => {
      // Handle cancelation
    })
}

// 调用 deleteUser 函数进行用户删除
const deleteUserAccount = (userData: Object) => {
  ElMessageBox.confirm(`你确定要删除该用户吗?`)
    .then(() => {
      deleteUser(userData)
        .then(() => {
          ElMessage.success('用户删除成功')
          getMusicListData()
        })
        .catch((err) => {
          ElMessage.error(`删除失败: ${err}`)
        })
    })
    .catch(() => {
      // Handle cancelation
    })
}

const templateData: any = ref({})
const dialogFormVisible = ref(false)
const ruleFormRef = ref(null)
const rule = {
  SongURL: [{ required: true, message: '请输入音乐地址', trigger: 'blur' }],
  SongName: [{ required: true, message: '请输入歌曲名称', trigger: 'blur' }],
  Duration: [{ required: true, message: '请输入时长', trigger: 'blur' }],
  SingerID: [{ required: true, message: '请输入歌手ID', trigger: 'blur' }],
}
const editMusic = (row) => {
  dialogFormVisible.value = true
  templateData.value = deepClone(row)
}
// 提交更改
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      let params = {
        SongURL: templateData.value.SongURL, // 音乐地址
        song_id: templateData.value.SongID,
        SongName: templateData.value.SongName, // 歌名
        TransName: templateData.value.TransName, // 翻译名称
        Alias: templateData.value.Alias,
        Duration: templateData.value.Duration, // 毫秒
        SingerID: templateData.value.SingerID, // 歌手id
      }

      editMusicById(params)
        .then(() => {
          ElMessage.success('修改成功')
          dialogFormVisible.value = false
          getMusicListData()
        })
        .catch((err) => {
          ElMessage.error(`修改失败: ${err}`)
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
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
</style>

