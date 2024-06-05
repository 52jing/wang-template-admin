<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">{{ $t('template.datasource.retrieveData') }}</div>
    </q-card-section>

    <q-form @submit.prevent.stop="onSubmit">
      <q-card-section class="q-pt-none q-gutter-sm scroll">

        <template v-for="param in params" :key="param.id">
          <q-input v-model="formdata[param.name]" :label="param.label"></q-input>
        </template>

      </q-card-section>

      <q-card-section v-if="jsonData">
        <div class="text-subtitle1 q-mb-sm">{{ $t('template.datasource.retrievedData') }}</div>
        <q-scroll-area style="height: 200px;">
          <pre>{{ jsonData }}</pre>
        </q-scroll-area>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn type="submit" color="primary" :loading="loading">{{ $t('buttons.Submit') }}</q-btn>
        <q-btn flat v-close-popup :loading="loading">{{ $t('buttons.Close') }}</q-btn>
      </q-card-actions>
    </q-form>

  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import _ from 'lodash';
import * as M from 'src/components/models';
import { retrieveDatasourceData } from 'src/api/template';

interface Props {
  // 数据源ID
  id: string
  // 数据源参数
  params: M.DatasourceParam[]
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

// 事件
const emit = defineEmits<{
  retrieve: [data: object]
}>()

const formdata = ref(buildFormdata())
const jsonData = ref()
const loading = ref(false)

// 初始化参数
function buildFormdata() {
  const fd = {}
  for (const param of props.params) {
    _.set(fd, param.name, param.defVal ?? '')
  }
  return fd
}

/**
 * 提交事件处理
 */
function onSubmit() {
  loading.value = true
  retrieveDatasourceData(props.id, formdata.value).then(res => {
    const redata = res.data.data
    jsonData.value = JSON.stringify(redata, null, 2)
    loading.value = false
    emit('retrieve', <object>redata)
  })
}

</script>
