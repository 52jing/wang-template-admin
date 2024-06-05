<template>
  <q-file v-model="fileModel" :label="label" lazy-rules :rules="rules" :accept="accept" :max-file-size="maxFileSize"
    :filled="filled" :outlined="outlined" :borderless="borderless" :standout="standout" :loading="loading"
    :error="error" :error-message="errorMessage" @update:model-value="onUpload">
  </q-file>
  <q-list dense padding>
    <q-item v-for="(item, idx) in uploadedFiles" :key="item.id">
      <q-item-section>
        {{ item.originalFilename }}
      </q-item-section>
      <q-item-section side>
        <div class="row">
          <q-btn v-if="showDownloadBtn" icon="download" size="sm" flat @click="onDownload(item)"></q-btn>
          <q-btn v-if="showDeleteBtn" icon="close" size="sm" flat @click="onDeleteFile(item, idx)"></q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ValidationRule } from 'quasar'
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import * as M from 'src/components/models';
import * as commonApi from 'src/api/common';
import { downloadBlobFile } from 'src/utils/obj';

interface Props {
  // 标签
  label?: string
  // 校验规则
  rules?: ValidationRule[]
  // 类型限制，如 '.jpg, .pdf, image/*'
  accept?: string
  // 初始文件列表
  fileList?: M.Attachment[]
  // 上传类型
  uploadType?: string
  fileKey?: string
  typeKey?: string
  // 单个文件限制大小（B）
  maxFileSize?: number
  // 限制文件数量
  maxFiles?: number
  // 显示下载按钮
  showDownloadBtn?: boolean
  // 显示删除按钮
  showDeleteBtn?: boolean
  filled?: boolean
  outlined?: boolean
  borderless?: boolean
  standout?: boolean
  loading?: boolean
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  label: '',
  fileKey: 'file',
  typeKey: 'type'
})

// 事件
const emit = defineEmits<{
  upload: [files: M.Attachment[], file: M.Attachment]
  delete: [file: M.Attachment]
}>()

const i18n = useI18n();

const error = ref<boolean | null>(null)
const errorMessage = ref(i18n.t('message.fileExceedMaxNumber', [props.maxFiles]))

const fileModel = ref()
// 已上传文件列表
const uploadedFiles = defineModel<M.Attachment[]>({ default: [] })

// 上传事件处理
async function onUpload(file: File) {
  if (!file) {
    return
  }
  if (props.maxFiles && props.maxFiles <= uploadedFiles.value.length) {
    error.value = true
    fileModel.value = null
    return
  } else {
    error.value = null
  }
  const res = await uploadFile(file, props.uploadType)
  if (res.data.data) {
    const att = <M.Attachment>res.data.data
    emit('upload', uploadedFiles.value, att)
    uploadedFiles.value.push(att)
  }
}

// 上传文件
function uploadFile(file: File, type?: string) {
  const formData = new FormData()
  formData.append(props.fileKey, file, file.name)
  if (type) {
    formData.append(props.typeKey, type)
  }
  return commonApi.upload(formData)
}

// 下载事件
function onDownload(item: M.Attachment) {
  commonApi.download(item.id).then(res => {
    downloadBlobFile(res)
  })
}

// 删除事件
function onDeleteFile(item: M.Attachment, idx: number) {
  uploadedFiles.value.splice(idx, 1)
  error.value = null
  emit('delete', item)
}

// 载入文件列表
function loadFileList() {
  uploadedFiles.value = _.clone(props.fileList ?? [])
}

onMounted(() => {
  loadFileList()
})

defineExpose({ loadFileList })
</script>
