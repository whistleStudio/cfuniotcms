const express = require("express")
const rt = express.Router()
const User = require("../db/model/User")
const Device = require("../db/model/Device")
const randomWords = require("random-words")
var hash = require('object-hash')

/* 批量生成时校验用户名前缀 */
rt.get("/checkName", (req, res) => {
  let {name} = req.query
  ;(async ()=>{
    try {
      let str = `^${name}[0-9]+`
      let reg = RegExp(str)
      let doc = await User.findOne({name: reg})
      if (!doc) {
        res.json({err:0})
      } else {
        res.json({err:1, msg:"当前用户名前缀不可用，换一个吧"})
      }
    } catch(e){
      console.log(e)
      res.json({err:5, msg:"database error"})
    }
  })()
})

/* 批量生成 */
rt.post("/batchGen", (req, res) => {
  let {pmail, num, name, school} = req.body
  ;(async ()=>{
    try {
      // pmail是否为已存在账号，是-改变role(=1); 否-创建
      // let teacher = await User.findOneAndUpdate({mail: pmail}, {role: 2})
      let teacher = await User.findOne({mail: pmail})
      if (!teacher) {
        let pwd = pmail.split("@")[0]
        await User.create({name: name+"0", role: 2, pwd, mail: pmail, school, regDate:new Date(), authDate:new Date()})
        await Device.create({user: pmail, name:"创趣小屋", did:1, regDate:new Date()})
      } 
      else if (teacher.role===1) await User.updateOne({mail: pmail}, {role: 2})
      else if (!teacher.role) throw "err1"
      // 批量生成
      let timeStamp = new Date().getTime()
      let val = timeStamp+pmail
      let mail
      let stuRegDate = new Date(), stuAuthDate = new Date()
      for (let i=1; i<=num; i++) {
        let createOK = 0, safeCount = 0
        val += i
        while (!createOK) {
          // 截取hash一部分可能重复
          mail = hash(val).slice(0,11) + "@cfun.com"
          let doc = await User.findOne({role: 0, mail})
          // 查重合格，创建；否则重新生成
          if (!doc) {
            createOK = 1
            await User.create({name: name+i, role: 0, pwd: "12345678", mail, pmail, school, regDate:stuRegDate, authDate:stuAuthDate})
            await Device.create({user:mail, name:"创趣小屋", did:1, regDate:stuRegDate})
          } else {
            safeCount ++
            timeStamp = new Date().getTime()
            val = timeStamp+pmail
            if (safeCount>10) throw "gen error"
          }     
        }
      }
      console.log(num, "create success")
      res.json({err:0, msg:"批量添加账号成功"})
    } catch(e){console.log(e); 
      if (e==="err1") res.json({err:1, msg:"操作失败，无法将学生账号作为父级"})
      else res.json({err:5, msg:"database error"})}
  })()
})

/* 获取数据列表总长 */
rt.post("/getPageContent", (req, res) => {
  let keys = ["name", "mail", "authority", "school"], f1 = [{name: /.+/}], f2 = [{mail: /.+/}]
  let flag = 1, filter = {}
  // 防止某个字段没有
  keys.forEach(k => {
    let v = req.body[k]
    if (v) {
      switch (k) {
        case "authority":
          filter[k] = parseInt(v);break;
        case "mail":
          filter.$or = [{mail: RegExp(v)}, {pmail: RegExp(v)}];break
        default:
          filter[k] = RegExp(v);break;
      }
    }
  })
  let {page} = req.body

  ;(async ()=>{
    try {
      if (page) {
        let docs = await User.find(filter, "name role mail pmail authority school")
        let dataSlice = docs.slice((page-1)*20, page*20)
        res.json({err:0, totalL:docs.length, dataSlice})
      } else {
        let docs = await User.find(filter, "name role mail authority")
        res.json({err:0, totalData: docs})
      }
    } catch(e){console.log(e);res.json({err:5, msg:"database error"})}
  })()
  // res.json({err:0})
})

/* 获取某个老师的学生 */
rt.get("/getMyStudents", (req, res) => {
  let {name, page} = req.query
  page = parseInt(page)
  ;(async ()=>{
    try {
      let doc = await User.findOne({name})
      if (doc) {
        let q = await User.find({pmail: doc.mail}, "name mail authority pwd school")
        let totalL = q.length
        let dataList = q.slice((page-1)*20, page*20)
        if (page) res.json({err:0, dataList, totalL})
        else {res.json({err:0, totalData:q})}
      } else res.json({err:4, msg:"信息更改，请重新登录"})
    } catch(e){console.log(e); res.json({err:5, msg:"database error"})}
  })()
})

/* 编辑一个账号 */
rt.post("/editOneAccount", (req, res) => {
  let {mail, pwd, school} = req.body
  ;(async () => {
    try {
      let q = await User.findOneAndUpdate({mail}, {pwd, school})
      if (q) res.json({err: 0, msg: "修改成功"})
      else res.json({err:0, msg:"参数错误, 页面刷新"})
    } catch(e){console.log(e);res.json({err:5, msg:"database error"})}
  })()
})

