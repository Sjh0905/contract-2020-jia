const root = {}
root.name = 'officialQuantitativeRegistration'



root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),


}

root.data = () => {
  return {
    loading: true, // 加载中
    matchDataList:[],
    matchDataObj:{},
    matchDataKey:{},
    matchDataFamt:{},
    matchDataffAmt:{},
    matchDataXX:{},
    matchingAmount: '',
    records: [],
    balanceYY:'0',
    balanceTT:'0',
    balanceXX:'0',
    balanceFF:'0',
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

    popWindowOpenShiM: false, //弹窗开关
    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定
    popIdenOpen: false,
    fstatus:'', //审核的状态
    remark:'',
    complete:'',  //挖矿已完成或进行中
    clickThis:1,
    sending1:false,

    isApp:false,
    isIOS:false,
    YTX:0,
    TT:0
  }
}

root.created = function() {
  this.getBalance()
  this.getSupporting()
  this.getRegistrationRecord()
  this.GET_AUTH_STATE()
  this.isAppQuery()
  this.isIOSQuery()
}

root.computed = {}
root.computed.computedRecord = function (item,index) {
  // console.log('jjjjjjjjjjj',item,'kkkkkkkk',index,'pppppp',this.records)
  return this.records
}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
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
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}


// // uid
// root.computed.uuid = function () {
//   if(this.$store.state.authMessage.uuid == undefined){
//     return this.$store.state.authMessage.userId
//   }
//   return this.$store.state.authMessage.uuid
// }


root.methods = {}


// 认证状态
root.methods.GET_AUTH_STATE = function () {
  this.$http.send("GET_AUTH_STATE", {
    bind: this,
    callBack: this.RE_GET_AUTH_STATE,
    errorHandler: this.error_getCurrency
  })
}
root.methods.RE_GET_AUTH_STATE = function (res) {
  typeof res === 'string' && (res = JSON.parse(res));
  if (!res) return
  this.$store.commit('SET_AUTH_STATE', res.dataMap)
  // let data = res.dataMap;
  // this.identity_type = data;
  // if (res.result == 'SUCCESS' && (data.sms || data.ga)) {
  //   this.bindIdentify = data.identity;
  // }
  // 两者都验证了
  // this.bindGA = data.ga;
  // this.bindMobile = data.sms;
  // this.bindEmail = data.email;
  // this.bindMobile && (this.picked = 'bindMobile');
  // this.bindGA && (this.picked = 'bindGA');
  // if (this.bindGA && this.bindMobile) {
  //   this.showPicker = true;
  // }
  //
  // this.loading = false
}



// 显示详情
root.methods.showDetail = function () {
  if (this.clickThis == 1) {
    this.clickThis = 2
    return
  }
  this.clickThis = 1
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
    this.currency = v.currency
    if (v.currency == 'YY') {
      console.log('查询用户余额get  index',index)
      console.log('查询用户余额get  index',v.balance)
      this.balanceYY = v.balance
      this.type = v.type
      this.currency = v.currency
    }
    if (v.currency == 'TT') {
      console.log('查询用户余额get  index',index)
      console.log('查询用户余额get  index',v.balance)
      this.balanceTT = v.balance
      this.type = v.type
      this.currency = v.currency
    }
    if (v.currency == 'XX') {
      console.log('查询用户余额get  index',index)
      console.log('查询用户余额get  index',v.balance)
      this.balanceXX = v.balance
      this.type = v.type
      this.currency = v.currency
    }
    if (v.currency == 'FF') {
      console.log('查询用户余额get  index',index)
      console.log('查询用户余额get  index',v.balance)
      this.balanceFF = v.balance
      this.type = v.type
      this.currency = v.currency
    }
  })
}
root.methods.error_getBalance = function (data) {
  console.log("this.err=====",data.data)
}

