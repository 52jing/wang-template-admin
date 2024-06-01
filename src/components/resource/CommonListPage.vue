<template>
  <div class="q-pa-md">
    <resource-list-table ref="tableRef" :columns="columns" :resource="resource" :perm-prefix="permPrefix"
      :list-filter="listFilter" :hide-selection="hideSelection" :hide-create-btn="hideCreateBtn"
      :hide-delete-btn="hideDeleteBtn" :hide-export-btn="hideExportBtn" :hide-view-btn="hideViewBtn"
      :hide-edit-btn="hideEditBtn" :hide-refresh-btn="hideRefreshBtn" :hide-column-config-btn="hideColumnConfigBtn"
      :hide-search="hideSearch" :after-load="afterLoad" :delete-row="deleteRow" :batch-delete-rows="batchDeleteRows"
      flat load-data-after-mounted @view="onView" @create="onCreate" @update="onUpdate" @delete="onDelete"
      @delete-selected="onDeleteSelected" @export="onExport">
      <template v-slot:operation="slotProps">
        <slot name="operation" :key="slotProps.key" :row="slotProps.row"></slot>
      </template>
    </resource-list-table>
    <q-dialog v-model="dialogModel" :persistent="dialogPersistent" :full-width="dialogFullWidth">
      <resource-detail-list v-if="detailConfig && dialogType === 'view'" :title="title" :fields="detailConfig"
        :data="selectedData" bordered></resource-detail-list>
      <resource-form v-else-if="createFormConfig && dialogType === 'create'" :form-config="createFormConfig"
        :initObj="<M.Entity>initNewData" :type="dialogType" :title="title" :loading="loading"
        @submit="onFormSubmit"></resource-form>
      <resource-form v-else-if="editFormConfig && dialogType === 'edit'" :form-config="editFormConfig"
        :initObj="<M.Entity>selectedData" :type="dialogType" :title="title" :loading="loading"
        @submit="onFormSubmit"></resource-form>
      <slot name="dialog" :dialogType="dialogType" :selectedId="selectedId" :selectedData="selectedData"></slot>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import ResourceListTable from 'src/components/resource/ResourceListTable.vue';
import ResourceDetailList from 'src/components/resource/ResourceDetailList.vue';
import ResourceForm from 'src/components/resource/ResourceForm.vue';
import { ref } from 'vue'
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useRest } from 'src/utils/uses';
import { notifySuccess } from 'src/utils/notify';
import _ from 'lodash';

interface Props {
  // 资源名称
  label: string
  // 资源地址
  resource: string
  // 表格列定义
  columns: M.ResourceTableColumn[]
  // 详情表单字段定义
  detailConfig?: M.DetailConfigProps[]
  // 创建表单字段定义
  createFormConfig?: M.FormConfigProps[]
  // 更新表单字段定义
  editFormConfig?: M.FormConfigProps[]
  // 权限前缀
  permPrefix?: string
  // 创建初始化对象
  initNewData?: object
  // 查看详情时请求数据，默认否
  requestDetail?: boolean
  // 列表筛选
  listFilter?: Record<string, unknown>
  // 是否显示选择框
  hideSelection?: boolean
  // 是否显示新建按钮
  hideCreateBtn?: boolean
  // 是否显示删除按钮
  hideDeleteBtn?: boolean
  // 是否显示导出按钮
  hideExportBtn?: boolean
  // 是否显示查看按钮
  hideViewBtn?: boolean
  // 是否显示编辑按钮
  hideEditBtn?: boolean
  // 是否显示刷新按钮
  hideRefreshBtn?: boolean
  // 是否显示列配置按钮
  hideColumnConfigBtn?: boolean
  // 是否显示搜索框
  hideSearch?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
  // 删除处理方法
  deleteRow?: (id: M.IdType, row: object) => void
  // 批量删除处理方法
  batchDeleteRows?: (rows: object[]) => void
  // 查看前数据处理
  processViewData?: (id: M.IdType, data: object) => object
  // 创建前数据处理
  processCreateData?: (data: object) => object
  // 更新前数据处理
  processUpdateData?: (id: M.IdType, data: object) => object
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  hideExportBtn: true
})

