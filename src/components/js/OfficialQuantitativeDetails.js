const root = {}
root.name = 'officialQuantitativeDetails'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = () => {
  return {
    loading: true, // 加载中

  }
}

root.computed = {}
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


root.methods = {}

//量化展示_量化交易记录get (query:{})  未完成
root.methods.getQuantifyransactions = function () {
  this.$http.send('GET_QUANT_GETUSERTRADE', {
    bind: this,
    // query:{userId:this.uuid},
    callBack: this.re_getQuantifyransactions,
    errorHandler: this.error_getQuantifyransactions
  })
}
root.methods.re_getQuantifyransactions = function (res) {
  console.log("this.re_getQuantifyransactions=====",res)
}
root.methods.error_getQuantifyransactions = function (err) {
  console.log("this.error_getQuantifyransactions=====",err)
}

//量化展示_量化基本信息get (query:{})  未完成
root.methods.getQuantifyBasicInformation = function () {
  this.$http.send('GET_USER_QUANTTRADE', {
    bind: this,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getQuantifyBasicInformation,
    errorHandler: this.error_getQuantifyBasicInformation
  })
}
root.methods.re_getQuantifyBasicInformation = function (res) {
  console.log("this.re_getQuantifyBasicInformation=====",res)
}
root.methods.error_getQuantifyBasicInformation = function (err) {
  console.log("this.error_getQuantifyBasicInformation=====",err)
}

export default root
