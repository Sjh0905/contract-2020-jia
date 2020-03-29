const root = {}
root.name = 'membershipCard'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),

}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {

    records: [],
    expires:'',
    flag:false,
    postWithdCard:false,
    popWindowOpen: false, //弹窗开关
    popWindowOpenShiM: false, //弹窗开关
    cardType: 1,
    transferFee:1,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    // verificationCode: '',
    // verificationCodePlaceholderShow: true,
    clickVerificationCodeButton: false,
    getVerificationCode: false,
    getVerificationCodeCountdown: 60,
    verificationCodeWA: '',
    getVerificationCodeInterval: null,
    success:false,

    // popWindowOpen: false, //弹窗开关
    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定

    buyCommitToastOpen: false,
    nameVIP:'',
    userNamePlaceholderShow:true,
    // toNameVIP:'',
    nameWA_0:'',
    UID_0:'',
    pswPlaceholderShow:true,
    testUID_012:'',
    nameMsg_0:'',
    popWindowOpen1: false, //弹窗开关
    popbindIdentify:false,

    picked:1,

    popWindowOpenVIP: false,    //是否打开弹窗VIP
    popWindowStep: 2, //1表示邮箱验证，2表示下一步验证
    popWindowLoading: false,//popWindow正在提交

    emailVerificationCode: '',//验证码
    emailVerificationCodeWA: '', //验证码错误提示
    emailVerificationSending: false,//邮箱验证发送中

    getEmailVerificationCodeInterval: null, //获取邮箱验证码倒计时container
    getEmailVerificationCodeCountdown: 60,  //获取邮箱验证码倒计时
    getEmailVerificationCode: false, //是否点击了获取邮箱验证码倒计时

    step2VerificationCode: '', //第二步
    step2VerificationCodeWA: '', //第二步验证
    step2VerificationSending: false,//第二步验证发送中
    step2Error: false, // 第二步验证出错

    picker: 0, //验证类型

    getMobileVerificationCodeInterval: null, //获取手机验证码倒计时container
    getMobileVerificationCodeCountdown: 60, //获取手机验证码倒计时
    getMobileVerificationCode: false, //获取手机验证码倒计时

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getBuyRecords()
  this.getCheck()
  this.getBuyRecords()
  // 获取验证状态
  this.getAuthState()
  // this.$store.commit('IS_VIP', this.flag);

  if (this.bindGA) {
    this.picked = 1
    return;
  }
  if (this.bindMobile) {
    this.picked = 2
    return;
  }

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}

/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// // 会员到期日
// root.computed.expires = function () {
//   return this.$store.state.isVIP.expires
// }
// // 是否是会员
// root.computed.flag = function () {
//   return this.$store.state.isVIP.flag
// }

// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return (this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return(this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// // 是否绑定邮箱
// root.computed.bindEmail = function () {
//   return this.$store.state.authState.email
// }
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}

// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}

// 验证类型
root.computed.showPicker = function () {
  return (this.$store.state.authState.sms && this.$store.state.authState.ga)
}


root.computed.computedRecord = function (item,index) {
  return this.records
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}


/*------------------ 获取验证状态 begin -------------------*/
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  // // 如果没有认证
  // if (!this.$store.state.authState.identity || (!this.$store.state.authState.sms && !this.$store.state.authState.ga) || !this.bindEmail) {
  //   this.close()
  //   return
  // }
  this.$store.state.authState.sms && (this.picker = 2)
  this.$store.state.authState.ga && (this.picker = 1)
  // 获取认证状态成功
  // this.authStateReady = true
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功
  // 如果没有认证
  // if (!this.$store.state.authState.identity || (!this.$store.state.authState.sms && !this.$store.state.authState.ga)) {
  //   this.close()
  //   return
  // }
  this.$store.state.authState.sms && (this.picker = 2)
  this.$store.state.authState.ga && (this.picker = 1)
  // this.authStateReady = true
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // this.close()
}


root.methods.closeVerification = function () {
  this.verificationOpen = false;
  this.sending = false;//验证弹窗关闭后需要恢复显示"登录"状态
}
// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);
  if(type == 'nameVIP'){
    this.userNamePlaceholderShow = false;
  }

  if(type == 'UID_0'){
    this.pswPlaceholderShow = false;
  }

  // if(type == 'verificationCode'){
  //   this.verificationCodePlaceholderShow = false;
  // }
  //
  // if(type == 'pswConfirm'){
  //   this.pswConfirmPlaceholderShow = false;
  // }
  //
  // if(type == 'referee'){
  //   this.refereePlaceholderShow = false;
  // }


}

