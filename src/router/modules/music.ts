import Layout from '@/layout/index.vue'

const musicRouter = [
  {
    path: '/music',
    component: Layout,
    redirect: '/user/musicList',
    name: 'music',
    alwaysShow: true,
    meta: {
      title: '音乐管理',
      icon: 'Headset',
      roles: ['admin', 'user'],
    },
    children: [
      {
        path: 'musicList',
        component: () => import('@/pages/music/musicList/index.vue'),
        name: 'musicList',
        meta: { title: '歌曲列表', keepAlive: true, icon: 'MenuIcon', roles: ['admin', 'user'] },
      },
      {
        path: 'songerList',
        component: () => import('@/pages/music/songerList/index.vue'),
        name: 'songerList',
        meta: { title: '歌曲列表', keepAlive: true, icon: 'MenuIcon', roles: ['admin', 'user'] },
      },
    ],
  },
]
export default musicRouter
