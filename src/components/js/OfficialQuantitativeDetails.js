const root = {}
root.name = 'officialQuantitativeDetails'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupArticle': resolve => require(['../vue/PopupArticle'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = () => {
  return {
    loading: true, // 加载中
    buyConfirmSuccess:false,
  }
}

root.created = function () {
  this.getRegistrationRecord()
}
root.computed = {}

root.computed.computedRecord = function (item,index) {
  // console.log('jjjjjjjjjjj',item,'kkkkkkkk',index,'pppppp',this.records)
  return this.records
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

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

root.methods = {}

root.methods.buyConfirmSuccessClose = function () {
  // this.buyConfirmSuccess=true

}

//查询报名记录get
root.methods.getRegistrationRecord = function () {

  this.$http.send('GET_GETREG_DATA', {
    bind: this,
    urlFragment:this.userId,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getRegistrationRecord,
    errorHandler: this.error_getRegistrationRecord
  })
}
root.methods.re_getRegistrationRecord = function (data) {

  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}
  console.log("this.re_getRegistrationRecord查询报名记录get=====",data)
  this.records = data.data

  if (this.records.length == 0) {
    this.buyConfirmSuccess=true
    return;
  }
  this.buyConfirmSuccess=false
}
root.methods.error_getRegistrationRecord = function (err) {
  console.log("this.err=====",err)
}


//量化展示_量化交易记录get (query:{})  未完成
root.methods.getQuantifyransactions = function () {

  var data = {
    "data": [
      {
        "createDate": "2020-03-23",
        "totalAmount": "34334.0000",
        "reward": "24.0000",
        "surplus": "900.0000"
      }
    ],
      "errorCode": "0",
      "message": "success"
  }
  this.$http.send('GET_USER_TRADE', {
    bind: this,
    urlFragment:this.userId,
    // query:{userId:this.uuid},
    callBack: this.re_getQuantifyransactions,
    errorHandler: this.error_getQuantifyransactions
  })
}
root.methods.re_getQuantifyransactions = function (res) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}
  console.log("this.re_getQuantifyransactions=====",res)
}
root.methods.error_getQuantifyransactions = function (err) {
  console.log("this.error_getQuantifyransactions=====",err)
}

//量化展示_量化基本信息get (query:{})  未完成
root.methods.getQuantifyBasicInformation = function () {
  var data = {
    "data": {
      "totalReward": "0",
      "recode": {
        "reward": 0,
        "totalAmount": 0,
        "surplus": 10000,
        "quantStartEndTime": "03/23 04:00 - 03/24 03:59",
        "createdate": "2020-03-23",
        "currency": "KK",
        "userId": "100013",
        "account": "2570167180@qq.com",
        "fut_amt": "10000",
        "fcode": "yy100",
        "prevSurplus":133,
        "miningProgress": 0.85
      }
    },
    "errorCode": "0",
    "message": "success"
  }
  this.$http.send('GET_TRADE', {
    bind: this,
    urlFragment:this.userId,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getQuantifyBasicInformation,
    errorHandler: this.error_getQuantifyBasicInformation
  })
}
root.methods.re_getQuantifyBasicInformation = function (res) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}
  console.log("this.re_getQuantifyBasicInformation=====",res)
}
root.methods.error_getQuantifyBasicInformation = function (err) {
  console.log("this.error_getQuantifyBasicInformation=====",err)
}

//跳转首页
root.methods.goToHomePage = function () {
  this.$router.push({name: 'home'})
}
//关闭蒙层弹框
root.methods.goToParticipateNow = function () {
  // this.buyConfirmSuccess = false
  this.$router.push({name: 'officialQuantitativeRegistration'})

}
export default root
