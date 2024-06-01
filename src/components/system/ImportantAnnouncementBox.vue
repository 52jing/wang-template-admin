<template>
  <div>
    <q-card v-for="item in announcements" :key="item.id" class="q-mb-md">
      <q-card-section>
        <div class="text-h6">{{ item.title }}</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-html="item.content"></div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat @click="onClick(item)">{{ $t('buttons.View') }}</q-btn>
      </q-card-actions>
    </q-card>
  </div>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useRouter } from 'vue-router';
import { getAnnouncements } from 'src/api/common';

interface Props {
  // 挂载后立即载入数据
  loadDataAfterMounted?: boolean
  // 数据载入后处理，返回处理后的数据
  afterLoad?: (data: M.ResponseListData) => M.ResponseListData
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

// 事件
const emit = defineEmits<{
  view: [data: M.Announcement]
}>()

const router = useRouter();

const announcements = ref<M.Announcement[]>([])

function loadAnnouncements() {
  getAnnouncements('IMPORTANT').then(res => {
    let data = res.data
    if (props.afterLoad) {
      data = props.afterLoad(data)
    }
    announcements.value = <M.Announcement[]>data.data;
  })
}

function onClick(item: M.Announcement) {
  emit('view', item)
  router.push({ name: C.routeAnnouncementDetailName, params: { id: item.id } })
}

onMounted(() => {
  if (props.loadDataAfterMounted) {
    loadAnnouncements()
  }
})

</script>
