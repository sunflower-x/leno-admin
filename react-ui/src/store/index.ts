import useUserStore from './modules/user'
import useGlobalStore from './modules/global'
import useLayoutStore from './modules/layout'
import useRoutersStore from './modules/permission'

class RootStore {
  useUserStore: useUserStore
  useGlobalStore: useGlobalStore
  useLayoutStore: useLayoutStore
  useRoutersStore: useRoutersStore

  constructor() {
    // 对引入进行来的子模块进行实例化操作，并挂载到RootStore上
    this.useUserStore = new useUserStore()
    this.useGlobalStore = new useGlobalStore()
    this.useLayoutStore = new useLayoutStore()
    this.useRoutersStore = new useRoutersStore()
  }
}

// 实例化操作
const rootStore = new RootStore()
const useStore = () => rootStore

export default useStore