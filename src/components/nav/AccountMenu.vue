<template>
  <div class="q-pa-md">
    <q-btn v-if="isLogin" flat :label="nickname">
      <q-menu fit auto-close>
        <q-list style="min-width: 100px;">
          <q-item clickable :to="{ name: C.routeProfileName }">
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>
            <q-item-section>{{ $t('pages.Profile') }}</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: C.routeInsideMessageBoxName }">
            <q-item-section avatar>
              <q-icon name="textsms" />
            </q-item-section>
            <q-item-section>{{ $t('pages.Message') }}</q-item-section>
          </q-item>
          <q-item clickable :to="{ name: C.routeDownloadCenterName }">
            <q-item-section avatar>
              <q-icon name="download" />
            </q-item-section>
            <q-item-section>{{ $t('pages.DownloadCenter') }}</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="help" />
            </q-item-section>
            <q-item-section>{{ $t('pages.Help') }}</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="text_snippet" />
            </q-item-section>
            <q-item-section>{{ $t('pages.Document') }}</q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="group" />
            </q-item-section>
            <q-item-section>{{ $t('pages.About') }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item v-if="isSuperuser" clickable :to="{ name: C.routeSettingsName }">
            <q-item-section avatar>
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>{{ $t('pages.Settings') }}</q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable @click="onLogout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>{{ $t('buttons.Logout') }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn v-else flat :label="$t('buttons.Login')" icon="login" @click="onLogin"></q-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProfileStore } from 'stores/profile';
import * as C from 'src/utils/constants';

const profileStore = useProfileStore();
const router = useRouter();

const isLogin = computed(() => profileStore.isLogin);

const isSuperuser = computed(() => profileStore.isSuperuser);

const nickname = computed(() => {
  if (profileStore.user) {
    if (profileStore.user.nickname) {
      return profileStore.user.nickname
    } else {
      return profileStore.user.username
    }
  } else {
    return ''
  }
});

function onLogin() {
  router.push({ name: C.routeLoginName });
}

function onLogout() {
  profileStore.logout().finally(() => {
    router.push({ name: C.routeLoginName });
  });

}

onMounted(() => {
  profileStore.syncProfile()
})

</script>
