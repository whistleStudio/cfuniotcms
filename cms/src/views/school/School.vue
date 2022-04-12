<!-- school -->
<template>
  <div id="school">
    <div id="head">
      <button class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#batchEditModal">批量修改</button>
      <button class="btn btn-outline-primary">批量导出</button>
      <!-- batchEditModal -->
      <div class="modal" tabindex="-1" id="batchEditModal" aria-labelledby="batchEditLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="batchEditLabel">批量修改</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label for="batchRange" class="form-label"><i>*</i> 范围</label>
          <div id="batchRan">
            <span>#</span>
            <input v-model.trim="batchEdit.range.l" 
            @focus="rangeFocus(0)" @blur="rangeBlur(0)"
            type="text" class="form-control" id="batchRange" >
            <span> —— #</span>
            <input v-model.trim="batchEdit.range.r" 
            @focus="rangeFocus(1)" @blur="rangeBlur(1)"
            type="text" class="form-control" id="batchRange2" >
          </div>
        </div>
        <div class="mb-3">
          <label for="batchPwd" class="form-label"><i>*</i> 新密码</label>
          <input v-model="rdChecked" @change="rdCheckChange"
          class="form-check-input" type="checkbox" value="" id="randomGen">
          <label :class="{labelChecked: rdChecked}" class="form-check-label" for="randomGen">
          随机
          </label> 
          <div v-if="!rdChecked" id="batchPassword">
            <input v-model.trim="batchEdit.pwd"
            type="text" class="form-control" id="batchPwd" placeholder="8-16个字符, 区分大小写">
          </div>
        </div>
        <div class="mb-3">
          <label for="batchSchool" class="form-label">学校</label>
          <input v-model.trim="batchEdit.school"
          type="text" class="form-control" id="batchSchool" >
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary">确认</button>
      </div>
      </div>
      </div>
      </div>

    </div>
    <div id="main">
      <table class="table table-striped table-hover">
      <thead>
      <tr>
      <th scope="col">#</th>
      <th scope="col">用户名</th>
      <th scope="col">用户邮箱</th>
      <th scope="col">等级</th>
      <th scope="col">用户密码</th>
      <th scope="col">学校</th>
      <th scope="col"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(v, i) in dataList" :key="i">
      <th scope="row">{{actPage*20+i+1}}</th>
      <td>{{v.name}}</td>
      <td>{{v.mail}}</td>
      <td>{{v.authority}}</td>
      <td>
        <span v-if="actTr!=i">{{v.pwd}}</span>
        <input ref="indiPwd" v-if="actTr==i" v-model.trim="indiEdit.pwd"
        type="text" placeholder="8-16个字符, 区分大小写">
      </td>
      <td>
        <span  v-if="actTr!=i">{{v.school}}</span>
        <input ref="indiSchool" v-if="actTr==i" v-model.trim="indiEdit.school"
        type="text" placeholder="请输入学校名称">
      </td>
      <td>
        <div class="editTd">
        <button v-if="actTr!=i" @click="editBtnClick(i)"
        class="editBtn btn btn-outline-warning">修改</button>
        <button v-if="actTr==i" @click="submitBtnClick(i)"
        class="editBtn btn btn-success">确认</button>
        <button v-if="actTr==i" @click="cancelBtnClick"
        class="editBtn btn btn-danger">取消</button>
        </div>
      </td>
      </tr>
      </tbody>
      </table>        
    </div>
    <div id="navigator">
      <page-navigator :totalItemsL="totalL" @pageChange="getMyStudents" />
    </div>
  </div>  
</template>

<script>
const PageNavigator = ()=>import("components/common/pageNavigator/PageNavigator")

export default {
  data () {
    return {
      dataList: [],
      totalL: 0, actPage: 0, resetSta: 0,
      actTr: -1, rdChecked: 0,
      indiEdit: {
        pwd: "",
        school: ""
      },
      batchEdit: {
        range: {l:"", r:""},
        pwd: "",
        school: ""
      }
    }
  },
  components: {
    "page-navigator": PageNavigator
  },
  methods:{
    /* 获取学生列表 */
    getMyStudents (page=1) {
      let username = sessionStorage.getItem("username")
      fetch(`/api/user/getMyStudents?name=${username}&page=${page}`)
      .then(res => res.json()
      .then(data => {
        if (!data.err) {
          this.dataList = data.dataList
          this.totalL = data.totalL
          this.actPage = page-1
        } else {
          aleart(data.msg)
          if (data.err === 4) this.$router.push("/login")
        }
      }))
    },
    /* 列表里的编辑按钮操作 */
    editBtnClick (i) {
      this.resetData()
      this.actTr = i
    },
    cancelBtnClick () {
      this.resetData()
    },
    submitBtnClick (i) {
      let reg =  /^([A-Za-z0-9]){8,16}$/
      if (reg.test(this.indiEdit.pwd)) {
        fetch(`/api/user/editOneAccount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify({
            mail: this.dataList[i].mail,
            pwd: this.indiEdit.pwd,
            school: this.indiEdit.school
          })          
        })
        .then(res=>res.json()
        .then(data=>{
          this.resetData()
          alert(data.msg)
          if (!data.err) {
            this.getMyStudents(actPage+1)
          }
        }))
      } else alert("操作失败，新密码不符合规范")
    },
    resetData () {
      this.actTr = -1
      this.indiEdit.pwd = ""
      this.indiEdit.school = ""
    },
    /* 批量修改modal */
    rdCheckChange () {
      this.batchEdit.pwd = this.rdChecked ? -1 : ""
    },
    rangeFocus (i) {
      let ips = document.querySelectorAll("#batchRan>input")
      document.onkeydown = (ev)=>{
        if (ev.key === "Enter") {
          ips[i].blur()
        }
      }
    },
    rangeBlur (i) {
      let val = i ? this.batchEdit.range.r : this.batchEdit.range.l
      val = parseInt(val) ? parseInt(val) : 1
      if (val<1) {
        val = 1
      } else if (val>this.totalL) val = this.totalL
      if (i) this.batchEdit.range.r = val
      else this.batchEdit.range.l = val
    }
  },
  created () {
    this.getMyStudents()
  }

}
</script>

<style src="assets/css/inputClean.css" scoped></style>
<style scoped>
  #school {
    height: 100%;
    /* background-color: yellow; */
  }
  #head {
    width: 100%;
    height: 40px;
    margin-bottom: 1rem;
  }
  #head>button {
    height: 100%;
    width: 100px;
    margin-right: 0.5rem;
  }
  #main {
    height: calc(100% - 40px - 1rem - 70px);
    /* background-color: pink; */
    overflow-y: auto;
  }
  #navigator {
    height: 70px;
  }
  .editTd {
    width: 140px;
    display: flex;
    justify-content: flex-start;
  }
  .editBtn {
    margin-right: 10px;
    width: 60px;

  }
  #batchRan {
    width: 100%;
    display: flex;
    line-height: 40px;
  }
  .modal-body i {
    color:red;
  }
  #batchRan>input {
    width: 15%;
    margin: 0px 5px;
  }
  #randomGen {
    margin-left: 50px;
  }
  label[for=randomGen] {
    color: gray;
    margin-left: 5px;
  }
  .labelChecked {
    color: black !important;
    font-weight: bold;
  }
</style>