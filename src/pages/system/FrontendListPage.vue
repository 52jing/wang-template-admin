<template>
  <common-list-page :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig"></common-list-page>
</template>

<script setup lang="ts">
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';

const i18n = useI18n();
useCommonPage();

// 资源名称
const label = i18n.t('system.frontend.resourceTitle')
// 资源地址
const resource = '/system/frontend'
// 权限前缀
const permPrefix = 'system:frontend'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    required: true,
    label: i18n.t('system.frontend.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'description', align: 'left', label: i18n.t('system.frontend.description'), field: 'description', sortable: true },
  { name: 'author', align: 'left', label: i18n.t('system.frontend.author'), field: 'author', sortable: false },
  { name: 'domain', align: 'left', label: i18n.t('system.frontend.domain'), field: 'domain', sortable: false },
  { name: 'clientType', align: 'left', label: i18n.t('system.frontend.clientType'), field: 'clientType', sortable: true },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.frontend.name') },
  { name: 'description', label: i18n.t('system.frontend.description') },
  { name: 'author', label: i18n.t('system.frontend.author') },
  { name: 'domain', label: i18n.t('system.frontend.domain') },
  { name: 'clientType', label: i18n.t('system.frontend.clientType') },
  { name: 'allowRegister', label: i18n.t('system.frontend.allowRegister') },
  { name: 'staffOnly', label: i18n.t('system.frontend.staffOnly') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.frontend.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.frontend.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  { name: 'description', label: i18n.t('system.frontend.description'), type: 'text' },
  {
    name: 'author', label: i18n.t('system.frontend.author'), type: 'text', rules: [
      val => !val || val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'domain', label: i18n.t('system.frontend.domain'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'clientType', label: i18n.t('system.frontend.clientType'), type: 'system_dict', dictName: 'client_type' },
  { name: 'allowRegister', label: i18n.t('system.frontend.allowRegister'), type: 'text' },
  { name: 'staffOnly', label: i18n.t('system.frontend.staffOnly'), type: 'text' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]
</script>
