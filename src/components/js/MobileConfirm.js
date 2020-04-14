// const root = {}
// root.name = 'MobileConfirm'
// /*------------------------------ 组件 ------------------------------*/
// //root.components = {
// //  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
// //}
// /*------------------------------ data -------------------------------*/
// root.data = function () {
//   return {}
// }
// /*------------------------------ 生命周期 -------------------------------*/
// root.created = function () {}
// root.mounted = function () {}
// root.beforeDestroy = function () {}
// /*------------------------------ 计算 -------------------------------*/
// root.computed = {}
// /*------------------------------ 观察 -------------------------------*/
// root.watch = {}
// /*------------------------------ 方法 -------------------------------*/
// root.methods = {}
// export default root



import {number} from "echarts/src/export";

const root = {}
root.name = 'MobileConfirm'

root.props = {}

root.props.emailInput = {
  type: String,
}

root.props.UIDInput = {
  type: String,
}

root.props.amountInput = {
  type: String,
}
root.props.userName = {
  type: String,
}
root.props.currentCurrency = {
  type: String,
}

/*---------------------- 组件 -----------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  // 'MobileTransferRecords': resolve => require(['../vue/MobileTransferRecords'], resolve),
}

root.data = function () {
  return {
    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    // 弹窗是否显示
    windowToastFlag: false,

    // mobileToast 邮箱弹窗是否显示
    mobileToastOneFlag: false,

    // 此币种信息
    mobileRechargeRecordData: '',


    // 邮箱验证码 及 错误提示
    sendMailMsg: ' ',
    mailCode: '',
    mailCodeWA: '',
    getMailCode:false,

    // 谷歌验证码
    googleCode:'',
    googleCodeWA:'',
    submitStepThreeFlag : false,

    phoneCode:'',
    phoneCodeWA:'',
    // 谷歌验证码或者手机验证码
    secondCode:'',

    // 获取mailcode状态
    getTransferMailCode: false,
    // 获取mail验证码倒计时container
    getEmailVerificationCodeInterval: null,
    // 获取邮箱验证码的倒计时
    getEmailVerificationCodeCountdown: 60,

    getMobileVerificationCodeInterval: null, //获取手机验证码倒计时container
    getMobileVerificationCodeCountdown: 60, //获取手机验证码倒计时
    getMobileVerificationCode: false, //获取手机验证码倒计时

    // 二级验证通过
    mobileToastTwoFlag: false,
    // 二级验证页页面样式
    // 顶部选择框 选择了哪一项  1---谷歌验证   2---手机验证
    secondPicker: 0,
    step2Error: false, // 第二步验证出错
    // // 转账记录显示
    // transferShow: false,
    // showSuccess:false,

    transferId:'',
    name:'',
    fromEmail:'',
    fromUserId:'',
    amount:0,
    dateTime:'',
    status:''
  }
}



root.created = function () {
  // this.submitSendMail()
  if (this.bindGA) {
    this.secondPicker = 1
    return;
  }
  if (this.bindMobile) {
    this.secondPicker = 2
    return;
  }
  // console.info(this.userName)
}



// 组件
// root.components = {
//   'Loading': resolve => require(['../vue/Loading'], resolve),
//   'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve)
// }

/*---------------------- 计算 ---------------------*/
root.computed = {}

root.computed.serverT = function () {
  return this.$store.state.serverTime /1000
}
// 认证状态：目前只有computed的变量用这个转一层，避免在当前页面刷新后初始化报错
root.computed.authState = function () {
  return this.$store.state.authState || {}
}
// 是否绑定手机
root.computed.bindMobile = function () {
  return this.authState.sms
}
// 是否绑定手机
root.computed.bindGA = function () {
  return this.authState.ga
}
// 验证类型
root.computed.secondShowPicker = function () {
  return (this.authState.sms && this.authState.ga)
}



/*---------------------- 监听 ---------------------*/

