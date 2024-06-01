<template>
  <q-card :flat="flat">
    <q-card-section v-if="!hideTitle">
      <div class="text-h6">{{ title ?? $t('pages.Detail') }}</div>
    </q-card-section>

    <q-card-section :style="{ maxHeight: contentMaxHeight }" class="q-pt-none scroll">
      <q-list :bordered="bordered">

        <q-item v-for="(item, index) in fields" :key="index" v-ripple>
          <q-item-section :class="item.labelClassName">{{ item.label }}</q-item-section>

          <q-item-section v-if="item.type === 'attachment'" side :class="item.valClassName">
            <attachment-list :files="getAttachments(data)" dense></attachment-list>
          </q-item-section>
          <q-item-section v-else-if="item.type === 'icon'" side :class="item.valClassName">
            <q-icon :name="formatVal(item, data)"></q-icon>
          </q-item-section>
          <q-item-section v-else-if="item.type === 'textarea'" side :class="item.valClassName">
            <pre>{{ formatVal(item, data) }}</pre>
          </q-item-section>
          <q-item-section v-else-if="item.type === 'editor'" side :class="item.valClassName">
            <div v-html="_.get(data, item.name)"></div>
          </q-item-section>
          <q-item-section v-else-if="item.type === 'user_dict'" side :class="item.valClassName">
            <user-dict-label :id="_.get(data, item.name)"></user-dict-label>
          </q-item-section>
          <q-item-section v-else side :class="item.valClassName">
            {{ formatVal(item, data) }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <div class="q-gutter-sm q-mt-sm">
        <q-btn v-if="!hideCloseBtn" flat v-close-popup @click="onClose">{{ $t('buttons.Close') }}</q-btn>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { date } from 'quasar'
import _ from 'lodash';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import AttachmentList from 'src/components/common/AttachmentList.vue';
import UserDictLabel from 'src/components/common/UserDictLabel.vue';

interface Props {
  // 字段定义
  fields: M.DetailConfigProps[]
  // 数据
  data?: object
  // 标题
  title?: string
  // 是否显示标题
  hideTitle?: boolean
  // 内容最大高度
  contentMaxHeight?: string
  // 是否扁平
  flat?: boolean
  // 是否有边框
  bordered?: boolean
  // 是否显示关闭按钮
  hideCloseBtn?: boolean
}

// 默认值
withDefaults(defineProps<Props>(), {
  hideTitle: false,
  contentMaxHeight: '50vh',
  flat: false,
  bordered: false,
  hideCloseBtn: false
})

// 事件
const emit = defineEmits<{
  close: []
}>()

const i18n = useI18n();

/**
 * 关闭事件处理
 */
function onClose() {
  emit('close')
}

/**
 * 处理值
 */
function formatVal(config: M.DetailConfigProps, data: object | undefined) {
  if (!data) {
    return undefined
  }
  let val = _.get(data, config.name)
  if (config.type === 'date') {
    const dateFormat = config.dateFormat ?? C.dateTimeFormat
    val = date.formatDate(val, dateFormat)
  } else if (config.type === 'bool') {
    val = val ? i18n.t('yes') : i18n.t('no')
  }
  if (config.formatter) {
    val = config.formatter(config.name, val, data)
  }
  return val;
}

function getAttachments(data?: object): M.Attachment[] {
  if (data) {
    const atts = _.get(data, 'attachments')
    if (atts) {
      return atts
    }
  }
  return []
}
</script>
