<!-- pageNavigator -->
<template>
  <div id="pageNavigator">
    <div>
      <div id="totalItem">共<span>{{totalItemsL}}</span>条</div>
      <ul id="navUl">
        <li v-if="actPageIdx>0" @click="navLiChangeClick(0)" class="navLi navLiChange">首页</li>
        <li v-if="actPageIdx>0" @click="navLiChangeClick(-1)" class="navLi navLiChange">&lt;上一页</li>
        <li :class="{navLiAct: actPageIdx==i, navLiHover: hovPageIdx==i&&hovPageIdx!=actPageIdx}"
        @mouseenter="hovPageIdx=i" @mouseleave="hovPageIdx=0" @click="navLiClick(i)"
        class="navLi boxLi" v-for="(v, i) in Array(navPagesL)" :key="i">{{page_1+i}}</li>
        <li v-if="actPageIdx<navPagesL-1" @click="navLiChangeClick(1)" class="navLi navLiChange">下一页&gt;</li>
        <li v-if="actPageIdx<navPagesL-1" @click="navLiChangeClick(2)" class="navLi navLiChange">尾页</li>
      </ul>
      <div id="toPage">到<input :disabled="pagesL<=1" v-model="toPageNum" 
      @focus="toPageIpFocus"
      ref="toPageIp" type="text">页</div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        hovPageIdx: -1,
        actPageIdx: 0,
        // totalItemsL: 0,
        page_1: 1,
        toPageNum: ''
      };
    },
    props: {
      // 父级动态请求到的数据长度
      totalItemsL: {type: Number, default: 0},
      resetState: {type: Number, default: 0}
    },
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
      // 基本点点点
      navLiClick (i) {
        if (this.pagesL>5) {
          this.page_1 = this.page_1+i-2
          if (this.page_1<1) {
            this.actPageIdx = 2-(1 - this.page_1)
            this.page_1 = 1
          } else if (this.page_1 > this.pagesL-4) {
            this.actPageIdx = 2+(this.page_1+4-this.pagesL)
            this.page_1 = this.pagesL - 4
          } else this.actPageIdx = 2
        } else {
          this.actPageIdx = i
        }
        this.$emit("pageChange", this.page_1+this.actPageIdx)
      },
      // 首尾左右切
      navLiChangeClick (i) {
        switch (i) {
          case 0:
            this.actPageIdx = 0
            this.page_1 = 1
            this.$emit("pageChange", 1)
            break
          case -1:
            this.navLiClick(this.actPageIdx-1)
            break
          case 1:
            this.navLiClick(this.actPageIdx+1)
            break
          case 2:
            this.actPageIdx = this.navPagesL-1
            this.page_1 = this.pagesL - this.actPageIdx
            this.$emit("pageChange", this.pagesL)
            break
        }
      },
      // 指定页面跳
      toPageIpFocus () {
        document.onkeydown = (ev)=>{
          if (ev.key === "Enter") {
            let v = parseInt(this.toPageNum)
            if (v) {
              if (v<0) v = 1
              if (v>this.pagesL) v = this.pagesL
              if (this.pagesL > 5) {
                if (v<=2) {
                  this.page_1 = 1
                  this.actPageIdx = v - 1
                } else if (v>=this.pagesL-1) {
                  this.page_1 = this.pagesL - 4
                  this.actPageIdx = v - this.page_1
                } else {
                  this.page_1 = v - 2
                  this.actPageIdx = 2
                }
              } else {
                this.actPageIdx = v - 1
              }
              this.toPageNum = v
              this.$emit("pageChange", v)
            } else this.toPageNum = ""
            this.$refs.toPageIp.blur()
          }
        }
      }
    },
    watch: {
      resetState (newV, oldV) {
        // 0->1 reset
        if (!oldV && newV===1) {
          this.actPageIdx = 0
          this.page_1 = 1
        }
      }
    },
    created () {
      // console.log(this.totalItemsL)
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