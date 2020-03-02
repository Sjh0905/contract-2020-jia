const root = {}
root.name = 'officialQuantitativeRegistration'



root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.data = () => {
  return {
    loading: true, // 加载中
    optionsgender:[],
    valuegender: '',
    records: [],
    balance:'0',
  }
}

root.created = function() {
  this.getSupporting()
  this.getRegistrationRecord()
  this.getBalance()
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

//查询配套数据get
root.methods.getSupporting = function (item) {
  // TODO: 要删除的
  // var data = {
  //   "data": [
  //     {
  //       "fcode": "qq100",
  //       "fdesc": "10000 QQ"
  //     },
  //     {
  //       "fcode": "qq110",
  //       "fdesc": "20000 QQ"
  //     },
  //     {
  //       "fcode": "qq120",
  //       "fdesc": "30000 QQ"
  //     },
  //     {
  //       "fcode": "qq130",
  //       "fdesc": "40000 QQ"
  //     },
  //     {
  //       "fcode": "qq140",
  //       "fdesc": "50000 QQ"
  //     }
  //   ],
  //   "status": "200",
  //   "message": "success"
  // }
  // this.re_getSupporting(data)
  //TODO: 要删除的
  this.$http.send('GET_MATCH_DATA', {
    bind: this,
    callBack: this.re_getSupporting,
    errorHandler: this.error_getSupporting
  })
}
root.methods.re_getSupporting = function (data) {

  // res = {
  //   "data": [
  //     {
  //       "fcode": "qq100",
  //       "fdesc": "10000 QQ"
  //     },
  //     {
  //       "fcode": "qq110",
  //       "fdesc": "20000 QQ"
  //     },
  //     {
  //       "fcode": "qq120",
  //       "fdesc": "30000 QQ"
  //     },
  //     {
  //       "fcode": "qq130",
  //       "fdesc": "40000 QQ"
  //     },
  //     {
  //       "fcode": "qq140",
  //       "fdesc": "50000 QQ"
  //     }
  //   ],
  //   "status": "200",
  //   "message": "success"
  // }
  this.optionsgender = data.data
  console.log("this.res=====",data)
}
root.methods.error_getSupporting = function (err) {
  console.log("this.err=====",err)
}

//查询用户余额get (query:{})未完成
root.methods.getBalance = function () {
  // /* TODO : 调试接口需要屏蔽 S*/
  var data ={
    "data": [
    {
      "id": "25139",
      "createdAt": "1574162856000",
      "updatedAt": "1574162856000",
      "userId": "100003",
      "version": "1",
      "balance": "1.000000000000000000",
      "currency": "BTC",
      "type": "SPOT_AVAILABLE"
    },
    {
      "id": "25142",
      "createdAt": "1574162856000",
      "updatedAt": "1574162856000",
      "userId": "100003",
      "version": "1",
      "balance": "1000.000000000000000000",
      "currency": "CHA3",
      "type": "SPOT_AVAILABLE"
    }
  ],
    "status": "200",
    "message": "success"
  }
  this.re_getBalance(data)
  // /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('GET_BALANCE', {
    bind: this,
    urlFragment:this.uuid,
    callBack: this.re_getBalance,
    errorHandler: this.error_getBalance
  })
}
root.methods.re_getBalance = function (data) {
  console.log("this.res=====查询用户余额",data.data)
  this.balance = data.data.balance
}
root.methods.error_getBalance = function (data) {
  console.log("this.err=====",data.data)
}

//查询报名记录get
root.methods.getRegistrationRecord = function () {

  // /* TODO : 调试接口需要屏蔽 S*/
  // var  data = {
  //   "data": [
  //     {
  //       "account": "54645@qq.com",
  //       "fdesc": "10000 QQ",
  //       "createdAt": "2020-02-05",
  //       "periodsNum": "1期"
  //     }
  //   ],
  //   "status": "200",
  //   "message": "success"
  // }
  // this.re_getRegistrationRecord(data)
  // /* TODO : 调试接口需要屏蔽 E*/

  this.$http.send('GET_GETREG_DATA', {
    bind: this,
    urlFragment:this.uuid,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getRegistrationRecord,
    errorHandler: this.error_getRegistrationRecord
  })
}
root.methods.re_getRegistrationRecord = function (data) {

  typeof data === 'string' && (data = JSON.parse(data))
  console.log("this.re_getRegistrationRecord=====",data)
  this.records = data.data
}
root.methods.error_getRegistrationRecord = function (err) {
  console.log("this.err=====",err)
}

//活动报名post(params:{})
root.methods.postActivities = function () {
  // TODO : 加变量的非空判断 正则判断
  let params = {
    userId: this.uuid,
    fcurr: this.fcurr,
    email: this.userName,
    mobile: this.userName,
    fcode: this.fcode,
    amount: this.valuegender //所需数额
  }
  console.log("postActivities + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  this.re_postActivities()
  /* TODO : 调试接口需要屏蔽 E*/

  this.$http.send('POST_REGACT', {
    bind: this,
    params: params,
    callBack: this.re_postActivities,
    errorHandler: this.error_postActivities
  })
}
root.methods.re_postActivities = function (data) {
  console.log("this.re_postActivities=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
}
root.methods.error_postActivities = function (err) {
  console.log("this.err=====",err)
}


export default root
