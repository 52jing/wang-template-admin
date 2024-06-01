<template>
  <div class="q-pa-md">
    <div class="text-center text-h6 q-pb-md">{{ $t('pages.ChangePassword') }}</div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mx-auto" style="max-width: 600px;">

      <q-input v-model="oldPwd" :type="showOldPwd ? 'text' : 'password'" :label="$t('auth.password')" clearable
        lazy-rules :rules="[val => val && val.length > 0 || $t('auth.inputPassword')]">
        <template v-slot:append>
          <q-icon :name="showOldPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showOldPwd = !showOldPwd" />
        </template>
      </q-input>

      <q-input v-model="newPwd" :type="showNewPwd ? 'text' : 'password'" :label="$t('auth.newPassword')" clearable
        lazy-rules :rules="[val => val && val.length > 0 || $t('auth.inputPassword')]">
        <template v-slot:append>
          <q-icon :name="showNewPwd ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showNewPwd = !showNewPwd" />
        </template>
      </q-input>

      <q-input v-model="newPwd2" :type="showNewPwd2 ? 'text' : 'password'" :label="$t('auth.newPassword2')" clearable
        lazy-rules
        :rules="[val => val && val.length > 0 || $t('auth.inputPassword'), val => val === newPwd || $t('auth.inputSamePassword')]">
        <template v-slot:append>
          <q-icon :name="showNewPwd2 ? 'visibility' : 'visibility_off'" class="cursor-pointer"
            @click="showNewPwd2 = !showNewPwd2" />
        </template>
      </q-input>

      <div class="text-center">
        <q-btn :label="$t('buttons.Confirm')" type="submit" color="primary" />
        <q-btn :label="$t('buttons.Reset')" type="reset" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProfileStore } from 'src/stores/profile';
import { notifySuccess } from 'src/utils/notify';
import { useRouter } from 'vue-router';
import { useCommonPage } from 'src/utils/uses';
import * as C from 'src/utils/constants';

const profileStore = useProfileStore()
const router = useRouter();
useCommonPage()

const oldPwd = ref('')
const newPwd = ref('')
const newPwd2 = ref('')
const showOldPwd = ref(false)
const showNewPwd = ref(false)
const showNewPwd2 = ref(false)

function onSubmit() {
  profileStore.changePassword(oldPwd.value, newPwd.value).then(() => {
    notifySuccess('auth.passwordChanged')
    router.push({ name: C.routeProfileName });
  })
}

function onReset() {
  oldPwd.value = ''
  newPwd.value = ''
  newPwd2.value = ''
}

</script>
