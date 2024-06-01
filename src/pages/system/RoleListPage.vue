<template>
  <common-list-page ref="compRef" :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig">
    <template v-slot:operation="slotProps">
      <q-btn v-if="hasUpdatePermission" flat dense @click="setPolicy(slotProps.key, slotProps.row)">{{
    $t('system.role.setPolicy') }}</q-btn>
    </template>
    <template v-slot:dialog="slotProps">
      <relation-manage-list v-if="slotProps.dialogType === 'setRelation'" resource="/system/role"
        relationName="policies" relationResource="/system/policy" :resource-id="slotProps.selectedId"
        :relationColumns="relationColumns" :title="$t('system.role.setPolicy') "></relation-manage-list>
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

const i18n = useI18n();
useCommonPage();

const profileStore = useProfileStore()

const compRef = ref();

// 资源名称
const label = i18n.t('system.role.resourceTitle')
// 资源地址
const resource = '/system/role'
// 权限前缀
const permPrefix = 'system:role'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    label: i18n.t('system.role.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.role.name') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.role.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.role.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]
// 关联策略表定义
const relationColumns: M.ResourceTableColumn[] = [
  { name: 'id', label: i18n.t('system.role.policyId'), field: 'id', align: 'left' },
  { name: 'policy', label: i18n.t('system.role.policyName'), field: 'name', sortable: true, align: 'left' },
  { name: 'label', label: i18n.t('system.role.policyLabel'), field: 'label', sortable: true, align: 'left' },
  { name: 'remark', label: i18n.t('pages.remark'), field: 'remark', align: 'left' },
  { name: 'operation', label: i18n.t('pages.Operation'), field: '', align: 'left' },
]

// 是否有更新权限
const hasUpdatePermission = computed(() => {
  return profileStore.hasPerm(permPrefix + C.permissionDel + C.updatePermission)
})

// 设置策略
function setPolicy(key: M.IdType, row: object) {
  compRef.value.updateSelected(key, row)
  compRef.value.updateDialog(true, 'setRelation')
}
</script>
