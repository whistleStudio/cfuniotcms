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
