<!-- pageNavigator -->
<template>
  <div id="pageNavigator">
    <div>
      <div id="totalItem">共<span>{{totalItemsL}}</span>条</div>
      <ul id="navUl">
        <li v-if="actPageIdx>0" class="navLi navLiChange">首页</li>
        <li v-if="actPageIdx>0" class="navLi navLiChange">&lt;上一页</li>
        <li :class="{navLiAct: actPageIdx==i, navLiHover: hovPageIdx==i&&hovPageIdx!=actPageIdx}"
        @mouseenter="hovPageIdx=i" @mouseleave="hovPageIdx=0" @click="navLiClick(i)"
        class="navLi boxLi" v-for="(v, i) in Array(navPagesL)" :key="i">{{page_1+i}}</li>
        <li v-if="actPageIdx<4" class="navLi navLiChange">下一页&gt;</li>
        <li v-if="actPageIdx<4" class="navLi navLiChange">尾页</li>
      </ul>
      <div id="toPage">到<input :disabled="pagesL<=1" ref="toPageIp" type="text">页</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        hovPageIdx: -1,
        actPageIdx: 0,
        totalItemsL: 180,
        page_1: 1
      };
    },
    components: {},
    computed: {
      pagesL: function () {
        return Math.ceil(this.totalItemsL/20)
      },
      navPagesL: function () {
        if (this.pagesL>=5)
         return 5
        else return this.pagesL
      },
    },
    methods: {
      navLiClick (i) {
        this.page_1 = this.page_1+i-2
        if (this.page_1<1) {
          this.actPageIdx = 2-(1 - this.page_1)
          this.page_1 = 1
        } else if (this.page_1 > this.pagesL-4) {
          this.actPageIdx = 2+(this.page_1+4-this.pagesL)
          this.page_1 = this.pagesL - 4
        } else this.actPageIdx = 2
      },
      changeIdx (p) {
        this.page_1 = p - 2
        
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
.navLiHover {
  color: var(--rMainColorA)
}
.navLiAct {
  border: none;
  background-color: var(--rMainColor);
  color: white;
  cursor: default;
}
.navLiChange:hover {
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