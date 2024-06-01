<template>
  <q-select v-model="model" :options="options" :label="label" :emit-value="emitValue" :map-options="mapOptions"
    :clearable="clearable" :multiple="multiple" :filled="filled" :outlined="outlined" :borderless="borderless"
    :standout="standout" :loading="loading" :rules="rules" lazy-rules option-value="id"
    option-label="dictVal"></q-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ValidationRule } from 'quasar'
import { useCommonStore } from 'src/stores/common';
import * as M from 'src/components/models';

interface Props {
  // 用户字典组
  group: string
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

const model = defineModel<string | string[] | M.UserDict | M.UserDict[] | undefined>()

const commonStore = useCommonStore();

// 可选值
const options = ref([] as M.UserDict[])

async function getUserDict(group: string) {
  if (group) {
    options.value = await commonStore.getUserDictList(group, undefined);
  }
}

onMounted(() => {
  getUserDict(props.group)
})

</script>
