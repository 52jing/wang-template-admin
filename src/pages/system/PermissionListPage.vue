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
const label = i18n.t('system.permission.resourceTitle')
// 资源地址
const resource = '/system/permission'
// 权限前缀
const permPrefix = 'system:permission'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    label: i18n.t('system.permission.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'label', align: 'left', label: i18n.t('system.permission.label'), field: 'label' },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.permission.name') },
  { name: 'label', label: i18n.t('system.permission.label') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.permission.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.permission.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'label', label: i18n.t('system.permission.label'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.permission.inputLabel'),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]
</script>