//跳转会员卡规则
root.methods.VIPrules = function () {
  this.$router.push( {path:'/index/notice/noticeDetail', query:{columnId:1,id:100629}})
  console.log('this.$router.push',this.$router.push( {path:'/index/notice/noticeDetail', query:{columnId:1,id:100629}}))
}

// 弹出绑定身份，跳转到实名认证界面
root.methods.goToBindIdentity = function () {
  this.popbindIdentify = false
  this.$router.push({name: 'authenticate'})
}

// 弹框跳安全中心
root.methods.goToSecurityCenter = function () {
  this.popbindIdentify = false
  this.$router.push({name: 'securityCenter'})
}





//是否是会员get (query:{})
root.methods.getCheck= function () {

  this.$http.send('GET_CHECK', {
    bind: this,
    urlFragment: this.userId,
    callBack: this.re_getCheck,
    errorHandler: this.error_getCheck
  })
}

root.methods.re_getCheck = function (data) {
  console.log('是否是会员get-----',123)
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('是否是会员get-----',123)
  this.expires = data.data.expires
  this.flag = data.data.flag
  // this.cardType = data.data.cardType
  this.transferFee = data.data.transferFee
  // this.$store.commit('IS_VIP', this.flag);
  console.log('是否是会员get-----',data.data)

}
root.methods.error_getCheck = function (err) {
  console.log("this.err=====",err)
}


//会员购买记录get (query:{})
root.methods.getBuyRecords= function () {

  this.$http.send('GET_BUY_RECORDS', {
    bind: this,
    urlFragment: this.userId,
    // query:{
    //   gname: this.gname
    // },
    callBack: this.re_getBuyRecords,
    errorHandler: this.error_getBuyRecords
  })
}

root.methods.re_getBuyRecords = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) {return}

  this.records  = data.data
  console.log('会员购买记录get', this.records)
}

root.methods.error_getBuyRecords = function (err) {
  console.log("this.err=====",err)
}


// // 会员卡报名是否金额足够
// root.methods.getCheckEnoughBalance= function () {
//
//   this.$http.send('GET_CHECK_ENOUGH_BALANCE', {
//     bind: this,
//     urlFragment: `${userId}/${this.cardType}`,
//     // query:{
//     //   gname: this.gname
//     // },
//     callBack: this.re_getCheckEnoughBalance,
//     errorHandler: this.error_getCheckEnoughBalance
//   })
// }
//
// root.methods.re_getCheckEnoughBalance = function (data) {
//   //检测data数据是JSON字符串转换JS字符串
//   typeof data === 'string' && (data = JSON.parse(data))
//   if (data.errorCode) {
//     if (
//       data.errorCode == 1 && (this.popText = this.$t('会员卡类型有误')) ||//会员卡类型有误
//       data.errorCode == 2 && (this.popText = this.$t('可用币种USDT余额不足')) || // 可用币种USDT余额不足
//       data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
//     ) {
//       this.popOpen = true
//       this.popType = 0
//       setTimeout(() => {
//         this.popOpen = true
//       }, 100)
//     }
//   }
// }
//
// root.methods.error_getCheckEnoughBalance = function (err) {
//   console.log("this.err=====",err)
// }



root.methods.postWithd1 = function (cardType) {
  this.cardType = cardType

  console.log("cardType  ===== ",this.cardType)

  // this.postBuyCard(cardType)
}

