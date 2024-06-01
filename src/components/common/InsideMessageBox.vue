<template>
  <q-btn icon="notifications" flat>
    <q-badge v-if="total > 0" color="red" floating>{{ total }}</q-badge>
    <q-menu>
      <q-list v-if="total > 0" bordered separator>
        <q-item v-for="item in messages" :key="item.id">
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label caption :lines="lines" :style="{ maxWidth: maxWidth, wordWrap: wrap, overflowWrap: wrap }">{{
      item.content }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label caption><q-btn flat @click="onViewMessage(item)">{{ $t('buttons.View')
                }}</q-btn></q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-banner v-else>
        <template v-slot:avatar>
          <q-icon name="comments_disabled" size="md" />
        </template>
        {{ $t('task.message.noMessage') }}
      </q-banner>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useRouter } from 'vue-router';
import * as taskApi from 'src/api/task';

interface Props {
  maxWidth?: string
  lines?: number
}

// 默认值
withDefaults(defineProps<Props>(), {
  maxWidth: '200px',
  lines: 2
})

const wrap = 'break-word'

const router = useRouter();

const messages = ref<M.InsideMessage[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

function getUnreadMessages() {
  taskApi.getUserReceivedMessages(true, page.value, pageSize.value).then(d => {
    messages.value = <M.InsideMessage[]>d.data.data
    total.value = d.data.total
  })
}

function onViewMessage(item: M.InsideMessage) {
  router.push({ name: C.routeInsideMessageDetailName, params: { 'id': item.id } })
}

onMounted(() => {
  getUnreadMessages()
})
</script>
