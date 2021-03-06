const express = require("express")
require('./core/db/connect')
const app = express()
const PORT = 8086
const path = require('path')
const staticPath = __dirname


const {verToken} = require("./core/validate/tokenVerify");
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// 解析token获取用户信息
app.use(['/api/user', '/api/code'], function(req, res, next) {
	var token = req.headers['authorization']||'Cfun '+req.cookies.token
	if(token == undefined){
		return next();
	}else{
		verToken(token).then((data)=> {
			req.userx = data;
			return next();
		}).catch((error)=>{
			res.send('token失效, 请重新登录')
			// return next();
		})
	}
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logApi = require("./core/api/logApi")
const userApi = require("./core/api/userApi")
const codeApi = require("./core/api/codeApi")

app.use("/api/log", logApi)
app.use("/api/user", userApi)
app.use("/api/code", codeApi)


app.listen(PORT, () => {
  console.log(`CMS server works on port:${PORT}`)
})