root.methods.postBuyCard1 = function () {
  // 如果没有实名认证不允许购买会员卡
  if (!this.bindIdentify) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popbindIdentify = true
    return
  }

  // 如果没有绑定邮箱，不允许购买会员卡
  // if (!this.bindEmail) {
  //   this.popWindowTitle = this.$t('bind_email_pop_title')
  //   this.popWindowPrompt = this.$t('bind_email_pop_article')
  //   this.popWindowStyle = '3'
  //   this.popbindIdentify = true
  //   return
  // }

  // 如果没有绑定谷歌或手机，不允许购买会员卡
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popbindIdentify = true
    return
  }
  this.popWindowOpen = true
}
//会员卡购买post(params:{})
root.methods.postBuyCard = function () {

  // this.postWithd1(cardType)


  let params = {
    userId: this.userId,  //userId
    account: this.userName, //账号
    cardType: this.cardType  //1:月卡，2:年卡
  }
  console.log("会员卡购买post  ===== ",params)

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

  this.$http.send('POST_BUY_CARD', {
    bind: this,
    params:params,
    callBack: this.re_postBuyCard,
    errorHandler: this.error_postBuyCard
  })
}
root.methods.re_postBuyCard = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  this.success = data.data.flag
  console.log("会员卡购买post=====", data)

  if (data.errorCode == "0" && this.success == true) {
    // this.getBuyRecords()
    this.popWindowOpen = false
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('registration')
    setTimeout(() => {
      this.popOpen = true
    }, 100)

    this.$eventBus.notify({key: 'CHECK_IS_VIP'})
    this.getCheck()
    this.getBuyRecords()
    return;
  }


  // if (this.success == true) {
  //
  //   this.popOpen = true
  //   this.popType = 1
  //   this.popText = '会员卡购买成功' //'会员卡购买成功'
  //   setTimeout(() => {
  //     this.popOpen = true
  //   }, 1000)
  //   // setTimeout(() => {
  //   //   this.$router.push({name: 'detailsOfTheGroup', params: {groupId: this.groupId}})
  //   // }, 1000)
  // }

  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('format')) || //会员账户格式错误
      data.errorCode == 2 && (this.popText = this.$t('does')) || // 会员账号不存在
      data.errorCode == 3 && (this.popText = this.$t('userIdOf')) || // 会员账号userId有误
      data.errorCode == 4 && (this.popText = this.$t('membershipC')) || // 会员卡类型有误
      data.errorCode == 5 && (this.popText = this.$t('purchased')) || // 用户购买会员卡余额不足
      data.errorCode == 6 && (this.popText = this.$t('failed)')) || // 购买失败 (未找到对应币种归集账户)
      data.errorCode == 7 && (this.popText = this.$t('popWindowPromptWithdrawals)')) || // 用户未完成实名
      data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
    this.getVerificationCodeInterval && clearInterval(this.getVerificationCodeInterval)
    this.getVerificationCode = false
    this.getVerificationCodeCountdown = 60
  }
}
root.methods.error_postBuyCard = function (err) {
  console.log("this.err=====",err)
}
//内部转账 验证码弹框
root.methods.goToConfirmsjhclose = function () {
  this.goToConfirmsjh = false

}

//会员卡转让 第一步确认转让按钮getGoToConfirmTransfer
root.methods.getGoToTransferVIP1 = function () {

  // sss 屏蔽 S
  let canSend = true
  canSend = this.toNameVIP() && canSend
  canSend = this.toUIDVIP() && canSend
  if (!this.$globalFunc.emailOrMobile(this.nameVIP)) {
    this.nameMsg_0 = this.$t('enter')
    canSend = false
  }
  if (this.nameVIP === '') {
    this.nameMsg_0 = this.$t('sitnotable')
    canSend = false
  }
  if (this.UID_0 === '') {
    this.testUIDMsg_0 = this.$t('empty')
    canSend = false
  }
  if (!canSend) {
    return false
  }

  this.buyCommitToastOpen = false
  this.popWindowOpenVIP = true

}

root.methods.postGoToTransferVIP = function () {
  // this.popWindowOpenVIP = true

  this.$http.send('POST_TRANSFERVIP',{
    bind: this,
    params:{
      fromUserId: this.userId,  //转让方userId (本人
      fromAccount: this.userName, //转让方账户, 手机或邮箱
      toUserId:this.UID_0, //接收方userId （他人
      toAccount:this.nameVIP,  //接收方账户，手机或邮箱
    },
    callBack: this.re_postGoToTransferVIP,
    errorHandler: this.error_postGoToTransferVIP,
  })

}
root.methods.re_postGoToTransferVIP = function(data){
  typeof data === 'string' && (data = JSON.parse(data))
  console.log("会员卡转让",data.data,data.errorCode)
  this.success = data.data.success

  if (data.errorCode == 0) {
    this.getCheck()
    this.popOpen = true
    this.popType = 1
    this.popText = this.$t('successful') //'转让会员成功'
    setTimeout(() => {
      this.popOpen = true
    }, 1000)
    setTimeout(() => {
      this.$router.push({name: 'membershipCard'})
    }, 1000)
    return;
  }

  if (data.errorCode) {
    if (data.errorCode == 1) {
      this.popOpen = true
      this.buyTransferDetails = false
      this.popText = this.$t('isWrong') // 会员卡类型有误
      this.popType = 0
      return
    }
    if (data.errorCode == 2) {
      this.popOpen = true
      // this.buyTransferDetails = false
      this.popText = this.$t('Insufficient')  //用户转让会员卡费用不足
      this.popType = 0
      return
    }
    if (data.errorCode == 3) {
      this.popOpen = true
      this.buyTransferDetails = false
      this.popText =this.$t('availabl') // 没有可用的会员卡可转让
      this.popType = 0
      return
    }
    if (data.errorCode == 4) {
      this.popOpen = true
      this.buyTransferDetails = false
      this.popText = this.$t('Format')  //接收方账户格式错误'
      this.popType = 0
      return
    }
    if (data.errorCode == 5) {
      this.popOpen = true
      this.buyTransferDetails = false
      this.popText = this.$t('exist')  //接收方账户不存在'
      this.popType = 0
      return
    }
    if (data.errorCode == 6) {
      this.popOpen = true
      this.buyTransferDetails = false
      this.popText = this.$t('recipient')  // 接收方userId有误
      this.popType = 0
      return
    }
    if (data.errorCode == 400) {
      this.popOpen = true
      this.buyTransferDetails = false
      this.popText = this.$t('mistake')
      this.popType = 0
      return
    }
    return
  }

}

