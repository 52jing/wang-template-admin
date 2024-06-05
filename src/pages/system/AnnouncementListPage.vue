<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="q-mx-md row q-gutter-md">
        <div class="col-3">
          <system-dict-select v-model="listFilter.type" name="announcement_type" :label="$t('system.announcement.type')"
            emitValue mapOptions clearable></system-dict-select>
        </div>
        <div class="col-3">
          <q-select v-model="listFilter.display" :options="YesNoOptions" :label="$t('system.announcement.display')"
            clearable emit-value map-options></q-select>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat @click="onFilter">{{ $t('buttons.Filter') }}</q-btn>
    </q-card-actions>
  </q-card>

  <common-list-page ref="compRef" :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig" :initNewData="initNewData"
    :listFilter="listFilter" :requestDetail="true"></common-list-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import SystemDictSelect from 'src/components/common/SystemDictSelect.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';

const i18n = useI18n();
useCommonPage();

// 资源名称
const label = i18n.t('system.announcement.resourceTitle')
// 资源地址
const resource = '/system/announcement'
// 权限前缀
const permPrefix = 'system:announcement'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'title',
    label: i18n.t('system.announcement.title'),
    align: 'left',
    field: 'title'
  },
  { name: 'type', align: 'left', label: i18n.t('system.announcement.type'), field: 'type', sortable: true },
  { name: 'display', align: 'left', label: i18n.t('system.announcement.display'), field: 'display', format: (val) => val ? i18n.t('yes') : i18n.t('no') },
  { name: 'sort', align: 'left', label: i18n.t('system.announcement.sort'), field: 'sort', sortable: true },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'title', label: i18n.t('system.announcement.title') },
  { name: 'content', label: i18n.t('system.announcement.content'), type: 'editor' },
  { name: 'type', label: i18n.t('system.announcement.type') },
  { name: 'display', label: i18n.t('system.announcement.display'), type: 'bool' },
  { name: 'sort', label: i18n.t('system.announcement.sort') },
  { name: 'attachments', label: i18n.t('pages.attachments'), type: 'attachment' },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'title', label: i18n.t('system.announcement.title'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.announcement.inputTitle'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'content', label: i18n.t('system.announcement.content'), type: 'editor' },
  {
    name: 'type', label: i18n.t('system.announcement.type'), type: 'system_dict', dictName: 'announcement_type'
  },
  { name: 'display', label: i18n.t('system.announcement.display'), type: 'checkbox' },
  { name: 'sort', label: i18n.t('system.announcement.sort'), type: 'number' },
  { name: 'attachments', label: i18n.t('pages.attachments'), type: 'attachment', uploadType: 'announcement' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true }
]
// 创建初始化对象
const initNewData = { display: true, content: '' }

const YesNoOptions = [
  { label: i18n.t('yes'), value: true },
  { label: i18n.t('no'), value: false },
]

const compRef = ref()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listFilter = ref<Record<string, any>>({
  type: undefined,
  display: undefined
})

function onFilter() {
  compRef.value.refresh()
}
</script>
