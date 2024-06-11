<template>
  <div class="q-pa-md">
    <div class="text-center text-h6 q-pb-md">{{ $t('template.analysis.pageTitle') }}</div>
    <q-tabs v-model="tab" active-color="primary" inline-label>
      <q-tab v-for="item in tabs" :name="item.name" :label="item.label" :key="item.name" />
    </q-tabs>

    <q-separator />

    <div class="q-pa-md" style="max-width: 600px; margin: 0 auto;">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="indicator">
          <q-form @submit="onIndicatorSubmit">
            <q-file filled v-model="indicatorFile" :label="$t('template.analysis.uploadFile')"
              :hint="$t('template.analysis.indicatorUploadHint')" :accept="indicatorAccepts" />
            <div class="text-center q-mt-md">
              <q-btn type="submit" color="primary">{{ $t('buttons.Submit') }}</q-btn>
            </div>
          </q-form>
          <div v-if="results && results.length > 0" class="q-my-md">
            <div class="text-h6">{{ $t('template.analysis.indicatorResult') }}</div>
            <pre v-for="(item, idx) in results" :key="idx">{{ item }}</pre>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import _ from 'lodash';
import * as templateApi from 'src/api/template';

const i18n = useI18n()
useCommonPage()

const tabs = ref([
  { name: 'indicator', label: i18n.t('template.analysis.indicatorAnalysis') },
])
const tab = ref(tabs.value[0].name)

const indicatorAccepts = '.pdf,.doc,.docx,image/*';
const indicatorFile = ref<File>()
const results = ref<string[]>()

function onIndicatorSubmit() {
  const formdata = new FormData();
  console.log(indicatorFile.value)
  if (indicatorFile.value) {
    formdata.append('file', indicatorFile.value, indicatorFile.value.name)
    templateApi.indicatorAnalysis(formdata).then(res => {
      console.log(res.data)
      results.value = []
      for (const cont of res.data.data) {
        if (_.has(cont, 'message')) {
          const msg = _.get(cont, 'message')
          if (_.has(msg, 'content')) {
            results.value.push(_.get(msg, 'content'))
          }
        }
      }
    })
  }
}

</script>