root.methods.error_postGoToTransferVIP = function(data){
  console.log('resDataMap=========rrrrr=========ggggggggg=',data)
}


// 判断受让人邮箱
root.methods.toNameVIP = function () {
  this.nameWA_0 = '0'
  if (this.nameVIP === '') {
    this.nameMsg_0 = this.$t('sitnotable')
    return false
  }
  if (!this.$globalFunc.emailOrMobile(this.nameVIP)) {
    this.nameMsg_0 = this.$t('meet')
    return false
  }
  this.nameMsg_0 = ''
  return true
}

// 判断受让人UID
root.methods.toUIDVIP = function () {
  this.testUID_012 = '0'
  if (this.UID_0 === '') {
    this.testUIDMsg_0 = this.$t('empty')
    return false
  }
  if (!this.$globalFunc.testNumber(this.UID_0)) {
    this.testUIDMsg_0 = this.$t('correct')
    return false
  }
  this.testUIDMsg_0 = ''
  return true
}

//会员卡转让
root.methods.VIPTransfer = function () {

  // 如果没有实名认证不允许购买会员卡
  if (!this.bindIdentify) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popbindIdentify = true
    return
  }

  // 如果没有绑定邮箱，不允许购买会员卡
  // if (!this.bindEmail) {
  //   this.popWindowTitle = this.$t('bind_email_pop_title')
  //   this.popWindowPrompt = this.$t('bind_email_pop_article')
  //   this.popWindowStyle = '3'
  //   this.popbindIdentify = true
  //   return
  // }

  // 如果没有绑定谷歌或手机，不允许购买会员卡
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popbindIdentify = true
    return
  }

  this.buyCommitToastOpen = true
}


// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}
// 弹窗关闭
root.methods.closeWindowClose = function () {
  this.popbindIdentify = false
}

// // 弹窗关闭
// root.methods.popWindowCloseShiM = function () {
//   this.popWindowOpenShiM = false
// }

root.methods.buyCommitToastClose = function () {
  this.buyCommitToastOpen = false
}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}
// 关闭弹框
root.methods.popWindowClose1 = function () {
  this.popWindowOpen1 = false;
}


//——————————————————————————————————————

// 关闭此组件
// root.methods.close = function () {
//   this.$emit('close')
// }

//关闭弹窗
root.methods.popWindowCloseVIP = function () {
  this.popWindowOpenVIP = false
  this.clearPopWindow()
  // this.sending = false
}
//清空popWindow
root.methods.clearPopWindow = function () {
  this.popWindowOpenVIP = false

  this.popWindowStep = 2 //1表示邮箱验证，2表示下一步验证
  this.popWindowLoading = false//popWindow正在提交

  //
  // this.emailVerificationCode = ''//验证码
  // this.emailVerificationCodeWA = '' //验证码错误提示
  // this.emailVerificationSending = false//邮箱验证发送中

  // this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
  // this.getEmailVerificationCodeCountdown = 60 //获取邮箱验证码倒计时
  // this.getEmailVerificationCode = true //是否点击了获取邮箱验证码倒计时

  this.step2VerificationCode = '' //第二步
  this.step2VerificationCodeWA = '' //第二步验证
  this.step2VerificationSending = false//第二步验证发送中

  // this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
  // this.getMobileVerificationCodeCountdown = 60 //获取手机验证码倒计时
  // this.getMobileVerificationCode = true //获取手机验证码倒计时

}


