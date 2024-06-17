<template>
  <div class="q-mt-md q-ml-md">
    <q-btn color="primary" @click="onStart">{{ $t('template.renderExecution.startExecution') }}</q-btn>
  </div>
  <common-list-page ref="compRef" :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    hide-selection hide-create-btn hide-delete-btn hideViewBtn hideEditBtn>
    <template v-slot:operation="slotProps">
      <q-btn flat dense @click="onView(slotProps.key)">{{
        $t('buttons.View') }}</q-btn>
    </template>
    <template v-slot:dialog="slotProps">
      <q-card v-if="slotProps.dialogType === 'start'">
        <q-card-section>
          <div class="text-h6">{{ $t('template.renderExecution.startExecution') }}</div>
        </q-card-section>
        <q-form @submit.prevent.stop="onSubmitStart">
          <q-card-section>
            <relation-select v-model="startForm.templateId" resource="/template/template"
              :label="$t('template.renderExecution.template')" emit-value map-options
              :rules="[val => val && val.length > 0 || $t('template.renderExecution.selectTemplate')]"></relation-select>
            <relation-select v-model="startForm.datasourceId" resource="/template/datasource"
              :label="$t('template.renderExecution.datasource')" emit-value map-options
              :rules="[val => val && val.length > 0 || $t('template.renderExecution.selectDatasource')]"
              @update:model-value="onChangeDatasource"></relation-select>
            <q-input v-model="startForm.filename" :label="$t('template.renderExecution.filename')"></q-input>
            <template v-if="datasourceParams">
              <div class="text-subtitle1 q-mt-md">{{ $t('template.renderExecution.datasourceParams') }}</div>
              <template v-for="param in datasourceParams" :key="param.id">
                <q-input v-model="startForm.params[param.name]" :label="param.label"></q-input>
              </template>
            </template>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn type="submit" color="primary" :loading="loading">{{ $t('buttons.Create') }}</q-btn>
            <q-btn flat v-close-popup :loading="loading">{{ $t('buttons.Close') }}</q-btn>
          </q-card-actions>
        </q-form>
      </q-card>
    </template>
  </common-list-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import * as M from 'src/components/models';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { useRouter } from 'vue-router';
import RelationSelect from 'src/components/common/RelationSelect.vue';
import { getDatasourceParams, startRenderExecution } from 'src/api/template';
import { notifySuccess } from 'src/utils/notify';

const i18n = useI18n();
useCommonPage();
const router = useRouter();

// 资源名称
const label = i18n.t('template.renderExecution.resourceTitle')
// 资源地址
const resource = '/template/render_execution'
// 权限前缀
const permPrefix = 'template:render_execution'
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'templateName',
    label: i18n.t('template.renderExecution.templateName'),
    align: 'left',
    field: 'templateName'
  },
  { name: 'templateType', align: 'left', label: i18n.t('template.renderExecution.templateType'), field: 'templateType' },
  { name: 'datasourceName', align: 'left', label: i18n.t('template.renderExecution.datasourceName'), field: 'datasourceName' },
  { name: 'datasourceType', align: 'left', label: i18n.t('template.renderExecution.datasourceType'), field: 'datasourceType' },
  { name: 'status', align: 'left', label: i18n.t('template.renderExecution.status'), field: 'status' },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]

const compRef = ref()

const startForm = ref<M.RenderExecutionStart>(new M.RenderExecutionStart())
const datasourceParams = ref<M.DatasourceParam[]>()
const loading = ref(false)

function onStart() {
  compRef.value.updateSelected('', undefined)
  compRef.value.updateDialog(true, 'start')
}

function onView(key: string) {
  router.push({ name: 'renderExecutionDetail', params: { id: key } })
}

function onChangeDatasource() {
  if (startForm.value.datasourceId) {
    getDatasourceParams(startForm.value.datasourceId).then(res => {
      datasourceParams.value = <M.DatasourceParam[]>res.data.data
    })
  }
}

function onSubmitStart() {
  loading.value = true
  startRenderExecution(startForm.value).then(() => {
    notifySuccess('template.renderExecution.startSuccess')
    compRef.value.refresh()
    compRef.value.updateDialog(false, '')
  }).finally(() => {
    loading.value = false
  })
}

</script>
