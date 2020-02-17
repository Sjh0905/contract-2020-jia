const root = {}
root.name = 'CreateAGroup'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    //副团长账号
    deputyAccount:'',
    //团名称
    gname:'',
    //检测团名 false:可用，true：不可用
    available:true
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// uid
root.computed.uuid = function () {
  if(this.$store.state.authMessage.uuid == undefined){
    return this.$store.state.authMessage.userId
  }
  return this.$store.state.authMessage.uuid
}

// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}



//创建拼团post(params:{})
root.methods.postCreateAGroup = function () {
  this.$http.send('POST_ASSEMBLE_CREATEGROUP', {
    bind: this,
    params:{
      userId: this.uuid,
      priAccount: this.userName,
      deputyAccount: this.deputyAccount,
      gname: this.gname
    },
    callBack: this.re_postCreateAGroup,
    errorHandler: this.error_postCreateAGroup
  })
}
root.methods.re_postCreateAGroup = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_postCreateAGroup = function (err) {
  console.log("this.err=====",err)
}

//检查团名是否可用get (query:{})
root.methods.getNameAvailable = function () {
  this.$http.send('GET_ASSEMBLE_ISEXISTGNAME', {
    bind: this,
    query:{
      gname: this.this.gname
    },
    callBack: this.re_getNameAvailable,
    errorHandler: this.error_getNameAvailable
  })
}
root.methods.re_getNameAvailable = function (res) {
  console.log("this.res=====",res)
  this.available = res.data.success
}
root.methods.error_getNameAvailable = function (err) {
  console.log("this.err=====",err)
}


//跳创建好拼团的页面
root.methods.createGroupType = function () {
  // if(this.available == false ) {
  //   this.$router.push({name: 'detailsOfTheGroup'})
  // }
  this.$router.push({name: 'detailsOfTheGroup'})
}
export default root
