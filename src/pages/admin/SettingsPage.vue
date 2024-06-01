<template>
  <div class="q-pa-md">
    <div class="text-center text-h6 q-pb-md">{{ $t('pages.Settings') }}</div>
    <q-tabs v-model="tab" active-color="primary" inline-label @update:model-value="onChangeTab">
      <q-tab v-for="item in paramGroups" :name="item.name" :label="item.label" :key="item.name" />
    </q-tabs>

    <q-separator />

    <div class="q-pa-md" style="max-width: 600px; margin: 0 auto;">
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="server">
        </q-tab-panel>

        <q-tab-panel name="security">
          <q-form>
            <q-input v-if="passwordMinLengthConf" v-model.number="passwordMinLength" :label="passwordMinLengthConf.name"
              :hint="passwordMinLengthConf.remark" :debounce="debounce" type="number"></q-input>
            <div>
              <q-checkbox v-if="passwordRequireNumberConf" v-model="passwordRequireNumber" left-label
                :label="passwordRequireNumberConf.name" />
            </div>
            <div>
              <q-checkbox v-if="passwordRequireUpperConf" v-model="passwordRequireUpper" left-label
                :label="passwordRequireUpperConf.name" />
            </div>
            <div>
              <q-checkbox v-if="passwordRequireLowerConf" v-model="passwordRequireLower" left-label
                :label="passwordRequireLowerConf.name" />
            </div>
            <div>
              <q-checkbox v-if="passwordRequireSymbolConf" v-model="passwordRequireSymbol" left-label
                :label="passwordRequireSymbolConf.name" />
            </div>
            <q-input v-if="loginFailedThresholdConf" v-model.number="loginFailedThreshold"
              :label="loginFailedThresholdConf.name" :hint="loginFailedThresholdConf.remark" :debounce="debounce"
              type="number"></q-input>
            <q-input v-if="loginFailedLockSecsConf" v-model.number="loginFailedLockSecs"
              :label="loginFailedLockSecsConf.name" :hint="loginFailedLockSecsConf.remark" :debounce="debounce"
              type="number"></q-input>
            <div class="text-center q-my-md">
              <q-btn color="primary" :label="$t('buttons.Update')" @click="onUpdate"></q-btn>
            </div>
          </q-form>

        </q-tab-panel>

        <q-tab-panel name="license">
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import * as M from 'src/components/models';
import { useRest } from 'src/utils/uses';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import _ from 'lodash';
import { strToBool } from 'src/utils/str';
import { notifySuccess } from 'src/utils/notify';

const resource = '/system/param'
const rest = useRest()
const restApi = rest.restResource(resource)
const i18n = useI18n()
useCommonPage()

// 参数组
const paramGroups = ref([
  { name: 'server', label: i18n.t('settings.server') },
  { name: 'security', label: i18n.t('settings.security') },
])
const debounce = ref(800)
const tab = ref(paramGroups.value[0].name)
const params = ref<M.Param[]>([])

const passwordMinLength = ref<number>()
const passwordRequireNumber = ref<boolean>()
const passwordRequireUpper = ref<boolean>()
const passwordRequireLower = ref<boolean>()
const passwordRequireSymbol = ref<boolean>()
const loginFailedThreshold = ref<number>()
const loginFailedLockSecs = ref<number>()

const passwordMinLengthConf = computed(() => {
  return getParamByKey('password_min_length')
})

const passwordRequireNumberConf = computed(() => {
  return getParamByKey('password_require_number')
})

const passwordRequireUpperConf = computed(() => {
  return getParamByKey('password_require_upper')
})

const passwordRequireLowerConf = computed(() => {
  return getParamByKey('password_require_lower')
})

const passwordRequireSymbolConf = computed(() => {
  return getParamByKey('password_require_symbol')
})

const loginFailedThresholdConf = computed(() => {
  return getParamByKey('login_failed_threshold')
})

const loginFailedLockSecsConf = computed(() => {
  return getParamByKey('login_failed_lock_seconds')
})