/* 批量编辑账号 */
rt.post("/editManyAccounts", (req, res) => {
  let {name, rL, rR, pwd, school, isRd} = req.body
  ;(async ()=> {
    try {
      let teacher = await User.findOne({name}, "mail")
      if (teacher) {
        let ids = []
        let pmail = teacher.mail
        let students = await User.find({pmail},null,{skip: rL-1, limit: rR-rL+1})
        students.forEach(e => {ids.push(e._id)})
        if (isRd) {
          for (let v of ids) {
            let newPwd = genRandomNum()
            await User.updateOne({_id:v}, {pwd:newPwd, school})
          }
          res.json({err:0, msg:"操作成功"})
        } else {
          await User.updateMany({_id:{$in: ids}}, {pwd, school})
          res.json({err:0, msg:"操作成功"})
        }

      } else res.json({err:4, msg:"操作失败，登录用户数据异常"})
    } catch(e){console.log(e);res.json({err:5, msg:"database error"})}
  })()
})

/* 获取管理员列表 */
rt.post("/getAdmins", (req, res) => {
  let keys = ["name", "mail", "role"]
  let filter = {}
  keys.forEach(k => {
    let v = req.body[k]
    if (v) filter[k] = v
    if (k=="role") filter[k] = {"$gte": 3}
  })
  let {page} = req.body
  ;(async ()=>{
    try {
      let docs = await User.find(filter)
      if (docs) {
        let dataSlice = docs.slice((page-1)*20, page*20)
        let totalL = docs.length
        res.json({err:0, dataSlice, totalL})
      } else res.json({err:1, msg:"database changed"})
    } catch(e){console.log(e); res.json({err:5, msg:"database error"})}
  })()
})

/* 新增管理员，有则改，无则增，排除学生身份 */
rt.post("/addAdmin", (req, res) => {
  let {mail, role} = req.body
  ;(async ()=>{
    let doc = await User.findOne({mail})
    if (doc) {
      if (doc.role) {
        await User.updateOne({mail}, {role})
        res.json({err:0, msg:`升级成功, 用户名:${doc.name} 邮箱:${mail}`})
      } else res.json({err:1, msg:`操作失败，学生用户无法升至管理员`})
    } else {
      let flag = 1
      let pwd = mail.split("@")[0]
      while (flag) {
        let rdName = genRdName(6, 16)
        let doc = await User.findOne({name: rdName})
        if (!doc) {
          flag = 0
          await User.create({pwd, mail, role, name:rdName, regDate:new Date(), authDate:new Date()})
          await Device.create({user: mail, name:"创趣小屋", did:1, regDate:new Date()})
          res.json({err:0, msg:`新增管理员, 用户名:${rdName} 邮箱:${mail}`})
        }
      }
      
    }
  })()
})

/* 删除管理员，不会删除账号 */
rt.get("/delAdmin", (req, res) => {
  let {delAdmin, myRole} = req.query
  let filter = {
    $or: [
      {name: delAdmin},
      {mail: delAdmin}
    ]
  }
  ;(async ()=>{
    try {
      let doc = await User.findOne(filter)
      if (doc) {
        console.log(doc.role)
        if (doc.role < myRole) {
          await User.updateOne(filter, {role: 1})
          res.json({err:0, msg:`操作成功, 用户:${delAdmin}恢复为普通用户`})
        } else res.json({err:1, msg:"操作失败, 仅可移除权限低于您的用户"})
      } else res.json({err:1, msg:"操作失败, 该用户不存在"})
    } catch(e){console.log(e); res.json({err:5, msg:"database error"})}


  })()
})

/* 删除普通/学生账号 */
rt.get("/delAccount", (req, res) => {
  let {mode, del} = req.query
  mode = parseInt(mode)
  ;(async ()=>{
    try {
      if (mode) {
        let docs = await User.find({pmail: del, role: 0}, "mail")
        if (docs) {
          let stuMails = []
          docs.forEach(e => stuMails.push(e.mail))
          let q = await User.deleteMany({pmail: del, role: 0})
          await Device.deleteMany({user: {$in: stuMails}})
          res.json({err:0, msg:`共删除${q.deletedCount}账号`})
        } else res.json({err:1, msg:"无匹配账号"}) 
      } else {
        let filter = {
          $or: [{name: del},{mail:del}]
        }
        let doc = await User.findOne(filter)
        if (doc) {
          if (doc.role<2) {
            await User.deleteOne(filter)
            await Device.deleteMany({user: doc.mail})
            res.json({err:0, msg:"删除成功"})
          } else res.json({err:1, msg:"操作失败，无法删除该用户组账号"}) 
        } else res.json({err:1, msg:"无匹配账号"})
      }
    } catch(e){console.log(e); res.json({err:0, msg: "database error"})} 

  })()
})

function genRdName (minL, maxL) {
  let ok = 0, rdName
  while (!ok) {
    rdName = randomWords()
    if (rdName.length>=minL&&rdName.length<=maxL) ok = 1
  }
  return rdName
}


// postman测试用,需关登录验证
rt.get("/test", (req, res) => {
  ;(async ()=> {
    let q = await User.findOneAndUpdate({mail: "2222@qq.com"}, {role: 3}, {new: true})
    console.log(q)
    res.json("ok")
  })()
})

function genRandomNum () {
  let d = new Date().getTime()
  d = parseInt(d * (Math.random()*100+1)).toString()
  return d.slice(0,8)
}

module.exports = rt