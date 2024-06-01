<template>
  <common-tree-page :label="label" :resource="resource" :perm-prefix="permPrefix" :detailConfig="detailConfig"
    :createFormConfig="formConfig" :editFormConfig="formConfig"></common-tree-page>
</template>

<script setup lang="ts">
import CommonTreePage from 'src/components/resource/CommonTreePage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';

const i18n = useI18n();
useCommonPage();

// 资源名称
const label = i18n.t('system.department.resourceTitle')
// 资源地址
const resource = '/system/department'
// 权限前缀
const permPrefix = 'system:department'
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.department.name') },
  { name: 'fullname', label: i18n.t('system.department.fullname') },
  { name: 'leader', label: i18n.t('system.department.leader') },
  { name: 'sort', label: i18n.t('system.department.sort') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.department.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.department.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'fullname', label: i18n.t('system.department.fullname'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  {
    name: 'leader', label: i18n.t('system.department.leader'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'sort', label: i18n.t('system.department.sort'), type: 'number' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]
</script>
