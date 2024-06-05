<template>
  <common-list-page :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig"></common-list-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { getTemplateTypes } from 'src/api/template';

const i18n = useI18n();
useCommonPage();

// 资源名称
const label = i18n.t('template.template.resourceTitle')
// 资源地址
const resource = '/template/template'
// 权限前缀
const permPrefix = 'template:template'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    label: i18n.t('template.template.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'type', align: 'left', label: i18n.t('template.template.type'), field: 'type', sortable: true },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('template.template.name') },
  { name: 'type', label: i18n.t('template.template.type') },
  { name: 'defFilename', label: i18n.t('template.template.defFilename') },
  { name: 'attachments', label: i18n.t('pages.attachments'), type: 'attachment' },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
const templateTypes = ref<M.OptionItem[]>()
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('template.template.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('template.template.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'type', label: i18n.t('template.template.type'), type: 'select', rules: [
      val => val && val.length > 0 || i18n.t('template.template.inputType'),
    ], selectOptions: () => templateTypes.value ?? []
  },
  {
    name: 'defFilename', label: i18n.t('template.template.defFilename'), type: 'text', rules: [
      val => !val || val.length <= 100 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'attachments', label: i18n.t('pages.attachments'), type: 'attachment', uploadType: 'template', maxFiles: 1 },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]

onBeforeMount(() => {
  getTemplateTypes().then(res => {
    templateTypes.value = res.data.data.map(d => { return { label: d, value: d } })
  })
})
</script>
