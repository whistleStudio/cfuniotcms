const express = require("express")
const rt = express.Router()
const User = require("../db/model/User")
const Device = require("../db/model/Device")
var hash = require('object-hash')

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

rt.post("/batchGen", (req, res) => {
  let {pmail, num, name, school} = req.body
  ;(async ()=>{
    try {
      let timeStamp = new Date().getTime()
      let val = timeStamp+pmail
      let mail
      for (let i=0; i<num; i++) {
        let createOK = 0, safeCount = 0
        val += i
        while (!createOK) {
          mail = hash(val).slice(0,11) + "@cfun.com"
          let doc = await User.findOne({role: 0, mail})
          // 查重合格，创建；否则重新生成
          if (!doc) {
            createOK = 1
            console.log("create success")
            await User.create({name: name+i, role: 0, pwd: "12345678", mail, pmail, school})
            await Device.create({user:mail, name:"创趣小屋", did:1})
          } else {
            safeCount ++
            timeStamp = new Date().getTime()
            val = timeStamp+pmail
            if (safeCount>10) throw "gen error"
          }     
        }
      }
    } catch(e){console.log(e); res.json({err:5, msg:"database error"})}
  })()
  console.log(req.body)
  res.json({err:0})
})

module.exports = rt