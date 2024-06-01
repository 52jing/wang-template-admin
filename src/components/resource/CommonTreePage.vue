<template>
  <div class="q-pa-md">
    <resource-tree-list ref="treeRef" :resource="resource" :perm-prefix="permPrefix" :fields="detailConfig"
      :list-filter="listFilter" :no-nodes-label="noNodesLabel" :accordion="accordion" :no-connectors="noConnectors"
      :text-color="textColor" :selected-color="selectedColor" :dense="dense" :duration="duration"
      :hide-create-root-btn="hideCreateRootBtn" :hide-add-child-btn="hideAddChildBtn" :hide-delete-btn="hideDeleteBtn"
      :hide-edit-btn="hideEditBtn" :hide-refresh-btn="hideRefreshBtn" :after-load="afterLoad"
      :format-detail="formatDetail" :delete-node="deleteNode" load-data-after-mounted @add-root="onAddRoot"
      @add-child="onAddChild" @update="onUpdate" @delete="onDelete"></resource-tree-list>
    <q-dialog v-model="dialogModel" :persistent="dialogPersistent" :full-width="dialogFullWidth">
      <resource-form v-if="dialogType === 'create'" :form-config="createFormConfig" :initObj="<M.Entity>selectedData"
        :type="dialogType" :title="title" @submit="onFormSubmit"></resource-form>
      <resource-form v-if="dialogType === 'edit'" :form-config="editFormConfig" :initObj="<M.Entity>selectedData"
        :type="dialogType" :title="title" @submit="onFormSubmit"></resource-form>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import ResourceTreeList from 'src/components/resource/ResourceTreeList.vue';
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
  // 详情表单字段定义
  detailConfig: M.DetailConfigProps[]
  // 创建表单字段定义
  createFormConfig: M.FormConfigProps[]
  // 更新表单字段定义
  editFormConfig: M.FormConfigProps[]
  // 权限前缀
  permPrefix?: string
  // 列表筛选
  listFilter?: Record<string, unknown>
  // 无节点文字
  noNodesLabel?: string
  // 手风琴模式
  accordion?: boolean
  // 是否显示连接线
  noConnectors?: boolean
  // 文字颜色
  textColor?: string
  // 选中节点文字颜色
  selectedColor?: string
  // 是否紧凑
  dense?: boolean
  // 展开动画时间
  duration?: number
  // 是否显示新建根节点按钮
  hideCreateRootBtn?: boolean
  // 是否显示添加子节点按钮
  hideAddChildBtn?: boolean
  // 是否显示删除按钮
  hideDeleteBtn?: boolean
  // 是否显示编辑按钮
  hideEditBtn?: boolean
  // 是否显示刷新按钮
  hideRefreshBtn?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
  // 查询节点详情处理
  formatDetail?: (data: object) => object
  // 删除处理方法
  deleteNode?: (id: M.IdType, node: object) => void
  // 创建前数据处理
  processCreateData?: (data: object) => object
  // 更新前数据处理
  processUpdateData?: (id: M.IdType, data: object) => object
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

// 事件
const emit = defineEmits<{
  afterCreate: [data: object]
  afterUpdate: [id: M.IdType, data: object]
  onDelete: [id: M.IdType, data: object]
}>()

const i18n = useI18n();

const rest = useRest()
const restApi = rest.restResource(props.resource)

// 选择数据的ID
const selectedId = ref<M.IdType>('')
// 选择的数据
const selectedData = ref<object | undefined>()
// 选择的父节点ID
const selectedParentId = ref<M.IdType | null>(null)
// 表格引用
const treeRef = ref()
// 是否显示弹出框
const dialogModel = ref(false)
// 弹出框类型
const dialogType = ref('')
// 弹出框标题
const title = ref('')
// 弹窗是否不可保持
const dialogPersistent = ref(true)
// 弹窗宽度
const dialogFullWidth = ref(true)

const loading = ref(false)

/**
 * 创建根节点事件处理
 */
function onAddRoot() {
  title.value = i18n.t('pages.Create') + props.label
  updateSelected('', null)
  updateDialog(true, 'create')
}

/**
 * 创建子节点事件处理
 */
function onAddChild(parentId: M.IdType) {
  title.value = i18n.t('pages.Create') + props.label
  updateSelected('', parentId, { parentId })
  updateDialog(true, 'create')
}

/**
 * 编辑事件处理
 * @param id 行主键
 * @param row 行数据
 */
function onUpdate(id: M.IdType, row: object) {
  title.value = i18n.t('pages.Update') + props.label
  updateSelected(id, null, row)
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
      dialogModel.value = false
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
      dialogModel.value = false
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
 * @param parentId 父ID
 * @param data 数据
 */
function updateSelected(id: M.IdType, parentId: M.IdType | null, data?: object) {
  selectedId.value = id
  selectedParentId.value = parentId
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
  treeRef.value.refresh()
}

defineExpose({ updateSelected, updateDialog, refresh })

</script>
