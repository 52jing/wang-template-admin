<template>
  <q-select v-model="model" :options="options" :label="label" :clearable="clearable" :filled="filled"
    :outlined="outlined" :borderless="borderless" :standout="standout" :loading="loading" :rules="rules" lazy-rules
    emit-value>
    <template v-slot:append>
      <q-icon :name="model"></q-icon>
    </template>
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section avatar>
          <q-icon :name="scope.opt.value" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ValidationRule } from 'quasar'
import * as M from 'src/components/models';

interface Props {
  // 标签
  label?: string
  // 是否可清除
  clearable?: boolean
  // 校验规则
  rules?: ValidationRule[]
  filled?: boolean
  outlined?: boolean
  borderless?: boolean
  standout?: boolean
  loading?: boolean
}

// 默认值
withDefaults(defineProps<Props>(), {
  label: ''
})

const model = defineModel<string | undefined>()

// 可选值
const options = ref<M.OptionItem[]>([
  { label: 'search', value: 'search' },
  { label: 'home', value: 'home' },
  { label: 'account_circle', value: 'account_circle' },
  { label: 'settings', value: 'settings' },
  { label: 'done', value: 'done' },
  { label: 'info', value: 'info' },
  { label: 'check_circle', value: 'check_circle' },
  { label: 'shopping_cart', value: 'shopping_cart' },
  { label: 'favorite', value: 'favorite' },
  { label: 'description', value: 'description' },
  { label: 'logout', value: 'logout' },
  { label: 'favorite_border', value: 'favorite_border' },
  { label: 'lock', value: 'lock' },
  { label: 'schedule', value: 'schedule' },
  { label: 'face', value: 'face' },
  { label: 'manage_accounts', value: 'manage_accounts' },
  { label: 'verified', value: 'verified' },
  { label: 'filter_alt', value: 'filter_alt' },
  { label: 'thumb_up', value: 'thumb_up' },
  { label: 'event', value: 'event' },
  { label: 'fingerprint', value: 'fingerprint' },
  { label: 'login', value: 'login' },
  { label: 'visibility_off', value: 'visibility_off' },
  { label: 'check_circle_outline', value: 'check_circle_outline' },
  { label: 'calendar_today', value: 'calendar_today' },
  { label: 'highlight_off', value: 'highlight_off' },
  { label: 'help', value: 'help' },
  { label: 'paid', value: 'paid' },
  { label: 'date_range', value: 'date_range' },
  { label: 'article', value: 'article' },
  { label: 'open_in_new', value: 'open_in_new' },
  { label: 'shopping_bag', value: 'shopping_bag' },
  { label: 'lightbulb', value: 'lightbulb' },
  { label: 'credit_card', value: 'credit_card' },
  { label: 'perm_identity', value: 'perm_identity' },
  { label: 'delete_outline', value: 'delete_outline' },
  { label: 'verified_user', value: 'verified_user' },
  { label: 'fact_check', value: 'fact_check' },
  { label: 'report_problem', value: 'report_problem' },
  { label: 'assignment', value: 'assignment' },
  { label: 'star_rate', value: 'star_rate' },
  { label: 'autorenew', value: 'autorenew' },
  { label: 'build', value: 'build' },
  { label: 'view_list', value: 'view_list' },
  { label: 'print', value: 'print' },
  { label: 'work', value: 'work' },
  { label: 'lock_open', value: 'lock_open' },
  { label: 'watch_later', value: 'watch_later' },
  { label: 'update', value: 'update' },
  { label: 'contact_support', value: 'contact_support' },
  { label: 'power_settings_new', value: 'power_settings_new' },
  { label: 'done_all', value: 'done_all' },
  { label: 'explore', value: 'explore' },
  { label: 'note_add', value: 'note_add' },
  { label: 'reorder', value: 'reorder' },
  { label: 'launch', value: 'launch' },
  { label: 'pending', value: 'pending' },
  { label: 'leaderboard', value: 'leaderboard' },
  { label: 'feedback', value: 'feedback' },
  { label: 'swap_horiz', value: 'swap_horiz' },
  { label: 'assignment_turned_in', value: 'assignment_turned_in' },
  { label: 'book', value: 'book' },
  { label: 'alarm', value: 'alarm' },
  { label: 'cached', value: 'cached' },
  { label: 'translate', value: 'translate' },
  { label: 'pan_tool', value: 'pan_tool' },
  { label: 'minimize', value: 'minimize' },
  { label: 'question_mark', value: 'question_mark' },
  { label: 'hourglass_empty', value: 'hourglass_empty' },
  { label: 'thumb_down', value: 'thumb_down' },
  { label: 'source', value: 'source' },
  { label: 'support', value: 'support' },
  { label: 'announcement', value: 'announcement' },
  { label: 'restore', value: 'restore' },
  { label: 'view_headline', value: 'view_headline' },
  { label: 'subject', value: 'subject' },
  { label: 'https', value: 'https' },
  { label: 'input', value: 'input' },
  { label: 'backup', value: 'backup' },
  { label: 'circle_notifications', value: 'circle_notifications' },
  { label: 'maximize', value: 'maximize' },
  { label: 'file_download', value: 'file_download' },
  { label: 'file_upload', value: 'file_upload' },
  { label: 'download', value: 'download' },
  { label: 'folder', value: 'folder' },
  { label: 'upload', value: 'upload' },
  { label: 'attachment', value: 'attachment' },
  { label: 'file_download_done', value: 'file_download_done' },
  { label: 'star', value: 'star' },
  { label: 'star_border', value: 'star_border' },
  { label: 'star_half', value: 'star_half' },
  { label: 'toggle_on', value: 'toggle_on' },
  { label: 'warning', value: 'warning' },
  { label: 'warning_amber', value: 'warning_amber' },
  { label: 'error', value: 'error' },
  { label: 'error_outline', value: 'error_outline' },
  { label: 'notification_important', value: 'notification_important' },
  { label: 'mail', value: 'mail' },
  { label: 'bluetooth', value: 'bluetooth' },
  { label: 'map', value: 'map' },
  { label: 'dashboard', value: 'dashboard' },
  { label: 'link', value: 'link' },
  { label: 'corporate_fare', value: 'corporate_fare' },
  { label: 'room_preferences', value: 'room_preferences' },
  { label: 'perm_data_setting', value: 'perm_data_setting' },
  { label: 'policy', value: 'policy' },
  { label: 'dataset', value: 'dataset' },
  { label: 'manage_history', value: 'manage_history' },
  { label: 'menu', value: 'menu' },
  { label: 'apps', value: 'apps' },
  { label: 'bookmark_border', value: 'bookmark_border' },
  { label: 'desktop_windows', value: 'desktop_windows' },
])

</script>
