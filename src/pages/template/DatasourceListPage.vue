<template>
  <common-list-page :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :createFormConfig="formConfig" :editFormConfig="formConfig" hideViewBtn>
    <template v-slot:operation="slotProps">
      <q-btn flat dense @click="onViewDatasource(slotProps.key)">{{
        $t('buttons.View') }}</q-btn>
    </template>
  </common-list-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { useRouter } from 'vue-router';
import { datasourceTypes } from 'src/api/template';

const i18n = useI18n();
useCommonPage();
const router = useRouter()

// 资源名称
const label = i18n.t('template.datasource.resourceTitle')
// 资源地址
const resource = '/template/datasource'
// 权限前缀
const permPrefix = 'template:datasource'
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

const types = ref<M.OptionItem[]>(datasourceTypes)

// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'name', label: i18n.t('template.datasource.name'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('template.datasource.inputName'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'type', label: i18n.t('template.datasource.type'), type: 'select', rules: [
      val => val && val.length > 0 || i18n.t('template.datasource.inputType'),
    ], selectOptions: types.value
  },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]

function onViewDatasource(key: M.IdType) {
  router.push({ name: 'datasourceDetail', params: { id: key } })
}

</script>
