<template>
  <q-select v-model="model" :options="options" :label="label" :emit-value="emitValue" :map-options="mapOptions"
    :clearable="clearable" :multiple="multiple" :filled="filled" :outlined="outlined" :borderless="borderless"
    :standout="standout" :loading="loading" :rules="rules" lazy-rules option-value="code"
    option-label="name"></q-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ValidationRule } from 'quasar'
import { useCommonStore } from 'src/stores/common';
import * as M from 'src/components/models';

interface Props {
  // 系统字典名称
  name: string
  // 标签
  label?: string
  emitValue?: boolean
  mapOptions?: boolean
  // 是否可清除
  clearable?: boolean
  // 是否可多选
  multiple?: boolean
  // 校验规则
  rules?: ValidationRule[]
  filled?: boolean
  outlined?: boolean
  borderless?: boolean
  standout?: boolean
  loading?: boolean
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  label: ''
})

const model = defineModel<string | string[] | M.SystemDict | M.SystemDict[] | undefined>()

const commonStore = useCommonStore();

// 可选值
const options = ref([] as M.SystemDict[])

async function getSystemDict(name: string) {
  if (name) {
    options.value = await commonStore.getSystemDictList(name);
  }
}

onMounted(() => {
  getSystemDict(props.name)
})

</script>
