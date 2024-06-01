<template>
  <q-select v-model="model" :options="options" :label="label" :emit-value="emitValue" :map-options="mapOptions"
    :clearable="clearable" :multiple="multiple" :filled="filled" :outlined="outlined" :borderless="borderless"
    :standout="standout" :option-label="optionLabel" :option-value="optionValue" :loading="loading" :rules="rules"
    lazy-rules use-input @filter="onFilter"></q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ValidationRule } from 'quasar'
import { userSearch } from 'src/api/auth';

interface Props {
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
withDefaults(defineProps<Props>(), {
  label: '',
  optionLabel: 'username',
  optionValue: 'id',
  emitValue: false
})

const model = defineModel<string | string[] | object | object[] | null>()

const options = ref<object[]>([])

function onFilter(val: string, doneFn: (callbackFn: () => void) => void, abortFn: () => void) {
  if (val) {
    doneFn(() => {
      userSearch(val).then(res => {
        options.value = res.data.data
      })
    })
  } else {
    abortFn()
  }
}
</script>
