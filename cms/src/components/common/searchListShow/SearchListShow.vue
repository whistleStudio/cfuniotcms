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
          {{v[tdv.k]}}
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
      tbData: Array, //[{name: "wsh",...}]
      colHead: Array, //[{k:"code", tag: "激活码"},...]
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