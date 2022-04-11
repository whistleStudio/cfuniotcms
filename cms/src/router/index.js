import Vue from 'vue'

import routes from '@/router/routes'
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  // mode: "history"
})

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("token")
  let role = sessionStorage.getItem("role")
  if (to.path === "/login") {
    next()
  } else if (token) {
    if (role == 2) {
      if (to.path === "/admin/school"||"/admin") next()
      else {next("/login"); alert("当前用户组不支持该操作")}
    } else {
      if (to.path !== "/admin/school") next()
      else {next("/admin/user"); alert("当前用户组不支持该操作")}
    }
  } else {
    next("/login")
    alert("token失效, 请重新登录")
  }
})


export default router