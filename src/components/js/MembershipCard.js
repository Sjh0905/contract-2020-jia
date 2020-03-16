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
    // expires:'',
    // flag:false,
    postWithdCard:false,
    popWindowOpen: false, //弹窗开关
    popWindowOpenShiM: false, //弹窗开关
    cardType: 1,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',

    verificationCode: '',
    verificationCodePlaceholderShow: true,
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
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getBuyRecords()
  // this.getCheck()
  // this.getBuyRecords()
  // this.$store.commit('IS_VIP', this.flag);

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}

/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 会员到期日
root.computed.expires = function () {
  return this.$store.state.isVIP.expires
}
// 是否是会员
root.computed.flag = function () {
  return this.$store.state.isVIP.flag
}
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
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}


root.computed.computedRecord = function (item,index) {
  return this.records
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 弹出绑定身份，跳转到实名认证界面
root.methods.goToBindIdentity = function () {
  this.popWindowOpenShiM = false
  this.$router.push({name: 'authenticate'})
}
// 去绑定谷歌验证
root.methods.goToBindGA = function () {
  this.popWindowOpenShiM = false
  this.$router.push({name: 'bindGoogleAuthenticator'})
}
// 去绑定手机号
root.methods.goToBindMobile = function () {
  this.popWindowOpenShiM = false
  this.$router.push({name: 'bindMobile'})
}
// 去绑定邮箱
root.methods.goToBindEmail = function () {
  this.popWindowOpenShiM = false
  this.$router.push({name: 'bindEmail'})
}



// //是否是会员get (query:{})
// root.methods.getCheck= function () {
//
//   this.$http.send('GET_CHECK', {
//     bind: this,
//     urlFragment: this.userId,
//     callBack: this.re_getCheck,
//     errorHandler: this.error_getCheck
//   })
// }
//
// root.methods.re_getCheck = function (data) {
//   console.log('是否是会员get-----',123)
//   //检测data数据是JSON字符串转换JS字符串
//   typeof data === 'string' && (data = JSON.parse(data))
//   console.log('是否是会员get-----',123)
//   this.expires = data.data.expires
//   this.flag = data.data.flag
//   // this.$store.commit('IS_VIP', this.flag);
//   console.log('是否是会员get-----',data.data)
//
// }
// root.methods.error_getCheck = function (err) {
//   console.log("this.err=====",err)
// }


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
  // // 如果没有实名认证不允许购买会员卡
  // if (!this.bindIdentify) {
  //   this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
  //   this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
  //   this.popWindowStyle = '0'
  //   this.popWindowOpenShiM = true
  //   return
  // }
  //
  // // 如果没有绑定邮箱，不允许购买会员卡
  // if (!this.bindEmail) {
  //   this.popWindowTitle = this.$t('bind_email_pop_title')
  //   this.popWindowPrompt = this.$t('bind_email_pop_article')
  //   this.popWindowStyle = '3'
  //   this.popWindowOpenShiM = true
  //   return
  // }
  //
  // // 如果没有绑定谷歌或手机，不允许购买会员卡
  // if (!this.bindGA && !this.bindMobile) {
  //   this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
  //   this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
  //   this.popWindowStyle = '1'
  //   this.popWindowOpenShiM = true
  //   return
  // }
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
    // this.getCheck()
    this.$eventBus.notify({key: 'CHECK_IS_VIP'})
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


// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}

// 弹窗关闭
root.methods.popWindowCloseShiM = function () {
  this.popWindowOpenShiM = false
}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}
export default root
