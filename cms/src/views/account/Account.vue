<!-- account -->
<template>
  <div id="account">
    <div id="search">
      <div v-for="(v, i) in keyword" :key="i" 
      class="mb-3 search-box">
      <label for="formGroupExampleInput" class="form-label">{{v.k}}</label>
      <input :placeholder="'请输入'+v.k" 
      type="text" class="form-control" id="formGroupExampleInput">
      </div> 
      <div class="search-btn">
        <button class="btn btn-primary">重置</button>
        <button class="btn btn-primary">查询</button>
      </div>     
    </div>
    <div id="batch">
      <button class="btn btn-success"  data-bs-toggle="modal" data-bs-target="#genModal">批量添加账号</button>
      <button class="btn btn-outline-success">批量导出账号</button>
    </div>
    <div id="content">
      <div id="show"></div>
      <div id="navigator"></div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="genModal" tabindex="-1" aria-labelledby="genModalLabel" aria-hidden="true">
      <div class="modal-dialog">
      <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="genModalLabel">新增</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div v-for="(v,i) in genModalInfo" :key="i" 
        class="mb-3">
          <label :for="'genGroupInput'+i" class="form-label"><i v-if="i<2">* </i>{{v.k}}</label>
          <input ref="genIp" :id="'genGroupInput'+i" :placeholder="v.ph" @focus="genIpFocus"
          type="text" class="form-control" >
          <div v-if="i<2" 
          class="invalid-feedback">{{v.hint}}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary">确定</button>
      </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: [
        {k: "用户名", v: ""},
        {k: "邮箱", v: ""},
        {k: "等级", v: ""},
        {k: "学校", v: ""}
      ],
      genModalInfo: [
        {k: "父级邮箱", v: "", ph: "请填入邮箱", hint: "糟糕, 这好像不是一个邮箱", ok:-1},
        {k: "数量", v: "", ph: "", hint: "数字0-100", ok:-1},
        {k: "学校", v: "", ph: "默认创趣小学"}
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped>
  input::placeholder {
    color: rgb(200, 200, 200);
  }
  #account {
    height: 100%;
    box-sizing: border-box;
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
  #batch>button {
    margin: 1.2rem;
    height: 40px;
    margin-left: 0;
  }
  #content {
    width: 100%;
    height: calc(100% - 90px - 4.4rem);
    background-color: gainsboro;
  }
  #genModal .modal-body i {
    color: red;
  }
</style>