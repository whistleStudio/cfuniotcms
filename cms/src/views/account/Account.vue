<!-- account -->
<template>
  <div id="account">
    <div id="search">
      <div v-for="(v, i) in keyword" :key="i" 
      class="mb-3 search-box">
      <label for="formGroupExampleInput" class="form-label">{{v.k}}</label>
      <input :placeholder="'请输入'+v.k" 
      type="text" class="form-control" id="formGroupExampleInput">
      </div> 
      <div class="search-btn">
        <button class="btn btn-primary">重置</button>
        <button class="btn btn-primary">查询</button>
      </div>     
    </div>
    <div id="batch">
      <button @click="batchGenClick" 
      class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#genModal">批量添加账号</button>
      <button class="btn btn-outline-success">批量导出账号</button>
    </div>
    <div id="content">
      <div id="show"></div>
      <div id="navigator">
        <page-navigator />
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
          <input :id="'genGroupInput'+i" :placeholder="v.ph" v-model="v.v" :class="{'is-valid': v.ok==1, 'is-invalid': v.ok==0}"
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
  </div>
</template>

<script>
const PageNavigator = ()=>import("components/common/pageNavigator/PageNavigator")

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
        if (!data.err) alert("批量添加账号成功")
        else {
          alert(data.msg)
        }
      }))
    }
  }

}   
</script>

<style src="views/account/account.css" scoped></style>