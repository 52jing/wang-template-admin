<template>
  <q-card style="min-width: 400px;">
    <q-card-section>
      <div class="text-h6">{{ $t('pages.SetPassword') }}</div>
    </q-card-section>

    <q-form @submit.prevent.stop="onSubmit">
      <q-card-section class="q-pt-none q-gutter-sm">

        <q-input v-model="form.newPwd" :type="showPwd ? 'text' : 'password'" :label="$t('auth.newPassword')"
          :filled="filled" :outlined="outlined" :borderless="borderless" :standout="standout" lazy-rules
          :rules="[val => val && val.length > 0 || $t('auth.inputPassword')]" clearable>
          <template v-slot:append>
            <q-icon :name="showPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer"
              @click="showPwd = !showPwd" />
          </template>
        </q-input>
        <q-input v-model="form.newPwd2" :type="showPwd2 ? 'text' : 'password'" :label="$t('auth.newPassword2')"
          :filled="filled" :outlined="outlined" :borderless="borderless" :standout="standout" lazy-rules
          :rules="[val => val && val.length > 0 || $t('auth.inputPassword'), val => val === form.newPwd || $t('auth.inputSamePassword')]"
          clearable>
          <template v-slot:append>
            <q-icon :name="showPwd2 ? 'visibility' : 'visibility_off'" class="cursor-pointer"
              @click="showPwd2 = !showPwd2" />
          </template>
        </q-input>

      </q-card-section>

      <q-card-actions align="right">
        <q-btn type="submit" color="primary">{{ $t('buttons.Confirm') }}</q-btn>
        <q-btn flat v-close-popup @click="onClose">{{ $t('buttons.Close') }}</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import * as M from 'src/components/models';

interface Props {
  // 用户ID
  userId?: M.IdType
  // 是否使用 filled 样式
  filled?: boolean
  // 是否使用 outlined 样式
  outlined?: boolean
  // 是否使用 borderless 样式
  borderless?: boolean
  // 是否使用 standout 样式
  standout?: boolean
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

// 事件
const emit = defineEmits<{
  submit: [userId: M.IdType, pwd: string]
  close: []
}>()

const form = reactive({ newPwd: '', newPwd2: '' })
const showPwd = ref(false)
const showPwd2 = ref(false)

/**
 * 提交事件处理
 */
function onSubmit() {
  emit('submit', props.userId ?? '', form.newPwd)
}

/**
 * 关闭事件处理
 */
function onClose() {
  emit('close')
}
</script>
