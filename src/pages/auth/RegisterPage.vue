<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container>
      <q-page class="register-container">
        <div class="title text-center">
          <div class="text-h5 q-my-md">{{ $t('auth.registerTitle') }}</div>
          <div class="text-h6 q-my-md">{{ frontend?.title }}</div>
        </div>
        <q-card class="q-pa-md">
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">

            <q-input filled v-model="username" :label="$t('auth.username')" lazy-rules :rules="[
            val => (val && val.length > 0) || $t('auth.inputUsername'),
            val => val.length > 2 || $t('message.inputAtLeastNChars', [3]),
            val => val.length <= 100 || $t('message.inputAtMostNChars', [100])
          ]" />

            <q-input filled v-model="nickname" :label="$t('auth.nickname')" lazy-rules :rules="[
            val => (val && val.length > 0) || $t('auth.inputNickname'),
            val => val.length > 2 || $t('message.inputAtLeastNChars', [3]),
            val => val.length <= 100 || $t('message.inputAtMostNChars', [100])
          ]" />

            <q-input filled v-model="pwd" :label="$t('auth.password')" type="password" lazy-rules :rules="[
            val => (val && val.length > 0) || $t('auth.inputPassword')
          ]" />

            <q-input filled v-model="pwd2" :label="$t('auth.newPassword2')" type="password" lazy-rules :rules="[
            val => (val && val.length > 0) || $t('auth.inputPassword'),
            val => val === pwd || $t('auth.inputSamePassword')
          ]" />

            <q-input filled v-model="email" :label="$t('auth.email')" lazy-rules :rules="[
            val => isEmail(val) || $t('auth.inputEmail'),
            val => !val || val.length <= 100 || $t('message.inputAtMostNChars', [100])
          ]" />

            <q-input filled v-model="tel" :label="$t('auth.tel')" lazy-rules :rules="[
            val => isTel(val) || $t('auth.inputTel'),
            val => !val || val.length <= 20 || $t('message.inputAtMostNChars', [20]),
          ]" />

            <div class="text-center">
              <q-btn :label="$t('buttons.Register')" type="submit" color="primary" />
              <q-btn :label="$t('buttons.Reset')" type="reset" class="q-ml-sm" />
            </div>
          </q-form>
        </q-card>

        <div class="q-my-md text-center">
          <LanguageSwitch></LanguageSwitch>
        </div>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonPage } from 'src/utils/uses';
import { notifySuccess } from 'src/utils/notify';
import LanguageSwitch from 'src/components/common/LanguageSwitch.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { isEmail, isTel } from 'src/utils/str';
import { register } from 'src/api/auth';
import { useCommonStore } from 'src/stores/common';

useCommonPage();
const router = useRouter();
const commonStore = useCommonStore()

const frontend = computed(() => {
  return commonStore.frontendProfile
});

const username = ref('');
const nickname = ref('');
const pwd = ref('');
const pwd2 = ref('');
const email = ref('');
const tel = ref('');
const loading = ref(false);

function onSubmit() {
  const data: M.RegisterBody = {
    frontendId: frontend.value.id,
    username: username.value,
    nickname: nickname.value,
    password: pwd.value,
    email: email.value,
    tel: tel.value
  }
  loading.value = true
  register(data).then(() => {
    notifySuccess('auth.registerSuccess')
    router.push({ name: C.routeLoginName })
  }).finally(() => {
    loading.value = false
  })
}

function onReset() {
  username.value = ''
  nickname.value = ''
  pwd.value = ''
  pwd2.value = ''
  email.value = ''
  tel.value = ''
}

onMounted(() => {
  if (!commonStore.envConfig.enableRegister) {
    router.push({ name: C.routeLoginName })
  }
})

</script>
<style scoped>
.register-container {
  width: 600px;
  margin: 0 auto;
}
</style>
