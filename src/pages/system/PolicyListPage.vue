<template>
  <common-list-page ref="compRef" :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig">
    <template v-slot:operation="slotProps">
      <q-btn v-if="hasUpdatePermission" flat dense @click="setPermission(slotProps.key, slotProps.row)">
        <template v-if="slotProps.row.readonly">{{ $t('system.policy.viewPermission') }}</template>
        <template v-else>{{ $t('system.policy.setPermission') }}</template>
      </q-btn>
      <q-btn v-if="hasUpdatePermission" flat dense @click="setMenu(slotProps.key, slotProps.row)">
        <template v-if="slotProps.row.readonly">{{ $t('system.policy.viewMenu') }}</template>
        <template v-else>{{ $t('system.policy.setMenu') }}</template>
      </q-btn>
      <q-btn v-if="hasUpdatePermission" flat dense @click="setDataScope(slotProps.key, slotProps.row)">
        <template v-if="slotProps.row.readonly">{{ $t('system.policy.viewDataScope') }}</template>
        <template v-else>{{ $t('system.policy.setDataScope') }}</template>
      </q-btn>
    </template>
    <template v-slot:dialog="slotProps">
      <relation-manage-list v-if="slotProps.dialogType === 'setPermission'" resource="/system/policy"
        relationName="permissions" relationResource="/system/permission" :resource-id="slotProps.selectedId"
        :relationColumns="relationPermissionColumns" :title="$t('system.policy.setPermission')"
        :readonly="_.get(slotProps.selectedData, 'readonly', false)"></relation-manage-list>
      <relation-manage-list v-if="slotProps.dialogType === 'setMenu'" resource="/system/policy" relationName="menus"
        relationResource="/system/menu" :resource-id="slotProps.selectedId" :relationColumns="relationMenuColumns"
        :title="$t('system.policy.setMenu')"
        :readonly="_.get(slotProps.selectedData, 'readonly', false)"></relation-manage-list>
      <relation-manage-list v-if="slotProps.dialogType === 'setDataScope'" resource="/system/policy"
        relationName="data_scopes" relationResource="/system/data_scope" :resource-id="slotProps.selectedId"
        :relationColumns="relationDataScopeColumns" :title="$t('system.policy.setDataScope')"
        :readonly="_.get(slotProps.selectedData, 'readonly', false)"></relation-manage-list>
    </template>
  </common-list-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import RelationManageList from 'src/components/resource/RelationManageList.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { useProfileStore } from 'src/stores/profile';

import _ from 'lodash';

const i18n = useI18n();
useCommonPage();

const profileStore = useProfileStore()

const compRef = ref();

// 资源名称
const label = i18n.t('system.policy.resourceTitle')
// 资源地址
const resource = '/system/policy'
// 权限前缀
const permPrefix = 'system:policy'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    label: i18n.t('system.policy.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'label', align: 'left', label: i18n.t('system.policy.label'), field: 'label' },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.policy.name') },
  { name: 'label', label: i18n.t('system.policy.label') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.policy.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.policy.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'label', label: i18n.t('system.policy.label'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.policy.inputLabel'),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]
// 关联策略表定义
const relationPermissionColumns: M.ResourceTableColumn[] = [
  { name: 'id', label: i18n.t('system.policy.permissionId'), field: 'id', align: 'left' },
  { name: 'permission', label: i18n.t('system.policy.permissionName'), field: 'name', sortable: true, align: 'left' },
  { name: 'label', label: i18n.t('system.policy.permissionLabel'), field: 'label', sortable: true, align: 'left' },
  { name: 'remark', label: i18n.t('pages.remark'), field: 'remark', align: 'left' },
  { name: 'operation', label: i18n.t('pages.Operation'), field: '', align: 'left' },
]
const relationMenuColumns: M.ResourceTableColumn[] = [
  { name: 'id', label: i18n.t('system.policy.menuId'), field: 'id', align: 'left' },
  { name: 'menu', label: i18n.t('system.policy.menuName'), field: 'name', sortable: true, align: 'left' },
  { name: 'caption', label: i18n.t('system.policy.menuCaption'), field: 'caption', sortable: true, align: 'left' },
  { name: 'remark', label: i18n.t('pages.remark'), field: 'remark', align: 'left' },
  { name: 'operation', label: i18n.t('pages.Operation'), field: '', align: 'left' },
]
const relationDataScopeColumns: M.ResourceTableColumn[] = [
  { name: 'id', label: i18n.t('system.policy.dataScopeId'), field: 'id', align: 'left' },
  { name: 'dataScope', label: i18n.t('system.policy.dataScopeName'), field: 'name', sortable: true, align: 'left' },
  { name: 'remark', label: i18n.t('pages.remark'), field: 'remark', align: 'left' },
  { name: 'operation', label: i18n.t('pages.Operation'), field: '', align: 'left' },
]

// 是否有更新权限
const hasUpdatePermission = computed(() => {
  return profileStore.hasPerm(permPrefix + C.permissionDel + C.updatePermission)
})

// 设置权限
function setPermission(key: M.IdType, row: object) {
  compRef.value.updateSelected(key, row)
  compRef.value.updateDialog(true, 'setPermission')
}
// 设置菜单
function setMenu(key: M.IdType, row: object) {
  compRef.value.updateSelected(key, row)
  compRef.value.updateDialog(true, 'setMenu')
}
// 设置数据权限
function setDataScope(key: M.IdType, row: object) {
  compRef.value.updateSelected(key, row)
  compRef.value.updateDialog(true, 'setDataScope')
}
</script>
