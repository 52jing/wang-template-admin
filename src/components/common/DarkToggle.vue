<template>
  <div>
    <q-btn icon="fa-solid fa-circle-half-stroke" flat @click="onClick"></q-btn>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()

function onClick() {
  $q.dark.toggle()
}
</script>
