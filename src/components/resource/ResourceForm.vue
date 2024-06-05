<template>
  <q-card>
    <q-card-section v-if="!hideTitle">
      <div class="text-h6">{{ title ?? (type === 'edit' ? $t('pages.Update') : $t('pages.Create')) }}</div>
    </q-card-section>

    <q-form @submit.prevent.stop="onSubmit" @reset="onReset">
      <q-card-section :style="{ maxHeight: contentMaxHeight }" class="q-pt-none q-gutter-sm scroll">

        <template v-for="(item, index) in formConfig" :key="index">
          <q-input v-if="item.type === undefined || item.type === 'text'" :label="item.label" lazy-rules
            :rules="item.rules" :maxlength="item.maxlength" :counter="item.counter" :clearable="item.clearable"
            :filled="filled" :outlined="outlined" :borderless="borderless" :standout="standout"
            v-model.trim="obj[item.name]" />
          <q-input v-else-if="item.type === 'textarea'" :label="item.label" type="textarea" lazy-rules
            :rules="item.rules" :maxlength="item.maxlength" :counter="item.counter" :clearable="item.clearable"
            :filled="filled" :outlined="outlined" :borderless="borderless" :standout="standout"
            v-model="obj[item.name]" />
          <q-editor v-else-if="item.type === 'editor'" v-model="obj[item.name]"></q-editor>
          <q-input v-else-if="item.type === 'number'" :label="item.label" type="number" lazy-rules :rules="item.rules"
            :clearable="item.clearable" :filled="filled" :outlined="outlined" :borderless="borderless"
            :standout="standout" v-model.number="obj[item.name]" />
          <div v-else-if="item.type === 'checkbox'">
            <q-checkbox left-label v-model="obj[item.name]" :label="item.label" />
          </div>
          <system-dict-select v-else-if="item.type === 'system_dict'" :name="item.dictName ?? ''" :label="item.label"
            :rules="item.rules" :clearable="item.clearable" :filled="filled" :outlined="outlined"
            :borderless="borderless" :standout="standout" v-model="obj[item.name]" emit-value
            map-options></system-dict-select>
          <user-dict-select v-else-if="item.type === 'user_dict'" :group="item.dictName ?? ''" :label="item.label"
            :rules="item.rules" :clearable="item.clearable" :filled="filled" :outlined="outlined"
            :borderless="borderless" :standout="standout" v-model="obj[item.name]" emit-value
            map-options></user-dict-select>
          <relation-select v-else-if="item.type === 'relation'" :resource="item.relationResource ?? ''"
            :option-label="item.relationOptionLabel" :option-value="item.relationOptionValue" :label="item.label"
            :rules="item.rules" :clearable="item.clearable" :filled="filled" :outlined="outlined"
            :borderless="borderless" :standout="standout" v-model="obj[item.name]" emit-value
            map-options></relation-select>
          <file-uploader v-else-if="item.type === 'attachment'" :label="item.label" :rules="item.rules" :filled="filled"
            :outlined="outlined" :borderless="borderless" :standout="standout" v-model="obj[item.name]"
            :file-list="attachmentList" :accept="item.fileAccept" show-download-btn show-delete-btn
            :max-file-size="item.maxFileSize" :max-files="item.maxFiles" :upload-type="item.uploadType"></file-uploader>
          <icon-select v-else-if="item.type === 'icon_select'" :label="item.label" :rules="item.rules"
            :clearable="item.clearable" :filled="filled" :outlined="outlined" :borderless="borderless"
            :standout="standout" v-model="obj[item.name]"></icon-select>
          <q-select v-else-if="item.type === 'select'" :label="item.label" :rules="item.rules"
            :clearable="item.clearable" :filled="filled" :outlined="outlined" :borderless="borderless"
            :standout="standout" v-model="obj[item.name]" emit-value map-options
            :options="getSelectOptions(item.selectOptions)"></q-select>
        </template>

      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn v-if="type === 'create'" type="submit" color="primary" :loading="loading">{{ $t('buttons.Create')
          }}</q-btn>
        <q-btn v-else type="submit" color="primary" :loading="loading">{{ $t('buttons.Update') }}</q-btn>
        <q-btn v-if="!hideResetBtn" type="reset" flat :loading="loading">{{ $t('buttons.Reset') }}</q-btn>
        <q-btn v-if="!hideCloseBtn" flat v-close-popup @click="onClose" :loading="loading">{{ $t('buttons.Close')
          }}</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import _ from 'lodash';
import * as M from 'src/components/models';
import SystemDictSelect from 'src/components/common/SystemDictSelect.vue';
import UserDictSelect from 'src/components/common/UserDictSelect.vue';
import RelationSelect from 'src/components/common/RelationSelect.vue';
import FileUploader from '../common/FileUploader.vue';
import IconSelect from 'src/components/common/IconSelect.vue';

interface Props {
  // 表单配置
  formConfig: M.FormConfigProps[]
  // 初始化对象
  initObj?: M.Entity
  // 表单类型
  type?: 'create' | 'edit'
  // 标题
  title?: string
  // 是否显示标题
  hideTitle?: boolean
  // 内容最大高度
  contentMaxHeight?: string
  // 是否显示重置按钮
  hideResetBtn?: boolean
  // 是否显示关闭按钮
  hideCloseBtn?: boolean
  // 是否使用 filled 样式
  filled?: boolean
  // 是否使用 outlined 样式
  outlined?: boolean
  // 是否使用 borderless 样式
  borderless?: boolean
  // 是否使用 standout 样式
  standout?: boolean
  loading?: boolean
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  type: 'create',
  hideTitle: false,
  contentMaxHeight: '50vh',
  hideResetBtn: false,
  hideCloseBtn: false,
})

// 事件
const emit = defineEmits<{
  submit: [formData: object]
  reset: []
  close: []
}>()

const obj = reactive<M.Entity>(_.cloneDeep(props.initObj ?? {}))
const attachmentList = computed(() => {
  if (_.has(obj, 'attachments')) {
    const att = _.get(obj, 'attachments')
    return <M.Attachment[]><unknown>att
  } else {
    return undefined
  }
})

function getSelectOptions(options?: M.OptionItem[] | (() => M.OptionItem[])) {
  if (options) {
    if (_.isFunction(options)) {
      return options()
    } else {
      return options
    }
  }
  return []
}

/**
 * 提交事件处理
 */
function onSubmit() {
  emit('submit', obj)
}

/**
 * 重置事件处理
 */
function onReset() {
  for (let k in obj) {
    obj[k] = undefined
  }
  _.assign(obj, props.initObj)
  emit('reset')
}

/**
 * 关闭事件处理
 */
function onClose() {
  emit('close')
}
</script>
