<template>
  <div class="musicList">
    <div class="header">
        <!-- <el-form :inline="true" :model="formInline1">
          <el-form-item label="姓名">
            <el-input v-model="formInline1.username" placeholder="请输入音乐名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form> -->
      </div>
    <el-table
      :data="data"
      style="width: 100%"
      stripe
      border
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <!-- <el-table-column prop="SongID" label="ID" width="80"></el-table-column>
      <el-table-column prop="SongName" label="歌曲名称"></el-table-column>
      <el-table-column prop="SongURL" label="歌曲链接"></el-table-column>
      <el-table-column prop="Duration" label="时长">
        <template #default="{ row }">{{ parseTime(row.Duration, '{i}:{s}') }}</template>
      </el-table-column> -->
      <el-table-column
        v-for="(label, prop) in columns"
        :key="prop"
        :prop="prop"
        :label="label"
        :formatter="prop === 'Duration' ? formatDuration : undefined"
      ></el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="{ row, $index }">
          <el-button text bg type="success" @click="playMusic(row, $index)">播放</el-button>
          <el-button @click="editMusic(row)">编辑</el-button>
          <el-button type="danger" @click="deleteMusic(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
      <el-button :disabled="!hasNextOrPrev[0]" type="primary" @click="handlePageChange(-1)">上一页</el-button>
      <el-button :disabled="!hasNextOrPrev[1]" type="success" @click="handlePageChange(+1)">下一页</el-button>
    </div> -->
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
    <el-dialog v-model="dialogFormVisible" width="500" :rule="rule">
      <el-form :model="templateData" ref="ruleFormRef">
        <el-form-item label="音乐地址" prop="SongURL">
          <el-input v-model="templateData.SongURL" />
        </el-form-item>
        <el-form-item label="歌曲名称">
          <el-input v-model="templateData.SongName" prop="SongName" />
        </el-form-item>
        <el-form-item label="翻译名称" prop="TransName">
          <el-input v-model="templateData.TransName" />
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
  import { ref, onMounted, nextTick, watch, computed } from 'vue'
  import { getMusicList, getSingerList, deleteMusicById, editMusicById } from '@/api/modules/music'
  import { deepClone, parseTime } from '@/utils/index'
  import useMusicStore from '@/store/modules/music'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import type { FormInstance } from 'element-plus'
  const pageSize = 10
  const currentPage = ref(1)
  const hasNextOrPrev = ref([false, false])
  const data = ref([])
  const loading = ref(false)
  const musicStore = useMusicStore()
  const columns = ref({}) //声明列值
  const total = ref(10)

  onMounted(() => {
    getMusicListData()
  })

  // const getMusicListData = async () => {
  //   loading.value = true
  //   let params = {
  //     page: currentPage.value,
  //     page_size: pageSize,
  //   }
  //   const res: any = await getMusicList(params)
  //   loading.value = false
  //   console.log(res);
  //   // (res)
    
  //   // if (res.code != 200) return
  //   hasNextOrPrev.value = [res.previous, res.next]
  //   console.log(hasNextOrPrev);
  //   data.value = [...res.results]
  //   data.value[0].SongURL =
  //     // 'https://zeromusic.oss-cn-beijing.aliyuncs.com/music/在加纳共和国离婚 (Acoustic Version).mp3'
  //   // data.value[1].SongURL = 'src/assets/music/无名的人-毛不易.128.mp3'
  //   musicStore.setMusicList(data.value)
  //   // const res: any = await getSingerList({
  //   //   page: currentPage.value,
  //   //   page_size: pageSize,
  //   // })

  // }
  //处理列值以及 列值数据
  // 过滤状态为 1 的数据
  // 过滤状态为 1 的数据
  const filteredData = computed(() => {
  return data.value.filter((song) => {
    const matchSongName = !formInline1.value.songName || song.SongName.includes(formInline1.value.songName)
    const matchSingerName = !formInline1.value.singerName || song.singer_name.includes(formInline1.value.singerName)
    return matchSongName && matchSingerName
  })
})

// 过滤要显示的列，排除 Status 和歌手相关字段
const visibleColumns = computed(() => {
  const excludedFields = ['Status', 'SingerID', 'singer_name', 'singer', 'id', 'oss_url']
  return Object.fromEntries(
    Object.entries(columns.value).filter(([key]) => !excludedFields.includes(key))
  )
})

// 初始化表单数据
const initializeFormTemplate = () => {
  const formTemplate = {}
  Object.keys(visibleColumns.value).forEach((key) => {
    formTemplate[key] = ''
  })
  templateData.value = { ...formTemplate }
}

// 移除不需要的字段
const cleanSongData = (songs) => {
  const excludedFields = ['Status', 'SingerID', 'singer_name', 'singer', 'id', 'oss_url']
  return songs.map((song) => {
    const cleanedSong = { ...song }
    excludedFields.forEach((field) => delete cleanedSong[field])
    return cleanedSong
  })
}

// 获取音乐列表数据
const getMusicListData = async () => {
  loading.value = true
  const params = {
    page: currentPage.value,
    page_size: pageSize,
  }
  try {
    const res: any = await getMusicList(params)
    total.value = res.count
    columns.value = res.data.songs_columns
    data.value = cleanSongData(res.data.songs)
    initializeFormTemplate() // 初始化表单数据
  } catch (error) {
    ElMessage.error('无法加载音乐列表数据')
  } finally {
    loading.value = false
  }
}


// 时长格式化函数
const formatDuration = (row: any, column: any, cellValue: any) => {
  const durationMs = cellValue
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

  // const handlePageChange = (val: number) => {
  //   let page = currentPage.value + val
  //   if (page < 1) page = 1
  //   currentPage.value = page
  // }
  // watch(
  //   () => currentPage.value,
  //   () => {
  //     getMusicListData()
  //   },
  // )
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
    ElMessageBox.confirm(`你确定要删除《${SongName}》 歌曲 ?`)
      .then(() => {
        deleteMusicById({
          song_id: SongID,
        })
          .then(() => {
            ElMessage.success('删除成功')
            getMusicListData()
          })
          .catch((err) => {
            ElMessage.error(`删除失败${err}`)
          })
      })
      .catch(() => {
        // catch error
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
          SongURL: templateData.value.SongURL, //音乐地址
          song_id: templateData.value.SongID,
          SongName: templateData.value.SongName, //歌名
          TransName: templateData.value.TransName, //翻译名称
          Alias: templateData.value.Alias,
          Duration: templateData.value.Duration, //毫秒
          SingerID: templateData.value.SingerID, //歌手id
        }

        editMusicById(params)
          .then(() => {
            ElMessage.success('修改成功')
            dialogFormVisible.value = false
            getMusicListData()
          })
          .catch((err) => {
            ElMessage.error(`修改失败${err}`)
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
