const express = require("express")
const rt = express.Router()
const {setToken} = require("../validate/tokenVerify")
const User = require("../db/model/User")

rt.post("/", (req, res) => {
  let {mail, pwd} = req.body
  console.log(mail, pwd)
  ;(async ()=>{
    try {
      // 数据库操作
      let doc = await User.findOne({mail, pwd})
      if (doc&&doc.role>1) {
        let us = mail
        let usid = pwd + new Date().toString()
        setToken(us,usid).then((data)=>{
          // maxAge(ms)                                                                                                                                                                                                        
          res.cookie('token',data, {maxAge: 3600000*24, httpOnly: true})
          res.json({ err:0, tkid: data, tk:mail, role: doc.role});
        })    
      } else if(doc) {
        res.json({err:1, msg:'您的权限不支持该操作'})    
      } else {
        res.json({err:1, msg:'邮箱或密码错误，请重新登录'})
      }
    } catch(e){
      console.log(e)
      res.json({err:5, msg:"database err"})} 
  })()

})

module.exports = rt