## log
### [202203281735] 
创建管理系统项目，写好了登录页面，用户密码验证及TOKEN逻辑，数据库还没链
### [202203291740] 
管理系统根据role返回不同页面
try catch 写在async里面
```
async function a () {
  throw "sad"
}


;(async ()=>{
  try {
    await a()
  } catch(e){console.log("xxx");}
})()
```
### [202203301725]
logApi / 返回增加username
account页面布局，批量生成按钮modal触发