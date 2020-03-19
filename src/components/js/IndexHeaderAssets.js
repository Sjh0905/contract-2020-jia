const root = {}


root.name = 'IndexHeaderAssets'

/*----------------------- 组件 --------------------------*/


root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve)
}

/*----------------------- props --------------------------*/
root.props = {}

root.props.black = {
  type: [Boolean, String],
  default: false
}

// root.props.flag = {
//   type: [Boolean],
//   default: false
// }

/*----------------------- data --------------------------*/


root.data = function () {
  return {
    loading: false,

    // total: 0, //总资产
    // frozen: 0, //冻结
    // available: 0, //可用
    currentPrice: {}, //最近一次的socket推送数据


    priceReady: false, //socket连接上
    accountReady: false,  //账户信息拿到
    accounts: [], // 账户信息

    initData: {},
    // 获取认证状态
    authType:0



  }
}

/*----------------------- 生命周期 --------------------------*/

root.created = function () {
  this.$eventBus.listen(this,'REFRESH_AUTHENTICATE',this.getAuthState);

  this.getInitData()
  this.getPrice()
  this.getCurrencyAndAccount()

  this.getAuthState()
}

/*----------------------- 计算 --------------------------*/


root.computed = {}

// 是否是会员
root.computed.flag = function () {
  return this.$store.state.isVIP.flag
}
// 观测currency是否发生变化
root.computed.watchCurrency = function () {
  return this.$store.state.currencyChange
}
// 计价货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
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

/*----------------------- 观察 --------------------------*/

root.watch = {}
root.watch.watchCurrency = function () {
  this.accounts = [...this.$store.state.currency.values()]
}


/*----------------------- 方法 --------------------------*/


root.methods = {}

// 获取认证状态
root.methods.getAuthState = function () {
  this.$http.send("GET_IDENTITY_AUTH_STATUS", {
    bind: this,
    callBack: this.re_getAuthState,
    errorHandler: this.error_getAuthState,
  })
}
// 获取认证状态成功
root.methods.re_getAuthState = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap) return
  console.log('获取状态', data)
  this.authType = data.dataMap.status

}
// 获取认证失败
root.methods.error_getAuthState = function (err) {
  console.warn("拿不到认证数据！", err)
}

// 登出
root.methods.loginOff = function () {
  let ctc_url = process.env.DOMAIN;
  let domain_url = window.location.origin;
  let replace_url = ctc_url;
  console.log(replace_url)
  this.$http.send('LOGIN_OFF', {bind: this})
    .then(({data}) => {
      // 清除cookie
      this.$cookies.remove("popShow");
      this.$store.commit('LOGIN_OUT');
      // window.location.reload();
      this.$router.push('index/home')
      // window.location.replace(replace_url);
    })
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
  this.initData = data
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)

}
// 获取data出错
root.methods.error_getInitData = function (err) {
  console.warn('获取init数据出错', err)
}

// 获取币种和账户
root.methods.getCurrencyAndAccount = function () {
  let currency = [...this.$store.state.currency.values()]
  if (currency.length === 0) {
    // 先获取币种
    this.getCurrency()
    return
  }
  // 再获取账户
  this.getAccounts()
}

// 获取币种
root.methods.getCurrency = function () {
  this.$http.send("GET_CURRENCY", {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency
  })
}

// 获取币种回调
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap || !data.dataMap.currencys) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // 获取账户信息
  this.getAccounts()
}
// 获取币种出错
root.methods.error_getCurrency = function (err) {
  console.warn('获取币种列表出错！', err)
}

// 获取账户信息
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
    console.warn("拿回了奇怪的东西！", data)
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  this.accountReady = true
  // this.loading = !(this.accountReady && this.priceReady)
}

// 获取账户信息出错
root.methods.error_getAccount = function (err) {
  console.warn('获取账户信息出错', err)
}
// 通过socket获取价格
root.methods.getPrice = function () {
  this.$socket.on({
    key: 'topic_prices',
    bind: this,
    callBack: this.re_getPrice
  })
}

// 通过socket获取价格的回调
root.methods.re_getPrice = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.priceReady = true
  this.currentPrice = data
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)
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

  // 特殊处理，作为base的货币也要加进去
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
