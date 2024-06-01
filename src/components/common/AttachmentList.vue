<template>
  <q-list v-if="files" :dense="dense" :bordered="bordered" :padding="padding">
    <q-item v-for="item in files" :key="item.id">
      <q-item-section>
        {{ item.originalFilename }} {{ formatFileSize(item.size) }}
      </q-item-section>
      <q-item-section side>
        <q-btn icon="download" size="sm" flat @click="onDownload(item)">{{ $t('buttons.Download') }}</q-btn>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import * as M from 'src/components/models';
import * as commonApi from 'src/api/common';
import { downloadBlobFile } from 'src/utils/obj';

interface Props {
  files?: M.Attachment[]
  dense?: boolean
  bordered?: boolean
  padding?: boolean
}

// 默认值
withDefaults(defineProps<Props>(), {

})

// 事件
const emit = defineEmits<{
  download: [file: M.Attachment]
}>()

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2).toString() + ' MB'
  } else if (size >= 1024) {
    return (size / 1024).toFixed(2).toString() + ' KB'
  } else {
    return size.toString() + ' B'
  }
}

// 下载文件
function downloadFile(id: string) {
  return commonApi.download(id)
}

// 下载事件
function onDownload(item: M.Attachment) {
  emit('download', item)
  downloadFile(item.id).then(res => {
    downloadBlobFile(res)
  })
}
</script>
