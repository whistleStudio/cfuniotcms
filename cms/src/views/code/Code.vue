<!-- code -->
<template>
  <div id="code">
    <div id="search">
      <div v-for="(v, i) in keyword" :key="i" 
      class="mb-3 search-box">
      <label for="formGroupExampleInput" class="form-label">{{v.k}}</label>
      <input :placeholder="'请输入'+v.k" v-model="v.v"
      :type="v.type" class="form-control" id="formGroupExampleInput">
      </div> 
      <div class="search-btn">
        <button @click="searchContent({reset:1})" class="btn btn-primary">重置</button>
        <button @click="searchContent" class="btn btn-primary">查询</button>
      </div>     
    </div>
  </div>  
</template>

<script>
export default {
  data () {
    return {
      keyword: [
        {type:"text", k: "激活码", v: ""},
        {type:"text", k: "激活码等级", v: ""},
        {type:"date", k: "开始结束时间", v: ""},
      ],      
    }
  },
  methods: {
    searchContent () {

    },
  }
}
</script>

<style src="views/code/code.css" scoped></style>