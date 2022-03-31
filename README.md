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
logApi /api/log 返回增加username
account页面布局，批量生成按钮modal触发
### [202203311717]
userApi: 
/api/user/checkName - 查重用户名前缀，正则：用户名前缀+至少一个数字，匹配user.name字段
/api/user/batchGen - 批量生成主要，hash邮箱,生成过程查询role:0字段文档邮箱是否重复；还差数据库实质添加操作
Account.vue:
批量生成Modal相关, 必填信息父级邮箱,数量,用户名前缀, 选填学校(默认创趣学院)