const root = {}

root.name = 'PersonalCenterAuthAuthenticationState'

/*----------------------- 组件 --------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'BasePopupWindow': resolve => require(['../vue/BasePopupWindow'], resolve),
  'PopAlert': resolve => require(['../vue/PopAlert'], resolve),
  'Toggle': resolve => require(['../vue/BaseToggle'], resolve),
}

/*----------------------- data --------------------------*/


root.data = function () {
  return {
    loading: true,

    // total: 0, //总资产
    // frozen: 0,  //可用
    // available: 0, //冻结
    currentPrice: {}, //最近的一次socket推送的数据
    priceReady: false,
    accountReady: false,
    accounts: [], //账户信息

    authState: '3',
    stateReady: false,
    stateStatusReady: false,

    BDBInfo: false,
    BDBReady: false,
    BDBChanging: false,


    popOpen: false,
    popType: 2,
    popText: 'demo',
    popWindowText: '身份认证',

    popIdenOpen: false,


    initData: {},
    initReady: false,

    popShow: false,

    // 移动端弹窗内容
    shareUrl: '',

    // 2018-4-26
    btc_rate: 0,
    change_price: 0,  // 当前价格
    show_key: '-1',  // 展示当前价格


    btRewardReady: false, //bt奖励比率加载中

    // bt轮询请求 所有属性---------------------------------- start
    // 设setInterval
    setIntervalTimer: '',

    // bt活动中今日待分红折合多少usdt
    btNum: 0,


    // bt轮询请求 所有属性---------------------------------- end


    facePopupWindow: false, //2018.10.16 face++ app端正在申请提示
    faceExiting: false, // 2018.10.16 face++ app端正在退出


  }
}


/*----------------------- 计算 --------------------------*/

root.computed = {}
// 当前语言
root.computed.lang = function () {
  return this.$store.state.lang;
}
// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

root.computed.staticUrl = function () {
  return this.$store.state.static_url
}
// userID
root.computed.uid = function () {
  // if(this.$store.state.authMessage.uuid == undefined){
    return this.$store.state.authMessage.userId
  // }
  // return this.$store.state.authMessage.uuid
}

// uuid
// root.computed.uuid = function () {
//   if(this.$store.state.authMessage.uuid == undefined){
//     return this.$store.state.authMessage.userId
//   }
//   return this.$store.state.authMessage.uuid
// }
// 证件号
root.computed.idCode = function () {
  // let idCode = this.$store.state.authMessage.idCode
  let idCode = this.$store.state.idCode || '********'
  idCode && idCode.length > 4 && (idCode = `${idCode.slice(0, 4)}****`)
  return idCode
}
// 姓名
root.computed.name = function () {
  let name = this.$store.state.name, newName
  if (name) {
    newName = name.slice(0, 1)
    for (let i = 0; i < name.length - 1; i++) {
      newName += '*'
    }
  }
  return newName
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 邮箱
root.computed.email = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}
// 电话
root.computed.phone = function () {
  return '1**********'
}
// 修改
root.computed.watchBOBInfo = function () {
  return this.BDBInfo
}
// 计价货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 移动端绑定谷歌
root.computed.bindGA = function () {
  if (!this.$store.state.authState.ga) {
    return false
  }
  return true
}
// 移动端绑定手机
root.computed.bindPhone = function () {
  if (!this.$store.state.authState.sms) {
    return false
  }
  return true
}
// 是否绑定了邮箱
root.computed.bindEmail = function () {
  if (!this.$store.state.authState.email) {
    return false
  }
  return true
}
// 账户信息
// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.isUserType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}


// 账户总资产
root.computed.total = function () {
  let total = 0
  for (let i = 0; i < this.accounts.length; i++) {
    total = this.accAdd(total, this.accounts[i].appraisement)
  }
  return this.toFixed(total)
}
// 账户可用
root.computed.available = function () {
  let available = 0
  for (let i = 0; i < this.accounts.length; i++) {
    available = this.accAdd(available, this.accMul(this.accounts[i].available, this.accounts[i].rate))
  }
  return this.toFixed(available)
}

// 账户冻结
root.computed.frozen = function () {
  let frozen = 0
  for (let i = 0; i < this.accounts.length; i++) {
    frozen = this.accAdd(frozen, this.accMul(this.accounts[i].frozen, this.accounts[i].rate))
  }
  return this.toFixed(frozen)
}

// bt奖励比率
root.computed.btReward = function () {
  return this.$store.state.btReward;
}
// bt活动
root.computed.btActivity = function () {
  return this.$store.state.btActivity;
}

root.watch = {}
// 观察
root.watch.currencyChange = function () {
  this.accounts = [...this.$store.state.currency.values()]
}
root.watch.watchBOBInfo = function (newVal, oldVal) {

}

