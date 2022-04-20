<!-- user -->
<template>
  <div id="user">
    <div id="searchBar">
      <search-bar :keywords="SBKeywords"
      @reset-search="pageSearch" @keyword-search="pageSearch"/>
    </div>
    <div id="addUser">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#genModal">新增管理员</button>
      <button v-if="curRole>3" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delModal">删除管理员</button>
    </div>
    <div id="searchListShow">
      <search-list-show :colHead="SBKeywords" :tbData="tbData" />
    </div>
    <div id="navigator">
      <page-navigator :totalItemsL="totalL" @pageChange="getAdmins"/>
    </div>

    <!-- genModal -->
    <div class="modal fade" id="genModal" tabindex="-1" aria-labelledby="genModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="genModalLabel">新增</h5>
        <button @click="genModalClear"
        type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label for="userModalMail" class="form-label"><i>*</i> {{genModalInfo[0].tag}}</label>
          <input ref="uMIP" :class="{'is-valid': genInfoOk, 'is-invalid': genModalInfo[0].ok==0}" 
          v-model.trim="genModalInfo[0].v" @focus="genIpFocus" @blur="genIpBlur"
          type="email" class="form-control" id="userModalMail" placeholder="name@example.com">
          <div class="invalid-feedback">{{genModalInfo[0].hint}}</div>
        </div>
        <div class="mb-3">
          <label for="userModalRole" class="form-label">{{genModalInfo[1].tag}}</label>
          <select v-model="genModalInfo[1].v" class="form-select" aria-label="Default select example">
          <option value="0">普通管理员</option>
          <option  v-if="curRole>3" value="1">超级管理员</option>
          </select>          
        </div>
      </div>
      <div class="modal-footer">
        <button @click="genModalClear"
        type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button :disabled="!genInfoOk" @click="genModalSubmit"
        type="button" class="btn btn-primary">确定</button>
      </div>
      </div>
      </div>
    </div>

    <!-- deleteModal -->
      <div class="modal" id="delModal" tabindex="-1" aria-labelledby="genModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" data-bs-toggle="tooltip" data-bs-placement="right" title="仅会将用户从管理组移除，不会删除账号">删除</h5>
        <button @click="delIpClear"
        type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label for="delIp" class="form-label"><i>*</i> 用户名或用户邮箱</label>
          <input v-model.trim="delAdmin" @focus="delIpFocus" 
          type="email" class="form-control" id="delIp" aria-describedby="emailHelp" placeholder="请输入用户名或用户邮箱" >
        </div>
      </div>
      <div class="modal-footer">
        <button @click="delIpClear" 
        type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button :disabled="!delAdmin" @click="delIpSubmit" 
        type="button" class="btn btn-primary">确定</button>
      </div>
      </div>
      </div>
      </div> 
  </div>  
</template>

<script>
const SearchBar = ()=>import("components/common/searchBar/SearchBar")
const SearchListShow = ()=>import("components/common/searchListShow/SearchListShow")
const PageNavigator = ()=>import("components/common/pageNavigator/PageNavigator")
import {roleMap} from "views/account/dataMap.json" 

export default {
  data () {
    return {
      SBKeywords: [
        {type:"text", k:"name", tag: "用户名", v: ""},
        {type:"text", k:"mail", tag: "用户邮箱", v: ""},
        {type:"select", k:"role", tag: "用户类型", v: 0, opt:['普通管理员', '超级管理员'], map:roleMap},
      ],
      genModalInfo : [
        {tag:"用户邮箱", v:"", ph:"name@exapmle.com", hint:"糟糕，这好像不是一个邮箱", ok:-1},
        {tag:"用户类型", v:0}
      ],
      tbData: [], totalL: 0,
      actPage: 0, perPageCount: 20,
      isSearch: 0, isReset: 0, curRole: sessionStorage.getItem("role"),
      delAdmin: ''
    }
  },
  computed: {
    genInfoOk: function () {
      return this.genModalInfo[0].ok===1
    }
  },
  components: {
    "search-bar": SearchBar,
    "search-list-show": SearchListShow,
    "page-navigator": PageNavigator
  },
  methods: {
    getAdmins (page=1) {
      let mode = this.isSearch
      fetch("/api/user/getAdmins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          page,
          name: mode ? this.SBKeywords[0].v : "",
          mail: mode ? this.SBKeywords[1].v : "",
          role: mode ? this.SBKeywords[2].v : "",
        })         
      })
      .then(res => res.json()
      .then(data => {
        if (!data.err) {
          this.tbData = data.dataSlice
          this.totalL = data.totalL
          this.actPage = page - 1
        } else alert(data.msg)
      }))
    },
    /* genModal */
    genIpFocus () {
      this.genModalInfo[0].ok = -1
      document.onkeydown = ev => {
        if (ev.key === "Enter") {
          this.$refs.uMIP.blur()
        }
      }
    },
    genIpBlur () {
      let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      this.genModalInfo[0].ok = reg.test(this.genModalInfo[0].v) ? 1 : 0
    },
    genModalClear () {
      this.genModalInfo[0].v = ""
      this.genModalInfo[0].ok = -1
      this.genModalInfo[1].v = 0
    },
    genModalSubmit () {
      fetch("/api/user/addAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          mail: this.genModalInfo[0].v,
          role: this.genModalInfo[1].v+3,
        })          
      })
      .then(res=>res.json()
      .then(data => {
        alert(data.msg)
        if (!data.err) {
          //reset
          this.pageSearch()
        }
      }))
    },
    /* pl ? 查询 : 重置 */
    pageSearch (pl) {
      if (pl) {
        this.isSearch = 1
        this.SBKeywords.forEach((e, i) => {
          e.v = pl[i].v
        })        
      } else this.SBKeywords.forEach(e => {
        e.v=""
        if (e.type=="select") e.v=0
      })
      this.getAdmins()
      this.isReset = 1
      // 立即执行，watch监控不到
      setTimeout(()=>{this.isReset=0}, 50)      
    }, 
    /* delModal */   
    delIpFocus () {
      document.onkeydown = ev=>{
        if (ev.key==="Enter") {
          document.querySelector("#delIp").blur()
        }
      }
    },
    delIpClear () {
      this.delAdmin = ""
    },
    delIpSubmit () {
      fetch (`/api/user/delAdmin?delAdmin=${this.delAdmin}&myRole=${this.curRole}`)
      .then(res => res.json()
      .then(data => {
        alert(data.msg)
        if (!data.err) {
          //reset
          this.pageSearch()
        }
      }))
    }
  },
  created () {
    this.getAdmins()
  }

}
</script>

<style src="./user.css" scoped></style>