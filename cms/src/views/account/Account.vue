<!-- account -->
<template>
  <div id="account">
    <div id="search">
      <div v-for="(v, i) in keyword" :key="i" 
      class="mb-3 search-box">
      <label for="formGroupExampleInput" class="form-label">{{v.k}}</label>
      <input :placeholder="'请输入'+v.k" v-model="v.v"
      type="text" class="form-control" id="formGroupExampleInput">
      </div> 
      <div class="search-btn">
        <button @click="searchContent({reset:1})" class="btn btn-primary">重置</button>
        <button @click="searchContent" class="btn btn-primary">查询</button>
      </div>     
    </div>
    <div id="batch">
      <button @click="batchGenClick" 
      class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#genModal">批量添加账号</button>
      <button @click="getPageContent(0, 1)"
      class="btn btn-outline-success">导出账号</button>
      <button v-if="curRole>3" data-bs-toggle="modal" data-bs-target="#delModal" 
      class="btn btn-danger">删除账号</button>
      <a :href="excelInfo.link"  ref="excelA" :download="excelInfo.name"
      ><span></span></a>
    </div>
    <div id="content">
      <div id="show">
        <table class="table table-striped table-hover">
        <thead>
        <tr>
        <th scope="col">#</th>
        <th scope="col">用户名</th>
        <th scope="col">用户类型</th>
        <th scope="col">用户邮箱</th>
        <th scope="col">父级邮箱</th>
        <th scope="col">等级</th>
        <th scope="col">学校</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(v, i) in dataList" :key="i">
        <th scope="row">{{actPage*20+i+1}}</th>
        <td>{{v.name}}</td>
        <td>{{roleMap[v.role]}}</td>
        <td>{{v.mail}}</td>
        <td>{{v.pmail}}</td>
        <td>{{v.authority}}</td>
        <td>{{v.school}}</td>
        </tr>
        </tbody>
        </table>        
      </div>
      <div id="navigator">
        <page-navigator :totalItemsL="totalL" :resetState="resetSta" @pageChange="getPageContent" />
      </div>
    </div>
    <!-- genModal -->
    <div class="modal fade" id="genModal" tabindex="-1" aria-labelledby="genModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="genModalLabel">新增</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div v-for="(v,i) in genModalInfo" :key="i" 
        class="mb-3">
          <label :for="'genGroupInput'+i" class="form-label"><i v-if="i<3">* </i>{{v.k}}</label>
          <input :id="'genGroupInput'+i" :placeholder="v.ph" v-model.trim="v.v" :class="{'is-valid': v.ok==1, 'is-invalid': v.ok==0}"
          @focus="genIpFocus(i)" @blur="genIpBlur(i, v.v)" @click="genIpClick(i)"
          ref="genIp" type="text" class="form-control" >
          <div v-if="i<3" 
          class="invalid-feedback">{{v.hint}}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button :disabled="!genInfoOk" 
        type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#genCheck">确定</button>
      </div>
      </div>
      </div>
    </div>
    <!-- genModalCheck -->
    <div class="modal fade" id="genCheck" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="genCheckLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="genCheckLabel">新增</h5>
        <button ref="genCheckCloseBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        确定生成 <strong>{{genModalInfo[1].v}}</strong> 个父级邮箱为 <strong>{{genModalInfo[0].v}}</strong> 的账号吗？
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button @click="genCheckClick"
        type="button" class="btn btn-primary">确定</button>
      </div>
      </div>
      </div>
    </div>
    <!-- deleteModal -->
      <div class="modal" id="delModal" tabindex="-1" aria-labelledby="delModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" data-bs-toggle="tooltip" data-bs-placement="right" title="仅会将用户从管理组移除，不会删除账号">删除</h5>
        <button @click="delIpClear"
        type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div id="delCheck">
          <div class="form-check">
          <input @change="delIpChange" v-model="delMode" value="0" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
          <label class="form-check-label" for="flexRadioDefault1">
          单个普通/学生账号
          </label>
          </div>
          <div class="form-check">
          <input @change="delIpChange" v-model="delMode" value="1" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
          <label class="form-check-label" for="flexRadioDefault2">
          批量学生账号
          </label>
          </div>           
        </div>
        <div class="mb-3">
        <label for="delIp" class="form-label"><i>*</i> {{delIpInfo[delMode].tag}}</label>
        <input v-model.trim="delIpInfo[delMode].v" :placeholder="delIpInfo[delMode].ph" 
        @focus="delIpFocus"
        type="text" class="form-control" id="delIp">
        </div>
      </div>
      <div class="modal-footer">
        <button @click="delIpClear" 
        type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button  @click="delIpSubmit" :disabled="!delIpInfo[delMode].v"
        type="button" class="btn btn-primary">确定</button>
      </div>
      </div>
      </div>
      </div>

  </div>
</template>

<script>
const PageNavigator = ()=>import("components/common/pageNavigator/PageNavigator")
import {roleMap} from "./dataMap.json"
import genWorkbook from "utils/genWorkbookAc"

