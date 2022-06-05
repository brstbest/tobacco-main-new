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
      component: () => import('@/views/production_main/index.vue'),
      meta: { title: '生产板块主页', icon: 'el-icon-s-home', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home2',
    children: [{
      path: 'home2',
      name: 'Home2',
      component: () => import('@/views/technology_main/index.vue'),
      meta: { title: '技术板块主页', icon: 'el-icon-s-home', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home3',
    children: [{
      path: 'home3',
      name: 'Home3',
      component: () => import('@/views/device_main/index.vue'),
      meta: { title: '设备板块主页', icon: 'el-icon-s-home', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/bakeryList',
    children: [{
      path: 'bakeryList',
      name: 'BakeryList',
      component: () => import('@/views/bakery_list/index'),
      meta: { title: '烤房列表', icon: 'el-icon-s-order', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/bakeryDetail',
    children: [{
      path: 'bakeryDetail',
      name: 'BakeryDetail',
      component: () => import('@/views/bakery_detail/index'),
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/lineModel',
    children: [{
      path: 'lineModel',
      name: 'LineModel',
      component: () => import('@/views/line_model/index'),
      meta: { title: '曲线模型', icon: 'el-icon-s-marketing', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/structureManagement',
    children: [{
      path: 'structureManagement',
      name: 'StructureManagement',
      component: () => import('@/views/structure_management/index'),
      meta: { title: '组织架构', icon: 'el-icon-location', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/userManagement',
    children: [{
      path: 'userManagement',
      name: 'UserManagement',
      component: () => import('@/views/user_management/index'),
      meta: { title: '用户管理', icon: 'el-icon-user-solid', permission: ["0", "1", "2", "3"] }
    }]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/personalManagement',
    children: [{
      path: 'personalManagement',
      name: 'PersonalManagement',
      component: () => import('@/views/personal_management/index'),
    }]
  },
  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/userManagement',
  //   name: 'User',
  //   meta: { title: '用户管理', icon: 'el-icon-s-custom' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Index',
  //       component: () => import('@/views/user_module/index'),
  //       meta: { title: '个人管理', icon: '', permission: ["0", "1", "2", "3"] }
  //     }
  //   ]
  // },
  // {
  //   path: '/user',
  //   component: Layout,
  //   redirect: '/user/index',
  //   name: 'User',
  //   meta: { title: '用户管理', icon: 'el-icon-s-custom' },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Index',
  //       component: () => import('@/views/user_module/index'),
  //       meta: { title: '个人管理', icon: '', permission: ["0", "1", "2", "3"] }
  //     },
  //     {
  //       path: 'user',
  //       name: 'MUser',
  //       component: () => import('@/views/user_management/index'), // Parent router-view
  //       meta: { title: '账号管理', permission: ["0", "1", "2", "3"] }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/test',
    children: [{
      path: 'test',
      name: 'Test',
      component: () => import('@/views/test.vue'),
      meta: { title: '测试用页面', icon: 'el-icon-close', permission: ["0", "1", "2", "3"] }
    }]
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
