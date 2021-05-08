// 1. 是一个插件 有 VueRouter class 以及 install 方法
// 2. new VueRouter(options) 一个实例 挂载到 根实例上 并且所有组件能通过 this.$router  访问router 实例
// 3. router-link router-view 两个全局组件 router-link 跳转，router-view 显示内容
// 4. 监听 url 变化 监听 haschange || popstate 事件
// 5. 响应最新的 url ： 创建一个响应式的属性 current 当它改变的时候获取对应的组件并显示
// 6. 子组件 深度标记 与 macth()
let Vue
// 保存路由配置选项
class VueRouter { // new VueRouter(routes)
  constructor(options) {
    this.$options = options
    // todo 缓存一个路由映射表

    // 响应式的matched 按深度存放路由配置
    Vue.util.defineReactive(this, 'matched', [])

    // this.current 记录的当前的URL标识符
    const initPath = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(this, 'current', initPath)

    // 监听URL变化
    window.addEventListener('hashchange', this.onHashChange.bind(this))
    // page加载时也要匹配当前URL需要render的组件
    window.addEventListener('load', this.onHashChange.bind(this))
    this.match()
  }
  onHashChange() {
    this.current = window.location.hash.slice(1) || '/'
    this.matched = []
    this.match()
  }
  match(routes) {
    routes = routes || this.$options.routes
    //递归遍历记录当前URL下所有命中的route
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') { // 首页
        this.matched.push(route)
        return
      }
      // about/info
      if (route.path !== '/' && ~this.current.indexOf(route.path)) {
        this.matched.push(route)
        if (route.children) {
          this.match(route.children)
        }
        return
      }
    }
  }
}

VueRouter.install = function (_Vue) { //
  Vue = _Vue // 接受宿主环境的 Vue
  Vue.mixin({
    beforeCreate() {
      // 将根组件上的 router 实例挂载到 Vue 实例原型，那么所有的 组件实例上都会有 $router
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router
      }
    },
  })

  const Link = Vue.extend({
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render(h) {
      return h('a', {
        attrs: {
          href: '#' + this.to
        }
      }, [this.$slots.default]
      )
    }
  })

  // 1. 标记深度
  const View = Vue.extend({
    render(h) {
      this.$vnode.data.routerView = true // 标记当前组件是 router-view
      let depth = 0
      //递归确认 当前 router-view 在组件树中的深度
      let parent = this.$parent
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data
        if (vnodeData) {
          if (vnodeData.routerView) { // 说明是一个 router-view
            ++depth
          }
        }
        parent = parent.$parent
      }
      let component = null
      const { matched } = this.$router
      if (matched[depth]) {
        component = matched[depth].component
      }
      console.log('当前深度：', depth);
      console.log('当前matched：', this.$router.matched);
      return h(component)

    }
  })

  Vue.component('router-link', Link)
  Vue.component('router-view', View)
}

export default VueRouter