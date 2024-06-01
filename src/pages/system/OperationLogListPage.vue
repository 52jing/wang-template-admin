<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="q-mx-md row q-gutter-md">
        <div class="col-3">
          <q-input v-model="listFilter.event" :label="$t('system.operationLog.event')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.resource" :label="$t('system.operationLog.resource')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.resourceId" :label="$t('system.operationLog.resourceId')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.username" :label="$t('system.operationLog.username')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.start" :label="$t('system.operationLog.startDate')" mask="date" :rules="['date']"
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
          <q-input v-model="listFilter.end" :label="$t('system.operationLog.endDate')" mask="date" :rules="['date']"
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
    :listFilter="listFilter" :hideCreateBtn="true" :hideEditBtn="true" :hideDeleteBtn="true"></common-list-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { date } from 'quasar'

const i18n = useI18n();
useCommonPage();

const compRef = ref();

// 资源名称
const label = i18n.t('system.operationLog.resourceTitle')
// 资源地址
const resource = '/log/operation_log'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'event', label: i18n.t('system.operationLog.event'), align: 'left', field: 'event', sortable: true },
  { name: 'resource', align: 'left', label: i18n.t('system.operationLog.resource'), field: 'resource', sortable: true },
  { name: 'resourceId', align: 'left', label: i18n.t('system.operationLog.resourceId'), field: 'resourceId' },
  { name: 'username', align: 'left', label: i18n.t('system.operationLog.username'), field: 'username', sortable: true },
  { name: 'createdTime', align: 'left', label: i18n.t('system.operationLog.createdTime'), field: 'createdTime', sortable: true, format: (val) => date.formatDate(val, C.dateTimeFormat) },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'event', label: i18n.t('system.operationLog.event') },
  { name: 'resource', label: i18n.t('system.operationLog.resource') },
  { name: 'resourceId', label: i18n.t('system.operationLog.resourceId') },
  { name: 'username', label: i18n.t('system.operationLog.username') },
  { name: 'obj', label: i18n.t('system.operationLog.obj'), type: 'textarea', formatter: formatObj },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listFilter = ref<Record<string, any>>({
  event: undefined,
  resource: undefined,
  resourceId: undefined,
  username: undefined,
  start: undefined,
  end: undefined
})

function onFilter() {
  compRef.value.refresh()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatObj(field: string, val: any) {
  if (val) {
    const d = JSON.parse(val)
    delete d.createdBy
    delete d.createdTime
    delete d.updatedBy
    delete d.updatedTime
    delete d.id
    const ss = []
    for (const k in d) {
      ss.push(k + ': ' + d[k])
    }
    return ss.join('\n')
  }
  return ''
}
</script>
