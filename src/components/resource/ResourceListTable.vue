<template>
  <div>
    <q-table ref="tableRef" :rows="rows" :columns="columns" :visible-columns="visibleColumns" :row-key="rowKey"
      :rows-per-page-options="pageSizes" :flat="flat" :bordered="bordered" :selection="sel" :loading="loading"
      :filter="searchText" v-model:pagination="pagination" v-model:selected="selectedRows" @request="onRequest">
      <template v-slot:top>
        <q-btn-group class="q-mb-md">
          <q-btn v-if="!hideCreateBtn && hasCreatePermission" text-color="info" :disable="loading" @click="onAddRow">{{
      $t('buttons.New')
    }}</q-btn>
          <q-btn v-if="!hideDeleteBtn && hasDeletePermission" text-color="negative"
            :disable="loading || selectedRows.length === 0" @click="onRemoveSelectedRows">{{
      $t('buttons.DeleteSelected')
    }}</q-btn>
          <q-btn v-if="!hideExportBtn" text-color="secondary" :disable="loading" @click="onExport">{{
      $t('buttons.Export')
    }}</q-btn>
          <q-btn v-if="!hideRefreshBtn" :disable="loading" @click="refresh">{{ $t('buttons.Refresh')
            }}</q-btn>
          <q-btn-dropdown v-if="!hideColumnConfigBtn" :disable="loading" size="sm" icon="fa-solid fa-gear">
            <q-option-group v-model="visibleColumns" :options="availableColConfig" color="green" type="checkbox" />
          </q-btn-dropdown>
        </q-btn-group>
        <q-space></q-space>
        <q-input v-if="!hideSearch" dense debounce="500" color="primary" v-model="searchText">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-icon="{ value }">
        <q-td class="q-gutter-sm">
          <q-icon :name="value"></q-icon>
        </q-td>
      </template>

      <template v-slot:body-cell-operation="{ key, row }">
        <q-td class="q-gutter-sm">
          <q-btn v-if="!hideViewBtn" flat dense @click="onViewRow(key, row)">{{ $t('buttons.View') }}</q-btn>
          <q-btn v-if="!hideEditBtn && hasUpdatePermission && row.readonly !== true" flat dense
            @click="onEditRow(key, row)">{{
      $t('buttons.Edit') }}</q-btn>
          <q-btn v-if="!hideDeleteBtn && hasDeletePermission && row.readonly !== true" flat dense
            @click="onRemoveRow(key, row)">{{
            $t('buttons.Delete') }}</q-btn>
          <slot name="operation" :key="key" :row="row"></slot>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import _ from 'lodash';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useRest } from 'src/utils/uses';
import { notifySuccess } from 'src/utils/notify';
import { camelToSnake } from 'src/utils/str';
import { useProfileStore } from 'src/stores/profile';

interface Props {
  // 资源路径
  resource: string
  // 列配置
  columns: M.ResourceTableColumn[]
  // 行主键子段
  rowKey?: string
  // 每页数量选择数组
  pageSizes?: number[]
  // 列表筛选
  listFilter?: Record<string, unknown>
  // 权限前缀
  permPrefix?: string
  // 是否扁平
  flat?: boolean
  // 是否有边框
  bordered?: boolean
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
  // 挂载后立即载入数据
  loadDataAfterMounted?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
  // 删除处理方法
  deleteRow?: (id: M.IdType, row: object) => void
  // 批量删除处理方法
  batchDeleteRows?: (rows: object[]) => void
};

// 默认值
const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  pageSizes: () => [10, 20, 50, 100],
  flat: false,
  bordered: false,
  hideSelection: false,
  hideCreateBtn: false,
  hideDeleteBtn: false,
  hideExportBtn: false,
  hideViewBtn: false,
  hideEditBtn: false,
  hideRefreshBtn: false,
  hideColumnConfigBtn: false,
  hideSearch: false,
  loadDataAfterMounted: false
});

// 事件
const emit = defineEmits<{
  // 点击查看按钮事件
  view: [id: M.IdType, row: object]
  // 点击编辑按钮事件
  update: [id: M.IdType, row: object]
  // 点击删除按钮事件
  delete: [id: M.IdType, row: object]
  // 点击新增按钮事件
  create: []
  // 点击删除已选按钮事件
  deleteSelected: [rows: object[]]
  // 点击导出按钮事件
  export: []
}>();

const $q = useQuasar();

const i18n = useI18n();

const router = useRouter();

const rest = useRest();
const restApi = rest.restResource(props.resource)

const profileStore = useProfileStore()

const sel = props.hideSelection ? undefined : 'multiple'

const tableRef = ref()

const loading = ref(false)

const rows = ref<object[]>([])

const selectedRows = ref<object[]>([])

let query: string | undefined = ''
const searchText = ref('')

