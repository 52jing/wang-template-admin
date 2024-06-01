<template>
  <common-tree-page :label="label" :resource="resource" :perm-prefix="permPrefix" :detailConfig="detailConfig"
    :createFormConfig="formConfig" :editFormConfig="formConfig" @afterCreate="updateAsideMenu"
    @afterUpdate="updateAsideMenu" @onDelete="updateAsideMenu"></common-tree-page>
</template>

<script setup lang="ts">
import CommonTreePage from 'src/components/resource/CommonTreePage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useProfileStore } from 'src/stores/profile';
import { useCommonPage } from 'src/utils/uses';

const i18n = useI18n();
const profileStore = useProfileStore();
useCommonPage();

// 资源名称
const label = i18n.t('system.menu.resourceTitle')
// 资源地址
const resource = '/system/menu'
// 权限前缀
const permPrefix = 'system:menu'
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.menu.name') },
  { name: 'caption', label: i18n.t('system.menu.caption') },
  { name: 'path', label: i18n.t('system.menu.path') },
  { name: 'icon', label: i18n.t('system.menu.icon'), type: 'icon' },
  { name: 'sort', label: i18n.t('system.menu.sort') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.menu.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.menu.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'caption', label: i18n.t('system.menu.caption'), type: 'text', rules: [
      val => !val || val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'path', label: i18n.t('system.menu.path'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'icon', label: i18n.t('system.menu.icon'), type: 'icon_select' },
  { name: 'sort', label: i18n.t('system.menu.sort'), type: 'number' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]

function updateAsideMenu() {
  // 更新菜单
  profileStore.getMyMenus(true)
}

</script>
