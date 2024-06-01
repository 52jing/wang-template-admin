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
        <q-btn icon="close" size="sm" flat @click="onDeleteFile(item, idx)"></q-btn>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ValidationRule } from 'quasar'
import { useI18n } from 'vue-i18n';
import _ from 'lodash';
import * as M from 'src/components/models';
import * as commonApi from 'src/api/common';

interface Props {
  // 标签
  label?: string
  // 校验规则
  rules?: ValidationRule[]
  // 类型限制，如 '.jpg, .pdf, image/*'
  accept?: string
  // 初始文件列表
  fileList?: M.Attachment[]
  fileKey?: string
  multiple?: boolean
  // 单个文件限制大小（B）
  maxFileSize?: number
  // 限制文件数量
  maxFiles?: number
  filled?: boolean
  outlined?: boolean
  borderless?: boolean
  standout?: boolean
  loading?: boolean
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  label: '',
  fileKey: 'file'
})

// 事件
const emit = defineEmits<{
  upload: [files: M.Attachment[], file: M.Attachment]
  delete: [file: M.Attachment]
}>()

const i18n = useI18n();

const model = defineModel<string | string[] | undefined>()

const error = ref<boolean | null>(null)
const errorMessage = ref(i18n.t('message.fileExceedMaxNumber', [props.maxFiles]))

const fileModel = ref()
const uploadedFiles = ref<M.Attachment[]>(_.clone(props.fileList ?? []))

async function onUpload(files: File) {
  if (!files) {
    return
  }
  if (props.multiple) {
    if (props.maxFiles && props.maxFiles <= uploadedFiles.value.length) {
      error.value = true
      fileModel.value = null
      return
    } else {
      error.value = null
    }
  }
  const res = await uploadFile(files)
  if (res.data.data) {
    const att = <M.Attachment>res.data.data
    emit('upload', uploadedFiles.value, att)
    if (props.multiple) {
      uploadedFiles.value.push(att)
      model.value = uploadedFiles.value.map(d => d.id)
    } else {
      uploadedFiles.value = [att]
      model.value = uploadedFiles.value[0].id
    }
  }
}

// 上传文件
function uploadFile(file: File) {
  const formData = new FormData()
  formData.append(props.fileKey, file, file.name)
  return commonApi.upload(formData)
}

// 删除事件
function onDeleteFile(item: M.Attachment, idx: number) {
  uploadedFiles.value.splice(idx, 1)
  model.value = uploadedFiles.value.map(d => d.id)
  error.value = null
  emit('delete', item)
}
</script>
