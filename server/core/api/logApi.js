const express = require("express")
const rt = express.Router()
const {setToken} = require("../validate/tokenVerify")

rt.post("/", (req, res) => {
  let {mail, pwd} = req.body
  console.log(mail, pwd)
  ;(async ()=>{
    try {
      // 数据库操作
      if (mail==="435424527@qq.com"&&pwd==="9") {
        // doc.logDate = new Date()
        // doc.save()
        // console.log(doc)
        let us = mail
        let usid = pwd + new Date().toString()
        setToken(us,usid).then((data)=>{
          // maxAge(ms)                                                                                                                                                                                                        
          res.cookie('token',data,{maxAge: 3600000*24, httpOnly: true})
          res.json({ err:0, tkid: data, tk:mail});
        })    
      } else {
        // console.log(new Date(), err)
        res.json({err:1, msg:'邮箱或密码错误，请重新登录'})    
      }
    } catch(e){
      console.log(e)
      res.json({err:5, msg:"database err"})} 
  })()

})

module.exports = rt