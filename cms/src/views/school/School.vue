<!-- school -->
<template>
  <div id="school">
    <div id="head">
      <button class="btn btn-success">批量修改</button>
      <button class="btn btn-outline-success">批量导出</button>
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
      <td>{{v.pwd}}</td>
      <td>{{v.school}}</td>
      <td><button class="btn btn-outline-warning">修改</button></td>
      </tr>
      </tbody>
      </table>        
    </div>
    <div id="navigator">
      <page-navigator  />
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
    }
  },
  components: {
    "page-navigator": PageNavigator
  },
  methods:{
    getMyStudents (page=1) {
      let username = sessionStorage.getItem("username")
      fetch(`/api/user/getMyStudents?name=${username}`)
      .then(res => res.json()
      .then(data => {
        if (!data.err) {
          this.dataList = data.dataList
        } else {
          aleart(data.msg)
          if (data.err === 4) this.$router.push("/login")
        }
      }))

    }
    //
  },
  created () {

  }

}
</script>

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
    background-color: pink;
    overflow-y: auto;
  }
  #navigator {
    height: 70px;
  }
</style>