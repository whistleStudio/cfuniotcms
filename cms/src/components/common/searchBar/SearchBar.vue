<!-- searchBar -->
<template>
  <div id="searchBar">
    <div id="search">
      <div v-for="(v, i) in kws" :key="i" 
      class="mb-3 search-box">
      <label for="formGroupExampleInput" class="form-label">{{v.tag}}</label>
      <input :placeholder="'请输入'+v.tag" v-model="v.v"
      :type="v.type" class="form-control" id="formGroupExampleInput">
      </div> 
      <div class="search-btn">
        <button @click="resetSearch" class="btn btn-primary">重置</button>
        <button @click="keywordSearch" class="btn btn-primary">查询</button>
      </div>     
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      kws: this.keywords
    }
  },
  computed: {
    kList: function () {
      return 
    }
  },
  props: {
    keywords: Array, // keywords: [{type:"text", k:"code", tag: "激活码", v: ""},...]

  },
  methods: {
    resetSearch () {
      this.kws.forEach(e => {
        e.v = ""
      })
      this.$emit("reset-search")
    },
    keywordSearch () {
      let payload = {}
      this.kws.forEach(e => {
        payload[e.k] = e.v
      })
      this.$emit("keyword-search", payload)
    }
  },
  }
</script>

<style scoped>
/* 需要bootstrap */
input::placeholder {
  color: rgb(200, 200, 200);
}
#search {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.search-box {
  width: 21%;
  height: 80px;
  margin-bottom: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.search-box input {
  height: 40px;
}
.search-btn {
  width: 10%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.search-btn>button {
  width: 47%;
  height: 40px;
}
</style>