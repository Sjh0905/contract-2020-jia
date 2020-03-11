const root = {}
root.name = 'officialQuantitativeRegistration'



root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),

}

root.data = () => {
  return {
    loading: true, // 加载中
    matchDataList:[],
    matchDataObj:{},
    matchDataKey:{},
    matchingAmount: '',
    records: [],
    balance:'0',
    matchingAmountMsg_0:'',

    popType: 0,
    popOpen: false,
    popText: '',

    verificationCode: '',
    verificationCodePlaceholderShow: true,
    clickVerificationCodeButton: false,
    getVerificationCode: false,
    getVerificationCodeCountdown: 60,
    verificationCodeWA: '',
    getVerificationCodeInterval: null,
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
    return (this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return (this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

// // uid
// root.computed.uuid = function () {
//   if(this.$store.state.authMessage.uuid == undefined){
//     return this.$store.state.authMessage.userId
//   }
//   return this.$store.state.authMessage.uuid
// }


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

  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}

  this.matchDataList = data.data || []
  this.matchDataList.map((v,key) =>{

    this.matchDataObj[v.fdesc] = v.fut_amt
    this.matchDataKey[v.fdesc] = v.fcode

    console.log('v,key======',this.matchDataObj[v.fdesc])
  })

  console.log("this.data查询配套数据get=====",data)
}
root.methods.error_getSupporting = function (err) {
  console.log("this.err=====",err)
}

//查询用户余额get (query:{})未完成
root.methods.getBalance = function () {
  // /* TODO : 调试接口需要屏蔽 S*/
  // var data ={
  //   "data": [
  //   {
  //     "id": "25139",
  //     "createdAt": "1574162856000",
  //     "updatedAt": "1574162856000",
  //     "userId": "100003",
  //     "version": "1",
  //     "balance": "1.000000000000000000",
  //     "currency": "BTC",
  //     "type": "SPOT_AVAILABLE"
  //   },
  //   // {
  //   //   "id": "25142",
  //   //   "createdAt": "1574162856000",
  //   //   "updatedAt": "1574162856000",
  //   //   "userId": "100003",
  //   //   "version": "1",
  //   //   "balance": "1000.000000000000000000",
  //   //   "currency": "CHA3",
  //   //   "type": "SPOT_AVAILABLE"
  //   // }
  // ],
  //   "status": "200",
  //   "message": "success"
  // }
  // this.re_getBalance(data)
  // /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('GET_BALANCE', {
    bind: this,
    urlFragment:this.userId,
    callBack: this.re_getBalance,
    errorHandler: this.error_getBalance
  })
}
root.methods.re_getBalance = function (data) {
  console.log('查询用户余额get  index',data)
  typeof data === 'string' && (data = JSON.parse(data))
  data.data.forEach((v,index)=>{
    if (v.currency == 'KK') {
      console.log('查询用户余额get  index',index)
      console.log('查询用户余额get  index',v.balance)
      this.balance = v.balance
      this.type = v.type
      this.currency = v.currency
    }
  })
}
root.methods.error_getBalance = function (data) {
  console.log("this.err=====",data.data)
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

  if (this.records.length !== 0) {
    this.balance = (this.balance - this.matchDataObj[this.matchingAmount])
  }

}
root.methods.error_getRegistrationRecord = function (err) {
  console.log("this.err=====",err)
}

//活动报名post(params:{})
root.methods.postActivities = function () {
  console.log(' this.balance', this.balance + ' KK')
  console.log(' this.matchingAmount', this.matchingAmount)
  // this.matchDataList

  let canSend = true
  // 判断用户名
  // 判断用户名
  canSend = this.testMatchingAmount() && canSend

  if (this.matchingAmount === '') {
    this.matchingAmountMsg_0 = this.$t('cannot')
    canSend = false
  }
  if (this.accMinus(this.matchDataObj[this.matchingAmount] || '0', this.balance || '0') > 0) {
    this.matchingAmountMsg_0 = this.$t('distribution')
    canSend = false
  }
  if (!canSend) {
    // console.log("不能发送！")
    return
  }

  // TODO : 加变量的非空判断 正则判断
  // let params = {
  //   userId: this.userId,
  //   fcurr: this.currency,
  //   email: this.userName,
  //   mobile: this.userName,
  //   fcode: this.matchDataKey[this.matchingAmount],
  //   amount: this.matchDataObj[this.matchingAmount] * 1//所需数额
  // }
  let params = this.userType === 0 ? {
    userId: this.userId,
    fcurr: this.currency,
    email: '',
    mobile: this.userName,
    fcode: this.matchDataKey[this.matchingAmount],
    amount: this.matchDataObj[this.matchingAmount]//所需数额
  } : {
    userId: this.userId,
    fcurr: this.currency,
    email: this.userName,
    mobile: '',
    fcode: this.matchDataKey[this.matchingAmount],
    amount: this.matchDataObj[this.matchingAmount]//所需数额
  }
  console.log("postActivities + params ===== ",params)
  /* TODO : 调试接口需要屏蔽 S*/
  // this.re_postActivities()
  /* TODO : 调试接口需要屏蔽 E*/

  this.getVerificationCode = true
  this.clickVerificationCodeButton = true
  this.verificationCodeWA = ''

  this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)

  this.getVerificationCodeInterval = setInterval(() => {
    this.getVerificationCodeCountdown--
    if (this.getVerificationCodeCountdown <= 0) {
      this.getVerificationCode = false
      this.getVerificationCodeCountdown = 60
      clearInterval(this.getVerificationCodeInterval)
    }
  }, 1000)

  this.$http.send('POST_REGACT', {
    bind: this,
    params: params,
    callBack: this.re_postActivities,
    errorHandler: this.error_postActivities
  })
}
root.methods.re_postActivities = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}
  console.log("this.re_postActivities活动报名=====",data)

  // this.re_getRegistrationRecord()
  this.success = data.data.success

  if (data.errorCode) {
    if (data.errorCode == "1") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('quantifying')
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "2") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('Insufficient')
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "400") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('parameter_error')
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "500") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('system_anomaly')
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }

  if (data.errorCode == "0" && this.success == true) {
    this.getRegistrationRecord()
    this.popOpen = true
    this.popType = 1
    this.popText = '报名成功'
    setTimeout(() => {
      this.popOpen = true
    }, 100)
    return;
  }
  // if (this.success == true) {
  //   this.getRegistrationRecord()
  //   this.popOpen = false
  //   return;
  // }
}
root.methods.error_postActivities = function (err) {
  console.log("this.err=====",err)
  console.warn('活动报名post 获取出错！', err)
}


// 拼团名称输入
root.methods.testMatchingAmount = function () {
  if (this.matchingAmount === '') {
    this.matchingAmountMsg_0 = ''
    return false
  }
  this.matchingAmountMsg_0 = ''
  return true
}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

/*---------------------- 保留小数位 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数位 end ---------------------*/


/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

export default root
