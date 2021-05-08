import Vue from 'vue'
import VueRouter from './my-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
// const a = {
//   template: '<div>This is about/a</div>'
// }
// const b = {
//   template: '<div>This is about/b</div>'
// }
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.,
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      { path: 'a', name: 'AboutA', component: { name: 'AboutA', render(h) { return h('div', 'This is about/a') } } },
      { path: 'b', name: 'AboutB', component: { name: 'AboutB', render(h) { return h('div', 'This is about/b') } } }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
