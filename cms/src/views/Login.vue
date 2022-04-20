<!-- login -->
<template>
  <div id="login">
    <div id="logbox">
      <div id="logHead">
        <img src="~img/cflogo.png" alt="">
        <h1>创趣物联管理系统</h1>
      </div>
      <div class="mb-3">
      <label for="inputMail" class="form-label">邮箱</label>
      <input ref="ipMail" v-model="submitInfo.mail" :class="{'is-valid': mailOk>0, 'is-invalid': !mailOk}" 
      @click="mailOk=-1" @focus="ipMailFocus" @blur="checkIsMail"
      type="text" class="form-control" id="inputMail" placeholder="name@exmaple.com">
      <div class="invalid-feedback">
      糟糕, 这好像不是一个邮箱
      </div>
      </div>
      <div class="mb-3">
      <label for="inputPwd" class="form-label">密码</label>
      <input v-model="submitInfo.pwd" type="password" class="form-control" id="inputPwd" >
      </div> 
      <button :disabled="!(mailOk&&submitInfo.pwd)" @click="login" 
      class="btn btn-primary" >登录</button> 
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        submitInfo: {
          mail: "",
          pwd: ""
        },
        mailOk: -1
      };
    },
    components: {},
    methods: {
      ipMailFocus () {
        document.onkeydown = (ev)=>{
          if (ev.key === "Enter") {
            this.$refs.ipMail.blur()
          }
        }
      },
      checkIsMail () {
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
        if (reg.test(this.submitInfo.mail)) {
          this.mailOk = 1
        } else this.mailOk = 0
      },
      login () {
        fetch('/api/log', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            mail: this.submitInfo.mail,
            pwd: this.submitInfo.pwd
          })
        })
        .then(res=>res.json()
        .then(data=>{
          if(!data.err) {
            sessionStorage.setItem("role", data.role)
            sessionStorage.setItem("token", data.tkid)
            sessionStorage.setItem("username", data.username)
            this.$router.push("/admin")
          } else {
            sessionStorage.removeItem("token")
            alert(data.msg)
          }
        }))
      }
    }
  }
</script>

<style scoped>
  #login {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #logbox {
    width: 500px;
    height: 450px;
    border: 1px solid var(--rMainColorAA);
    border-radius: 0.5rem;
    box-sizing: border-box;
    padding: 50px;
  }
  #logHead {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #logHead>img {
    display: block;
    width: 100px;
  }
  #logHead>h1 {
    font: 1.5rem sans-serif;
  }
  #logbox>button {
    width: 100%;
    height: 40px;
    margin-top: 1rem;
    cursor: pointer;
  }
</style>