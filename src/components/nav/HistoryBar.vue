<template>
  <div class="row justify-center">
    <q-chip v-for="item in histories" :key="item.path" :color="getColor(item)" :text-color="getTextColor(item)" square
      removable clickable @click="onClick(item)" @remove="onRemove(item)">{{
      $t(item.label) }}</q-chip>
  </div>
  <q-separator />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProfileStore } from 'src/stores/profile';
import * as M from 'src/components/models';

interface Props {
  activeColor?: string
  activeTextColor?: string
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  activeColor: 'primary',
  activeTextColor: 'white',
})

const profileStore = useProfileStore();
const router = useRouter();
const route = useRoute();

const histories = computed(() => {
  return profileStore.pageHistory
})

const currPath = computed(() => {
  return route.path
})

function getColor(item: M.PageHistoryRecord) {
  if (item.path === currPath.value) {
    return props.activeColor
  }
  return undefined
}

function getTextColor(item: M.PageHistoryRecord) {
  if (item.path === currPath.value) {
    return props.activeTextColor
  }
  return undefined
}

function onClick(item: M.PageHistoryRecord) {
  router.push({ path: item.path })
}

function onRemove(item: M.PageHistoryRecord) {
  profileStore.removePageHistory(item.path)
}
</script>
