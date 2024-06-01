<template>
  <q-card>
    <q-card-section v-if="!hideTitle">
      <div class="text-h6">{{ title ?? $t('pages.Update') }}</div>
    </q-card-section>

    <q-card-section :style="{ maxHeight: contentMaxHeight }" class="q-pt-none q-gutter-sm scroll">

      <q-table :rows="rows" :columns="relationColumns" :rows-per-page-options="pageSizes" row-key="id" flat>
        <template v-slot:top>
          <relation-select v-if="!readonly" v-model="selectedData" :resource="relationResource"></relation-select>
          <q-btn v-if="!readonly" text-color="info" flat class="q-ml-sm" @click="onAddRow">{{ $t('buttons.Add')
            }}</q-btn>
          <q-btn flat @click="refresh">{{ $t('buttons.Refresh') }}</q-btn>
        </template>
        <template v-slot:body-cell-operation="{ key, row }">
          <q-td class="q-gutter-sm">
            <q-btn v-if="!readonly" flat dense @click="onRemoveRow(key)">{{ $t('buttons.Delete') }}</q-btn>
            <slot name="operation" :key="key" :row="row"></slot>
          </q-td>
        </template>
      </q-table>

    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn v-close-popup @click="onConfirm" color="primary">{{ $t('buttons.Confirm') }}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import RelationSelect from 'src/components/common/RelationSelect.vue';
import { useRest } from 'src/utils/uses';
import { notifySuccess } from 'src/utils/notify';

interface Props {
  // 主资源地址
  resource: string;
  // 关联资源名
  relationName: string;
  // 关联资源地址
  relationResource: string;
  // 主资源 ID
  resourceId: M.IdType;
  // 关联资源列定义
  relationColumns: M.ResourceTableColumn[];
  // 标题
  title?: string
  // 是否隐藏标题
  hideTitle?: boolean
  // 是否只读
  readonly?: boolean
  // 每页数量选择数组
  pageSizes?: number[]
  // 内容最大高度
  contentMaxHeight?: string
  // 是否使用 filled 样式
  filled?: boolean
  // 是否使用 outlined 样式
  outlined?: boolean
  // 是否使用 borderless 样式
  borderless?: boolean
  // 是否使用 standout 样式
  standout?: boolean
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [5, 10, 20, 0],
  readonly: false,
  contentMaxHeight: '50vh',
})

// 事件
const emit = defineEmits<{
  add: [id: M.IdType]
  delete: [id: M.IdType]
  confirm: [rows: object[]]
}>()

const rest = useRest();
const relationApi = rest.restRelation(props.resource, props.relationName);

const rows = ref<object[]>([])

const selectedData = ref<M.Entity>()

/**
 * 刷新列表
 */
function refresh() {
  if (props.resourceId) {
    relationApi.list(props.resourceId).then(data => {
      rows.value = <object[]>data.data
    })
  }
}

/**
 * 添加事件处理
 */
function onAddRow() {
  selectedData.value?.id
  if (selectedData.value) {
    const rid = <M.IdType>selectedData.value.id
    relationApi.add(props.resourceId, [rid]).then(data => {
      if (data.data) {
        emit('add', rid)
        notifySuccess('message.addSuccess')
        refresh()
      }
    })
  }
}

/**
 * 删除事件处理
 * @param key 删除 ID
 */
function onRemoveRow(key: M.IdType) {
  if (props.resourceId && key) {
    relationApi.delete(props.resourceId, [key]).then(data => {
      if (data.data) {
        emit('delete', key)
        notifySuccess('message.deleteSuccess');
        refresh()
      }
    })
  }
}

/**
 * 确认事件处理
 */
function onConfirm() {
  emit('confirm', rows.value)
}

onMounted(() => {
  refresh()
})
</script>
