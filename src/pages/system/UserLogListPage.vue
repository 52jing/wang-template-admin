<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="q-mx-md row q-gutter-md">
        <div class="col-3">
          <q-input v-model="listFilter.event" :label="$t('system.userLog.event')" clearable></q-input>
        </div>
        <div class="col-3">
          <system-dict-select v-model="listFilter.status" name="log_status" :label="$t('system.userLog.status')"
            emitValue mapOptions clearable></system-dict-select>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.username" :label="$t('system.userLog.username')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.frontendName" :label="$t('system.userLog.frontendName')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.ip" :label="$t('system.userLog.ip')" clearable></q-input>
        </div>
        <div class="col-3">
          <q-input v-model="listFilter.start" :label="$t('system.userLog.startDate')" mask="date" :rules="['date']"
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
          <q-input v-model="listFilter.end" :label="$t('system.userLog.endDate')" mask="date" :rules="['date']"
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
import SystemDictSelect from 'src/components/common/SystemDictSelect.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { date } from 'quasar'

const i18n = useI18n();
useCommonPage();

const compRef = ref();

// 资源名称
const label = i18n.t('system.userLog.resourceTitle')
// 资源地址
const resource = '/log/user_log'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'event', label: i18n.t('system.userLog.event'), align: 'left', field: 'event', sortable: true },
  { name: 'status', align: 'left', label: i18n.t('system.userLog.status'), field: 'status', sortable: true },
  { name: 'username', align: 'left', label: i18n.t('system.userLog.username'), field: 'username', sortable: true },
  { name: 'frontendName', align: 'left', label: i18n.t('system.userLog.frontendName'), field: 'frontendName', sortable: true, hide: true },
  { name: 'ip', align: 'left', label: i18n.t('system.userLog.ip'), field: 'ip' },
  { name: 'ua', align: 'left', label: i18n.t('system.userLog.ua'), field: 'ua', hide: true },
  { name: 'message', align: 'left', label: i18n.t('system.userLog.message'), field: 'message', hide: true },
  { name: 'createdTime', align: 'left', label: i18n.t('system.userLog.createdTime'), field: 'createdTime', sortable: true, format: (val) => date.formatDate(val, C.dateTimeFormat) },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'event', label: i18n.t('system.userLog.event') },
  { name: 'status', label: i18n.t('system.userLog.status') },
  { name: 'userId', label: i18n.t('system.userLog.userId') },
  { name: 'username', label: i18n.t('system.userLog.username') },
  { name: 'frontendId', label: i18n.t('system.userLog.frontendId') },
  { name: 'frontendName', label: i18n.t('system.userLog.frontendName') },
  { name: 'ip', label: i18n.t('system.userLog.ip') },
  { name: 'ua', label: i18n.t('system.userLog.ua') },
  { name: 'message', label: i18n.t('system.userLog.message') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listFilter = ref<Record<string, any>>({
  event: undefined,
  status: undefined,
  username: undefined,
  frontendName: undefined,
  ip: undefined,
  start: undefined,
  end: undefined
})

function onFilter() {
  compRef.value.refresh()
}
</script>
