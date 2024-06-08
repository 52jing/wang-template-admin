<template>
  <div class="row">
    <div class="col-7">
      <q-card v-if="item" class="q-ma-md">
        <q-card-section>
          <div class="text-h6">{{ item.name }}</div>
          <div class="text-subtitle2">
            {{ datasourceType }}
          </div>
          <div>
            <span v-if="item.connected"><q-icon name="check" color="positive"></q-icon> {{
              $t('template.datasource.isConnected')
            }}</span>
            <span v-else><q-icon name="warning" color="warning"></q-icon> {{ $t('template.datasource.notConfiged')
              }}<span class="q-ml-sm">({{ $t('template.datasource.configTips') }})</span></span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="text-h6">{{ $t('template.datasource.paramList') }}</div>
          <div class="q-mt-md">
            <q-btn @click="onAddParam">{{ $t('template.datasource.addParam') }}</q-btn>
          </div>
          <q-list bordered separator class="q-my-md">
            <q-item v-for="param in datasourceParams" :key="param.id">
              <q-item-section>
                <q-item-label>{{ param.label }}</q-item-label>
                <q-item-label caption>{{ param.name }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div>
                  <q-btn size="sm" icon="edit" flat @click="onEditParam(param)"></q-btn>
                  <q-btn size="sm" icon="close" flat @click="onDeleteParam(param)"></q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

      </q-card>
    </div>
    <div class="col-5">
      <q-card class="q-ma-md">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ $t('pages.Operation') }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section>{{ $t('template.datasource.configDatasource') }}</q-item-section>
              <q-item-section side>
                <q-btn color="primary" @click="onConfigure">{{ $t('template.datasource.config') }}</q-btn>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>{{ $t('template.datasource.testRetrieveData') }}</q-item-section>
              <q-item-section side>
                <q-btn color="primary" @click="onTest">{{ $t('template.datasource.test') }}</q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-dialog v-model="configDialogVisible" persistent full-width>
    <q-card v-if="item">
      <q-card-section>
        <div class="text-h6">{{ $t('template.datasource.configDatasource') }}</div>
      </q-card-section>
      <q-form @submit.prevent.stop="onConfigSubmit">
        <q-card-section v-if="item.type === 'db_sql'">

          <q-select v-model="configForm.dbType" :label="$t('template.datasource.dbType')" :options="supportedDatabase"
            emit-value map-options
            :rules="[val => val && val.length > 0 || $t('template.datasource.selectConfigDbType')]"></q-select>
          <q-input v-model="configForm.url" :label="$t('template.datasource.dbUrl')"
            :hint="$t('template.datasource.dbUrlHint')"
            :rules="[val => val && val.length > 0 || $t('template.datasource.inputConfigDbUrl')]"></q-input>
          <q-input v-model="configForm.username" :label="$t('template.datasource.username')"
            :rules="[val => val && val.length > 0 || $t('template.datasource.inputConfigUsername')]"></q-input>
          <q-input v-model="configForm.password" :label="$t('template.datasource.password')" type="password"
            :rules="[val => val && val.length > 0 || $t('template.datasource.inputConfigPassword')]"></q-input>
          <q-input v-model="configForm.sql" :label="$t('template.datasource.sql')" type="textarea"
            :hint="$t('template.datasource.sqlHint')"
            :rules="[val => val && val.length > 0 || $t('template.datasource.inputConfigSql')]"></q-input>
          <q-checkbox v-model="configForm.expandOnOne" :label="$t('template.datasource.expandOnOne')" />

        </q-card-section>
        <q-card-actions align="right">
          <q-btn type="submit" color="primary">{{ $t('buttons.Submit') }}</q-btn>
          <q-btn flat v-close-popup>{{ $t('buttons.Close') }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="paramDialogVisible" persistent full-width>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('template.datasource.editParam') }}</div>
      </q-card-section>
      <q-form @submit.prevent.stop="onEditParamSubmit">
        <q-card-section v-if="paramForm">
          <q-input v-model="paramForm.name" :label="$t('template.datasource.paramName')"
            :rules="[val => val && val.length > 0 || $t('template.datasource.inputParamName')]"></q-input>
          <q-input v-model="paramForm.label" :label="$t('template.datasource.paramLabel')"
            :rules="[val => val && val.length > 0 || $t('template.datasource.inputParamLabel')]"></q-input>
          <q-input v-model="paramForm.defVal" :label="$t('template.datasource.paramDefVal')"></q-input>
          <q-checkbox left-label v-model="paramForm.required" :label="$t('template.datasource.paramRequired')" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn type="submit" color="primary">{{ $t('buttons.Submit') }}</q-btn>
          <q-btn flat v-close-popup>{{ $t('buttons.Close') }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-dialog v-model="testDialogVisible" persistent full-width>
    <datasource-test-form v-if="item" :id="item.id" :params="datasourceParams"></datasource-test-form>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import { notifySuccess } from 'src/utils/notify';
import { useCommonPage, useRest } from 'src/utils/uses';
import DatasourceTestForm from 'src/components/template/DatasourceTestForm.vue';
import { datasourceTypes, supportedDatabase, getDatasourceParams, addDatasourceParams, updateDatasourceParams, deleteDatasourceParams, connectDatasource } from 'src/api/template';

interface Props {
  id: string
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

// 资源地址
const resource = '/template/datasource'

useCommonPage();
const rest = useRest()
const restApi = rest.restResource(resource)

const item = ref<M.Datasource>();
const datasourceType = ref('');

const configDialogVisible = ref(false);
const configForm = ref({});

const datasourceParams = ref<M.DatasourceParam[]>([]);
const paramDialogVisible = ref(false);
const paramForm = ref<M.DatasourceParam>();
let paramMode = 'create';

const testDialogVisible = ref(false)

function getType(type: string) {
  if (type) {
    for (let dst of datasourceTypes) {
      if (dst.value === type) {
        return dst.label
      }
    }
  }
  return ''
}

function parseConfig(config: string) {
  if (config) {
    return JSON.parse(config)
  }
  return {}
}

function onConfigure() {
  if (item.value) {
    configForm.value = parseConfig(item.value.config)
  }
  configDialogVisible.value = true
}

// 修改配置提交
function onConfigSubmit() {
  configDialogVisible.value = false
  if (item.value) {
    item.value.config = JSON.stringify(configForm.value)
    restApi.update(item.value.id, item.value).then(() => {
      // 连接数据库
      if (item.value) {
        connectDatasource(item.value.id).then(() => {
          loadItem()
          notifySuccess('message.updateSuccess')
        })
      }
    })
  }
}

// 添加参数
function onAddParam() {
  paramForm.value = new M.DatasourceParam()
  paramMode = 'create'
  paramDialogVisible.value = true
}

// 编辑参数提交
function onEditParamSubmit() {
  paramDialogVisible.value = false
  if (item.value && item.value.id && paramForm.value) {
    if (paramMode === 'create') {
      addDatasourceParams(item.value.id, [paramForm.value]).then(() => {
        notifySuccess('message.updateSuccess')
        getParams()
      })
    } else if (paramMode === 'update') {
      updateDatasourceParams(item.value.id, [paramForm.value]).then(() => {
        notifySuccess('message.updateSuccess')
        getParams()
      })
    }
  }
}

function onEditParam(param: M.DatasourceParam) {
  paramForm.value = param
  paramMode = 'update'
  paramDialogVisible.value = true
}

function onDeleteParam(param: M.DatasourceParam) {
  if (item.value) {
    deleteDatasourceParams(item.value.id, param.id).then(() => {
      notifySuccess('message.deleteSuccess')
      getParams()
    })
  }
}

function onTest() {
  testDialogVisible.value = true
}

async function loadItem() {
  const res = await restApi.detail(props.id);
  item.value = <M.Datasource>res.data;
  datasourceType.value = getType(item.value.type)
}

function getParams() {
  getDatasourceParams(props.id).then(res => {
    datasourceParams.value = <M.DatasourceParam[]>res.data.data
  })
}

onMounted(() => {
  loadItem()
  getParams()
})
</script>
