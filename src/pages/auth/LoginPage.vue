<template>
  <q-layout view="lHh lpr lFf">
    <q-page-container>
      <q-page class="login-container">
        <div class="left-wrapper">
          <div class="login-title">
            <div class="login-h1">{{ $t('auth.welcome') }}</div>
            <div class="login-h1">{{ frontend?.title }}</div>
            <div class="login-h2">{{ frontend?.description }}</div>
            <LanguageSwitch></LanguageSwitch>
          </div>
        </div>
        <q-card class="login-wrapper animate__animated animate__bounceInDown">
          <q-tabs v-model="tab" class="text-teal">
            <q-tab v-if="enableUsernamePassword" name="password" :label="$t('auth.passwordLogin')" />
            <q-tab v-if="enableTelcode" name="tel" :label="$t('auth.telLogin')" />
          </q-tabs>
          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel v-if="enableUsernamePassword" name="password">
              <PasswordLoginForm :loading="loading" @submit="onUsernamePasswordLogin">
              </PasswordLoginForm>
            </q-tab-panel>

            <q-tab-panel v-if="enableTelcode" name="tel">
              <TelephoneLoginForm :loading="loading" @submit="onUsernamePasswordLogin"></TelephoneLoginForm>
            </q-tab-panel>
          </q-tab-panels>

          <div v-if="commonStore.envConfig.enableRegister" class="text-center">
            <q-btn flat :to="{ name: C.routeRegisterName }">{{ $t('buttons.Register') }}</q-btn>
          </div>
        </q-card>

        <div class="q-my-md text-center">

        </div>

        <q-dialog v-model="changePwd" persistent>
          <q-card class="" style="width: 300px">
            <q-card-section>
              <div class="text-h6">{{ $t('pages.ChangePassword') }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input v-model="newPwd" :type="showNewPwd ? 'text' : 'password'" :label="$t('auth.newPassword')"
                clearable lazy-rules :rules="[val => val && val.length > 0 || $t('auth.inputPassword')]">
                <template v-slot:append>
                  <q-icon :name="showNewPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                    @click="showNewPwd = !showNewPwd" />
                </template>
              </q-input>

              <q-input v-model="newPwd2" :type="showNewPwd2 ? 'text' : 'password'" :label="$t('auth.newPassword2')"
                clearable lazy-rules
                :rules="[val => val && val.length > 0 || $t('auth.inputPassword'), val => val === newPwd || $t('auth.inputSamePassword')]">
                <template v-slot:append>
                  <q-icon :name="showNewPwd2 ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                    @click="showNewPwd2 = !showNewPwd2" />
                </template>
              </q-input>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn color="primary" :label="$t('buttons.Confirm')" @click="onChangePwd" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCommonPage } from 'src/utils/uses';
import { notifySuccess } from 'src/utils/notify';
import PasswordLoginForm from 'src/components/auth/PasswordLoginForm.vue';
import TelephoneLoginForm from 'src/components/auth/TelephoneLoginForm.vue';
import LanguageSwitch from 'src/components/common/LanguageSwitch.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useProfileStore } from 'src/stores/profile';
import { useCommonStore } from 'src/stores/common';

useCommonPage();
const router = useRouter();
const profileStore = useProfileStore();
const commonStore = useCommonStore()

const tab = ref('password');
const frontend = computed(() => {
  return commonStore.frontendProfile
})
const enableUsernamePassword = commonStore.envConfig.enableUsernamePasswordLogin
const enableTelcode = commonStore.envConfig.enableTelCodeLogin
const loading = ref(false);
const changePwd = ref(false);
const oldPwd = ref<string>();
const newPwd = ref<string>();
const newPwd2 = ref<string>();
const showNewPwd = ref(false);
const showNewPwd2 = ref(false);

function onUsernamePasswordLogin(data: M.LoginBody) {
  oldPwd.value = data.password;
  loading.value = true;
  profileStore
    .login(data)
    .then(() => {
      notifySuccess('message.loginSuccess')
      // 如果需要修改密码，则弹出框
      if (profileStore.user?.needChangePwd) {
        changePwd.value = true;
      } else {
        // 登录成功后跳转原路径或首页
        redirectPath()
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

// 修改密码事件
function onChangePwd() {
  if (oldPwd.value && newPwd.value) {
    profileStore.changePassword(oldPwd.value, newPwd.value).then(() => {
      notifySuccess('auth.passwordChanged')
      redirectPath();
    })
  }
}

function redirectPath() {
  let url = profileStore.redirectAfterLogin ?? '/';
  router.push({ path: url });
}

</script>
<style lang="scss" scoped>
@import "src/css/login.scss";
</style>
