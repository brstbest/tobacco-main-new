import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home'),
      meta: { title: '首页', icon: 'dashboard', permission: ["0", "1", "2", "3"] }
    }]
  },

  {
    path: '/production',
    component: Layout,
    redirect: '/production/data',
    name: 'Production',
    meta: { title: '生产管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'data',
        name: 'Data',
        component: () => import('@/views/production/qdata'),
        meta: { title: '数据查询', icon: 'el-icon-data-line', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'mdata',
        name: 'MData',
        component: () => import('@/views/production/mdata'),
        meta: { title: '数据展示', icon: 'el-icon-data-line', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'harvest',
        name: 'Harvest',
        component: () => import('@/views/production/harvest'),
        meta: { title: '采编管理', icon: 'el-icon-data-line', permission: ["0", "1", "2", "3"] }
      }
    ]
  },

  {
    path: '/bake',
    component: Layout,
    redirect: '/bake/data',
    name: 'Bake',
    meta: { title: '烘烤管理', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'data',
        name: 'data',
        component: () => import('@/views/bake/bdata'),
        meta: { title: '采烤数据', icon: 'el-icon-s-marketing', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'other',
        name: 'other',
        component: () => import('@/views/bake/other'),
        meta: { title: '其它数据', icon: 'el-icon-s-platform', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/bake/device'),
        meta: { title: '设备监管', icon: 'el-icon-s-platform', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'record',
        name: 'Record',
        component: () => import('@/views/bake/record'),
        meta: { title: '烘烤记录', icon: 'el-icon-s-platform', permission: ["0", "1", "2", "3"] }
      },
    ]
  },

  {
    path: '/control',
    component: Layout,
    redirect: '/control/line',
    name: 'Control',
    meta: {
      title: '智能分析',
      icon: 'el-icon-odometer'
    },
    children: [
      {
        path: 'score',
        name: 'Score',
        component: () => import('@/views/bake/index'),
        meta: { title: '评分对比', icon: 'el-icon-trophy', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'line',
        component: () => import('@/views/control/line'), // Parent router-view
        name: 'Line',
        meta: { title: '智能曲线', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'index',
        component: () => import('@/views/advanced/index'),
        name: 'index',
        meta: { title: '标准曲线', permission: ["0", "1", "2", "3"] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/self',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'el-icon-user'
    },
    children: [
      {
        path: 'self',
        name: 'Self',
        component: () => import('@/views/user/index'),
        meta: { title: '个人管理', permission: ["0", "1"] }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/user/role'),
        meta: { title: '角色管理', permission: ["0", "1"] }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/user'),
        meta: { title: '账号管理', permission: ["0", "1"] }
      },
      {
        path: 'station',
        name: 'Station',
        component: () => import('@/views/user/station'),
        meta: { title: '烟站管理', permission: ["0", "1"] }
      },
      {
        path: 'device',
        name: 'Device',
        component: () => import('@/views/user/device'),
        meta: { title: '设备管理', permission: ["0", "1"] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
