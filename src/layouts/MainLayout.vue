<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ title }}
        </q-toolbar-title>

        <inside-message-box></inside-message-box>
        <language-switch></language-switch>
        <dark-toggle></dark-toggle>
        <account-menu></account-menu>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="showMenu" v-model="leftDrawerOpen" show-if-above bordered>
      <aside-menu></aside-menu>
    </q-drawer>

    <q-page-container>
      <history-bar v-if="showHistoryBar"></history-bar>
      <router-view />
      <q-ajax-bar v-if="showAjaxBar" position="bottom" color="primary" size="5px" />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import AccountMenu from 'components/nav/AccountMenu.vue';
import AsideMenu from 'components/nav/AsideMenu.vue';
import LanguageSwitch from 'src/components/common/LanguageSwitch.vue';
import DarkToggle from 'src/components/common/DarkToggle.vue';
import HistoryBar from 'src/components/nav/HistoryBar.vue'
import InsideMessageBox from 'src/components/common/InsideMessageBox.vue';
import { useCommonStore } from 'stores/common';

const commonStore = useCommonStore();

const title = computed(() => {
  return commonStore.frontendProfile.title
})

const showAjaxBar = computed(() => {
  return commonStore.envConfig.showAjaxBar
})

const leftDrawerOpen = ref(false)

const showMenu = computed(() => {
  return commonStore.pageConfig.showMenu
})

const showHistoryBar = computed(() => {
  return commonStore.envConfig.showHistoryBar && commonStore.pageConfig.showHistory
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