root.watch = {}
root.watch.serverTime = function () {

}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods = {}

// 点击提交，先检查所有信息
root.methods.checkStepThree = function () {
  if (this.secondPicker == 1) {
    if (this.googleCode == '' || this.googleCode.length != 6) {
      this.googleCodeWA = '请输入正确的谷歌验证码'
      return false
    }
    this.secondCode = this.googleCode
    this.googleCodeWA = ''
    return true
  }
  if (this.secondPicker == 2) {
    if (this.phoneCode == '' || this.phoneCode.length != 6) {
      this.phoneCodeWA = '请输入正确的手机验证码'
      return false
    }
    this.secondCode = this.phoneCode
    this.phoneCodeWA = ''
    return true
  }
}

// 获取币种
root.methods.getCurrency = function () {
  this.$http.send("GET_CURRENCY", {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency
  })
}
root.methods.isERC20 = function () {
  // let currencyObj = this.$store.state.currency.get(this.title)
  // return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
  return (this.title == "USDT" && this.selectTab == 2) ? "USDT2" : this.title;
}

// 获取币种回调
root.methods.re_getCurrency = function (data) {
  console.log(data)
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap || !data.dataMap.currencys) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)

  let object = this.$store.state.currency.get(this.title)

  console.log('object', object)
  if(object.memo === 'yes') {
    this.isMemo = true
    this.memoToastShow = true
  }

  // 获取账户信息
  this.getAccounts()
}
// 获取币种出错
root.methods.error_getCurrency = function (err) {
}

/*---------------------- 进入页面获取币种详情 ---------------------*/

root.methods.getAccounts = function () {
  this.$http.send("ACCOUNTS", {
    bind: this,
    callBack: this.re_getAccounts,
    errorHandler: this.error_getAccounts
  })
}

// 获取币种回调
root.methods.re_getAccounts = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.accounts) {
    return
  }
  // console.log("这是accounts", data.accounts)
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)

  this.accounts = this.$store.state.currency

  let isERC20 = this.isERC20();
  let currency = this.title == "USDT" ? isERC20 : this.title
  this.mobileRechargeRecordData = this.$store.state.currency.get(currency)

  this.accountLoadingFlag = true;

  if (this.accountLoadingFlag && this.socketLoadingFlag && this.initDataLoadingFlag) {
    this.loading = false;
  }
}

// 获取币种出错
root.methods.error_getAccounts = function (err) {
  console.log('获取账户信息出错！', err)
}


/*---------------------- 进入页面，请求账户信息 start ---------------------*/

// 判断认证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  this.$store.state.authState.sms && (this.secondPicker = 2)
  this.$store.state.authState.ga && (this.secondPicker = 1)
  // 获取认证状态成功
  this.authStateReady = true
  // this.loading = !(this.feeReady && this.addressReady && this.authStateReady)
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功


  this.$store.state.authState.sms && (this.secondPicker = 2)
  this.$store.state.authState.ga && (this.secondPicker = 1)


  this.authStateReady = true
  // this.loading = !(this.feeReady && this.addressReady && this.authStateReady)
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
  this.close()
}


/*---------------------- 获取邮箱验证码 ---------------------*/

