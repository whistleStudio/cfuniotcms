const Login = ()=>import("views/Login")
const Admin = ()=>import("views/admin/Admin")

const routes = [
  {
    path: "",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/admin",
    component: Admin
  }

]

export default routes