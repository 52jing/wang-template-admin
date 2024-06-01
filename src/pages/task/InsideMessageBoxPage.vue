<template>
  <q-card class="q-ma-md">
    <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
      narrow-indicator>
      <q-tab name="received" :label="$t('task.message.receivedBox')" />
      <q-tab name="sent" :label="$t('task.message.sentBox')" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="received">
        <div class="q-mb-md">
          <q-toggle v-model="unread" :label="$t('task.message.onlyUnread')" @update:model-value="onChangeUnread" />
          <q-btn flat class="q-ml-sm" @click="onClickAllRead">{{ $t('task.message.markAllRead') }}</q-btn>
          <q-btn flat class="q-ml-sm" @click="onRefreshReceivedMessages">{{ $t('buttons.Refresh') }}</q-btn>
        </div>
        <q-table :rows="receivedMessages" :columns="columns" row-key="id" :rows-per-page-options="pageSizes"
          v-model:pagination="pagination" @request="onRequest">
          <template v-slot:body-cell-title="{ row }">
            <q-td class="q-gutter-sm">
              {{ row.title }}
              <q-badge v-if="!row.readTime" color="red" rounded floating />
            </q-td>
          </template>
          <template v-slot:body-cell-operation="{ key, row }">
            <q-td class="q-gutter-sm">
              <q-btn flat dense @click="onViewRow(key)">{{ $t('buttons.View') }}</q-btn>
              <slot name="operation" :key="key" :row="row"></slot>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

      <q-tab-panel name="sent">
        <div class="q-mb-md">
          <q-btn flat color="primary" @click="onClickSend">{{ $t('task.message.sendMessage') }}</q-btn>
          <q-btn flat class="q-ml-sm" @click="onRefreshSentMessages">{{ $t('buttons.Refresh') }}</q-btn>
        </div>
        <q-table :rows="sentMessages" :columns="columns" row-key="id" :rows-per-page-options="pageSizes"
          v-model:pagination="pagination" @request="onRequest">
          <template v-slot:body-cell-operation="{ key, row }">
            <q-td class="q-gutter-sm">
              <q-btn flat dense @click="onViewRow(key)">{{ $t('buttons.View') }}</q-btn>
              <slot name="operation" :key="key" :row="row"></slot>
            </q-td>
          </template>
        </q-table>
      </q-tab-panel>

    </q-tab-panels>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ $t('task.message.sendMessage') }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input v-model="sendMessageTitle" :label="$t('task.message.title')" />
          <q-input v-model="sendMessageContent" :label="$t('task.message.content')" />
          <user-select v-model="receiver" :label="$t('task.message.receiver')"></user-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :label="$t('buttons.Send')" color="primary" v-close-popup @click="onSend" />
          <q-btn flat :label="$t('buttons.Cancel')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCommonPage } from 'src/utils/uses';
import { restrictLength } from 'src/utils/str';
import { notifySuccess } from 'src/utils/notify';
import { date } from 'quasar'
import * as taskApi from 'src/api/task';
import _ from 'lodash';
import UserSelect from 'src/components/system/UserSelect.vue';

const i18n = useI18n();
const router = useRouter();
useCommonPage();

const tab = ref('received')

const receivedMessages = ref<M.InsideMessage[]>([])
const sentMessages = ref<M.InsideMessage[]>([])
const unread = ref(false)

const columns: M.ResourceTableColumn[] = [
  { name: 'title', align: 'left', label: i18n.t('task.message.title'), field: 'title' },
  { name: 'content', align: 'left', label: i18n.t('task.message.content'), field: 'content', format: (val) => restrictLength(val, 10) + ' ...' },
  { name: 'type', align: 'left', label: i18n.t('task.message.type'), field: 'type' },
  { name: 'fromUser', align: 'left', label: i18n.t('task.message.fromUser'), field: 'fromUser' },
  { name: 'toUser', align: 'left', label: i18n.t('task.message.toUser'), field: 'toUser' },
  {
    name: 'createdTime', align: 'left', label: i18n.t('pages.createdTime'), field: 'createdTime', format: (val) => {
      return date.formatDate(val, C.dateTimeFormat)
    }
  },
  { name: 'operation', align: 'left', label: i18n.t('pages.Operation'), field: '' }
];

const pageSizes = [10, 20, 50];

const pagination = ref({
  sortBy: '',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10
})

const loading = ref(false)

const showDialog = ref(false)
const sendMessageTitle = ref('')
const sendMessageContent = ref('')
const receiver = ref<object | null>(null)

async function loadReceivedMessages(unread: boolean, page: number, pageSize: number) {
  const data = await taskApi.getUserReceivedMessages(unread, page, pageSize)
  receivedMessages.value = <M.InsideMessage[]>data.data.data
  pagination.value.page = data.data.page
  pagination.value.rowsPerPage = data.data.pageSize
  pagination.value.rowsNumber = data.data.total
}

async function loadSentMessages(page: number, pageSize: number) {
  const data = await taskApi.getUserSentMessages(page, pageSize)
  sentMessages.value = <M.InsideMessage[]>data.data.data
  pagination.value.page = data.data.page
  pagination.value.rowsPerPage = data.data.pageSize
  pagination.value.rowsNumber = data.data.total
}

/**
 * 请求事件处理
 * @param requestProp
 */
async function onRequest(requestProp: M.TableRequestProps) {
  const { page, rowsPerPage } = requestProp.pagination

  loading.value = true

  if (tab.value === 'sent') {
    loadSentMessages(page, rowsPerPage);
  } else {
    loadReceivedMessages(unread.value, page, rowsPerPage);
  }

  loading.value = false
}

/**
 * 查看未读消息事件
 * @param val
 */
function onChangeUnread(val: boolean) {
  loadReceivedMessages(val, 1, 10)
}

/**
 * 全部标记已读事件
 */
function onClickAllRead() {
  taskApi.markAllRead().then(() => {
    loadReceivedMessages(unread.value, 1, 10)
  })
}

/**
 * 查看详情事件
 * @param key 消息ID
 */
function onViewRow(key: M.IdType) {
  router.push({ name: C.routeInsideMessageDetailName, params: { id: key } })
}

/**
 * 点击发送站内信事件
 */
function onClickSend() {
  showDialog.value = true;
}

/**
 * 发送站内信
 */
function onSend() {
  const data: M.InsideMessage = {
    id: '',
    title: sendMessageTitle.value,
    content: sendMessageContent.value,
    type: 'message',
    fromUserId: '',
    toUserId: _.get(receiver.value, 'id') ?? '',
    remark: ''
  }
  taskApi.sendMessage(data).then(() => {
    notifySuccess('task.message.sendSuccess')
    onRefreshSentMessages()
  })
}

function onRefreshReceivedMessages() {
  loadReceivedMessages(unread.value, 1, 10)
}

function onRefreshSentMessages() {
  loadSentMessages(1, 10)
}

/**
 * 刷新表格
 */
function refresh() {
  loadReceivedMessages(unread.value, 1, 10)
  loadSentMessages(1, 10)
}

onMounted(() => {
  refresh()
})

</script>