// 获取参数配置
function getParamByKey(key: string) {
  for (const p of params.value) {
    if (p.paramKey === key) {
      return p
    }
  }
  return null
}

// 获取参数组
function getParams(group: string) {
  restApi.list({ filter: { param_group: group } }).then(data => {
    const ps: M.Param[] = []
    for (const d of data.data) {
      const p = <M.Param>d
      ps.push(p)
    }
    params.value = ps
    loadParamValues()
  })
}

// 载入配置值
function loadParamValues() {
  for (const p of params.value) {
    if (p.paramKey === 'password_min_length') {
      passwordMinLength.value = <number>formatVal(p.paramType, p.paramVal)
    } else if (p.paramKey === 'password_require_number') {
      passwordRequireNumber.value = <boolean>formatVal(p.paramType, p.paramVal)
    } else if (p.paramKey === 'password_require_upper') {
      passwordRequireUpper.value = <boolean>formatVal(p.paramType, p.paramVal)
    } else if (p.paramKey === 'password_require_lower') {
      passwordRequireLower.value = <boolean>formatVal(p.paramType, p.paramVal)
    } else if (p.paramKey === 'password_require_symbol') {
      passwordRequireSymbol.value = <boolean>formatVal(p.paramType, p.paramVal)
    } else if (p.paramKey === 'login_failed_threshold') {
      loginFailedThreshold.value = <number>formatVal(p.paramType, p.paramVal)
    } else if (p.paramKey === 'login_failed_lock_seconds') {
      loginFailedLockSecs.value = <number>formatVal(p.paramType, p.paramVal)
    }
  }
}

// 变更标签页事件
function onChangeTab(val: string) {
  getParams(val)
}

// 提交更新事件
async function onUpdate() {
  const requestList = []
  if (passwordMinLengthConf.value && passwordMinLengthConf.value.paramVal !== passwordMinLength.value?.toString()) {
    const p = passwordMinLengthConf.value
    p.paramVal = passwordMinLength.value?.toString()
    requestList.push(restApi.update(p.id, p))
  }
  if (passwordRequireNumberConf.value && passwordRequireNumberConf.value.paramVal !== passwordRequireNumber.value?.toString()) {
    const p = passwordRequireNumberConf.value
    p.paramVal = passwordRequireNumber.value?.toString()
    requestList.push(restApi.update(p.id, p))
  }
  if (passwordRequireUpperConf.value && passwordRequireUpperConf.value.paramVal !== passwordRequireUpper.value?.toString()) {
    const p = passwordRequireUpperConf.value
    p.paramVal = passwordRequireUpper.value?.toString()
    requestList.push(restApi.update(p.id, p))
  }
  if (passwordRequireLowerConf.value && passwordRequireLowerConf.value.paramVal !== passwordRequireLower.value?.toString()) {
    const p = passwordRequireLowerConf.value
    p.paramVal = passwordRequireLower.value?.toString()
    requestList.push(restApi.update(p.id, p))
  }
  if (passwordRequireSymbolConf.value && passwordRequireSymbolConf.value.paramVal !== passwordRequireSymbol.value?.toString()) {
    const p = passwordRequireSymbolConf.value
    p.paramVal = passwordRequireSymbol.value?.toString()
    requestList.push(restApi.update(p.id, p))
  }
  if (loginFailedThresholdConf.value && loginFailedThresholdConf.value.paramVal !== loginFailedThreshold.value?.toString()) {
    const p = loginFailedThresholdConf.value
    p.paramVal = loginFailedThreshold.value?.toString()
    requestList.push(restApi.update(p.id, p))
  }
  await Promise.all(requestList)
  notifySuccess('message.updateSuccess')
}

// 格式化参数值
function formatVal(type: string, val: unknown) {
  if (type === '整数') {
    return _.toInteger(val)
  } else if (type === '浮点数') {
    return _.toNumber(val)
  } else if (type === '布尔值') {
    return _.isBoolean(val) ? val : strToBool(<string>val)
  } else {
    return <string>val
  }
}

</script>
