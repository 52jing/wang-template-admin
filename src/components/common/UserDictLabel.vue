<template>
  <span v-if="dict">{{ dict.dictVal }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCommonStore } from 'src/stores/common';
import * as M from 'src/components/models';

interface Props {
  // 用户字典ID
  id: string | null
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

const commonStore = useCommonStore();

const dict = ref<M.UserDict>()

async function getUserDict(id?: string | null) {
  if (id) {
    dict.value = await commonStore.getUserDict(id);
  }
}

onMounted(() => {
  getUserDict(props.id)
})

</script>
