const root = {}
root.name = 'OfficialQuantitativeRegistration'



root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupArticle': resolve => require(['../vue/PopupArticle'], resolve),
}

root.data = () => {
  return {
    loading: true, // 加载中

    buyConfirmSuccess:true,
    // optionsgender: [{
    //   value: '0',
    //   label: '10000 QQ'
    // }, {
    //   value: '1',
    //   label: '20000 QQ'
    // }, {
    //   value: '2',
    //   label: '20000 QQ'
    // }, {
    //   value: '3',
    //   label: '30000 QQ'
    // }, {
    //   value: '4',
    //   label: '40000 QQ'
    // }, {
    //   value: '5',
    //   label: '50000 QQ'
    // }, {
    //   value: '6',
    //   label: '60000 QQ'
    // }, {
    //   value: '7',
    //   label: '70000 QQ'
    // }, {
    //   value: '8',
    //   label: '90000 QQ'
    // }, {
    //   value: '9',
    //   label: '100000 QQ'
    // }
    // ],
    optionsgender:[],
    valuegender: '',
  }
}

root.created = function() {
  this.get_supporting()
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

//查询配套数据get
root.methods.get_supporting = function () {
  this.$http.send('GET_MATCHDATA', {
    bind: this,
    callBack: this.re_get_supporting,
    errorHandler: this.error_get_supporting
  })
}
root.methods.re_get_supporting = function (res) {

  this.optionsgender = res.data
  console.log("this.res=====",res)
}
root.methods.error_get_supporting = function (err) {
  console.log("this.err=====",err)
}

//查询用户余额get (query:{})
root.methods.get_balance = function () {
  this.$http.send('GET_GETUSERBALANCE', {
    bind: this,
    callBack: this.re_get_balance,
    errorHandler: this.error_get_balance
  })
}
root.methods.re_get_balance = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_balance = function (err) {
  console.log("this.err=====",err)
}

//查询报名记录get
root.methods.get_registration_record = function () {
  this.$http.send('GET_GETREGDATA', {
    bind: this,
    callBack: this.re_get_getregdata,
    errorHandler: this.error_get_getregdata
  })
}
root.methods.re_get_getregdata = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_get_getregdata = function (err) {
  console.log("this.err=====",err)
}

//查询活动报名post(params:{})
root.methods.post_activities = function () {
  this.$http.send('POST_REGACT', {
    bind: this,
    params:{},
    callBack: this.re_post_activities,
    errorHandler: this.error_post_activities
  })
}
root.methods.re_post_activities = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_post_activities = function (err) {
  console.log("this.err=====",err)
}





//跳转首页
root.methods.goToHomePage = function () {
  this.$router.push({name: 'home'})
}
//关闭蒙层弹框
root.methods.goToParticipateNow = function () {
  this.buyConfirmSuccess = false
}

export default root
