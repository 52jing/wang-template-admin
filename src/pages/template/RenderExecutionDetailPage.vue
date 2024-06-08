<template>
  <div class="row">
    <div class="col-12">
      <q-card v-if="item" class="q-ma-md">
        <q-card-section>
          <div class="text-h6">
            <span>{{ $t('template.renderExecution.template') }} {{ item.templateName }}</span>
            <span class="q-ml-md">{{ $t('template.renderExecution.datasource') }} {{ item.datasourceName }}</span>
          </div>
          <div class="text-caption">
            {{ $t('template.renderExecution.executionId') }}: {{ item.id }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h6">{{ $t('template.renderExecution.executionParams') }}</div>
          <div>
            {{ item.params }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h6">{{ $t('template.renderExecution.results') }}</div>
          <q-list bordered separator class="q-my-md">
            <q-item v-for="result in results" :key="result.id">
              <q-item-section>
                <q-item-label>{{ result.status }}</q-item-label>
                <q-item-label caption>{{ result.message }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div v-if="result.attachments && result.attachments.length > 0">
                  <q-btn size="sm" icon="download" flat @click="onDownloadResult"></q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import { useCommonPage, useRest } from 'src/utils/uses';
import { getExecutionResults } from 'src/api/template';
import * as commonApi from 'src/api/common';
import { downloadBlobFile } from 'src/utils/obj';

interface Props {
  id: string
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

// 资源地址
const resource = '/template/render_execution'

useCommonPage();
const rest = useRest()
const restApi = rest.restResource(resource)

const item = ref<M.RenderExecution>();
const results = ref<M.ExecutionResult[]>();

function onDownloadResult() {
  if (results.value && results.value.length > 0) {
    const res = results.value[0]
    if (res.attachments && res.attachments.length > 0) {
      const aid = res.attachments[0].id
      commonApi.download(aid).then(res => {
        downloadBlobFile(res)
      })
    }
  }
}

async function loadItem() {
  const res = await restApi.detail(props.id);
  item.value = <M.RenderExecution>res.data;
}

function getResults() {
  getExecutionResults(props.id).then(res => {
    results.value = <M.ExecutionResult[]>res.data.data
  })
}

onMounted(() => {
  loadItem()
  getResults()
})
</script>
