<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="q-mx-md row q-gutter-md">
        <div class="col-3">
          <q-input v-model="listFilter.dictGroup" :label="$t('system.userDict.dictGroup')" clearable></q-input>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat @click="onFilter">{{ $t('buttons.Filter') }}</q-btn>
    </q-card-actions>
  </q-card>

  <common-list-page ref="compRef" :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig"
    :listFilter="listFilter"></common-list-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';

const i18n = useI18n();
useCommonPage();

// 资源名称
const label = i18n.t('system.userDict.resourceTitle')
// 资源地址
const resource = '/system/user_dict'
// 权限前缀
const permPrefix = 'system:user_dict'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'name',
    label: i18n.t('system.userDict.name'),
    align: 'left',
    field: 'name',
    sortable: true
  },
  { name: 'dictGroup', align: 'left', label: i18n.t('system.userDict.dictGroup'), field: 'dictGroup' },
  { name: 'dictCode', align: 'left', label: i18n.t('system.userDict.dictCode'), field: 'dictCode' },
  { name: 'dictVal', hide: true, align: 'left', label: i18n.t('system.userDict.dictVal'), field: 'dictVal' },
  { name: 'dictType', hide: true, align: 'left', label: i18n.t('system.userDict.dictType'), field: 'dictType' },
  { name: 'sort', hide: true, align: 'left', label: i18n.t('system.userDict.sort'), field: 'sort' },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.userDict.name') },
  { name: 'dictGroup', label: i18n.t('system.userDict.dictGroup') },
  { name: 'dictCode', label: i18n.t('system.userDict.dictCode') },
  { name: 'dictVal', label: i18n.t('system.userDict.dictVal') },
  { name: 'dictType', label: i18n.t('system.userDict.dictType') },
  { name: 'sort', label: i18n.t('system.userDict.sort') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('system.userDict.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.userDict.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'dictGroup', label: i18n.t('system.userDict.dictGroup'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.userDict.inputDictGroup'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'dictCode', label: i18n.t('system.userDict.dictCode'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.userDict.inputDictCode'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  { name: 'dictVal', label: i18n.t('system.userDict.dictVal'), type: 'text' },
  {
    name: 'dictType', label: i18n.t('system.userDict.dictType'), type: 'system_dict', dictName: 'param_type'
  },
  { name: 'sort', label: i18n.t('system.userDict.sort'), type: 'number' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]

const compRef = ref();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listFilter = ref<Record<string, any>>({
  dictGroup: undefined
})

function onFilter() {
  compRef.value.refresh()
}
</script>