// 获取转账邮箱验证码
root.methods.getMailVerificationCode = function () {
  console.log(this.serverT)
  if (this.getTransferMailCode) {
    return
  }
  // 暂时不需要
  // let isERC20 = this.isERC20();
  // let currency = this.title == "USDT" ? isERC20 : this.title
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: {
      type: 'email',
      purpose: 'transfer',
      // withdrawTime: parseInt(this.serverT),
      currency: this.currentCurrency, // TODO: 父组件传过来的值
      amount: parseFloat(this.amountInput),

      // transferTime: this.formatDateUitl(this.serverT),
      num:'',
      toEmail: this.emailInput,
      toUserId: this.UIDInput
    },
    callBack: this.re_getEmailVerification,
    errorHandler: this.error_getEmailVerification,
  })

  this.getEmailVerificationCodeCountdown = 60
  this.getMailCode = true
  this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
  this.getEmailVerificationCodeInterval = setInterval(() => {
    this.getEmailVerificationCodeCountdown--
    if (this.getEmailVerificationCodeCountdown < 0) {
      this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
      this.getEmailVerificationCodeCountdown = 60
      // this.getTransferMailCode = false
      this.getMailCode = false
    }
  }, 1000)
}
// 获取转账邮箱验证码
root.methods.re_getEmailVerification = function (data) {

  typeof data === 'string' && (data = JSON.parse(data))
  console.log('data', data)
  if (data.errorCode) {
    if (data.errorCode == 1) {
      this.mailCodeWA = '用户未登录'
    }
    if (data.errorCode == 2) {
      this.mailCodeWA = '获取验证码过于频繁'
    }
    if (data.errorCode == 3) {
      this.mailCodeWA = '发送邮件异常'
    }
    if (data.errorCode == 5) {
      this.mailCodeWA = '用户因修改密码未满24小时不能转账'
    }
    if (data.errorCode == 6) {
      this.mailCodeWA = '收款账户不存在'
    }
    if (data.errorCode==0) {
      this.sendMailMsg = '已向您的邮箱发送验证码'
    }


    this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
    this.getEmailVerificationCodeCountdown = 60
    this.getMailCode = false

  }


}
// 获取转账邮箱验证码出错
root.methods.error_getEmailVerification = function (err) {
  console.warn('获取邮箱验证码出错', err)
}
// 再点击邮箱，把错误提示关闭
root.methods.closeMailWrong = function () {
  this.mailCodeWA = ''
}



/*---------------------- 如果有两个验证，选择验证 ---------------------*/
root.methods.changeSecondPicker = function (num) {
  this.secondPicker = num
}


/*---------------------- 提交邮箱验证码 ---------------------*/
// 邮箱验证码页点击提交
root.methods.submitStepTwo = function () {

  // this.mobileToastOneFlag = false
  // this.mobileToastTwoFlag = true
  // this.$store.commit('changeMobileHeaderTitle', '提现确认');

  console.log(this.amountInput)
  if (this.mailCode === '' || this.mailCode.length != 6) {
    this.mailCodeWA = '请输入正确的邮箱验证码'
    return
  }
  this.submitSendMail()
  //
}


// 提交验证码
root.methods.submitSendMail = function () {
  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: 'email',
      purpose: 'transfer',
      code: this.mailCode,
      currency:this.currentCurrency,
      toEmail:this.emailInput,
      toUserId:this.UIDInput,
      amount:parseInt(this.amountInput),
      fee:0
    },
    callBack: this.re_commitEmailVerification,
    errorHandler: this.error_commitEmailVerification
  })
}
root.methods.re_commitEmailVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('点击提交了', data)

  // let resDataMap = data.dataMap;

  if (data.errorCode) {
    data.errorCode == 1 && (this.mailCodeWA = '用户未登录')
    data.errorCode == 2 && (this.mailCodeWA = '验证码已过期')
    data.errorCode == 3 && (this.mailCodeWA = '验证码错误')
    data.errorCode == 4 && (this.mailCodeWA = '系统异常')
    data.errorCode == 7 && (this.mailCodeWA = '收款人未实名认证')

    // if (data.errorCode === 2 && resDataMap.times) {
    //   this.SHOW_TIPS_FREQUENCY((resDataMap.times - resDataMap.wrong), resDataMap.times, (resDataMap.lock / 60));
    //   setTimeout(() => {
    //     this.popType = 0;
    //     this.popOpen = true;
    //   }, 200);
    //   return
    // }
    //
    // if (data.errorCode === 100 && resDataMap.lock) {
    //   this.SHOW_TIPS(resDataMap.lock / 60);
    //   setTimeout(() => {
    //     this.popType = 0;
    //     this.popOpen = true;
    //   }, 200);
    //   return
    // }
    return
  }

  // if(data.errorCode == 0 ){
  // this.mailCodeWA = ''
  this.mobileToastOneFlag = false
  this.mobileToastTwoFlag = true
  this.$store.commit('changeMobileHeaderTitle', '提现确认');
  // }
  this.mailCodeWA = ''
  // this.mobileToastOneFlag = false
  // this.mobileToastTwoFlag = true
  // this.$store.commit('changeMobileHeaderTitle', '提现确认');
}
root.methods.error_commitEmailVerification = function (err) {
  this.popText = '系统繁忙'
  this.popType = 0
  this.popOpen = true
}