/*----------------------- 生命周期 --------------------------*/

root.created = function () {
  // 获取id
  this.getIdCode()
  // 获取初始化data
  this.getInitData()
  // 通过socket监听价格
  this.getPrice()
  // 获取用户状态
  this.getAuthState()
  // 获取BDB是否抵扣
  // this.getBDBInfo()
  // 获取资金
  this.getCurrencyAndAccount()
  // 移动端
  this.getAuthStateStatus()
  // 获取btc汇率
  // this.GET_BTC_RATE();
  // 获取bt奖励比率
  // this.getBtReward()

  // let that = this
  // that.getFeeDivident();
  // this.setIntervalTimer = setInterval(() => {
  //   that.getFeeDivident();
  // }, 300000)

  // this.link_to_authenticate();

}

root.destroy = function () {
  let that = this
  clearInterval(that.setIntervalTimer);
}


/*----------------------- 方法 --------------------------*/

root.methods = {}

// 获取bt信息 轮询
root.methods.getFeeDivident = function (data) {
  this.$http.send('GET_BT_FEE_DIVIDENT', {
    bind: this,
    callBack: this.re_getFeeDivident,
    errorHandler: this.error_getFeeDivident
  })
}

root.methods.re_getFeeDivident = function (data) {
  typeof data === 'string' && (data = JSON.parse(data));
  console.log('获取平台信息1', data)
  this.btNum = data.dataMap.dividend
  // this.userProfitsData.items = data.dataMap;

}

root.methods.error_getFeeDivident = function (err) {
  console.log(err)
}

// 获取bt奖励比率
root.methods.getBtReward = function () {
  let that = this
  // this.$globalFunc.getBTRegulationConfig(this, (data) => {
  //   this.btRewardReady = true
  //   this.loading = !(this.stateReady && this.BDBReady && this.btRewardReady && (this.stateStatusReady || !this.isMobile))
  //
  // })
}


// 跳转bdb燃烧页面
root.methods.jumpToBDBBurnReward = function () {
  // MobileUseBDBBurnRewards

  this.$router.push({name: 'MobileUseBDBBurnRewards'});
  return false;
}

// 计算当前币对折合多少人民币  2018-4-26 start
root.methods.GET_BTC_RATE = function () {
  this.$http.send('GET_EXCHANGE__RAGE', {
    bind: this,
    callBack: this.re_getExchangeRate,
    errorHandler: this.error_getExchangeRate
  })
}
root.methods.re_getExchangeRate = function (data) {
  this.btc_rate = !!JSON.parse(data).dataMap ? JSON.parse(data).dataMap.exchangeRate.btcExchangeRate : 0;
}
root.methods.get_now_price = function (price, key) {
  let rate = this.btc_rate;
  if (this.lang === 'CH') {
    this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    this.change_price = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  // 展示价格
  if (price.indexOf('.') > -1) {
    this.show_key = key;
  }
}
root.methods.hide_now_price = function () {
  this.show_key = '-1';
}
// 2018-4-26  end

//获取用户id
root.methods.getIdCode = function () {
  if (!this.$store.state.idCode || !this.$store.state.name) {
    this.$http.send('GET_USER_PROFILE', {
      bind: this,
      callBack: this.re_getIdCode,
      errorHandler: this.error_getIdCode
    })
  }
}
root.methods.re_getIdCode = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn("获取idCode", data)
  if (!data) {
    return
  }
  this.$store.commit('SET_AUTH_ID_CODE', data.dataMap.userProfile)
}
root.methods.error_getIdCode = function (err) {
  console.warn('获取用户ID出错', err)
}
// 移动端活动copy url
root.methods.copyShareUrl = function () {
  let input = document.getElementById('moblieCopy');
  input.select();
  document.execCommand("Copy");
}

// 关闭提示
root.methods.closeClick = function () {
  this.popShow = false;
  !!this.$cookies.get("popShow") || this.$cookies.set("popShow", false, 60 * 60 * 12);
}

// 获取手机认证 谷歌认证
root.methods.getAuthStateStatus = function () {
  if (this.isMobile === false) return;
  this.shareUrl = 'https://' + document.location.host + '/index/register?uid=' + this.$store.state.authMessage.userId + '&source=share';
  this.$http.send('GET_AUTH_STATE', {
    bind: this,
    callBack: this.re_getAuthStateStatus
  })
}

// 获取是否data
root.methods.re_getAuthStateStatus = function (data) {
  let dataObj = JSON.parse(data)
  this.$store.commit('SET_AUTH_STATE', dataObj.dataMap)
  this.stateStatusReady = true
  this.loading = !(this.stateReady && (this.stateStatusReady || !this.isMobile))
}

