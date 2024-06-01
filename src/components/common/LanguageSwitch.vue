<template>
  <div>
    <q-btn v-if="langs.showLanguage" :label="langs.selectedLang().label" icon="translate" flat>
      <q-menu>
        <q-list style="min-width: 100px">
          <q-item v-for="lang in langs.supportedLanguages" :key="lang.value" clickable v-close-popup
            @click="clickLanguage(lang)">
            <q-item-section>{{ lang.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
// 语言选择
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { Language, useCommonStore } from 'stores/common';

const { locale } = useI18n({ useScope: 'global' });
const commonStore = useCommonStore();
const { langs } = storeToRefs(commonStore);

function clickLanguage(lang: Language) {
  if (lang.value !== <string>locale.value) {
    locale.value = lang.value;
    commonStore.updateLang(lang.value);
  }
}
</script>
