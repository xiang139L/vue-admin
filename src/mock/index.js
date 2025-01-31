export const userData = [
  {
    username: 'zzb',
    nickname: '林峰',
    sex: '男',
    role: '超级管理员',
    status: true,
    photo: '15333333333',
    describe: '超级管理员不可删除',
    createTime: '2022-09-02 15:30:20',
  },
  {
    username: 'zhangsan',
    nickname: '张三',
    sex: '女',
    role: '管理员',
    status: true,
    photo: '15311111111',
    describe: '管理员不可删除',
    createTime: '2022-09-02 15:30:20',
  },
  {
    username: 'lisi',
    nickname: '李四',
    sex: '男',
    role: '管理员',
    status: true,
    photo: '13823456789',
    describe: '测试账户',
    createTime: '2022-09-02 15:30:20',
  },
  {
    username: 'wangwu',
    nickname: '王五',
    sex: '男',
    role: '超级管理员',
    status: false,
    photo: '13923456789',
    describe: '超级管理员不可删除',
    createTime: '2022-09-02 15:30:20',
  },
  {
    username: 'zhaoliu',
    nickname: '赵柳',
    sex: '男',
    role: '普通用户',
    status: false,
    photo: '14523456789',
    describe: '普通测试用户',
    createTime: '2022-09-02 15:30:20',
  },
]

export const roleData = [
  {
    roleName: '超级管理员',
    roleId: 'admin',
    roleIdentification: 'admin',
    describe: '这是超级管理员，拥有一切权限',
    createTime: '2022-09-02 15:30:20',
  },
  {
    roleName: '管理员',
    roleId: 'role',
    roleIdentification: 'admin',
    describe: '普通管理员',
    createTime: '2022-09-02 15:30:20',
  },
  {
    roleName: '普通用户',
    roleId: 'other',
    describe: '测试用户',
    roleIdentification: 'other',
    createTime: '2022-09-02 15:30:20',
  },
]

export const menuData = [
  {
    menuName: '首页',
    menuType: '菜单',
    menuRouter: '/home',
    identification: 'menu:home',
    parentId: 0,
    level: 1,
    id: 0,
    createTime: '2022-09-02',
  },
  {
    menuName: '表格',
    menuType: '目录',
    menuRouter: '/table',
    identification: 'menu:table',
    parentId: 0,
    level: 1,
    id: 1,
    createTime: '2022-09-02',
    children: [
      {
        menuName: '菜单1',
        menuType: '菜单',
        menuRouter: '/table',
        identification: 'menu1:view',
        parentId: 1,
        level: 2,
        id: 10,
        createTime: '2022-09-02',
        children: [
          {
            menuName: '按钮1',
            menuType: '按钮',
            menuRouter: '/table',
            identification: 'menu1:view:btn1',
            parentId: 10,
            id: 20,
            level: 3,
            createTime: '2022-09-02',
          },
          {
            menuName: '按钮2',
            menuType: '按钮',
            menuRouter: '/table',
            identification: 'menu1:view:btn2',
            parentId: 10,
            id: 21,
            level: 3,
            createTime: '2022-09-02',
          },
          {
            menuName: '按钮3',
            menuType: '按钮',
            menuRouter: '/table',
            identification: 'menu1:view:btn2',
            parentId: 10,
            id: 22,
            level: 3,
            createTime: '2022-09-02',
          },
        ],
      },
    ],
  },

  {
    menuName: '可视化图表',
    menuType: '目录',
    menuRouter: '/charts',
    identification: 'menu:charts',
    parentId: 0,
    level: 1,
    id: 1,
    createTime: '2022-09-02',
    children: [
      {
        menuName: '菜单1',
        menuType: '菜单',
        menuRouter: '/charts',
        identification: 'menu1:view',
        parentId: 1,
        level: 2,
        id: 10,
        createTime: '2022-09-02',
        children: [
          {
            menuName: '按钮1',
            menuType: '按钮',
            menuRouter: '/charts',
            identification: 'menu1:view:btn1',
            parentId: 10,
            id: 20,
            level: 3,
            createTime: '2022-09-02',
          },
          {
            menuName: '按钮2',
            menuType: '按钮',
            menuRouter: '/charts',
            identification: 'menu1:view:btn2',
            parentId: 10,
            id: 21,
            level: 3,
            createTime: '2022-09-02',
          },
          {
            menuName: '按钮3',
            menuType: '按钮',
            menuRouter: '/charts',
            identification: 'menu1:view:btn2',
            parentId: 10,
            id: 22,
            level: 3,
            createTime: '2022-09-02',
          },
        ],
      },
    ],
  },
  {
    menuName: '基础组件',
    menuType: '目录',
    menuRouter: '/components',
    identification: 'menu:components',
    parentId: 0,
    level: 1,
    id: 1,
    createTime: '2022-09-02',
    children: [
      {
        menuName: '菜单1',
        menuType: '菜单',
        menuRouter: '/components',
        identification: 'menu1:view',
        parentId: 1,
        level: 2,
        id: 10,
        createTime: '2022-09-02',
        children: [
          {
            menuName: '按钮1',
            menuType: '按钮',
            menuRouter: '/components',
            identification: 'menu1:view:btn1',
            parentId: 10,
            id: 20,
            level: 3,
            createTime: '2022-09-02',
          },
          {
            menuName: '按钮2',
            menuType: '按钮',
            menuRouter: '/components',
            identification: 'menu1:view:btn2',
            parentId: 10,
            id: 21,
            level: 3,
            createTime: '2022-09-02',
          },
          {
            menuName: '按钮3',
            menuType: '按钮',
            menuRouter: '/components',
            identification: 'menu1:view:btn2',
            parentId: 10,
            id: 22,
            level: 3,
            createTime: '2022-09-02',
          },
        ],
      },
    ],
  },
]