/*---------------------- 点击提交所有信息 start ---------------------*/
root.methods.submitStepThree = function () {

  if (!this.checkStepThree()) return
  if (this.submitStepThreeFlag) return
  this.submitStepThreeFlag = true
  // let address = this.defaultAddress
  // let currencyObj = this.$store.state.currency.get(this.mobileRechargeRecordData.currency)
  // if (currencyObj && currencyObj.addressAliasTo === 'ETH') {
  //   address = this.toChecksumAddress(address)
  // }
  // let description = '';
  // if(this.isMemo === true){
  //   description = this.defaultName + this.remarkMemoConnect + this.defaultMemo
  // }
  // if(this.isMemo === false){
  //   description = this.defaultName
  //   if(this.isWCG){
  //     description = this.defaultName + this.remarkMemoConnect + this.newPublicKey
  //   }
  // }
  // let isERC20 = this.isERC20();
  // let currency = this.title == "USDT" ? isERC20 : this.title
  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      examinee:'',
      // areaCode:'0086',
      type: this.secondPicker == 1 ? 'ga' : 'mobile',
      purpose: 'transfer',
      code: this.secondPicker == 1 ? this.googleCode : this.phoneCode,
      currency: this.currentCurrency,//TODO：这里的币种要切换
      toEmail:this.emailInput,
      toUserId:this.UIDInput,
      amount: parseFloat(this.amountInput),
      fee:0,

    },
    callBack: this.re_commitStep2Verification,
    errorHandler: this.error_commitStep2Verification
  })
}
// 提交谷歌或手机验证码成功
root.methods.re_commitStep2Verification = function (data) {

  typeof data === 'string' && (data = JSON.parse(data))
  console.log('dataguge=====',data)
  this.submitStepThreeFlag = true

  this.googleCodeWA = ''
  this.phoneCodeWA = ''

  this.popOpen = true

  if (data.errorCode == 0) {
    this.popType = 1
    this.popText = this.$t('申请成功')
    // let params = data.dataMap.userTransferRecord
    // console.log(params)
    // setTimeout(() => {
    //   this.$router.push({name:'MobileTransferSuccess',params:{data:params}})
    //   this.$router.push({name:'MobileTransferSuccess'})
    // }, 1000)
    setTimeout(() => {
      this.$router.push({name: 'MobileTransferSuccess'})
    }, 1000)
  }

  // let resDataMap = data.dataMap;

  if (data.errorCode) {
    // 1
    if (this.secondPicker == 1) {
      data.errorCode == 1 && (this.googleCodeWA = '用户未登录')
      data.errorCode == 2 && (this.googleCodeWA = '未进行邮箱验证')
      data.errorCode == 3 && (this.googleCodeWA = '未绑定手机')
      data.errorCode == 4 && (this.googleCodeWA = '验证码失效')
      data.errorCode == 5 && (this.googleCodeWA = '验证码错误')
      data.errorCode == 6 && (this.googleCodeWA = '验证码过期')
      data.errorCode == 7 && (this.googleCodeWA = '输入转账数量无效')
      data.errorCode == 8 && (this.googleCodeWA = '用户余额不足')
      data.errorCode == 9 && (this.googleCodeWA = '转账数量小于单笔成交最小数量')
      data.errorCode == 10 && (this.googleCodeWA = '24小时转账金额必须要在范围内')
      data.errorCode == 11 && (this.googleCodeWA = '超出当日限额')
      data.errorCode == 12 && (this.googleCodeWA = '手续费TT不足0.1')
      data.errorCode == 13 && (this.googleCodeWA = '用户未输入验证码')
      data.errorCode == 15 && (this.googleCodeWA = '用户没有转账币种的可用余额')
    }
    if (this.secondPicker == 2) {
      data.errorCode == 1 && (this.phoneCodeWA = '用户未登录')
      data.errorCode == 2 && (this.phoneCodeWA = '未进行邮箱验证')
      data.errorCode == 3 && (this.phoneCodeWA = '未绑定手机')
      data.errorCode == 4 && (this.phoneCodeWA = '验证码失效')
      data.errorCode == 5 && (this.phoneCodeWA = '验证码错误')
      data.errorCode == 6 && (this.phoneCodeWA = '验证码过期')
      data.errorCode == 7 && (this.phoneCodeWA = '输入转账数量无效')
      data.errorCode == 8 && (this.phoneCodeWA = '用户余额不足')
      data.errorCode == 9 && (this.phoneCodeWA = '转账数量小于单笔成交最小数量')
      data.errorCode == 10 && (this.phoneCodeWA = '24小时转账金额必须要在范围内')
      data.errorCode == 11 && (this.phoneCodeWA = '超出当日限额')
      data.errorCode == 12 && (this.phoneCodeWA = '手续费TT不足0.1')
      data.errorCode == 13 && (this.phoneCodeWA = '用户未输入验证码')
      data.errorCode == 15 && (this.phoneCodeWA = '用户没有转账币种的可用余额')
    }
    //   if (this.secondPicker == 2 && data.errorCode === 4 && resDataMap.times) {
    //     this.SHOW_TIPS_FREQUENCY((resDataMap.times - resDataMap.wrong), resDataMap.times, (resDataMap.lock / 60));
    //     setTimeout(() => {
    //       this.popType = 0;
    //       this.popOpen = true;
    //     }, 200);
    //     return
    //   }
    //
    //   if (data.errorCode == '100' && resDataMap.lock) {
    //     this.SHOW_TIPS(resDataMap.lock / 60);
    //     setTimeout(() => {
    //       this.popType = 0;
    //       this.popOpen = true;
    //     }, 200);
    //     return
    //   }
    //   return
  }




  // console.log('this.data is ==================' ,data)
  // this.transferId = data.dataMap.userTransferRecord.transferId
  // this.name = data.dataMap.userTransferRecord.name
  // this.fromEmail = data.dataMap.userTransferRecord.fromEmail
  // this.fromUserId = data.dataMap.userTransferRecord.fromUserId
  // this.amount = data.dataMap.userTransferRecord.amount
  // this.dateTime = data.dataMap.userTransferRecord.dateTime
  // this.status = data.dataMap.userTransferRecord.status

}
//提交谷歌或手机验证码失败
root.methods.error_commitStep2Verification = function (err) {
  // console.warn('提交谷歌或手机验证码失败', err)
  // this.popWindowLoading = false
  // this.step2VerificationSending = false
  this.submitStepThreeFlag = true
  //
  // this.popText = '系统繁忙'
  // this.popType = 0
  // this.popOpen = true
}


