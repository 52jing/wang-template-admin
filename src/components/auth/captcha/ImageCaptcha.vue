<template>
  <q-input v-model="model" :label="label" :filled="filled" :outlined="outlined" :borderless="borderless"
    :standout="standout" :rounded="rounded" :square="square" :dense="dense" :clearable="clearable" :loading="loading"
    @update:model-value="onTextChange">
    <template #append>
      <template v-if="showVerify">
        <q-icon v-if="verifySuccess" name="check" color="positive" />
        <q-icon v-else name="close" color="negative"></q-icon>
      </template>
    </template>
    <template #after>
      <img :src="captchaImgSrc" style="height: 50px" @click="refresh" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
// 图形验证码
import { ref, onMounted } from 'vue';
import { imageCaptchaLength } from 'src/utils/constants';
import { randomString } from 'src/utils/str';
import * as C from 'src/utils/constants';
import _ from 'lodash';
import * as authApi from 'src/api/auth';

export interface Props {
  label?: string;
  filled?: boolean;
  outlined?: boolean;
  borderless?: boolean;
  standout?: boolean;
  rounded?: boolean;
  square?: boolean;
  dense?: boolean;
  clearable?: boolean;
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: '',
  dark: false,
  filled: false,
  outlined: false,
  borderless: false,
  standout: false,
  rounded: false,
  square: false,
  dense: false,
  clearable: false,
  loading: false,
});

// 事件
const emit = defineEmits<{
  // 载入验证码
  load: [uid: string]
  // 校验验证码
  verify: [res: boolean]
}>()

const model = defineModel<string | undefined>()

const captchaType = 'image';
let captchaUid = '';
const captchaImgSrc = ref('');
const showVerify = ref(false);
const verifySuccess = ref(false);

// 获取验证码
function getImageCaptcha() {
  captchaUid = randomString(16);
  authApi.getImageCaptcha(captchaUid).then(res => {
    if (_.has(res.data[C.responseDataKey], 'base64_data')) {
      captchaImgSrc.value = 'data:image/png;base64,' + _.get(res.data[C.responseDataKey], 'base64_data')
      emit('load', captchaUid);
    }
  })
}

// 验证验证码
function verifyImageCaptcha(val: string) {
  authApi.verifyCaptcha(captchaType, captchaUid, val).then(res => {
    if (res.data.data) {
      verifySuccess.value = true;
    } else {
      verifySuccess.value = false;
    }
    showVerify.value = true;
    emit('verify', verifySuccess.value)
  })
}

// 刷新验证码
function refresh() {
  showVerify.value = false;
  getImageCaptcha();
}

function onTextChange(val: string | number | null) {
  if (val && val.toString().length === imageCaptchaLength) {
    verifyImageCaptcha(val.toString());
  } else {
    showVerify.value = false;
  }
}

onMounted(() => {
  getImageCaptcha();
});

defineExpose({ refresh })

</script>
