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
    records: [],
  }
}

root.created = function() {
  this.getSupporting()
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

// uid
root.computed.uuid = function () {
  if(this.$store.state.authMessage.uuid == undefined){
    return this.$store.state.authMessage.userId
  }
  return this.$store.state.authMessage.uuid
}


root.methods = {}
root.methods.buyConfirmSuccessClose = function () {

}

//查询配套数据get
root.methods.getSupporting = function (item) {
  this.$http.send('GET_MATCHDATA', {
    bind: this,
    callBack: this.re_getSupporting,
    errorHandler: this.error_getSupporting
  })
}
root.methods.re_getSupporting = function (res) {

  res = {
    "data": [
      {
        "fcode": "qq100",
        "fdesc": "10000 QQ"
      },
      {
        "fcode": "qq110",
        "fdesc": "20000 QQ"
      },
      {
        "fcode": "qq120",
        "fdesc": "30000 QQ"
      },
      {
        "fcode": "qq130",
        "fdesc": "40000 QQ"
      },
      {
        "fcode": "qq140",
        "fdesc": "50000 QQ"
      }
    ],
    "status": "200",
    "message": "success"
  }
  this.optionsgender = res.data
  console.log("this.res=====",res)
}
root.methods.error_getSupporting = function (err) {
  console.log("this.err=====",err)
}

//查询用户余额get (query:{})
root.methods.getBalance = function () {
  this.$http.send('GET_GETUSERBALANCE', {
    bind: this,
    callBack: this.re_getBalance,
    errorHandler: this.error_getBalance
  })
}
root.methods.re_getBalance = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_getBalance = function (err) {
  console.log("this.err=====",err)
}

//查询报名记录get
root.methods.getRegistrationRecord = function () {
  this.$http.send('GET_GETREGDATA', {
    bind: this,
    query:{
      userId:this.uuid
    },
    callBack: this.re_getRegistrationRecord,
    errorHandler: this.error_getRegistrationRecord
  })
}
root.methods.re_getRegistrationRecord = function (res) {
  res = {
    "data": [
      {
        "account": "54645@qq.com",
        "fdesc": "10000 QQ",
        "createdAt": "2020-02-05",
        "periodsNum": "1期"
      }
    ],
    "status": "200",
    "message": "success"
  }
  console.log("this.res=====",res)
  this.records = res.data
}
root.methods.error_getRegistrationRecord = function (err) {
  console.log("this.err=====",err)
}

//查询活动报名post(params:{})
root.methods.postActivities = function () {
  this.$http.send('POST_REGACT', {
    bind: this,
    params:{},
    callBack: this.re_postActivities,
    errorHandler: this.error_postActivities
  })
}
root.methods.re_postActivities = function (res) {
  console.log("this.res=====",res)
}
root.methods.error_postActivities = function (err) {
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
