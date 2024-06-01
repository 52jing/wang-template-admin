<template>
  <div class="fullscreen bg-image text-center q-pa-md flex flex-center">
    <div class="text-pos">
      <div class="bg-text-h1">
        {{ $t('message.notFoundMessage') }}
      </div>

      <div class="bg-text-h2">
        <p>{{ $t('message.notFoundtitle') }}</p>
        <p>{{ $t('message.notFoundMethod') }}</p>
        <p>{{ $t('message.notFoundOtherMethod') }}</p>
      </div>

      <q-btn class="q-mt-xl" color="primary" text-color="white" unelevated to="/" :label="$t('buttons.Return')"
        no-caps />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.bg-image {
  background-image: url('./../assets/error_404.png');
  background-size: 100% 100%;
  justify-content: center;
}

.bg-text-h1 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 5vmin;
  letter-spacing: 4px;
}

.bg-text-h2 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 3vmin;
  letter-spacing: 4px;
}

.text-pos {
  position: relative;
  top: -20%;
}
</style>
