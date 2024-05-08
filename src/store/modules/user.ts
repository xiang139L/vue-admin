import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/modules/user'
const useUserStore = defineStore({
  // id: 必须的，在所有 Store 中唯一
  id: 'userState',
  // state: 返回对象的函数
  state: () => ({
    // 登录token
    token: null,
    // 登录用户信息
    userInfo: {
      id: 3131307098,
      username: 'admin',
      nickname: null,
      email: null,
      created_at: '2024-03-11 06:10:51',
      last_login: null,
      status: 1,
      user_level_name: 'admin',
    },
    // 角色
    roles: [],
  }),
  getters: {},
  // 可以同步 也可以异步
  actions: {
    // 登录
    async login(userInfo) {
      const { username, password } = userInfo
      let data: any = await login({ username, password })
      debugger
      if (data?.code! != 200) return
      this.token = data.access
      debugger
      await this.getInfo(data.username)
      return userInfo
    },
    // 获取用户授权角色信息，实际应用中 可以通过token通过请求接口在这里获取用户信息
    getRoles(userInfo) {
      // 获取权限列表 默认就是超级管理员，因为没有进行接口请求 写死
      this.roles = [userInfo.user_level_name]
      Promise.resolve(this.roles)
    },
    // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
    async getInfo(username: string) {
      let data: any = await getUserInfo({ username })
      if (data?.code != 200) return

      this.userInfo = data.info.user_info

      this.getRoles(this.userInfo)
      Promise.resolve(this.userInfo)
    },
    // 编辑用户信息3
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    // 退出
    logout() {
      return new Promise((resolve, reject) => {
        this.token = null
        this.userInfo = {}
        this.roles = []
        resolve(null)
      })
    },
  },
  // 进行持久化存储
  persist: {
    // 本地存储的名称
    key: 'userState',
    //保存的位置
    storage: window.localStorage, //localstorage
  },
})

export default useUserStore
