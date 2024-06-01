<template>
  <div>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input
        v-model="tel"
        :label="$t('auth.tel')"
        lazy-rules
        filled
        clearable
        :rules="[
          (val) => (val && /^1[0-9]{10}$/.test(val)) || $t('auth.inputTel'),
        ]"
      />

      <sms-captcha
        v-model="captcha"
        :tel="tel"
        :label="$t('auth.telCode')"
        filled
      ></sms-captcha>

      <div>
        <q-btn
          :label="$t('buttons.Login')"
          :loading="loading"
          :disable="captcha.length === 0"
          type="submit"
          color="primary"
          rounded
          class="full-width"
        />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SmsCaptcha from './captcha/SmsCaptcha.vue';

export interface Props {
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits(['submit']);

let tel = ref('' as string | null);
let captcha = ref('');
const captchaType = 'sms';
const loginType = 'tel_code';

function onSubmit() {
  emit('submit', {
    username: tel.value,
    captcha: captcha.value,
    uuid: tel.value,
    captchaType: captchaType,
    loginType: loginType,
  });
}
</script>
