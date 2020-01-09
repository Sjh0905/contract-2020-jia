const root = {}
root.name = 'AssetPageRechargeAndWithdrawals'

/*----------------------------- 组件 ------------------------------*/

// 组件
root.components = {
  'RechargeAndWithdrawalsRecharge': resolve => require(['../vue/AssetPageRechargeAndWithdrawalsRecharge'], resolve),
  'RechargeAndWithdrawalsWithdrawals': resolve => require(['../vue/AssetPageRechargeAndWithdrawalsWithdrawals'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve)
}

/*----------------------------- data ------------------------------*/

// 数据
root.data = function () {
  return {
    loading: true,
    popWindowOpen: false, //弹窗开关

    activeIndex: -1, //激活
    recharge: false,
    withdrawals: false,//提款
    accounts: [],
    currency: new Map(),

    currentPrice: {},//最近的一次socket数据

    initData: {}, //初始值
    initReady: false,

    socketTime: 0,  //socket计数器
    socketBase: 1,  //socket基数，多少次取一次socket

    priceReady: false,    //socket准备
    currencyReady: false, //currency准备，只有加载完全部的loading才会关闭！
    authStateReady: false, //认证状态准备

    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定
  }
}

/*----------------------------- 生命周期 ------------------------------*/


// 开始初始化请求
root.created = function () {
  this.getInitData()
  // 获取验证状态
  this.getAuthState()
  // 监听socket
  this.getPrice()
  let currency = [...this.$store.state.currency]
  if (!currency) {
    // 获取币种状态
    this.getCurrency()
    return
  }
  // 获取账户信息
  this.getAccounts()
}

/*----------------------------- 计算 ------------------------------*/


// 计算
root.computed = {}
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}
// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  // 特殊处理
  // return this.accounts.filter(v => {
  //   return v.currency === 'BTC' || v.currency === 'BDB' || v.currency === 'ETH' || v.currency === 'BDX'
  // })
  return this.accounts
}
// 基础货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}


/*----------------------------- 监听 ------------------------------*/


// 监听
root.watch = {}
// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
  this.changeAppraisement(this.currentPrice)
}


/*----------------------------- 方法 ------------------------------*/

root.methods = {}


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
  console.warn('获取了初始化数据', data)
  this.initData = data
  this.initReady = true
  this.changeAppraisement(this.initData)
}
// 获取data出错
root.methods.error_getInitData = function (err) {
  // console.warn('获取init数据出错', err)
}


// 获取权限

// 判断验证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  // 获取认证状态成功
  this.authStateReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
}


// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功
  // console.warn('获取验证状态成功', data)
  this.authStateReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
}


// 修改估值
root.methods.changeAppraisement = function (dataObj) {
  typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj))
  let data = this.$globalFunc.mergeObj(dataObj, this.initData)
  this.initData = data
  if (!data) return

  for (let key in data) {
    let targetName = key.split('_')[0]
    let baseName = key.split('_')[1]
    if (baseName !== this.baseCurrency) continue
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].currency !== targetName) continue
      this.accounts[i].appraisement = this.accounts[i].total * data[key][4]
      break
    }
  }

  // 特殊处理，如果是基础货币
  for (let i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].currency !== this.baseCurrency) continue
    this.accounts[i].appraisement = this.accounts[i].total
  }

}

// 打开socket监听
root.methods.getPrice = function () {
  this.$socket.on(
    {
      key: 'topic_prices',
      bind: this,
      callBack: this.re_getPrice
    })
}

// socket估值发生变化！
root.methods.re_getPrice = function (data) {
  if (this.socketTime % this.socketBase !== 0) {
    this.socketTime++
    return
  }
  this.socketTime = 1
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return

  // console.warn("rechargeAndWithdrawals 收到socket!",data)

  this.priceReady = true
  this.loading = !(this.currencyReady && this.authStateReady)


  // 记录最近的price
  this.currentPrice = data
  this.changeAppraisement(data)
}


// 获取币种
root.methods.getCurrency = async function () {
  this.$http.send('GET_CURRENCY', {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency,
  })
}
// 获取币种的状态
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  // console.warn("获取币种状态", data)
  if (!data.dataMap || !data.dataMap.currencys) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  this.getAccounts()
}
// 获取币种失败
root.methods.error_getCurrency = function (err) {
  // console.warn("获取币种失败", err)
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
    // console.warn("拿回来了个奇怪的东西", data)
    return
  }
  // console.warn('请求更新accounts', data.accounts)
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  // 关闭loading
  this.currencyReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
  this.changeAppraisement(this.currentPrice)

}
// 获取账户信息失败
root.methods.error_getAccount = function (err) {
  // console.warn("获取账户内容失败", err)
}


// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}
// 弹出绑定身份
root.methods.goToBindIdentity = function () {
  this.popWindowOpen = false
  this.$router.push('/index/personal')
}
// 去绑定谷歌验证
root.methods.goToBindGA = function () {
  this.popWindowOpen = false
  this.$router.push('/index/personal/securityCenter/bindGoogleAuthenticator')
}
// 去绑定手机号
root.methods.goToBindMobile = function () {
  this.popWindowOpen = false
  this.$router.push('/index/personal/securityCenter/bindMobile')
}


// 打开提现
root.methods.openWithdrawals = function (index) {
  // 如果没有实名认证不允许打开提现
  if (!this.bindIdentify) {
    this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popWindowOpen = true
    return
  }
  // 如果没有绑定谷歌或手机，不允许打开提现
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }

  //todo 修改密码后不能提现


  this.recharge = false
  this.activeIndex !== index && (this.withdrawals = true)
  if (this.activeIndex === index) {
    this.withdrawals = !this.withdrawals
    if (this.withdrawals === false) {
      this.activeIndex = -1
      return
    }
  }
  this.activeIndex = index
}


// root.methods.openWithdrawals = function (index) {
//   // 如果没有实名认证不允许打开提现
//   if (!this.bindIdentify) {
//     this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleWithdrawals')
//     this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowPromptWithdrawals')
//     this.popWindowStyle = '0'
//     this.popWindowOpen = true
//     return
//   }
//   // 如果没有绑定谷歌或手机，不允许打开提现
//   if (!this.bindGA && !this.bindMobile) {
//     this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleWithdrawals')
//     this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaWithdrawals')
//     this.popWindowStyle = '1'
//     this.popWindowOpen = true
//     return
//   }

// 打开充值
root.methods.openRecharge = function (index) {
  // 如果没有实名认证不允许打开充值
  // 充值取消实名认证的限制
  // if (!this.bindIdentify) {
  //   this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
  //   this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowPromptRecharge')
  //   this.popWindowStyle = '0'
  //   this.popWindowOpen = true
  //   return
  // }

  // 如果没有绑定谷歌或手机，不允许打开充值
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleRecharge')
    this.popWindowPrompt = this.$t('assetPageRechargeAndWithdrawals.popWindowTitleBindGaRecharge')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    // this.loading = true
    return
  }

  this.withdrawals = false
  this.activeIndex !== index && (this.recharge = true)
  if (this.activeIndex === index) {
    this.recharge = !this.recharge
    if (this.recharge === false) {
      this.activeIndex = -1
      return
    }
  }
  this.loading = true
  this.activeIndex = index
}

root.methods.errorHandler = function (err, state, text) {
  console.error('数据出错！', err, state, text)
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
