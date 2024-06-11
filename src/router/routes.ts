import { RouteRecordRaw } from 'vue-router';
import * as C from 'src/utils/constants';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // 首页
      {
        path: '',
        name: C.routeHomeName,
        component: () => import('pages/IndexPage.vue'),
        meta: {
          title: 'pages.Home',
        },
      },
      // 设置
      {
        path: 'settings',
        name: C.routeSettingsName,
        component: () => import('pages/admin/SettingsPage.vue'),
        meta: {
          title: 'pages.Settings',
        },
      },
      // 用户中心
      {
        path: 'profile',
        name: C.routeProfileName,
        component: () => import('pages/auth/ProfileCenter.vue'),
        meta: {
          title: 'pages.Profile',
          requiresAuth: true,
        },
      },
      // 修改密码
      {
        path: 'change_password',
        name: C.routeChangePasswordName,
        component: () => import('pages/auth/ChangePassword.vue'),
        meta: {
          title: 'pages.ChangePassword',
          requiresAuth: true,
        },
      },
      // 系统管理
      {
        path: 'system/user',
        name: 'system_user',
        component: () => import('pages/system/UserListPage.vue'),
        meta: {
          title: 'system.user.pageTitle',
          requiresAuth: true,
          perm: 'system:user:view',
        },
      },
      {
        path: 'system/role',
        name: 'system_role',
        component: () => import('pages/system/RoleListPage.vue'),
        meta: {
          title: 'system.role.pageTitle',
          requiresAuth: true,
          perm: 'system:role:view',
        },
      },
      {
        path: 'system/policy',
        name: 'system_policy',
        component: () => import('pages/system/PolicyListPage.vue'),
        meta: {
          title: 'system.policy.pageTitle',
          requiresAuth: true,
          perm: 'system:policy:view',
        },
      },
      {
        path: 'system/permission',
        name: 'system_permission',
        component: () => import('pages/system/PermissionListPage.vue'),
        meta: {
          title: 'system.permission.pageTitle',
          requiresAuth: true,
          perm: 'system:permission:view',
        },
      },
      {
        path: 'system/data_scope',
        name: 'system_data_scope',
        component: () => import('pages/system/DataScopeListPage.vue'),
        meta: {
          title: 'system.dataScope.pageTitle',
          requiresAuth: true,
          perm: 'system:data_scope:view',
        },
      },
      {
        path: 'system/department',
        name: 'system_department',
        component: () => import('pages/system/DepartmentTreePage.vue'),
        meta: {
          title: 'system.department.pageTitle',
          requiresAuth: true,
          perm: 'system:department:view',
        },
      },
      {
        path: 'system/frontend',
        name: 'system_frontend',
        component: () => import('pages/system/FrontendListPage.vue'),
        meta: {
          title: 'system.frontend.pageTitle',
          requiresAuth: true,
          perm: 'system:frontend:view',
        },
      },
      {
        path: 'system/job',
        name: 'system_job',
        component: () => import('pages/system/JobListPage.vue'),
        meta: {
          title: 'system.job.pageTitle',
          requiresAuth: true,
          perm: 'system:job:view',
        },
      },
      {
        path: 'system/menu',
        name: 'system_menu',
        component: () => import('pages/system/MenuTreePage.vue'),
        meta: {
          title: 'system.menu.pageTitle',
          requiresAuth: true,
          perm: 'system:menu:view',
        },
      },
      {
        path: 'system/user_dict',
        name: 'system_user_dict',
        component: () => import('pages/system/UserDictListPage.vue'),
        meta: {
          title: 'system.userDict.pageTitle',
          requiresAuth: true,
          perm: 'system:user_dict:view',
        },
      },
      {
        path: 'system/announcement',
        name: 'system_announcement',
        component: () => import('pages/system/AnnouncementListPage.vue'),
        meta: {
          title: 'system.announcement.pageTitle',
          requiresAuth: true,
          perm: 'system:announcement:view',
        },
      },
      // 查看公告
      {
        path: 'announcement/:id',
        name: C.routeAnnouncementDetailName,
        component: () => import('pages/system/AnnouncementDetailPage.vue'),
        props: true,
        meta: {
          title: 'system.announcement.pageTitle',
          requiresAuth: true,
          noHistory: true,
        },
      },
      // 后台下载
      {
        path: 'download_center',
        name: C.routeDownloadCenterName,
        component: () => import('pages/system/BgDownloadListPage.vue'),
        props: true,
        meta: {
          title: 'system.bgTask.downloadCenterTitle',
          requiresAuth: true,
        },
      },
      // 日志记录
      {
        path: 'log/operation_log',
        name: 'system_operation_log',
        component: () => import('pages/system/OperationLogListPage.vue'),
        meta: {
          title: 'system.operationLog.pageTitle',
          requiresAuth: true,
          perm: 'log:operation_log:view',
        },
      },
      {
        path: 'log/user_log',
        name: 'system_user_log',
        component: () => import('pages/system/UserLogListPage.vue'),
        meta: {
          title: 'system.userLog.pageTitle',
          requiresAuth: true,
          perm: 'log:user_log:view',
        },
      },
      // 站内信
      {
        path: 'task/inside_message_box',
        name: C.routeInsideMessageBoxName,
        component: () => import('pages/task/InsideMessageBoxPage.vue'),
        meta: {
          title: 'task.message.pageTitle',
          requiresAuth: true,
        },
      },
      {
        path: 'task/inside_message/:id',
        name: C.routeInsideMessageDetailName,
        component: () => import('pages/task/InsideMessageDetailPage.vue'),
        props: true,
        meta: {
          title: 'task.message.pageTitle',
          requiresAuth: true,
          noHistory: true,
        },
      },
      // 快捷菜单
      {
        path: 'task/quick_link',
        name: C.routeQuickLinkManageName,
        component: () => import('pages/task/QuickLinkListPage.vue'),
        meta: {
          title: 'task.quickLink.pageTitle',
          requiresAuth: true,
        },
      },
      // 模板管理
      {
        path: 'template/template',
        name: 'templateList',
        component: () => import('pages/template/TemplateListPage.vue'),
        meta: {
          title: 'template.template.pageTitle',
          requiresAuth: true,
        },
      },
      // 数据源管理
      {
        path: 'template/datasource',
        name: 'datasourceList',
        component: () => import('pages/template/DatasourceListPage.vue'),
        meta: {
          title: 'template.datasource.pageTitle',
          requiresAuth: true,
        },
      },
      {
        path: 'template/datasource/:id',
        name: 'datasourceDetail',
        component: () => import('pages/template/DatasourceDetailPage.vue'),
        props: true,
        meta: {
          title: 'template.datasource.pageTitle',
          requiresAuth: true,
          noHistory: true,
        },
      },
      // 渲染执行
      {
        path: 'template/render_execution',
        name: 'renderExecutionList',
        component: () => import('pages/template/RenderExecutionListPage.vue'),
        meta: {
          title: 'template.renderExecution.pageTitle',
          requiresAuth: true,
        },
      },
      {
        path: 'template/render_execution/:id',
        name: 'renderExecutionDetail',
        component: () => import('pages/template/RenderExecutionDetailPage.vue'),
        props: true,
        meta: {
          title: 'template.renderExecution.pageTitle',
          requiresAuth: true,
          noHistory: true,
        },
      },
      // 分析
      {
        path: 'analysis',
        name: 'analysis',
        component: () => import('pages/analysis/AnalysisPage.vue'),
        meta: {
          title: 'template.analysis.pageTitle',
          requiresAuth: true,
        },
      },
    ],
  },
  // 登录
  {
    path: '/login',
    name: C.routeLoginName,
    component: () => import('pages/auth/LoginPage.vue'),
    meta: {
      title: 'pages.Login',
    },
  },
  // 注册
  {
    path: '/register',
    name: C.routeRegisterName,
    component: () => import('pages/auth/RegisterPage.vue'),
    meta: {
      title: 'pages.Register',
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
