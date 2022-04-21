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
### [202204010000]
! Fools' Day !
userApi:
/api/user/batchGen - 数据库添加完成
Account.vue:
样式微调
PageNavigator.vue:
创建，跳转逻辑梳理，页面搭建中...
### [202204021656] 
pageNavigator逻辑书写，有点绕
### [202204061656]
pageNavigator逻辑优化
userApi:
/api/user/getPageContent - 获取页面显示信息，filter {$and:[{},{},{$or:[]}]}
model User - 增加了一些字段初始值，方便查询，虽然也做了防空的处理
Account.vue - getPageContent方法
### [202204081725]
PageNavigator：
首尾左右navLiChangeClick，指定页面跳转toPageIpFocus, 
属性resetState用于监控父级页面是否重置
Account：
优化getPageContent 增加参数mode用于决定是否忽视关键词
searchContent 参数reset决定重置或检索功能
### [2022040111728]
utils-genWorkbook 生成表格
Account:
优化getPageContent 实现批量导出功能，导出表格会结合页面的关键词
School:
页面基本布局
路由首位进行调整
Admin:
mounted默认激活菜单栏第一项
userApi-getMyStudents 用于获得某个用户的学生
### [2022040121732]
Account:
getPageContent-适配navigator
userApi:
getMyStudents
editOneAccount-修改单个账号
Schoool:
batchEdit-索引选择范围，密码修改(指定, 随机生成)，学校修改
### [2022040131748]
utils:
genWorkbook -优化 提高通用性; 关联Account
School:
批量编辑，数据导出完成
userApi:
editManyAccounts-修改多个账号
### [2022040141725]
code 开始
### [2022040151725]
code: 
页面UI搭建完成，功能模块抽离
genModal - 相关验证
批量创建激活码功能完成
codeApi:
/api/code/genModalSubmit - 后台随机生成定数定级激活码
### [2022040181731]
api记得前面加 `/`!!!
code:
关键词查询，数据导出
searchBar:(account也需修改一下)
kws改为属性keywords的深拷贝，以消除与父级页面数据的相互干涉，只有点击查询才会读取input里的新关键词
mongo比较器$gt大于,$gte大于等于,$lt小于,$lte小于等于
filter:[{key: {"$gt": num1, "$lt": num2}}] Date类型也可以比较
### [2022040191730]
user: 
管理员管理页面基本完成
userapi:
/getAdmins - 获取管理员列表
/addAdmin - 新增管理员，有则改，无则增（引入random-words库，用于生成随机name）
现阶段，后台管理教师、普通管理员身份登入业务已完成
*学习记录:* 插件引入时，通常会在外层加个div，这里的div, id最好不要与插件里的重复，以免样式受层叠性影响乱套  
### [2022040201725]
user, code, account, userapi, codeapi
超级管理员权限 增加的删除操作功能 完成
user-可将普通管理员恢复成普通用户
code-可单个/批量删除激活码
account-（仅限学生/普通）可删除单个/批量学生账号，连同注册设备一起清空
页面展示逻辑修改， 现在role>=2用户都有校园管理功能， userapi批量添加账号时，判断pmail ? pmail.role?

基本完成了，还有些组件可以复用，缩小些体积
### [2022040211146]
account-也使用了组件，缩小体积
admin-侧边栏图标对其
userapi-修复了关键词搜素，数值类型数据等级原正则搜索产生的问题