//查询配套数据get
root.methods.getSupporting = function (item) {

  this.$http.send('GET_MATCH_DATA', {
    bind: this,
    urlFragment:this.userId,
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
    this.matchDataFamt[v.fdesc] = v.next_famt
    this.matchDataffAmt[v.fdesc] = v.ffAmt
    // this.matchDataXX[v.fdesc] = v.fut_amt
    this.matchDataKey[v.fdesc] = v.fcode
    // this.YTX = this.matchDataKey[this.matchingAmount].indexOf('y')
    // this.TT = this.matchDataKey[this.matchingAmount].indexOf('x')

    // this.YTX = this.matchDataKey[v.fdesc].substr(0,1)
    // this.matchDataKey[v.fdesc]=YTX.substr(0,1)


    console.log('v,key======',this.matchDataObj[v.fdesc])
    console.log('v,key======',this.matchDataKey[v.fdesc])
    console.log('v,key======',this.YTX)
  })

  this.getBalance()

  console.log("this.data查询配套数据get=====",data)
}
root.methods.error_getSupporting = function (err) {
  console.log("this.err=====",err)
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

  let E2 = this.records[0]
  this.fstatus = E2.fstatus
  this.complete = E2.complete
  // this.fstatus = data.data.fstatus
  // this.remark = this.records.getArrayIndex(5)
  if ((this.records.length !== 0) && (this.matchDataKey[this.matchingAmount].indexOf('y') > -1)) {
    this.balanceYY = (this.balanceYY - this.matchDataObj[this.matchingAmount])
    this.balanceTT = (this.balanceTT - this.matchDataFamt[this.matchingAmount])
    this.balanceFF = (this.balanceFF - this.matchDataffAmt[this.matchingAmount])
    // this.balanceXX = (this.balanceXX - this.matchDataObj[this.matchingAmount])
  }
  if ((this.records.length !== 0) && (this.matchDataKey[this.matchingAmount].indexOf('x') > -1)) {
    // this.balanceYY = (this.balanceYY - this.matchDataObj[this.matchingAmount])
    this.balanceTT = (this.balanceTT - this.matchDataFamt[this.matchingAmount])
    this.balanceXX = (this.balanceXX - this.matchDataObj[this.matchingAmount])
    this.balanceFF = (this.balanceFF - this.matchDataffAmt[this.matchingAmount])

  }

}
root.methods.error_getRegistrationRecord = function (err) {
  console.log("this.err=====",err)
}
root.methods.goToDelails = function () {
  // this.$router.push({name: 'MobileLockHouseRecord'})
  if (this.isMobile && this.records.length !== 0) {
    this.$router.push({name:'officialQuantitativeDetails'})
  }

}

