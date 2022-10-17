<!-- code -->
<template>
  <div id="code">
    <div id="searchBar">
      <search-bar :keywords="keywords" 
      @reset-search="pageSearch" @keyword-search="pageSearch" />
    </div>
    <div id="batch">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#genModal">批量创建激活码</button>
      <button @click="getCodeList(0)" class="btn btn-outline-success">导出激活码</button>
      <button v-if="curRole>3" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#delModal" @click="btnTest">删除激活码</button>
      <a :href="excelInfo.link"  ref="excelA" :download="excelInfo.name"><span></span></a>
    </div>
    <div id="searchListShow">
      <search-list-show  :colHead="keywords" :tbData="tbData" :actPage="actPage" />
    </div>
    <div id="navigator">
      <page-navigator :totalItemsL="totalL" :resetState="isReset" 
      @pageChange="getCodeList"/>
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
        <div v-for="(v,i) in genModalInfo" :key="i" 
        class="mb-3">
          <label :for="'genGroupInput'+i" class="form-label"><i v-if="i!==1">* </i>{{v.tag}}</label>
          <input :id="'genGroupInput'+i" :placeholder="v.ph" v-model.trim="v.v" :class="{'is-valid': v.ok==1, 'is-invalid': v.ok==0}"
          @focus="genIpFocus(i)" @blur="genIpBlur(i, v.v)"
          ref="genIp" type="number" class="form-control" >
          <div v-if="i!==1" 
          class="invalid-feedback">{{v.hint}}</div>
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
          单个
          </label>
          </div>
          <div class="form-check">
          <input @change="delIpChange" v-model="delMode" value="1" class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
          <label class="form-check-label" for="flexRadioDefault2">
          多个
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
const SearchBar = ()=>import("components/common/searchBar/SearchBar")
const SearchListShow = ()=>import("components/common/searchListShow/SearchListShow")
const PageNavigator = ()=>import("components/common/pageNavigator/PageNavigator")
import genWorkbook from "utils/genWorkbook"

export default {
  data () {
    return {
      keywords: [
        {type:"text", k:"code", tag: "激活码", v: ""},
        {type:"number", k:"auth", tag: "激活码等级", v: ""},
        {type:"number", k:"authExp", tag: "使用时长", v: ""},
        {type:"date", k:"genDate", tag: "创建时间", v: ""},
      ],
      tbData: [],
      actPage: 0, totalL: 0, isReset: 0, isSearch: 0,
      genModalInfo: [
        {tag:"激活码等级", v:"", ph:"1-10", hint:"该项不能为空", ok:-1},
        {tag:"使用时长", v:"", ph:"请输入天数, 默认30", hint:"", ok:-1},
        {tag:"个数", v:"", ph:"1-100", hint:"该项不能为空", ok:-1},
      ],
      sheetCol: [
        {header: '激活码', key: 'code', width: '30'},
        {header: '激活等级', key: 'auth', width: '10'},
        {header: '使用时长', key: 'authExp', width: '10'},
        {header: '创建时间', key: 'genDate', width: '30'},
      ],
      excelInfo: {
        link: "",
        name: ""
      },
      curRole: sessionStorage.getItem("role"),
      delMode: 0,
      delIpInfo: [
        {tag: "激活码", k: "code", v: "", ph: "请输入激活码"},
        {tag: "创建时间", k: "genDate", v: "", ph: "请输入创建时间"}
      ]     
    }
  },
  computed: {
    genInfoOk: function () {
      return this.genModalInfo[0].ok===1&&this.genModalInfo[2].ok===1
    }
  },
  components: {
    "search-bar": SearchBar,
    "search-list-show": SearchListShow,
    "page-navigator": PageNavigator
  },
  methods: {
    btnTest () {console.log("btntest")},
    // 内容获取 page=0,导出表格
    getCodeList (page=1) {
      let mode = this.isSearch
      fetch("/api/code/getCodeList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          page,
          code: mode ? this.keywords[0].v : "",
          auth: mode ? this.keywords[1].v : "",
          authExp: mode ? this.keywords[2].v : "",
          genDate: mode ? this.keywords[3].v : "",
        })        
      })
      .then(res => res.json()
      .then(data => {
        if (page) {
          if (!data.err) {
            this.tbData = data.dataSlice
            this.totalL = data.totalL
            this.actPage = page-1
          } else alert(data.msg)
        } else {
          this.expData(data.totalData)
        }
      }))
    },
    /* 批量生成 */
    genIpFocus (i) {
      this.genModalInfo[i].ok = -1
      document.onkeydown = (ev)=>{
        if (ev.key === "Enter") {
          this.$refs.genIp[i].blur()
        }
      }
    },
    genIpBlur (i, v) {
      if (i==1 || v) {
        let num = parseInt(v)
        switch (i) {
          case 0:
            this.genModalInfo[i].v = (num>=1&&num<=10) ? num : 1
            break
          case 1:
            this.genModalInfo[i].v = num ? num : 30
            break
          case 2:
            this.genModalInfo[i].v = (num>=1&&num<=100) ? num : 1
        }
        this.genModalInfo[i].ok = 1
      }
      else {
        this.genModalInfo[i].ok = 0
      }
    },
    genModalClear () {
      this.genModalInfo.forEach(e => {
        e.v = ""
        e.ok = -1
      })
    },
    genModalSubmit () {
      fetch(`/api/code/genModalSubmit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        body: JSON.stringify({
          auth: this.genModalInfo[0].v, 
          authExp: this.genModalInfo[1].v, 
          count: this.genModalInfo[2].v
        })
      })
      .then(res=>res.json()
      .then(data=>{
        if (!data.err) {
          document.querySelector("#genModal .btn-close").click()
          this.pageSearch()
        }
        else this.genModalClear()
        alert(data.msg)
      }))
    },
    /* pl ? 查询 : 重置 */
    pageSearch (pl) {
      if (pl) {
        this.isSearch = 1
        this.keywords.forEach((e, i) => {
          e.v = pl[i].v
        })        
      } else this.keywords.forEach(e => e.v="")
      
      this.getCodeList()
      this.isReset = 1
      // 立即执行，watch监控不到
      setTimeout(()=>{this.isReset=0}, 50)      
    },
    /* 数据导出 */
    expData (arr) {
      ;(async ()=>{
        let d = new Date().getTime()
        let dataName = "物联网激活码"+d
        let workbook = genWorkbook(arr, dataName, this.sheetCol)
        const buf = await workbook.xlsx.writeBuffer()
        this.excelInfo.link = URL.createObjectURL(new Blob([buf.buffer]))
        this.excelInfo.name = `${dataName}.xlsx`
        console.log(this.$refs.excelA)
        setTimeout(()=>{this.$refs.excelA.click()}, 100)
      })()
    },
    /* delModal */
    delIpChange () {
      this.delIpInfo.forEach(e => e.v="")
    },
    delIpFocus () {
      document.onkeydown = ev=>{
        if (ev.key === "Enter") {
          document.querySelector("#delIp").blur()
        }
      }
    },
    delIpClear () {
      this.delIpChange()
      this.delMode = 0
    },
    delIpSubmit () {
      let del = this.delMode ? this.delIpInfo[1].v : this.delIpInfo[0].v
      fetch(`/api/code/delCode?mode=${this.delMode}&del=${del}`)
      .then(res => res.json()
      .then(data => {
        alert(data.msg)
        if (!data.err) {
          this.pageSearch()
          document.querySelector("#delModal .btn-close").click()
        }
      }))
    } 
  },
  created () {
    this.getCodeList()
  }
}
</script>

<style src="views/code/code.css" scoped></style>