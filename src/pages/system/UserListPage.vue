<template>
  <q-card class="q-ma-md">
    <q-card-section>
      <div class="q-mx-md row q-gutter-md">
        <div class="col-3">
          <relation-select v-model="listFilter.departmentId" resource="/system/department"
            :label="$t('system.user.department')" clearable emit-value map-options></relation-select>
        </div>
        <div class="col-3">
          <relation-select v-model="listFilter.jobId" resource="/system/job" :label="$t('system.user.job')" clearable
            emit-value map-options></relation-select>
        </div>
        <div class="col-3">
          <q-select v-model="listFilter.superuser" :options="YesNoOptions" :label="$t('system.user.superuser')"
            clearable emit-value map-options></q-select>
        </div>
        <div class="col-3">
          <q-select v-model="listFilter.staff" :options="YesNoOptions" :label="$t('system.user.staff')" clearable
            emit-value map-options></q-select>
        </div>
        <div class="col-3">
          <q-select v-model="listFilter.active" :options="YesNoOptions" :label="$t('system.user.active')" clearable
            emit-value map-options></q-select>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat @click="onFilter">{{ $t('buttons.Filter') }}</q-btn>
    </q-card-actions>
  </q-card>

  <common-list-page ref="compRef" :label="label" :resource="resource" :perm-prefix="permPrefix" :columns="columns"
    :detailConfig="detailConfig" :createFormConfig="formConfig" :editFormConfig="formConfig" :initNewData="initNewData"
    :listFilter="listFilter" :hide-export-btn="!enableExport">
    <template v-slot:operation="slotProps">
      <q-btn v-if="hasUpdatePermission" flat dense @click="setRole(slotProps.key, slotProps.row)">{{
            $t('system.user.setRole') }}</q-btn>
      <q-btn v-if="hasUpdatePermission" flat dense @click="changePassword(slotProps.key, slotProps.row)">{{
            $t('buttons.ChangePassword') }}</q-btn>
    </template>
    <template v-slot:dialog="slotProps">
      <admin-set-password v-if="slotProps.dialogType === 'changePwd'" :user-id="slotProps.selectedId"
        @submit="onChangePwd"></admin-set-password>
      <relation-manage-list v-if="slotProps.dialogType === 'setRelation'" resource="/system/user" relationName="roles"
        relationResource="/system/role" :resource-id="slotProps.selectedId" :relationColumns="relationColumns"
        :title="$t('system.user.setRole')"></relation-manage-list>
    </template>
  </common-list-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CommonListPage from 'src/components/resource/CommonListPage.vue';
import AdminSetPassword from 'src/components/system/AdminSetPassword.vue';
import RelationManageList from 'src/components/resource/RelationManageList.vue';
import RelationSelect from 'src/components/common/RelationSelect.vue';
import * as M from 'src/components/models';
import * as C from 'src/utils/constants';
import { useI18n } from 'vue-i18n';
import { useCommonPage } from 'src/utils/uses';
import { useProfileStore } from 'src/stores/profile';
import { setPwd } from 'src/api/admin';
import { isEmail, isTel } from 'src/utils/str';
import { notifySuccess } from 'src/utils/notify';

const i18n = useI18n();
useCommonPage();

const profileStore = useProfileStore()

const compRef = ref();

