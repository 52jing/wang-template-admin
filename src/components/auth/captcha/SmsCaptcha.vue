<template>
  <q-input
    v-model="text"
    :dark="dark"
    :filled="filled"
    :outlined="outlined"
    :borderless="borderless"
    :standout="standout"
    :rounded="rounded"
    :square="square"
    :dense="dense"
    :clearable="clearable"
    @update:model-value="handleTextChange"
  >
    <template #append>
      <span v-if="showCount">{{ countSecs }}s</span>
      <template v-if="showVerify">
        <q-icon v-if="verifySuccess" name="check" color="positive" />
        <q-icon v-else name="close" color="negative"></q-icon>
      </template>
    </template>

    <template #after>
      <q-btn
        v-loading="loading"
        :disable="disableSend"
        round
        dense
        flat
        icon="send"
        @click="send"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
// 短信验证码
import { ref, computed } from 'vue';
import { smsCaptchaSendInterval, smsCaptchaLength } from 'src/utils/constants';
import { useCommonStore } from 'src/stores/common';

export interface Props {
  tel: string | null;
  modelValue: string;
  dark?: boolean;
  filled?: boolean;
  outlined?: boolean;
  borderless?: boolean;
  standout?: boolean;
  rounded?: boolean;
  square?: boolean;
  dense?: boolean;
  clearable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  dark: false,
  filled: false,
  outlined: false,
  borderless: false,
  standout: false,
  rounded: false,
  square: false,
  dense: false,
  clearable: false,
});

const emit = defineEmits(['update:modelValue', 'reload']);

const commonStore = useCommonStore();

const captchaType = 'sms';
let captchaUid = '';
let text = ref(props.modelValue);
let countSecs = ref(0);
let showCount = ref(false);
let showVerify = ref(false);
let verifySuccess = ref(false);

const disableSend = computed(() => {
  return showCount.value || !props.tel || props.tel.length < 11;
});

let loading = ref(false)

// 获取验证码
function getSmsCaptcha() {
  captchaUid = props.tel ?? '';
  if (!captchaUid) {
    return;
  }
  loading.value = true
  commonStore.getSmsCaptcha(captchaUid).then(() => {
    countSecs.value = smsCaptchaSendInterval;
    showCount.value = true;
    const tid = setInterval(() => {
      countSecs.value--;
      if (countSecs.value <= 0) {
        showCount.value = false;
        clearInterval(tid);
      }
    }, 1000);
    emit('reload', captchaUid);
  }).finally(() => {
    loading.value = false
  });
}

// 验证验证码
function verifySmsCaptcha() {
  commonStore
    .verifyCaptcha({
      uuid: captchaUid,
      captcha: text.value,
      captchaType: captchaType,
      username: text.value,
    })
    .then((data) => {
      if (data) {
        verifySuccess.value = true;
      } else {
        verifySuccess.value = false;
      }
      showVerify.value = true;
    });
}

function handleTextChange() {
  if (text.value.length === smsCaptchaLength) {
    verifySmsCaptcha();
  } else {
    showVerify.value = false;
  }
  emit('update:modelValue', text.value);
}

// 发送验证码
function send() {
  getSmsCaptcha();
}
</script>
