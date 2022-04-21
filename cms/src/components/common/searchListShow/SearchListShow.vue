<!-- searchlistshow -->
<template>
  <div id="searchListShow">
    <table class="table table-striped table-hover">
      <thead>
      <tr>
      <th scope="col">#</th>
      <th scope="col" v-for="(v, i) in colHeadList" :key="i">{{v.tag}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(v, i) in tbList" :key="i">
        <th scope="row">{{actPage*perPageCount+i+1}}</th>
        <td v-for="(tdv, tdi) in colHeadList" :key="tdi">
          <span v-if="tdv.map">{{tdv.map[v[tdv.k]]}}</span>
          <span v-else>{{v[tdv.k]}}</span> 
        </td>
      </tr>
      </tbody>
    </table>            
  </div>
</template>

<script>
  export default {
    data () {
      return {
        tbList: this.tbData,
        colHeadList: this.colHead
      };
    },
    computed: {
      colCount: function () {
        return this.colHeadList.length
      }
    },
    props: {
      colHead: Array, //[{k:"code", tag: "激活码", ?map: {0:"",1:"",...}},...] k要和请求来的数据tbList的k相同, 可选map决定是否有映射
      tbData: Array, //[{name: "wsh",...}]
      actPage: {type: Number, default: 0},
      perPageCount: {type: Number, default: 20}
    },
    components: {},
    watch: {
      tbData (newVal) {
        // console.log("get new data")
        this.tbList = newVal 
      }
    }
  }
</script>

<style scoped>
/* 需要bootstrap */
#searchListShow {
  height: 100%;
}
</style>