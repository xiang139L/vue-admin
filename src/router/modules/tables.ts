/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout/index.vue'

const tableRouter = [
  {
    path: '/tables',
    component: Layout,
    redirect: '/tables/comprehensive',
    name: 'tables',
    meta: {
      title: '超级表格',
      icon: 'School',
    },
    children: [
      {
        path: 'comprehensive',
        component: () => import('@/pages/tables/ComprehensiveTable/index.vue'),
        name: 'comprehensive',
        meta: { title: '综合表格', keepAlive: true, icon: 'MenuIcon' },
      },
      {
        path: 'inlineTable',
        component: () => import('@/pages/tables/InlineEditTable/index.vue'),
        name: 'inlineTable',
        meta: { title: '行内编辑', keepAlive: true, icon: 'MenuIcon' },
      },
    ],
  },
]

export default tableRouter
