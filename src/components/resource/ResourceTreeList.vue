<template>
  <div>
    <q-splitter v-model="splitterModel">
      <template v-slot:before>
        <div class="q-pa-sm">
          <q-tree v-if="displayTree" ref="treeRef" :nodes="nodes" :node-key="nodeKey" :label-key="labelKey"
            :children-key="childrenKey" :no-nodes-label="noNodesLabel" :accordion="accordion"
            :no-connectors="noConnectors" :text-color="textColor" :selected-color="selectedColor" :dense="dense"
            :duration="duration" v-model:selected="selectedKey" default-expand-all @lazy-load="onLazyLoad"
            @update:selected="onUpdateSelected">
          </q-tree>
        </div>
      </template>

      <template v-slot:after>
        <div class="q-pa-sm">
          <q-btn-group class="q-mb-md">
            <q-btn v-if="!hideCreateRootBtn && hasCreatePermission" text-color="info" @click="onAddRoot">{{
      $t('buttons.NewRoot') }}</q-btn>
            <q-btn v-if="!hideAddChildBtn && hasCreatePermission" :disable="!selectedKey" text-color="secondary"
              @click="onAddChild">{{
      $t('buttons.AddChild')
    }}</q-btn>
            <q-btn v-if="!hideEditBtn && hasUpdatePermission" :disable="!selectedKey" text-color="accent"
              @click="onEditNode">{{
      $t('buttons.Edit')
    }}</q-btn>
            <q-btn v-if="!hideDeleteBtn && hasDeletePermission" :disable="!selectedKey" text-color="negative"
              @click="onDeleteNode">{{
      $t('buttons.Delete') }}</q-btn>
            <q-btn v-if="!hideRefreshBtn" @click="refresh">{{ $t('buttons.Refresh')
              }}</q-btn>
          </q-btn-group>
          <resource-detail-list v-if="selectedNode" :fields="fields" :data="selectedNode" :bordered="bordered" flat
            hideTitle hide-close-btn content-max-height="70vh"></resource-detail-list>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useRest } from 'src/utils/uses';
import { useProfileStore } from 'src/stores/profile';
import { notifySuccess } from 'src/utils/notify';
import { listToTreeNodes } from 'src/utils/obj';
import ResourceDetailList from 'src/components/resource/ResourceDetailList.vue'

/**
 * 树懒加载参数
 */
interface LazyLoadDetails {
  /**
   * The node to which the new nodes (the children) will be appended
   */
  node: object;
  /**
   * The key of the node getting the newly loaded child nodes
   */
  key: string;
  /**
   * The callback to be carried out when the loading is successful
   * @param children Array of nodes
   */
  done: (children?: readonly object[]) => void;
  /**
   * The callback to be carried out should the loading fails
   */
  fail: () => void;
}

interface Props {
  // 资源路径
  resource: string
  // 右侧详情字段定义
  fields: M.DetailConfigProps[]
  // 权限前缀
  permPrefix?: string
  // ID 字段名
  nodeKey?: string
  // 名称字段名
  labelKey?: string
  // 子节点数组字段名
  childrenKey?: string
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
  // 是否有边框
  bordered?: boolean
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
  // 挂载后立即载入数据
  loadDataAfterMounted?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
  // 查询节点详情处理
  formatDetail?: (data: object) => object
  // 删除处理方法
  deleteNode?: (id: M.IdType, node: object) => void
};

// 默认值
const props = withDefaults(defineProps<Props>(), {
  nodeKey: 'id',
  labelKey: 'name',
  childrenKey: 'children',
  accordion: false,
  noConnectors: false,
  selectedColor: 'primary',
  dense: false,
  bordered: false,
  hideCreateRootBtn: false,
  hideAddChildBtn: false,
  hideDeleteBtn: false,
  hideEditBtn: false,
  hideRefreshBtn: false,
  loadDataAfterMounted: false
});

// 事件
const emit = defineEmits<{
  // 点击新增根节点按钮事件
  addRoot: []
  // 点击添加子节点按钮事件
  addChild: [parentId: M.IdType, parent: object]
  // 点击编辑按钮事件
  update: [id: M.IdType, row: object]
  // 点击删除按钮事件
  delete: [id: M.IdType, row: object]
}>();

const $q = useQuasar();

const i18n = useI18n();

const rest = useRest();
const restApi = rest.restResource(props.resource)

const profileStore = useProfileStore()

const treeRef = ref()

// 左边树组件占比
const splitterModel = ref(30)

// 树组件节点
const nodes = ref<object[]>([])
const displayTree = ref(false)

// 树组件选择的节点ID
const selectedKey = ref<M.IdType>('')

// 右侧节点详情数据
const selectedNode = ref<object | null>(null)

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
 * 懒加载事件处理
 */
function onLazyLoad(details: LazyLoadDetails) {
  if (details.key) {
    restApi.getChildren(details.key, { postProcess: props.afterLoad }).then(data => {
      details.done(listToTreeNodes(data.data, true))
    }).catch(() => {
      details.fail()
    })
  }
}

/**
 * 查看节点详情事件处理
 */
function onUpdateSelected(key: M.IdType) {
  if (key) {
    restApi.detail(key).then(data => {
      if (props.formatDetail) {
        selectedNode.value = props.formatDetail(data.data)
      } else {
        selectedNode.value = data.data
      }
    })
  } else {
    selectedNode.value = null
  }
}

/**
 * 添加根节点事件处理
 */
function onAddRoot() {
  emit('addRoot')
}

/**
 * 添加子节点事件处理
 */
function onAddChild() {
  if (selectedKey.value && selectedNode.value) {
    emit('addChild', selectedKey.value, selectedNode.value)
  }
}

/**
 * 编辑节点事件处理
 */
function onEditNode() {
  if (selectedKey.value && selectedNode.value) {
    emit('update', selectedKey.value, selectedNode.value)
  }
}

/**
 * 删除节点事件处理
 */
function onDeleteNode() {
  if (selectedKey.value && selectedNode.value) {
    emit('delete', selectedKey.value, selectedNode.value)
    // 调用删除接口
    if (props.deleteNode) {
      // 提供了删除方法
      props.deleteNode(selectedKey.value, selectedNode.value)
    } else {
      // 未提供，使用默认实现
      $q.dialog({
        title: i18n.t('message.confirmDelete'),
        message: i18n.t('message.confirmDeleteRecord', [_.get(selectedNode.value, props.labelKey, '')]),
        ok: {
          color: 'negative'
        },
        cancel: true,
        persistent: true
      }).onOk(() => {
        restApi.delete(selectedKey.value).then(() => {
          notifySuccess('message.deleteSuccess')
          refresh()
        })
      })
    }
  }
}

/**
 * 刷新
 */
function refresh() {
  displayTree.value = false
  restApi.listRoot().then(data => {
    selectedKey.value = ''
    selectedNode.value = null
    nodes.value = listToTreeNodes(data.data, true)
    displayTree.value = true
  })
}

onMounted(() => {
  // 获取数据
  if (props.loadDataAfterMounted) {
    refresh()
  }
})

defineExpose({ refresh })

</script>
