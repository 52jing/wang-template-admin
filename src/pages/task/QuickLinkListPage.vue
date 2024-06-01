<template>
  <common-list-page :label="label" :resource="resource" :columns="columns" :detailConfig="detailConfig"
    :createFormConfig="formConfig" :editFormConfig="formConfig"></common-list-page>
</template>

<script setup lang="ts">
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';

const i18n = useI18n();
useCommonPage();

// 资源名称
const label = i18n.t('task.quickLink.title')
// 资源地址
const resource = '/task/quick_link'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    label: i18n.t('task.quickLink.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'icon', align: 'left', label: i18n.t('task.quickLink.icon'), field: 'icon' },
  { name: 'path', align: 'left', label: i18n.t('task.quickLink.path'), field: 'path' },
  { name: 'sort', align: 'left', label: i18n.t('task.quickLink.sort'), field: 'sort', sortable: true },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('task.quickLink.name') },
  { name: 'icon', label: i18n.t('task.quickLink.icon'), type: 'icon' },
  { name: 'path', label: i18n.t('task.quickLink.path') },
  { name: 'sort', label: i18n.t('task.quickLink.sort') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('task.quickLink.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('task.quickLink.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'icon', label: i18n.t('task.quickLink.icon'), type: 'icon_select', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  {
    name: 'path', label: i18n.t('task.quickLink.path'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'sort', label: i18n.t('task.quickLink.sort'), type: 'number' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'text' }
]
</script>