export default {
  data () {
    return {
      keyword: [
        {k: "用户名", v: ""},
        {k: "邮箱", v: ""},
        {k: "等级", v: ""},
        {k: "学校", v: ""}
      ],
      genModalInfo: [
        {k: "父级邮箱", v: "", ph: "请填入邮箱", hint: "糟糕, 这好像不是一个邮箱", ok:-1},
        {k: "数量", v: "", ph: "1-100", hint: "数字1-100", ok:-1},
        {k: "用户名前缀", v: "", ph: "6-14个字符, 可使用数字、字母、下划线", hint: "用户名不合法", ok:-1},
        {k: "学校", v: "", ph: "默认创趣学院", ok:-1}
      ],
      dataList: [],
      totalData: [],
      roleMap,
      totalL: 0, actPage: 0, resetSta: 0,
      excelInfo: {link: "", name: ""},
      sheetCol: [
        {header: '用户名', key: 'name', width: '25'},
        {header: '用户类型', key: 'role', width: '15'},
        {header: '用户邮箱', key: 'mail', width: '30'},
        {header: '等级', key: 'authority', width: '5'},        
      ],
      curRole: sessionStorage.getItem("role"),
      delMode: 0,
      delIpInfo: [
        {tag: "用户名或用户邮箱", k: "nameormail", v:"", ph:"请输入用户名或用户邮箱"},
        {tag: "父级邮箱", k: "pmail", v:"", ph:"name@example.com"}
      ]
    }
  },
  computed: {
    genInfoOk: function () {
      return this.genModalInfo[0].ok==1&&this.genModalInfo[1].ok==1&&this.genModalInfo[2].ok==1
    }
  },
  components: {
    'page-navigator': PageNavigator,
  },
  methods: {
    /* batch gen btn reset */
    batchGenClick () {
      this.genModalInfo.forEach(e => {
        e.v = ""
        e.ok = -1
      })
    },
    /* input验证三连 */
    genIpFocus (i) {
      document.onkeydown = (ev)=>{
        if (ev.key === "Enter") {
          this.$refs.genIp[i].blur()
        }
      }
    },
    genIpBlur (i, v) {
      let reg
      switch (i) {
        case 0:
          reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
          this.genModalInfo[i].ok = reg.test(v) ? 1 : 0
          break
        case 1:
          let num = parseInt(v)
          if (num>0&&num<=100) {
            this.genModalInfo[i].v = num 
            this.genModalInfo[i].ok = 1
          } else {
            this.genModalInfo[i].ok = 0
          }
          break
        case 2:
          reg = /^([A-Za-z0-9]|_){6,14}$/
          if (reg.test(v)) {
            this.usernameCheck(i, v)
          } else {
            this.genModalInfo[i].ok = 0
          }
          break
        default:
          break
      }
    },
    usernameCheck (i, name) {
      fetch(`/api/user/checkName?name=${name}`)
      .then(res => res.json()
      .then(data => {
        if (!data.err) {
          this.genModalInfo[i].ok = 1
        } else {
          this.genModalInfo[i].ok = 0
          alert(data.msg)
        }
      }))
    },
    /* genModal 确认提交信息 */
    genIpClick (i) {
      this.genModalInfo[i].ok = -1
    },
    genCheckClick () {
      let pmail = this.genModalInfo[0].v, num = this.genModalInfo[1].v
      let name = this.genModalInfo[2].v
      let school = this.genModalInfo[3].v ? this.genModalInfo[3].v : "创趣学院"
      this.$refs.genCheckCloseBtn.click()
      fetch ("/api/user/batchGen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          pmail, num, name, school
        })
      })
      .then(res => res.json()
      .then(data => {
        alert(data.msg)
        if(!data.err) this.$router.push("/admin/account")
      }))
    },
    /* 更新页面内容 */
    getPageContent (page=1, mode=0) {
      fetch("/api/user/getPageContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          page,
          name: mode ? this.keyword[0].v:"",
          mail: mode ? this.keyword[1].v:"",
          authority: mode ? this.keyword[2].v:"",
          school: mode ? this.keyword[3].v:""
        })
      })
      .then(res => res.json()
      .then(data => {
        if (!data.err) {
          if (page) {
            this.actPage = page-1
            this.dataList = data.dataSlice
            this.totalL = data.totalL
          }
          else {
            let {totalData} = data
            if (totalData.length) {
              this.expWorkbook(totalData)      
            } else alert("当前关键词无数据可导出") 
          }
          // console.log(this.totalL, "---", this.dataList)
        } else alert(data.msg)
      }))
    },
    /* 表格导出至本地 */
    expWorkbook (arr) {
      ;(async ()=> {
        let dateStamp = new Date().getTime()
        let dataName = "账号信息_" + dateStamp
        let workbook = genWorkbook(arr, dataName, this.sheetCol)
        const buf = await workbook.xlsx.writeBuffer()
        this.excelInfo.link = URL.createObjectURL(new Blob([buf.buffer]))
        this.excelInfo.name = `${dataName}.xlsx`
        setTimeout(()=>{this.$refs.excelA.click()}, 100)
      })()
    },
    /* 页面搜索0与重置1 */
    searchContent ({reset=0}) {
      this.resetSta = 1
      if (reset) {this.keyword.forEach(e => e.v="")}
      this.getPageContent(1, 1)
      // 立即执行，watch监控不到
      setTimeout(()=>{this.resetSta=0}, 50)
    },
    /* delModal */
    delIpChange () {
      this.delIpInfo.forEach(e => e.v="")
    },
    delIpClear () {
      this.delIpChange()
      this.delMode = 0
    },
    delIpSubmit () {
      let del = this.delMode ? this.delIpInfo[1].v : this.delIpInfo[0].v
      fetch(`/api/user/delAccount?mode=${this.delMode}&del=${del}`)
      .then(res => res.json()
      .then(data => {
        alert(data.msg)
        if (!data.err) {
          this.searchContent({})
          document.querySelector("#delModal .btn-close").click()
        }
      }))
    },
    delIpFocus () {
      document.onkeydown = ev=>{
        if (ev.key === "Enter") {
          document.querySelector("#delIp").blur()
        }
      }
    },    

  },
  created () {
    // this.getPageContent()
  },
  mounted () {
    this.getPageContent()
  }
}   
</script>

<style src="views/account/account.css" scoped></style>