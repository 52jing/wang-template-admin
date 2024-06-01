<template>
  <q-select v-model="model" :options="options" :label="label" :emit-value="emitValue" :map-options="mapOptions"
    :clearable="clearable" :multiple="multiple" :filled="filled" :outlined="outlined" :borderless="borderless"
    :standout="standout" :option-label="optionLabel" :option-value="optionValue" :loading="loading" :rules="rules"
    lazy-rules use-input @filter="onFilter"></q-select>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ValidationRule } from 'quasar'
import { useRest } from 'src/utils/uses';

interface Props {
  // 资源路径
  resource: string
  // 标签
  label?: string
  // 标签字段
  optionLabel?: string,
  // 值字段
  optionValue?: string,
  // 绑定model为value值，而非整个对象
  emitValue?: boolean,
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
  label: '',
  optionLabel: 'name',
  optionValue: 'id',
  emitValue: false
})

const model = defineModel<string | string[] | object | object[] | null>()

const rest = useRest();
const restApi = rest.restResource(props.resource)

// 可选值
const options = ref([] as object[])

// 获取资源
function getResourceList(query?: string) {
  return restApi.list({ query })
}

function onFilter(val: string, doneFn: (callbackFn: () => void) => void) {
  doneFn(() => {
    getResourceList(val).then(res => {
      options.value = res.data
    })
  })
}

onMounted(() => {
  getResourceList().then(res => {
    options.value = res.data
  })
})

</script>
