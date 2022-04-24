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
      component: () => import('@/views/production_module/index'),
      meta: { title: '首页', icon: 'el-icon-s-home', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/harvest',
    children: [{
      path: 'harvest',
      name: 'Harvest',
      component: () => import('@/views/production_module/harvest'),
      meta: { title: '采编管理', icon: 'el-icon-s-opportunity', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/bake',
    component: Layout,
    redirect: '/bake/sdevice',
    name: 'Bake',
    meta: { title: '烘烤管理', icon: 'el-icon-odometer' },
    children: [
      {
        path: 'sdevice',
        name: 'DeviceSupervision',
        component: () => import('@/views/bake_module/sdevice'),
        meta: { title: '设备监管', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'record',
        name: 'Record',
        component: () => import('@/views/bake_module/record'),
        meta: { title: '烘烤记录', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'mdevice',
        name: 'DeviceManagement',
        component: () => import('@/views/bake_module/mdevice'),
        meta: { title: '设备管理', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'station',
        name: 'Station',
        component: () => import('@/views/bake_module/station'),
        meta: { title: '烟站管理', icon: '', permission: ["0", "1", "2", "3"] }
      }
    ]
  },

  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/bdata',
    name: 'Analysis',
    meta: { title: '数据分析', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'bdata',
        name: 'BData',
        component: () => import('@/views/analysis_module/bdata'),
        meta: { title: '采烤数据', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'other',
        name: 'Other',
        component: () => import('@/views/analysis_module/other'),
        meta: { title: '其它数据', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/analysis_module/index'),
        meta: { title: '评分对比', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'line',
        name: 'Line',
        component: () => import('@/views/analysis_module/line'),
        meta: { title: '智能曲线', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'mdata',
        name: 'MData',
        component: () => import('@/views/analysis_module/mdata'),
        meta: { title: '数据展示', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'qdata',
        name: 'QData',
        component: () => import('@/views/analysis_module/qdata'),
        meta: { title: '数据查询', icon: '', permission: ["0", "1", "2", "3"] }
      },
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: { title: '用户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/user_module/index'),
        meta: { title: '个人管理', icon: '', permission: ["0", "1", "2", "3"] }
      },
      {
        path: 'user',
        name: 'MUser',
        component: () => import('@/views/user_module/user'), // Parent router-view
        meta: { title: '账号管理', permission: ["0", "1", "2", "3"] }
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
