<template>
  <q-card flat bordered>
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ $t('task.quickLink.title') }}</div>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="edit" @click="onEdit"></q-btn>
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div v-if="links.length === 0"><q-btn flat icon="add" @click="onEdit">{{ $t('task.quickLink.AddNewQuickLink')
          }}</q-btn>
      </div>
      <q-chip v-for="item in links" :key="item.id" square :icon="item.icon" :size="size" clickable :color="color"
        :text-color="textColor" class="quick-link" @click="onClick(item)">
        {{ item.name }}
      </q-chip>
    </q-card-section>

  </q-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRest } from 'src/utils/uses';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';

interface Props {
  size?: string
  color?: string
  textColor?: string
}

// 默认值
withDefaults(defineProps<Props>(), {
  size: 'lg'
})

// 事件
const emit = defineEmits<{
  afterLoad: [links: M.QuickLink[]]
  clickLink: [link: M.QuickLink]
}>()

const resource = '/task/quick_link';

const router = useRouter();
const rest = useRest();
const restApi = rest.restResource(resource)

const links = ref<M.QuickLink[]>([])

function loadQuickLinks() {
  restApi.list().then(d => {
    links.value = <M.QuickLink[]>d.data
    emit('afterLoad', links.value)
  })
}

function onClick(link: M.QuickLink) {
  emit('clickLink', link)
  if (link && link.path) {
    if (link.path.startsWith('http://') || link.path.startsWith('https://')) {
      window.open(link.path);
    } else if (link.path.startsWith('/')) {
      router.push({ path: link.path });
    } else {
      router.push({ name: link.path });
    }
  }
}

function onEdit() {
  router.push({ name: C.routeQuickLinkManageName })
}

onMounted(() => {
  loadQuickLinks()
})

</script>
<style scoped>
.quick-link {
  min-width: 200px;
}
</style>