//活动报名post(params:{})
root.methods.postActivities = function () {
  console.log(' this.balance', this.balance + ' KK')
  console.log(' this.matchingAmount', this.matchingAmount)
  // this.matchDataList

  // // 如果没有实名认证不允许报名
  if (!this.bindIdentify && !this.isMobile) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popWindowOpenShiM = true
    return
  }

  // // PC如果没有绑定谷歌或手机，不允许报名(邮箱注册,手机注册无限制)
  if (!this.bindGA && !this.bindMobile  && !this.isMobile) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popWindowOpenShiM = true
    return
  }

  if (this.isMobile && !this.bindIdentify) {
    this.popIdenOpen = true
    return
  }

  // H5判断是否绑定谷歌或手机，如果都没绑定
  if (this.isMobile && !this.bindGA && !this.bindMobile) {
    // this.$eventBus.notify({key: 'BIND_AUTH_POP'})
    this.popText = '请绑定谷歌或手机';
    this.popType = 0;
    this.popOpen = true;
    return
  }

  // let canSend = true
  // 判断用户名
  // 判断用户名
  // canSend = this.testMatchingAmount() && canSend


  if ((this.accMinus(this.matchDataFamt[this.matchingAmount] || '0', this.balanceTT || '0')) > 0) {
    this.matchingAmountMsg_0 = this.$t('distribution')
    return false
  }
  if (this.matchingAmount === '') {
    this.matchingAmountMsg_0 = this.$t('cannot')
    return false
  }
  // if (!canSend) {
  //   // console.log("不能发送！")
  //   return
  // }

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
    // amount: this.matchDataObj[this.matchingAmount]//所需数额
  } : {
    userId: this.userId,
    fcurr: this.currency,
    email: this.userName,
    mobile: '',
    fcode: this.matchDataKey[this.matchingAmount],
    // amount: this.matchDataObj[this.matchingAmount]//所需数额
  }
  console.log("postActivities + params ===== ",params)

  //
  // this.getVerificationCode = true
  // this.clickVerificationCodeButton = true
  // this.verificationCodeWA = ''
  //
  // this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
  //
  // this.getVerificationCodeInterval = setInterval(() => {
  //   this.getVerificationCodeCountdown--
  //   if (this.getVerificationCodeCountdown <= 0) {
  //     this.getVerificationCode = false
  //     this.getVerificationCodeCountdown = 60
  //     clearInterval(this.getVerificationCodeInterval)
  //   }
  // }, 1)
  this.sending1 = true
  this.$http.send('POST_REGACT', {
    bind: this,
    params: params,
    callBack: this.re_postActivities,
    errorHandler: this.error_postActivities
  })
}
root.methods.re_postActivities = function (data) {
  // this.sending1 = false
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}
  console.log("this.re_postActivities活动报名=====",data)

  // this.re_getRegistrationRecord()
  this.success = data.data.success

  if (data.errorCode) {
    if (data.errorCode == "1") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('quantifying') //量化币种有误
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "2") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('Insufficient') //可用币种TT或YY余额不足
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    // if (data.errorCode == "3") {
    //   this.popOpen = true
    //   this.popType = 0
    //   this.popText = this.$t('system_err1') //用户已参加过报名活动
    //   setTimeout(() => {
    //     this.popOpen = true
    //   }, 100)
    // }
    if (data.errorCode == "4") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('system_err') //参数配套编码fcode有误
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "5") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('popWindowPromptWithdrawals') //您尚未通过实名认证
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "7") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('applied3') //挖矿进行中，不能兑换其他矿源
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "8") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('applied4') //已报名挖矿,不能重复报名
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "400") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('parameter_error') //参数有误
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    if (data.errorCode == "500") {
      this.popOpen = true
      this.popType = 0
      this.popText = this.$t('system_anomaly') //系统异常
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    this.sending1 = false
    // this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    // this.getVerificationCode = false
    // this.getVerificationCodeCountdown = 60
  }

  if (this.fstatus == '已报名' && this.isMobile) {
    // setTimeout(() => {
      this.$router.push({name:'officialQuantitativeDetails'})
    // }, 1000)
    return;
  }

  if (this.isMobile && data.errorCode == "0" && this.success == true) {
    this.getRegistrationRecord()
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('applied') //报名成功
    setTimeout(() => {
      this.popOpen = true
    }, 100)
    if(this.fstatus == '已报名') {
      setTimeout(() => {
        this.$router.push({name:'officialQuantitativeDetails'})
      }, 1000)
    }
    return;
  }

  if (data.errorCode == "0" && this.success == true) {
    this.getRegistrationRecord()
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('registration') //报名成功
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
  this.sending1 = false
  console.log("this.err=====",err)
  console.warn('活动报名post 获取出错！', err)
}


//
root.methods.testMatchingAmount = function () {
  if (this.matchingAmount === '') {
    this.matchingAmountMsg_0 = ''
    return false
  }
  this.matchingAmountMsg_0 = ''
  return true
}

// 弹窗关闭
root.methods.popWindowCloseShiM = function () {
  this.popWindowOpenShiM = false
}

// 关闭弹窗
root.methods.popIdenClose = function () {
  this.popIdenOpen = false
}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

root.methods.isAppQuery = function (query) {
  if(this.$route.query.isApp) {
    this.isApp = true
  } else {
    this.isApp = false
  }
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

// 弹出绑定身份，跳转到实名认证界面
root.methods.goToBindIdentity = function () {
  this.popWindowOpenShiM = false
  this.$router.push({name: 'authenticate'})
}


// 弹框跳安全中心
root.methods.goToSecurityCenter = function () {
  this.popWindowOpenShiM = false
  this.$router.push({name: 'securityCenter'})
}

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(Number(time), 'YYYY-MM-DD')
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
