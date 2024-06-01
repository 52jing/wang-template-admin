<template>
  <q-page>
    <div class="row q-pa-md">
      <div class="col-8">
        <div>
          <normal-announcement-box load-data-after-mounted></normal-announcement-box>
        </div>
        <div>
          <quick-link-bar color="orange" text-color="white"></quick-link-bar>
        </div>
      </div>
      <div class="col-4 q-pl-md">
        <important-announcement-box load-data-after-mounted></important-announcement-box>
      </div>
      <div>
        <notification-announcement-box load-data-after-mounted></notification-announcement-box>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useCommonPage } from 'src/utils/uses';
import QuickLinkBar from 'src/components/nav/QuickLinkBar.vue';
import ImportantAnnouncementBox from 'src/components/system/ImportantAnnouncementBox.vue';
import NormalAnnouncementBox from 'src/components/system/NormalAnnouncementBox.vue';
import NotificationAnnouncementBox from 'src/components/system/NotificationAnnouncementBox.vue';

useCommonPage();
</script>
