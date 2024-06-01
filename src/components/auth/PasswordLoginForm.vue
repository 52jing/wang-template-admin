<template>
  <div>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input v-model="username" :label="$t('auth.username')" lazy-rules filled
        :rules="[(val) => (val && val.length > 0) || $t('auth.inputUsername')]" />

      <q-input :type="isPwd ? 'password' : 'text'" v-model="password" :label="$t('auth.password')" lazy-rules filled
        :rules="[(val) => (val && val.length > 0) || $t('auth.inputPassword')]">
        <template #append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>

      <image-captcha v-if="enableCaptcha && captchaType === 'image'" ref="captchaRef" v-model="captcha"
        :label="$t('auth.captcha')" filled @load="onCaptchaLoad"></image-captcha>

      <div>
        <q-btn :label="$t('buttons.Login')" :loading="loading" type="submit" color="primary" rounded
          class="full-width" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCommonStore } from 'src/stores/common';
import ImageCaptcha from './captcha/ImageCaptcha.vue';
import * as M from 'src/components/models';

export interface Props {
  loading?: boolean;
}

withDefaults(defineProps<Props>(), {

});

// 事件
const emit = defineEmits<{
  // 提交事件
  submit: [data: M.LoginBody]
}>()

const commonStore = useCommonStore();

const enableCaptcha = ref(commonStore.envConfig.enableCaptcha);
const captchaType = ref(commonStore.envConfig.loginCaptchaType);

const isPwd = ref(true);
const username = ref('');
const password = ref('');
const captcha = ref('');
const captchaRef = ref()
let captchaUid = '';
const loginType = 'username_password';

function onSubmit() {
  emit('submit', {
    username: username.value,
    password: password.value,
    captcha: captcha.value,
    captchaType: captchaType.value,
    uuid: captchaUid,
    loginType: loginType,
  });
  if (captchaRef.value) {
    captchaRef.value.refresh()
  }
}

function onCaptchaLoad(uid: string) {
  captchaUid = uid;
}
</script>
