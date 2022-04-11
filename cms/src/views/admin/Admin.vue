<!-- admin -->
<template>
  <div id="admin">
    <div id="header">
      <div>
        <img src="~img/cflogo.png" alt="">
        <span style="fontWeight: bold">创趣物联管理系统</span>
      </div>
      <div>
        <span>你好，</span>
        <span id="username">{{username}} </span>
        <span @click="logoutClick" id="logout"> 退出登录</span>
      </div>
    </div>
    <div id="menu">
      <ul>
        <li v-for="(v,i) in menuList" :key="v.id" class="menuLi" :class="{menuLiAct: actMenuIdx===i}"
        @click="menuLiClick(i, v.name)"
        >
          <span :class="[v.icf]" class="iconfont menuIcf"></span>{{v.v}}</li>
      </ul>
    </div>
    <div id="main">
      <div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () { 
      return {
        username: "",
        menuList: [
          {id:"0", v: "管理员", icf: "icon-guanliyuan", name: "user"},
          {id:"1", v: "激活码管理", icf: "icon-yuechi", name: "code"},
          {id:"2", v: "账号管理", icf: "icon-zhanghaoguanli", name: "account"},
          {id:"3", v: "校园管理", icf: "icon-xuexiao", name: "school"},
        ],
        actMenuIdx: 0
      };
    },
    components: {},
    methods: {
      menuLiClick (i, pth) {
        this.actMenuIdx = i
        this.$router.push(`/admin/${pth}`)
      },
      logoutClick () {
        this.$router.push("/login")
      }
    },
    created () {
      let role = sessionStorage.getItem("role"), username = sessionStorage.getItem("username")
      // console.log(role)
      this.username = username
      if (role==2) this.menuList = this.menuList.slice(3,4)
      else this.menuList = this.menuList.slice(0,3)
      // console.log(this.menuList)
    },
    mounted () {
      this.menuLiClick(0, this.menuList[0].name)
    }
  }
</script>

<style scoped>
  #header {
    width: 100%;
    height: 75px;
    padding: 7.5px;
    padding-left: 20px;
    padding-right: 20px;
    line-height: 50px;
    font-size: 1.1rem;
    box-sizing: border-box;
    box-shadow: 0px 1px 1px 1px gainsboro;
  }
  #header>div:first-of-type {
    float: left;
    height: 50px;
  }
  #header>div:last-of-type {
    float: right;
    height: 50px;
  }
  #header img {
    height: 40px;
    margin-right: 15px;
  }
  #menu {
    width: 250px;
    height: calc(100vh - 75px);
    /* background-color: orange; */
    float: left;
  }
  #menu>ul {
    width: 100%;
    box-sizing: border-box;
    padding-top: 1rem;
  }
  .menuLi {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding-left: 20px;
    cursor: pointer;
    /* background-color: blue; */
  }
  .menuLi:hover {
    color: var(--rMainColorA);
  }
  .menuLiAct {
    color: var(--rMainColor);
  }
  .menuIcf {
    margin-right: 0.5rem;
  }
  #main {
    float: right;
    width: calc(100% - 250px);
    height: calc(100vh - 75px);
    /* background-color: yellow; */
    box-sizing: border-box;
    padding: 1rem;
  }
  #main>div:first-of-type {
    width: 100%;
    height: 100%;
    border: 1px solid gainsboro;
    border-radius: 5px;
    /* background-color: red; */
    box-sizing: border-box;
    padding: 1rem;
  }
  #logout {
    cursor: pointer;
  }
  #logout:hover {
    /* font-weight: bold; */
    color: var(--rMainColor);
  }

</style>