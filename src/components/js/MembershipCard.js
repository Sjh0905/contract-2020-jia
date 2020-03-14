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
    success:false
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getBuyRecords()
  this.getCheck()
  // this.getBuyRecords()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}

/*------------------------------ 计算 -------------------------------*/
root.computed = {}
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


root.computed.computedRecord = function (item,index) {
  return this.records
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

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
  this.$store.commit('IS_VIP', this.flag);
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


// 会员卡报名是否金额足够
root.methods.getCheckEnoughBalance= function () {

  this.$http.send('GET_CHECK_ENOUGH_BALANCE', {
    bind: this,
    urlFragment: `${userId}/${this.cardType}`,
    // query:{
    //   gname: this.gname
    // },
    callBack: this.re_getCheckEnoughBalance,
    errorHandler: this.error_getCheckEnoughBalance
  })
}

root.methods.re_getCheckEnoughBalance = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  if (data.errorCode) {
    if (
      data.errorCode == 1 && (this.popText = this.$t('会员卡类型有误')) ||//会员卡类型有误
      data.errorCode == 2 && (this.popText = this.$t('可用币种USDT余额不足')) || // 可用币种USDT余额不足
      data.errorCode == 400 && (this.popText = this.$t('parameter_error')) //参数有误
    ) {
      this.popOpen = true
      this.popType = 0
      setTimeout(() => {
        this.popOpen = true
      }, 100)
    }
  }
}

root.methods.error_getCheckEnoughBalance = function (err) {
  console.log("this.err=====",err)
}

root.methods.postWithd1 = function (cardType) {
  this.cardType = cardType

  console.log("cardType  ===== ",this.cardType)

  // this.postBuyCard(cardType)
}

root.methods.postBuyCard1 = function () {
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
    this.popText = '报名成功'
    setTimeout(() => {
      this.popOpen = true
    }, 100)

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
      data.errorCode == 1 && (this.popText = this.$t('会员账户格式错误')) || //会员账户格式错误
      data.errorCode == 2 && (this.popText = this.$t('会员账号不存在')) || // 会员账号不存在
      data.errorCode == 3 && (this.popText = this.$t('会员账号userId有误')) || // 会员账号userId有误
      data.errorCode == 4 && (this.popText = this.$t('会员卡类型有误')) || // 会员卡类型有误
      data.errorCode == 5 && (this.popText = this.$t('用户购买会员卡余额不足')) || // 用户购买会员卡余额不足
      data.errorCode == 6 && (this.popText = this.$t('购买失败 (未找到对应币种归集账户)')) || // 购买失败 (未找到对应币种归集账户)
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

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}
export default root
