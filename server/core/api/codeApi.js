const express = require("express")
const rt = express.Router()
const AuthCode = require("../db/model/AuthCode")
const hash = require("object-hash")

/* 批量生成激活码 */
rt.post("/genModalSubmit", (req, res)=>{
  let {auth, authExp, count} = req.body
  ;(async ()=>{
    try {
      for (let v of Array(count)) {
        let code = genCode()
        await AuthCode.create({code, auth, authExp})
      }
      console.log(new Date(), ` ${count} code created`)
      res.json({err:0, msg:"激活码生成成功"})
    } catch(e){console.log(e);res.json({err:5, msg:"database error"})}
  })()
})

/* 获取激活码列表信息 */
rt.post("/getCodeList", (req, res) => {
  let {page} = req.body
  let filterKs = ["code", "auth", "authExp", "genDate"]
  let filter = {}
  filterKs.forEach(k => {
    if (req.body[k]) filter[k] = req.body[k]
    if (req.body[k]&&k=="genDate") {
      let d = new Date(req.body[k]), d2 = new Date(req.body[k])
      d2 = new Date(d2.setDate(d2.getDate()+1))
      filter[k] = {"$gte": d, "$lt": d2}
    }
  })
  console.log(filter.genDate)
  ;(async ()=>{
    try {
      let docs = await AuthCode.find(filter)
      if (docs) {
        let dataSlice = docs.slice((page-1)*20, page*20), totalL = docs.length
        if(page) res.json({err:0, dataSlice, totalL})
        else res.json({err:0, totalData:docs})
      } else res.json({err:0, msg:"无匹配结果"})
    } catch(e){console.log(e);res.json({err:5, msg:"database error"})}
  })()
})

/* 随机生成 */
function genCode () {
  var reg = /\/|\+|=/g
  var code = new Date()
  var code = hash(code, { algorithm: 'md5', encoding: 'base64' }).replace(reg, '')
  return code
}



module.exports = rt