const pagination = ref({
  sortBy: '',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

// 可配置的列
const availableColConfig = ref(props.columns.filter(c => {
  return !c.required
}).map(c => {
  return { label: c.label, value: c.name }
}))

// 显示的列
const visibleColumns = ref(props.columns.filter(c => {
  return !c.hide
}).map(c => {
  return c.name
}))

// 是否有创建权限
const hasCreatePermission = computed(() => {
  if (!props.permPrefix) {
    return true
  }
  return profileStore.hasPerm(props.permPrefix + C.permissionDel + C.createPermission)
})

// 是否有更新权限
const hasUpdatePermission = computed(() => {
  if (!props.permPrefix) {
    return true
  }
  return profileStore.hasPerm(props.permPrefix + C.permissionDel + C.updatePermission)
})

// 是否有删除权限
const hasDeletePermission = computed(() => {
  if (!props.permPrefix) {
    return true
  }
  return profileStore.hasPerm(props.permPrefix + C.permissionDel + C.deletePermission)
})

/**
 * 请求事件处理
 * @param requestProp
 */
async function onRequest(requestProp: M.TableRequestProps) {
  if (loading.value) {
    return
  }
  const { page, rowsPerPage, sortBy, descending } = requestProp.pagination
  let sorts: string[] | undefined = undefined
  if (sortBy) {
    if (descending) {
      sorts = [camelToSnake(sortBy) + '-']
    } else[
      sorts = [camelToSnake(sortBy)]
    ]
  }
  query = requestProp.filter?.toString()
  const filter = props.listFilter

  loading.value = true

  try {
    const data = await restApi.list({ filter, sorts, page, pageSize: rowsPerPage, query, postProcess: props.afterLoad });
    rows.value = data.data
    pagination.value.page = data.page
    pagination.value.rowsPerPage = data.pageSize
    pagination.value.rowsNumber = data.total
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
    loading.value = false
  } catch (e) {
    loading.value = false
  }
}

/**
 * 新增数据
 */
function onAddRow() {
  emit('create')
}

/**
 * 导出数据
 */
function onExport() {
  emit('export')
  restApi.export({ filter: props.listFilter, query: query }).then(data => {
    if (data) {
      $q.dialog({
        title: i18n.t('message.exportingTitle'),
        message: i18n.t('message.exportingMessage'),
        ok: i18n.t('buttons.toDownloadCenter'),
        cancel: true,
      }).onOk(() => {
        // 前往下载中心
        router.push({ name: C.routeDownloadCenterName })
      })
    }
  })
}

/**
 * 删除选中的数据
 */
function onRemoveSelectedRows() {
  if (selectedRows.value.length > 0) {
    emit('deleteSelected', selectedRows.value)
    // 调用批量删除接口
    if (props.batchDeleteRows) {
      // 提供了批量删除方法
      props.batchDeleteRows(selectedRows.value)
    } else {
      // 未提供，使用默认实现
      const ids: M.IdType[] = selectedRows.value.map(item => {
        return _.get(item, props.rowKey)
      })
      $q.dialog({
        title: i18n.t('message.confirmDelete'),
        message: i18n.t('message.confirmDeleteNRecords', [ids.length]),
        ok: {
          color: 'negative'
        },
        cancel: true,
        persistent: true
      }).onOk(() => {
        loading.value = true
        restApi.batchDelete(ids).then(() => {
          selectedRows.value = []
          notifySuccess('message.deleteSuccess')
          refresh()
        }).finally(() => {
          loading.value = false
        })
      })
    }
  }
}

/**
 * 查看数据
 * @param key 行键
 * @param row 行数据
 */
function onViewRow(key: M.IdType, row: object) {
  emit('view', key, row)
}

/**
 * 编辑数据
 * @param key 行键
 * @param row 行数据
 */
function onEditRow(key: M.IdType, row: object) {
  emit('update', key, row)
}

/**
 * 删除数据
 * @param key 行键
 * @param row 行数据
 */
function onRemoveRow(key: M.IdType, row: object) {
  if (key && row) {
    emit('delete', key, row)
    // 调用删除接口
    if (props.deleteRow) {
      // 提供了删除方法
      props.deleteRow(key, row)
    } else {
      // 未提供，使用默认实现
      $q.dialog({
        title: i18n.t('message.confirmDelete'),
        message: i18n.t('message.confirmDeleteRecord', [key]),
        ok: {
          color: 'negative'
        },
        cancel: true,
        persistent: true
      }).onOk(() => {
        loading.value = true
        restApi.delete(key).then(() => {
          selectedRows.value = []
          notifySuccess('message.deleteSuccess')
          refresh()
        }).finally(() => {
          loading.value = false
        })
      })
    }
  }
}

/**
 * 刷新表格
 */
function refresh() {
  tableRef.value.requestServerInteraction()
}

onMounted(() => {
  // 获取数据
  if (props.loadDataAfterMounted) {
    refresh()
  }
})

defineExpose({ refresh })

</script>