// 事件
const emit = defineEmits<{
  afterCreate: [data: object]
  afterUpdate: [id: M.IdType, data: object]
  onDelete: [id: M.IdType, data: object]
  onDeleteSelected: [rows: object[]]
  onExport: []
}>()

const i18n = useI18n();

const rest = useRest()
const restApi = rest.restResource(props.resource)

// 选择数据的ID
const selectedId = ref<M.IdType>('')
// 选择的数据
const selectedData = ref<object | undefined>()
// 表格引用
const tableRef = ref()
// 是否显示弹出框
const dialogModel = ref(false)
// 弹出框类型
const dialogType = ref('')
// 弹窗是否不可保持
const dialogPersistent = ref(true)
// 弹窗宽度
const dialogFullWidth = ref(true)
// 弹出框标题
const title = ref('')

const loading = ref(false)

/**
 * 查看事件处理
 * @param id 行主键
 * @param row 行数据
 */
async function onView(id: M.IdType, row: object) {
  title.value = i18n.t('pages.View') + props.label
  let d = row
  if (props.requestDetail) {
    const res = await restApi.detail(id)
    if (res.data) {
      d = res.data
    }
  }
  if (props.processViewData) {
    d = props.processViewData(id, row)
  }
  updateSelected(id, d)
  updateDialog(true, 'view')
}

/**
 * 创建事件处理
 */
function onCreate() {
  title.value = i18n.t('pages.Create') + props.label
  updateSelected('', undefined)
  updateDialog(true, 'create')
}

/**
 * 编辑事件处理
 * @param id 行主键
 * @param row 行数据
 */
async function onUpdate(id: M.IdType, row: object) {
  title.value = i18n.t('pages.Update') + props.label
  let d = row
  if (props.requestDetail) {
    const res = await restApi.detail(id)
    if (res.data) {
      d = res.data
    }
  }
  updateSelected(id, d)
  updateDialog(true, 'edit')
}

/**
 * 删除事件处理
 * @param id 行主键
 * @param row 行数据
 */
function onDelete(id: M.IdType, row: object) {
  emit('onDelete', id, row)
}

/**
 * 删除已选事件处理
 * @param rows 已选数据
 */
function onDeleteSelected(rows: object[]) {
  emit('onDeleteSelected', rows)
}

/**
 * 导出事件处理
 */
function onExport() {
  emit('onExport')
}

/**
 * 表单提交事件处理
 * @param data 待处理的对象
 */
function onFormSubmit(data: object) {
  if (!data || _.isEmpty(data)) {
    return
  }
  if (dialogType.value === 'create') {
    // 创建前数据处理
    if (props.processCreateData) {
      data = props.processCreateData(data)
    }
    loading.value = true
    // 创建
    restApi.create(data).then(() => {
      loading.value = false
      updateDialog(false, '')
      notifySuccess('message.createSuccess')
      refresh()
      emit('afterCreate', data)
    }).catch(() => {
      loading.value = false
    })
  } else if (dialogType.value === 'edit' && selectedId.value) {
    // 更新前数据处理
    if (props.processUpdateData) {
      data = props.processUpdateData(selectedId.value, data)
    }
    loading.value = true
    // 更新
    restApi.update(selectedId.value, data).then(() => {
      loading.value = false
      updateDialog(false, '')
      notifySuccess('message.updateSuccess')
      refresh()
      emit('afterUpdate', selectedId.value, data)
    }).catch(() => {
      loading.value = false
    })
  }
}

/**
 * 修改所选择数据
 * @param id ID
 * @param data 数据
 */
function updateSelected(id: M.IdType, data?: object) {
  selectedId.value = id
  selectedData.value = data
}

/**
 * 修改弹出框
 * @param model 模式
 * @param type 类型
 */
function updateDialog(model: boolean, type: string, persistent = true, fullWidth = true) {
  dialogModel.value = model
  dialogType.value = type
  dialogPersistent.value = persistent
  dialogFullWidth.value = fullWidth
}

function refresh() {
  tableRef.value.refresh()
}

defineExpose({ updateSelected, updateDialog, refresh })

</script>
