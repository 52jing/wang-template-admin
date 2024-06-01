<template>
  <q-list>
    <q-item-label header>
      {{ menuTitle }}
    </q-item-label>

    <template v-for="menu in asideMenus" :key="menu.id">
      <q-expansion-item v-if="menu.children.length > 0" expand-separator :label="menu.name" :icon="menu.icon"
        :caption="menu.caption">
        <q-list>
          <q-item v-for="sub in menu.children" :key="sub.id" clickable @click="onClick(sub)">
            <q-item-section v-if="sub.icon" avatar>
              <q-icon :name="sub.icon" />
            </q-item-section>

            <q-item-section class="q-pl-md">
              <q-item-label>{{ sub.name }}</q-item-label>
              <q-item-label caption>{{ sub.caption }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
      <q-item v-else clickable @click="onClick(menu)">
        <q-item-section v-if="menu.icon" avatar>
          <q-icon :name="menu.icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ menu.name }}</q-item-label>
          <q-item-label caption>{{ menu.caption }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCommonStore } from 'stores/common';
import { useProfileStore } from 'stores/profile';
import { useRouter } from 'vue-router';
import * as M from 'src/components/models';

const commonStore = useCommonStore();
const profileStore = useProfileStore();
const router = useRouter();

const menuTitle = computed(() => {
  return commonStore.menuTitle;
})

const asideMenus = computed(() => {
  return profileStore.asideMenus;
})

function onClick(menu: M.Menu) {
  if (menu.path.startsWith('http://') || menu.path.startsWith('https://')) {
    window.open(menu.path);
  } else if (menu.path.startsWith('/')) {
    router.push({ path: menu.path });
  } else {
    router.push({ name: menu.path });
  }
}
</script>
