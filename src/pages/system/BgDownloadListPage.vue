<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="q-mx-md row q-gutter-md">
        <div class="col-3">
          <q-select v-model="listFilter.status" :options="statusOptions" :label="$t('system.bgTask.status')" clearable
            emit-value map-options></q-select>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.start" :label="$t('system.bgTask.startDate')" mask="date" :rules="['date']"
            clearable>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="listFilter.start">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('buttons.Close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.end" :label="$t('system.bgTask.endDate')" mask="date" :rules="['date']"
            clearable>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="listFilter.end">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label="$t('buttons.Close')" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat @click="onFilter">{{ $t('buttons.Filter') }}</q-btn>
    </q-card-actions>
  </q-card>

  <common-list-page ref="compRef" :label="label" :resource="resource" :columns="columns" :detailConfig="detailConfig"
    :listFilter="listFilter" :hideSearch="true" :hideCreateBtn="true" :hideEditBtn="true" :hideDeleteBtn="true">
    <template v-slot:operation="slotProps">
      <q-btn v-if="slotProps.row.attachments && slotProps.row.attachments.length > 0" flat dense
        @click="downloadAttachment(slotProps.row)">{{
          $t('buttons.Download') }}</q-btn>
    </template>
  </common-list-page>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { date } from 'quasar'
import { download } from 'src/api/common';
import { downloadBlobFile } from 'src/utils/obj';
import _ from 'lodash';

const i18n = useI18n();
useCommonPage();

const compRef = ref();

// 资源名称
const label = i18n.t('system.bgTask.downloadCenterTitle')
// 资源地址
const resource = '/system/bg_task'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id' },
  { name: 'name', align: 'left', label: i18n.t('system.bgTask.name'), field: 'name' },
  { name: 'status', align: 'left', label: i18n.t('system.bgTask.status'), field: 'status' },
  { name: 'createdTime', align: 'left', label: i18n.t('pages.createdTime'), field: 'createdTime', sortable: true, format: (val) => date.formatDate(val, C.dateTimeFormat) },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'name', label: i18n.t('system.bgTask.name') },
  { name: 'status', label: i18n.t('system.bgTask.status') },
  { name: 'type', label: i18n.t('system.bgTask.type') },
  { name: 'result', label: i18n.t('system.bgTask.result') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listFilter = ref<Record<string, any>>({
  type: 'export',  // 仅导出类型
  status: undefined,
  start: undefined,
  end: undefined
})

const statusOptions: M.OptionItem[] = [
  { 'label': '运行中', 'value': 'PENDING' },
  { 'label': '已完成', 'value': 'COMPLETED' },
  { 'label': '已失败', 'value': 'FAILED' },
  { 'label': '已取消', 'value': 'CANCELED' },
]

function onFilter() {
  compRef.value.refresh()
}

// 下载附件
function downloadAttachment(row: object) {
  const attachments: M.Attachment[] = _.get(row, 'attachments')
  if (attachments && attachments.length > 0) {
    // 单个附件
    if (attachments.length === 1) {
      download(attachments[0].id).then(res => {
        downloadBlobFile(res)
      })
    }
  }
}

</script>