/*---------------------- 获取手机验证码 ---------------------*/
// 获取手机验证码
root.methods.getMobileVerification = function () {
  // if (this.getMobileVerificationCode) {
  //   return
  // }
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: {
      examinee:'',
      // areaCode:'0086',
      type: 'mobile',
      num:'',
      purpose: 'transfer',
      code: this.secondPicker == 1 ? this.googleCode : this.phoneCode,
      currency: this.currentCurrency,//TODO：这里的币种要切换
      toEmail:this.emailInput,
      toUserId:this.UIDInput,
      amount: parseFloat(this.amountInput),
      // fee:0,
    },
    callBack: this.re_getMobileVerification,
    errorHandler: this.error_getMobileVerification,
  })
  this.getMobileVerificationCode = true
  this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
  this.getMobileVerificationCodeInterval = setInterval(() => {
    this.getMobileVerificationCodeCountdown--
    if (this.getMobileVerificationCodeCountdown < 0) {
      this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
      this.getMobileVerificationCodeCountdown = 60
      this.getMobileVerificationCode = false
    }
  }, 1000)
}
// 获取手机验证码
root.methods.re_getMobileVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  // console.warn('获取手机验证码！')
  this.phoneCodeWA = ''
  if (data.errorCode) {
    data.errorCode === 1 && (this.phoneCodeWA = '用户未登录')
    data.errorCode === 2 && (this.phoneCodeWA = '未绑定手机')
    data.errorCode === 3 && (this.phoneCodeWA = '已发送')
    data.errorCode === 4 && (this.phoneCodeWA = '系统异常')

    this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
    this.getMobileVerificationCode = false
    this.getMobileVerificationCodeCountdown = 60
  }
}


