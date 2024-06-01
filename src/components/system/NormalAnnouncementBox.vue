<template>
  <div>
    <q-banner v-for="item in display" :key="item.id" :class="bannerClass">
      {{ item.title }}
      <template v-slot:action>
        <q-btn flat :color="buttonColor" :label="$t('buttons.View')" @click="onView(item)" />
        <q-btn flat :color="buttonColor" :label="$t('buttons.Close')" @click="onClose(item)" />
      </template>
    </q-banner>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useRouter } from 'vue-router';
import { getAnnouncements } from 'src/api/common';

interface Props {
  bannerClass?: string
  buttonColor?: string
  // 挂载后立即载入数据
  loadDataAfterMounted?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  bannerClass: 'bg-primary text-white q-mb-md',
  buttonColor: 'white'
})

// 事件
const emit = defineEmits<{
  view: [data: M.Announcement]
  close: [data: M.Announcement]
}>()

const router = useRouter();

const announcements = ref<M.Announcement[]>([])
const closedIndex = ref<Set<M.IdType>>(new Set())
const display = computed(() => {
  return announcements.value.filter(d => !closedIndex.value.has(d.id))
})

function loadAnnouncements() {
  getAnnouncements('NORMAL').then(res => {
    let data = res.data
    if (props.afterLoad) {
      data = props.afterLoad(data)
    }
    announcements.value = <M.Announcement[]>data.data;
  })
}

function onView(item: M.Announcement) {
  emit('view', item)
  router.push({ name: C.routeAnnouncementDetailName, params: { id: item.id } })
}

function onClose(item: M.Announcement) {
  emit('close', item)
  closedIndex.value.add(item.id)
}

onMounted(() => {
  if (props.loadDataAfterMounted) {
    loadAnnouncements()
  }
})

</script>