// 获取初始data
root.methods.getInitData = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getInitData,
    errorHandler: this.error_getInitData
  })
}
// 返回初始data
root.methods.re_getInitData = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('获取了初始化数据', data)
  this.initData = data
  this.initReady = true
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)

}
// 获取data出错
root.methods.error_getInitData = function (err) {
  console.warn('获取init数据出错', err)
}

// 去认证跳转
root.methods.link_to_authenticate = function () {
  if (this.$store.state.isMobile === false) {
    this.$router.push("/index/personal/auth/authenticate")
  } else {
    this.popWindowText = '身份认证';
    this.popIdenOpen = true;
  }
}


// BDB是否抵扣
root.methods.getBDBInfo = function () {
  this.$http.send('FIND_FEE_DEDUCTION_INFO', {
    bind: this,
    callBack: this.re_getBDBInfo,
    errorHandler: this.error_getBDBInfo
  })
}


// BDB是否抵扣回调
root.methods.re_getBDBInfo = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  // console.warn("get BDB info", data)
  if (data.dataMap.TTFEE === 'yes') {
    this.BDBInfo = true
  }
  if (data.dataMap.TTFEE === 'no') {
    this.BDBInfo = false
  }
  // BDB状态
  this.BDBReady = true
  // this.loading = !(this.stateReady && this.BDBReady && (this.stateStatusReady || !this.isMobile))
  this.loading = !(this.stateReady && (this.stateStatusReady || !this.isMobile))
}
// BDB是否抵扣出错
root.methods.error_getBDBInfo = function (err) {
  // console.warn('BDB抵扣出错', err)
}
// 获取状态
root.methods.getAuthState = function () {
  this.$http.send("GET_IDENTITY_AUTH_STATUS", {
    bind: this,
    callBack: this.re_getAuthState,
    errorHandler: this.error_getAuthState,
  })
}
// 获取状态回复
root.methods.re_getAuthState = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap) return
  // console.warn('获取状态', data)
  this.authState = data.dataMap.status

  // 如果不是通过或者不是待审核状态，直接跳转到认证页面
  if(this.authState != 0 && this.authState != 2 && this.authState != 5 && this.authState != 6){
    this.link_to_authenticate();
  }
  this.stateReady = true
  // this.loading = !(this.stateReady && this.BDBReady && (this.stateStatusReady || !this.isMobile))
  this.loading = !(this.stateReady && (this.stateStatusReady || !this.isMobile))

}
// 获取状态出错
root.methods.error_getAuthState = function (err) {
  console.warn("获取状态出错了！", err)
}


// 获取资金和账户信息
root.methods.getCurrencyAndAccount = function () {
  let account = [...this.$store.state.currency.values()]
  if (account.length === 0) {
    this.getCurrency()
    return
  }
  this.getAccounts()
}

// 通过socket获取价格
root.methods.getPrice = function () {
  this.$socket.on({
      key: 'topic_prices',
      bind: this,
      callBack: this.re_getPrice
    }
  )
}
// 通过socket获取价格的回调
root.methods.re_getPrice = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  // console.warn('收到了价格socket', data)

  this.priceReady = true
  // this.loading = !(this.stateReady && this.BDBReady && (this.stateStatusReady || !this.isMobile))
  this.loading = !(this.stateReady  && (this.stateStatusReady || !this.isMobile))


  this.currentPrice = data

  this.$store.commit('CHANGE_PRICE_TO_BTC', data)


}


// 点击切换手续费折扣
root.methods.clickToggle = function (e) {
  if (this.BDBChanging) return
  this.BDBInfo = !this.BDBInfo
  this.BDBChanging = true
  this.$http.send('FEECHANGE', {
    bind: this,
    params: {
      'deduction': this.BDBInfo ? 'yes' : 'no'
    },
    callBack: this.re_clickToggle,
    errorHandler: this.error_clickToggle
  })
}
// 点击切换手续费折扣
root.methods.re_clickToggle = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  this.BDBChanging = false

}
// 点击切换手续费折扣失败
root.methods.error_clickToggle = function (err) {
  console.warn('点击切换手续费折扣失败', err)
  this.BDBInfo = !this.BDBInfo
  this.BDBChanging = false
}


// 获取币种请求
root.methods.getCurrency = function () {
  this.$http.send('GET_CURRENCY', {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency,
  })
}
// 获取币种的状态
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap || !data.dataMap.currencys) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // 继续获取账户信息
  this.getAccounts()
}
// 获取币种失败
root.methods.error_getCurrency = function (err) {
  console.warn("获取币种失败", err)
}
//获取账户信息
root.methods.getAccounts = function () {
  // 请求各项估值
  this.$http.send('RECHARGE_AND_WITHDRAWALS_RECORD', {
    bind: this,
    callBack: this.re_getAccount,
    errorHandler: this.error_getAccount
  })
}
// 获取账户信息回调
root.methods.re_getAccount = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.accounts) {
    console.warn("拿回来了个奇怪的东西", data)
    return
  }
  // console.warn('请求更新accounts', data.accounts)
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)

  this.accountReady = true
  this.loading = !(this.stateReady  && (this.stateStatusReady || !this.isMobile))


}
// 获取账户信息失败
root.methods.error_getAccount = function (err) {
  console.warn("获取账户内容失败", err)
}

