<template>
    <div class="app-container">
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
        <div class="footer">
            <el-table :data="songerList" style="width: 100%" stripe border v-loading="loading"
                element-loading-text="拼命加载中">
                <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop"
                    :label="column.label"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template #default="{ row }">
                        <el-button @click="confirmEdit(row)">编辑</el-button>
                        <el-button type="danger" @click="deleteAction(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div style="width: 100%; display: flex; justify-content: center; padding-top: 20px">
                <el-pagination v-model:current-page="currentPage" :page-size="pageSize" background
                    layout="prev, pager, next" :total="total" @current-change="handleCurrentChange" />
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
                <el-form-item label="歌手的简短描述" prop="briefdesc">
                    <el-input v-model="templateData.briefdesc" />
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
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getSingerList, editSingerById, deleteSingerById, searchinfoSinger } from '@/api/modules/music'
import { deepClone } from '@/utils/index'
import type { FormInstance } from 'element-plus'

const songerList = ref<any[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 10
const total = ref(10)
const columns = ref([]) // 声明列值
// const columns = ref([])


const dialogFormVisible = ref(false)
const visibleColumns = computed(() => {
    return columns.value.map(column => ({
        prop: column.prop,
        label: column.label
    }));
});
const templateData = ref({
    id: '',
    name: '',
    singer_category: '',
    cat_id: '',
    briefdesc: '',
    picurl: ''
})
const formInline1 = ref({ query: '' }) // 搜索表单
const ruleFormRef = ref<FormInstance | null>(null)

// const visibleColumns = computed(() => {
//   return columns.value
// })

const onSubmit = () => {
    currentPage.value = 1
    getSingerListData()
}
const getSingerListData = async () => {
    loading.value = true
    const params = {
        page: currentPage.value,
        page_size: pageSize,
        query: formInline1.value.query // 加入搜索查询参数
    }
    try {
        let res;
        // 根据是否存在搜索条件，调用相应的API
        if (params.query) {
            res = await searchinfoSinger(params);
        } else {
            res = await getSingerList(params);
        }

        // 处理API响应
        if (res && res.data && res.data.length > 0) {
            total.value = res.total;  // 更新总条目数
            // 构建表格列信息，确保后端返回的字段名与前端期望一致
            columns.value = Object.entries(res.singer_columns).map(([key, label]) => ({
                prop: key,  // 使用后端定义的属性名
                label: label  // 使用后端提供的中文描述作为列名
            }));
            songerList.value = res.data;  // 更新歌手列表数据
        } else {
            ElMessage.warning('未找到相关数据');
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        ElMessage.error('加载数据时出错');
    } finally {
        loading.value = false;  // 确保加载状态被正确更新
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
                await deleteSingerById(row.id);
                songerList.value = songerList.value.filter(item => item.id !== row.id);
                ElMessage.success('删除成功');
            } catch (error) {
                ElMessage.error('删除失败: ' + error.message);
            }
        }).catch(() => {
            ElMessage.info('已取消删除');
        });
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
