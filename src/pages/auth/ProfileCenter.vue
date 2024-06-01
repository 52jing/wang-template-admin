<template>
  <div class="q-pa-md">
    <div class="text-center text-h6 q-pb-md">{{ $t('pages.Profile') }}</div>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md q-mx-auto" style="max-width: 600px;">

      <q-input v-model="user.id" :label="$t('profile.id')" readonly />
      <q-input v-model="user.username" :label="$t('profile.username')" readonly />

      <q-input v-model="user.nickname" :label="$t('profile.nickname')" :readonly="!editMode" clearable lazy-rules
        :rules="[val => val && val.length > 0 || $t('profile.inputNickname')]">
      </q-input>

      <q-input v-model="user.email" :label="$t('profile.email')" :readonly="!editMode" clearable lazy-rules
        :rules="[val => isEmail(val) || $t('profile.inputEmail')]">
      </q-input>

      <q-input v-model="user.tel" :label="$t('profile.tel')" :readonly="!editMode" clearable lazy-rules
        :rules="[val => isTel(val) || $t('profile.inputTel')]">
      </q-input>

      <q-input v-model="user.province" :label="$t('profile.province')" :readonly="!editMode" clearable>
      </q-input>

      <q-input v-model="user.city" :label="$t('profile.city')" :readonly="!editMode" clearable>
      </q-input>

      <q-input v-model="user.area" :label="$t('profile.area')" :readonly="!editMode" clearable>
      </q-input>

      <q-input v-model="user.town" :label="$t('profile.town')" :readonly="!editMode" clearable>
      </q-input>

      <q-input v-model="user.address" :label="$t('profile.address')" :readonly="!editMode" clearable>
      </q-input>

      <div class="text-center">
        <q-btn v-if="!editMode" :label="$t('buttons.Edit')" color="primary" @click="editMode = !editMode" />
        <q-btn v-if="editMode" :label="$t('buttons.Confirm')" type="submit" color="primary" />
        <q-btn v-if="editMode" :label="$t('buttons.Cancel')" type="reset" flat class="q-ml-sm" />
        <q-btn :label="$t('buttons.ChangePassword')" class="q-ml-sm" @click="onChangePassword" />
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { notifySuccess } from 'src/utils/notify';
import { useRouter } from 'vue-router';
import { useProfileStore } from 'src/stores/profile';
import { useCommonPage } from 'src/utils/uses';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { isEmail, isTel } from 'src/utils/str';
import _ from 'lodash';

const router = useRouter();
const profileStore = useProfileStore();
useCommonPage()

const user = reactive<M.User>(getUserData())
const editMode = ref(false)

function getUserData(): M.User {
  if (profileStore.user) {
    return _.cloneDeep(profileStore.user)
  } else {
    return new M.User()
  }
}

function onSubmit() {
  profileStore.updateProfile(user).then(() => {
    notifySuccess('message.updateSuccess')
    editMode.value = false
  })
}

function onReset() {
  _.assign(user, getUserData())
  editMode.value = false
}

function onChangePassword() {
  router.push({ name: C.routeChangePasswordName })
}

</script>
