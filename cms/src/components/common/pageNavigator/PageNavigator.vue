<!-- pageNavigator -->

<template>
  <div id="pageNavigator">
    <div>
      <div id="totalItem">共<span>{{totalItemsL}}</span>条</div>
      <ul id="navUl">
        <li class="navLi">首页</li>
        <li class="navLi">&lt;上一页</li>
        <li class="navLi boxLi" v-for="(v, i) in Array(pagesL)" :key="i">{{i+1}}</li>
        <li class="navLi">下一页&gt;</li>
        <li class="navLi">尾页</li>
      </ul>
      <div id="toPage">到<input ref="toPageIp" type="text">页</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        actPageIdx: 0,
        totalItemsL: 0
      };
    },
    components: {},
    computed: {
      pagesL: function () {
        return Math.ceil(this.totalItemsL/20)
      }
    }
  }
</script>

<style scoped>
/* need --rMainColor, --rMainColorA*/
#pageNavigator {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
#pageNavigator>div {
  height: 40px;
  display: flex;
  line-height: 40px;
  color: rgb(80,80,80);
}
#navUl {
  height: 100%;
  display: flex;
  margin: 0 10px;
}
.navLi {
  height: 100%;
  box-sizing: border-box;
  border: 1px solid gainsboro;
  border-radius: 3px;
  text-align: center;
  margin-right: 10px;
  padding:0 5px;
  cursor: pointer;
  background-color: white;
}
.navLi:hover {
  color: var(--rMainColorA)
}
.boxLi {
  width: 40px;
}
#totalItem {
  height: 40px;
  margin-right: 10px;
}
#toPage {
  height: 40px;
}
#toPage>input {
  text-align: center;
  height: 40px;
  width: 60px;
  box-sizing: border-box;
  border: 1px solid gainsboro;
  border-radius: 3px;
  outline: none;
  margin: 0 5px;
}

</style>