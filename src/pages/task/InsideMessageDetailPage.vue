<template>
  <q-card v-if="message" class="q-ma-md">
    <q-card-section>
      <div class="text-h6">{{ message.title }}</div>
      <div class="text-subtitle2">{{ message.type }}</div>
    </q-card-section>

    <q-card-section>
      {{ message.content }}
    </q-card-section>

    <q-separator />

    <q-card-actions>
      <q-btn flat :to="{ name: C.routeInsideMessageBoxName }">{{ $t('buttons.Return') }}</q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import * as taskApi from 'src/api/task';
import { useCommonPage } from 'src/utils/uses';

interface Props {
  id: string
}

// 默认值
const props = withDefaults(defineProps<Props>(), {

})

useCommonPage();

const message = ref<M.InsideMessage>()

function getMessage() {
  taskApi.getMessage(props.id).then(d => {
    message.value = <M.InsideMessage>d.data.data
  })
}

function readMessage() {
  taskApi.readMessage(props.id)
}

onMounted(() => {
  getMessage()
  readMessage()
})

</script>
