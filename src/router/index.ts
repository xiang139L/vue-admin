import  {createRouter, createWebHistory, RouteRecordRaw,createWebHashHistory,Router} from 'vue-router'
import Layout from '@/layout/index.vue'

import tableRouter from './modules/tables'

// 扩展继承属性
interface extendRoute {
  hidden?:boolean
}
export const constantRoutes: Array<RouteRecordRaw&extendRoute>= [
  { path: '/login',  hidden: true,component: () => import('@/pages/login/index.vue') },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    meta: { title: '首页', icon: 'House' },
    children: [
      {
      path: 'home', 
      component: () => import('@/pages/admin/index.vue'), 
      name:'首页',
      meta: { title: '首页', icon: 'House', affix: true, role: ['other'] 
      }, 
    },
    ],
  },
  {
    path: '/404',
    name: '404',
    hidden: true,
    component: () => import('@/pages/error/404.vue'),
  },
]

// 异步组件
export const asyncRoutes: Array<RouteRecordRaw&extendRoute> = [
  ...tableRouter,
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]

/**
 * path ==> 路由路径
 * name ==> 路由名称
 * component ==> 路由组件
 * redirect ==> 路由重定向
 * alwaysShow ==> 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden ==> 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * keepAlive ==> 设为true 缓存
 * meta ==> 路由元信息
 * meta.title ==> 路由标题
 * meta.icon ==> 菜单icon
 * meta.affix ==> 如果设置为true将会出现在 标签栏中
 * meta.breadcrumb ==> 如果设置为false，该项将隐藏在breadcrumb中（默认值为true）
 */

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
})

export default router
