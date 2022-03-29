const Login = ()=>import("views/Login")
const Admin = ()=>import("views/admin/Admin")
const User = ()=>import("views/user/User")
const Code = ()=>import("views/code/Code")
const Account = ()=>import("views/account/Account")
const School = ()=>import("views/school/School")

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
    component: Admin,
    children: [
      {
        path: "user",
        component: User
      },
      {
        path: "code",
        component: Code
      },
      {
        path: "account",
        component: Account
      },
      {
        path: "school",
        component: School
      }
    ]
  }

]

export default routes