// 进行验证第二步，手机、谷歌
root.methods.beginVerificationStep2 = function () {
  if (this.secondPicker == 0) {
    this.popText = this.$t('尚未进行认证')
    this.popType = 0
    this.popOpen = true
    this.sending = false
    return
  }
  // this.secondShowPicker = true
  // this.step2Error = false
  if (!this.secondShowPicker && this.secondPicker == 2) {
    this.getMobileVerification()
  }

  // if (this.picker == 0) {
  //   this.popText = this.$t('popText_3')
  //   this.popType = 0
  //   this.popOpen = true
  //   this.sending = false
  //   return
  // }
  // this.popWindowStep = 2
  // this.step2Error = false
  // if (!this.showPicker && this.picker == 2) {
  //   this.getMobileVerification()
  // }
}

// 获取手机验证码出错
root.methods.error_getMobileVerification = function (err) {
  // console.warn('获取手机验证码出错！')
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

/*---------------------- 点击弹窗效果 ---------------------*/
// 点击弹窗 关闭按钮
root.methods.closeWindowToast = function () {
  this.windowToastFlag = false
}

// 点击弹窗 关闭按钮
root.methods.openWindowToast = function () {
  this.windowToastFlag = true
}



// 返回上一级页面
root.methods.gotoTransfer = function (){
  this.$router.go('-1')
}

// 显示邮箱验证码页面
root.methods.gotoTransferSuccess = function () {
  console.log(this.emailInput)
  this.mobileToastOneFlag = true
  // this.$router.push({name:'MobileAssetWithdrawDetail',query:{currency:'USDT'}})
}

// 跳转转账成功页面
// root.methods.gotoTransferSuccess = function () {
//   this.$router.push('MobileTransferSuccess')
// }


/*---------------------- 除法运算 end ---------------------*/
// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

/*---------------------- 修改弹窗验证码输错显示信息 begin ---------------------*/


// 提示toast次数错误
root.methods.SHOW_TIPS_FREQUENCY = function (frequency, total_frequency, hours) {
  this.popText = this.$t('falseHints.vfc_1') + frequency + this.$t('falseHints.vfc_2') + total_frequency + this.$t('falseHints.vfc_3') + hours + this.$t('falseHints.hour');
}

// 提示toast错误太多了
root.methods.SHOW_TIPS = function (hours) {
  this.popText = this.$t('falseHints.vfc_error1') + hours + this.$t('falseHints.vfc_error2');
}

/*---------------------- 修改弹窗验证码输错显示信息 end ---------------------*/

export default root