// 用户登出
root.methods.loginOff = function () {
  this.$http.send('LOGIN_OFF',
    {
      bind: this,
      params: {},
      callBack: this.re_login_off_callback
    }
  )
}

// 登出回调
root.methods.re_login_off_callback = function (data) {
  this.$store.commit('LOGIN_OUT')
  window.location.reload();
}


// 修改估值
root.methods.changeAppraisement = function (dataObj) {
  typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj))
  let data = this.$globalFunc.mergeObj(dataObj, this.initData)
  this.initData = data

  this.$globalFunc.handlePrice(this.$store.state.currency, data)

  if (!data) return

  let total = 0
  let frozen = 0
  let available = 0

  for (let key in data) {
    let targetName = key.split('_')[0]
    let baseName = key.split('_')[1]
    if (baseName !== this.baseCurrency) continue
    let targetObj = this.$store.state.currency.get(targetName)
    if (!targetObj) continue
    total += targetObj.total * data[key][4]
    frozen += targetObj.frozen * data[key][4]
    available += targetObj.available * data[key][4]
  }

  let baseCurrencyHandle = this.$store.state.currency.get(this.baseCurrency)
  if (baseCurrencyHandle) {
    total += baseCurrencyHandle.total
    frozen += baseCurrencyHandle.frozen
    available += baseCurrencyHandle.available
  }

  this.total = total
  this.frozen = frozen
  this.available = available

}

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}
// 打开弹窗
root.methods.openPop = function (text = '', type = 0) {
  this.popText = text
  this.popType = type
  this.popOpen = true
}

// 关闭弹窗
root.methods.popIdenClose = function () {
  this.popIdenOpen = false
}

// 绑定谷歌验证
root.methods.click_bind_GA = function () {
  if (this.$store.state.isMobile === false) {
    this.$router.push('/index/personal/securityCenter/bindGoogleAuthenticator')
  } else {
    this.$router.push('/index/personal/securityCenter/MobileBindGoogleAuthenticator')

  }
}
// 解绑谷歌验证
root.methods.click_release_GA = function () {
  if (this.$store.state.isMobile === false) {
    this.$router.push('/index/personal/securityCenter/releaseGoogleAuthenticator')
  } else {
    // this.popWindowText = this.$t('popWindowText_3');
    // this.popOpen = true;
    this.$router.push('/index/personal/securityCenter/MobileReleaseGoogleAuthenticator')

  }
}
// 修改登录密码
root.methods.click_change_login_psw = function () {
  this.$router.push('/index/personal/securityCenter/modifyLoginPassword')
}
// 绑定手机验证
root.methods.click_bind_mobile = function () {
  this.$router.push('/index/personal/securityCenter/bindMobile')
}
// 解绑手机验证
root.methods.click_release_mobile = function () {
  this.$router.push('/index/personal/securityCenter/releaseMobile')
}
root.methods.click_bind_email = function () {
  this.$router.push({name: 'bindEmail'})
}
root.methods.click_release_email = function () {
  this.$router.push({name: 'releaseEmail'})
}

// 2018.10.16 打开提示取消app端身份认证的弹窗
root.methods.openFacePopupWindow = function () {
  this.facePopupWindow = true
  this.faceExiting = false
}
// 2018.10.16 关闭提示取消app端身份认证的弹窗
root.methods.closeFacePopupWindow = function () {
  this.facePopupWindow = false
  this.faceExiting = false
}
// 2018.10.16 请求提示取消app端身份认证的弹窗
root.methods.facePopupWindowConfirm = function () {
  if (this.faceExiting) return
  this.faceExiting = true
  this.$http.send('POST_EXIT_AUTHENTICATION', {
    bind: this
  }).then(({data}) => {
    typeof data === 'string' && (data = JSON.parse(data))
    this.faceExiting = false
    if (data.errorCode) {
      let message = ''
      switch (data.errorCode) {
        case 1:
          location && location.reload()
          break;
        case 2:
          message = this.$t('wrong_message_2')
          break;
        default:
          message = this.$t('wrong_message_3')
      }
      this.openPop(message, 0)
      return
    }
    this.closeFacePopupWindow()
    this.getAuthState()
  }).catch(e => {
    this.openPop(this.$t('wrong_message_3'), 0)
  })
}


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/


export default root
