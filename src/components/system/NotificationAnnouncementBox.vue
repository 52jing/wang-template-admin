<template>
  <div>
    <q-dialog v-model="dialogModel" seamless :position="position">
      <q-card :style="{ width }">

        <q-linear-progress :value="progress" color="primary" />

        <q-card-actions align="right">
          <q-btn flat round icon="close" size="sm" v-close-popup></q-btn>
        </q-card-actions>
        <q-card-section>
          <q-list dense padding>
            <q-item v-for="item in displayedAnnouncements" :key="item.id" clickable @click="onView(item)">
              <q-item-section>
                {{ item.title }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

      </q-card>
    </q-dialog>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useRouter } from 'vue-router';
import { saveSession, loadSession } from 'src/utils/storage';
import { getAnnouncements } from 'src/api/common';

interface Props {
  position?: 'top' | 'right' | 'bottom' | 'left'
  width?: string
  // 自动关闭时间（秒），0 不自动关闭
  closeSecs?: number
  // 挂载后立即载入数据
  loadDataAfterMounted?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  position: 'right',
  width: '350px',
  closeSecs: 5
})

// 事件
const emit = defineEmits<{
  view: [data: M.Announcement]
}>()

const router = useRouter();

const dialogModel = ref(false);
const progress = ref(0.01);

const announcements = ref<M.Announcement[]>([])
const displayedAnnouncements = ref<M.Announcement[]>([])

const readIds = ref<string[]>([])

function loadAnnouncements() {
  getAnnouncements('NOTIFICATION').then(res => {
    let data = res.data
    if (props.afterLoad) {
      data = props.afterLoad(data)
    }
    announcements.value = <M.Announcement[]>data.data;
    displayedAnnouncements.value = announcements.value.filter(d => {
      return readIds.value?.indexOf(d.id) < 0
    })
    console.log(displayedAnnouncements.value)
    if (displayedAnnouncements.value.length > 0) {
      dialogModel.value = true
      startCountdown()
      // save read
      const ids = announcements.value.map(d => d.id)
      readIds.value = readIds.value.concat(ids)
      saveSession(C.keyNotification, readIds.value)
    }
  })
}

function loadRead() {
  const val = loadSession(C.keyNotification)
  if (val) {
    readIds.value = <string[]>val
  }
  console.log(readIds.value)
}

function onView(item: M.Announcement) {
  emit('view', item)
  router.push({ name: C.routeAnnouncementDetailName, params: { id: item.id } })
}

function startCountdown() {
  if (props.closeSecs > 0) {
    const tid = setInterval(() => {
      progress.value += 1.0 / props.closeSecs;
      if (progress.value > 1) {
        clearInterval(tid);
        dialogModel.value = false;
      }
    }, 1000)
  }
}

onMounted(() => {
  if (props.loadDataAfterMounted) {
    loadRead()
    loadAnnouncements()
  }
})

</script>