// 进行验证第二步，手机、谷歌
root.methods.beginVerificationStep2 = function () {
  if (this.picker == 0) {
    this.popText = this.$t('popText_3')
    this.popType = 0
    this.popOpen = true
    this.sending = false
    return
  }
  this.popWindowStep = 2
  this.step2Error = false
  if (!this.showPicker && this.picker == 2) {
    this.getMobileVerification()
  }
}


root.methods.testMobileVerification = function () {
  if (this.step2VerificationCode === '') {
    this.step2VerificationCodeWA = ''
    return false
  }
  // this.step2VerificationCodeWA = ''
  return true
}
// 表单验证，谷歌验证码
root.methods.testGACodeVerification = function () {
  if (this.step2VerificationCode === '') {
    this.step2VerificationCodeWA = ''
    return false
  }
  // this.step2VerificationCodeWA = ''
  return true
}


//提交谷歌或手机验证码
root.methods.commitStep2Verification = function () {
  let canSend = true
  // this.picker === 1 && (canSend = this.testGACodeVerification() && canSend)
  this.picker === 2 && (canSend = this.testMobileVerification() && canSend)
  if (this.step2VerificationCode === '') {
    this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_5')
    canSend = false
  }
  if (!canSend) {
    return false
  }

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: this.picked == 1 ? 'ga' : 'mobile',
      purpose: 'validate',
      tosType:"TRANSFER_MEMBER",
      code: this.step2VerificationCode,
      // currency: currency,  // TODO：这里要切换币种
      // description: description,
      // address: address,
      // amount: parseFloat(this.realAccount),
    },
    callBack: this.re_commitStep2Verification,
    errorHandler: this.error_commitStep2Verification
  })

  // this.popWindowLoading = true
  // this.step2VerificationSending = true
}
// 提交谷歌或手机验证码成功
root.methods.re_commitStep2Verification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // this.popWindowLoading = false
  // this.step2VerificationSending = false

  // let resDataMap = data.dataMap

  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_11') //用户未登录
        break;
      case 2:
        this.step2VerificationCodeWA = this.$t('often') //获取验证码过于频繁
        break;
      // case 3:
      //   this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_13') //用户认证数据异常，详情请联系客服
      //   break;
      case 4:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_14') //验证码错误或过期
        break;
      // case 5:
      //   this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_15')
      //   break;
      // case 6:
      //   this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_16')
      //   break;
      // case 7:
      //   this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_17')
      //   break;
      // case 8:
      //   this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_18')
      //   break;
      // case 9:
      //   this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_19')
      //   break;
      case 10:
        this.step2VerificationCodeWA = this.$t('business')
        break;
      case 100:
        break;
      default:
        this.step2VerificationCodeWA = '系统繁忙，请稍后再试'
    }


    // if (data.errorCode !== 4) {
    //   this.step2Error = true
    // }


    return
  }



  // this.popType = 1
  // this.popText = this.$t('popText_4')
  // this.popOpen = true
  if (data.errorCode == 0) {
    setTimeout(() => {
      this.popWindowOpenVIP=false
      // this.close()
      this.postGoToTransferVIP()
    }, 1000)
  }



}
//提交谷歌或手机验证码失败
root.methods.error_commitStep2Verification = function (err) {
  // console.warn('提交谷歌或手机验证码失败', err)

  this.popWindowLoading = false
  this.step2VerificationSending = false

  this.popText = this.$t('popText_1')
  this.popType = 0
  this.popOpen = true
}

// 获取手机验证码
root.methods.getMobileVerification = function () {
  if (this.getMobileVerificationCode) {
    return
  }
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: {
      type: 'mobile',
      purpose: 'validate',
      tosType:"TRANSFER_MEMBER",
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
  if (data.errorCode) {
    data.errorCode === 1 && (this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_1'))
    data.errorCode === 2 && (this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_2'))
    data.errorCode === 3 && (this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_3'))
    data.errorCode === 4 && (this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_4'))

    this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
    this.getMobileVerificationCode = false
    this.getMobileVerificationCodeCountdown = 60
  }
}
// 获取手机验证码出错
root.methods.error_getMobileVerification = function (err) {
  // console.warn('获取手机验证码出错！')
}


// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}

// 手机 谷歌验证切换
root.methods.open_mob = function (index) {
  this.picked = index
}

export default root
