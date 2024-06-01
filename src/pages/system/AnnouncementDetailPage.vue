<template>
  <q-card v-if="item" class="q-ma-md">
    <q-card-section>
      <div class="text-h6">{{ item.title }}</div>
      <div class="text-subtitle2">{{ item.type }} {{ $t('system.announcement.publishedAt') }} {{ publishedTime }}
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-html="item.content"></div>
      <div v-if="attachmentsArr && attachmentsArr.length > 0" class="q-mt-md">
        <div class="text-subtitle1">{{ $t('pages.attachments') }}</div>
        <attachment-list :files="attachmentsArr" dense></attachment-list>
      </div>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { date } from 'quasar'
import { useCommonPage } from 'src/utils/uses';
import { getAnnouncement } from 'src/api/common';
import AttachmentList from 'src/components/common/AttachmentList.vue';

interface Props {
  id: string
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

useCommonPage();

const item = ref<M.Announcement>();

const publishedTime = computed(() => {
  if (item.value) {
    return date.formatDate(item.value?.createdTime, C.dateFormat);
  } else {
    return '';
  }
})

const attachmentsArr = computed(() => {
  if (item.value) {
    return item.value.attachments
  }
  return undefined
})

function loadItem() {
  getAnnouncement(props.id).then(res => {
    item.value = <M.Announcement>res.data.data;
  })
}

onMounted(() => {
  loadItem()
})
</script>
