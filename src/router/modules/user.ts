import Layout from '@/layout/index.vue'

const userRouter = [
  {
    path: '/user',
    component: Layout,
    redirect: '/user/userList',
    name: 'user',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'User',
      roles: ['admin', 'user'],
    },
    children: [
      {
        path: 'userList',
        component: () => import('@/pages/user/userList/index.vue'),
        name: 'userIndex',
        meta: { title: '用户列表', keepAlive: true, icon: 'MenuIcon', roles: ['admin', 'user'] },
      },
    ],
  },
]
export default userRouter