// 资源名称
const label = i18n.t('system.user.resourceTitle')
// 资源地址
const resource = '/system/user'
// 权限前缀
const permPrefix = 'system:user'
// 启用导出
const enableExport = true
// 表格列定义
const columns: M.ResourceTableColumn[] = [
  { name: 'id', required: true, align: 'left', label: 'ID', field: 'id', sortable: true, sortOrder: 'ad' },
  {
    name: 'username',
    required: true,
    label: i18n.t('system.user.username'),
    align: 'left',
    field: 'username',
    sortable: true
  },
  { name: 'nickname', align: 'left', label: i18n.t('system.user.nickname'), field: 'nickname', sortable: true },
  { name: 'email', align: 'left', label: i18n.t('system.user.email'), field: 'email', sortable: true },
  { name: 'tel', align: 'left', label: i18n.t('system.user.tel'), field: 'tel', sortable: true },
  { name: 'sex', align: 'left', label: i18n.t('system.user.sex'), field: 'sexVal' },
  { name: 'active', align: 'left', label: i18n.t('system.user.active'), field: 'active', format: (val) => val ? i18n.t('yes') : i18n.t('no') },
  { name: 'superuser', align: 'left', label: i18n.t('system.user.superuser'), field: 'superuser', format: (val) => val ? i18n.t('yes') : i18n.t('no'), hide: true },
  { name: 'staff', align: 'left', label: i18n.t('system.user.staff'), field: 'staff', format: (val) => val ? i18n.t('yes') : i18n.t('no'), hide: true },
  { name: 'department', align: 'left', label: i18n.t('system.user.department'), field: 'department', hide: true },
  { name: 'job', align: 'left', label: i18n.t('system.user.job'), field: 'job', hide: true },
  { name: 'province', align: 'left', label: i18n.t('system.user.province'), field: 'email', sortable: true, hide: true },
  { name: 'city', align: 'left', label: i18n.t('system.user.city'), field: 'email', sortable: true, hide: true },
  { name: 'area', align: 'left', label: i18n.t('system.user.area'), field: 'email', sortable: true, hide: true },
  { name: 'town', align: 'left', label: i18n.t('system.user.town'), field: 'email', sortable: true, hide: true },
  { name: 'operation', required: true, align: 'left', label: i18n.t('pages.Operation'), field: '' }
]
// 详情表单字段定义
const detailConfig: M.DetailConfigProps[] = [
  { name: 'id', label: 'ID' },
  { name: 'username', label: i18n.t('system.user.username') },
  { name: 'nickname', label: i18n.t('system.user.nickname') },
  { name: 'email', label: i18n.t('system.user.email') },
  { name: 'tel', label: i18n.t('system.user.tel') },
  { name: 'sexVal', label: i18n.t('system.user.sex') },
  { name: 'active', label: i18n.t('system.user.active'), type: 'bool' },
  { name: 'superuser', label: i18n.t('system.user.superuser'), type: 'bool' },
  { name: 'staff', label: i18n.t('system.user.staff'), type: 'bool' },
  { name: 'department', label: i18n.t('system.user.department') },
  { name: 'job', label: i18n.t('system.user.job') },
  { name: 'province', label: i18n.t('system.user.province') },
  { name: 'city', label: i18n.t('system.user.city') },
  { name: 'area', label: i18n.t('system.user.area') },
  { name: 'town', label: i18n.t('system.user.town') },
  { name: 'address', label: i18n.t('system.user.address') },
  { name: 'remark', label: i18n.t('pages.remark') },
  { name: 'createdTime', label: i18n.t('pages.createdTime'), type: 'date' },
  { name: 'createdBy', label: i18n.t('pages.createdBy') },
  { name: 'updatedTime', label: i18n.t('pages.updatedTime'), type: 'date' },
  { name: 'updatedBy', label: i18n.t('pages.updatedBy') },
]
// 表单字段定义
const formConfig: M.FormConfigProps[] = [
  {
    name: 'username', label: i18n.t('system.user.username'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.user.inputUsername'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'nickname', label: i18n.t('system.user.nickname'), type: 'text',
    rules: [
      val => val && val.length > 0 || i18n.t('system.user.inputNickname'),
      val => val.length > 2 || i18n.t('message.inputAtLeastNChars', [3]),
      val => val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'email', label: i18n.t('system.user.email'), type: 'text', rules: [
      val => isEmail(val) || i18n.t('system.user.inputEmail'),
      val => !val || val.length <= 100 || i18n.t('message.inputAtMostNChars', [100]),
    ]
  },
  {
    name: 'tel', label: i18n.t('system.user.tel'), type: 'text', rules: [
      val => isTel(val) || i18n.t('system.user.inputTel'),
      val => !val || val.length <= 20 || i18n.t('message.inputAtMostNChars', [20]),
    ]
  },
  { name: 'sex', label: i18n.t('system.user.sex'), type: 'user_dict', dictName: 'sex' },
  { name: 'active', label: i18n.t('system.user.active'), type: 'checkbox' },
  { name: 'superuser', label: i18n.t('system.user.superuser'), type: 'checkbox' },
  { name: 'staff', label: i18n.t('system.user.staff'), type: 'checkbox' },
  { name: 'departmentId', label: i18n.t('system.user.department'), type: 'relation', relationResource: '/system/department' },
  { name: 'jobId', label: i18n.t('system.user.job'), type: 'relation', relationResource: '/system/job' },
  {
    name: 'province', label: i18n.t('system.user.province'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  {
    name: 'city', label: i18n.t('system.user.city'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  {
    name: 'area', label: i18n.t('system.user.area'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  {
    name: 'town', label: i18n.t('system.user.town'), type: 'text', rules: [
      val => !val || val.length <= 200 || i18n.t('message.inputAtMostNChars', [200]),
    ]
  },
  { name: 'address', label: i18n.t('system.user.address'), type: 'text' },
  { name: 'remark', label: i18n.t('pages.remark'), type: 'textarea', maxlength: 500, counter: true },
  { name: 'needChangePwd', label: i18n.t('system.user.needChangePwd'), type: 'checkbox' }
]
// 创建初始化对象
const initNewData = { active: true, superuser: false, staff: false, needChangePwd: true }
// 关联策略表定义
const relationColumns: M.ResourceTableColumn[] = [
  { name: 'id', label: i18n.t('system.user.roleId'), field: 'id', align: 'left' },
  { name: 'role', label: i18n.t('system.user.roleName'), field: 'name', sortable: true, align: 'left' },
  { name: 'remark', label: i18n.t('pages.remark'), field: 'remark', align: 'left' },
  { name: 'operation', label: i18n.t('pages.Operation'), field: '', align: 'left' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listFilter = ref<Record<string, any>>({
  departmentId: undefined,
  jobId: undefined,
  superuser: undefined,
  staff: undefined,
  active: undefined
})

const YesNoOptions = [
  { label: i18n.t('yes'), value: true },
  { label: i18n.t('no'), value: false },
]

// 是否有更新权限
const hasUpdatePermission = computed(() => {
  return profileStore.hasPerm(permPrefix + C.permissionDel + C.updatePermission)
})

function onFilter() {
  compRef.value.refresh()
}

function setRole(key: M.IdType, row: object) {
  compRef.value.updateSelected(key, row)
  compRef.value.updateDialog(true, 'setRelation')
}

function changePassword(key: M.IdType, row: object) {
  compRef.value.updateSelected(key, row)
  compRef.value.updateDialog(true, 'changePwd', true, false)
}

function onChangePwd(userId: M.IdType, pwd: string) {
  if (!userId) {
    return
  }
  setPwd(userId, pwd).then(() => {
    notifySuccess('auth.passwordChanged')
  })
  compRef.value.updateDialog(false, '')
}

</script>
