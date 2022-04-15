<!-- code -->
<template>
  <div id="code">
    <div id="searchBar">
      <search-bar :keywords="keywords" />
    </div>
    <div id="batch">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#genModal">批量创建激活码</button>
      <button class="btn btn-outline-success">导出激活码</button>
    </div>
    <div id="searchListShow">
      <search-list-show :colHead="keywords" :tbData="tbData" :actPage="actPage" />
    </div>
    <div id="navigator">
      <page-navigator  />
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
  </div>  
</template>

<script>
const SearchBar = ()=>import("components/common/searchBar/SearchBar")
const SearchListShow = ()=>import("components/common/searchListShow/SearchListShow")
const PageNavigator = ()=>import("components/common/pageNavigator/PageNavigator")

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
      actPage: 0, totalL: 0,
      genModalInfo: [
        {tag:"激活码等级", v:"", ph:"1-10", hint:"该项不能为空", ok:-1},
        {tag:"使用时长", v:"", ph:"请输入天数, 默认30", hint:"", ok:-1},
        {tag:"个数", v:"", ph:"1-100", hint:"该项不能为空", ok:-1},
      ],      
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
    getCodeList (page=1, mode=0) {
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
          } else alert(data.msg)
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
        if (!data.err) 
          document.querySelector("#genModal .btn-close").click()
        else this.genModalClear()
        alert(data.msg)
      }))
    }
  }
}
</script>

<style src="views/code/code.css" scoped></style>