const root = {}
root.name = 'MobileAssetRechargeAndWithdrawals'

root.props = {}


root.data = function () {
  return {
    loading: true, //加载中
    // total: 0, //总资产
    accountReady: false, //currency加载完毕
    priceReady: false,  //socket加载完毕，只有这两个加载完了loading才能打开
    initReady: false, //init数据加载完毕

    // frozen: 0,  //冻结
    // available: 0, //可用
    isTotalAssetShow: true, // 是否显示总资产，true为显示

    // frozen: 0,  //冻结
    // available: 0, //可用
    limit: 50, //提现额度
    exchangeRate: 0, //人民币汇率
    exchangeRateReady: false, //人民币汇率拿到
    exchangeRateInterval: null, //循环拿汇率
    // valuation: 0,//换算成人民币的估值

    currentPrice: {}, //最近的一次价格变动

    initData: {},

    // 不确定数据作用
    activeIndex: -1, //激活
    recharge: false,
    withdrawals: false,
    accounts: [],
    otcAccounts: [],
    currency: new Map(),

    tableOpenFlag: false, // 点击币种详情弹窗开关

    // 打算点击币种详情弹窗内容
    tableOpenData: {
      name: '',
      totalPrice: 0,
      availablePrice: 0,
      frozenPrice: 0,
      appraisementPrice: 0,
    },
    toastOpenFlag: false, // 弹窗开关

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    agreement: false,

    assetAccountType:'wallet',//当前账户类型,默认显示我的钱包

    otcCurrencyList:[] //法币账户列表

  }
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'MobileCheckbox': resolve => require(['../mobileVue/MobileCompentsVue/MobileCheckbox'], resolve),
}

root.created = function () {
  // 修改顶部标题
  this.$store.commit('changeMobileHeaderTitle', '资产');
  // socket获取价格
  this.getPrice()
  // 获取initData
  this.getInitData()
  // 获取验证状态
  this.getAuthState()
  // 获取汇率
  this.getExchangeRate()
  // 获取币种
  // let currency = [...this.$store.state.currency.values()]
  // if (currency.length === 0) {
    // 发送请求
  // this.getOtcCurrency()


    // return
  // }
  // 获取用户信息
  this.getAccounts()
  this.getOtcCurrency()
  this.getCurrency()


}

root.beforeDestroy = function () {
  this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
}

root.computed = {}
//换算成人民币的估值
root.computed.valuation = function () {
  return this.$globalFunc.accFixedCny(this.total * this.computedExchangeRate,2)
}
//换算成人民币的法币估值
root.computed.otcValuation = function () {
  return this.$globalFunc.accFixedCny(this.otcTotal * this.computedExchangeRate,2)
}
// 计算当前的服务器时间
root.computed.serverT = function () {
  return this.$store.state.serverTime/1000;
}
// 计算计价货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 计算汇率
root.computed.computedExchangeRate = function () {
  // console.info(this.$store.state.exchange_rate_dollar)
  // todo h5国际化
  // if (this.$store.state.lang === 'CH') {
    return this.exchangeRate * this.$store.state.exchange_rate_dollar
  // }
  // return this.exchangeRate
}
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}
// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  if(this.assetAccountType == 'wallet'){
    return this.accounts
  }
  return this.otcAccounts
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

// 我的钱包账户总资产
root.computed.total = function () {
  let total = 0
  for (let i = 0; i < this.accounts.length; i++) {
    total = this.accAdd(total, this.accounts[i].appraisement)
  }
  // console.info('total',total)
  return this.toFixed(total)
}
// 我的钱包账户可用
root.computed.available = function () {
  let available = 0
  for (let i = 0; i < this.accounts.length; i++) {
    available = this.accAdd(available, this.accMul(this.accounts[i].available, this.accounts[i].rate))
    // console.log(this.accounts[i].rate)
  }
  return this.toFixed(available)
}

// 我的钱包账户冻结
root.computed.frozen = function () {
  let frozen = 0
  for (let i = 0; i < this.accounts.length; i++) {
    frozen = this.accAdd(frozen, this.accMul(this.accounts[i].frozen, this.accounts[i].rate))
  }
  return this.toFixed(frozen)
}

// 法币账户账户总资产
root.computed.otcTotal = function () {
  let total = 0
  for (let i = 0; i < this.otcAccounts.length; i++) {
    total = this.accAdd(total, this.otcAccounts[i].otcAppraisement)
  }
  // console.info('OTC total',total)
  return this.toFixed(total)
}
// 法币账户账户可用
root.computed.otcAvailable = function () {
  let available = 0
  for (let i = 0; i < this.accounts.length; i++) {
    available = this.accAdd(available, this.accMul(this.accounts[i].otcAvailable, this.otcAccounts[i].rate))
  }
  return this.toFixed(available)
}

// 我的钱包账户冻结
root.computed.otcFrozen = function () {
  let frozen = 0
  for (let i = 0; i < this.accounts.length; i++) {
    frozen = this.accAdd(frozen, this.accMul(this.accounts[i].otcFrozen, this.otcAccounts[i].rate))
  }
  return this.toFixed(frozen)
}
// 所有账户总资产
root.computed.totalAssets = function () {
  return this.toFixed((this.accAdd(this.total,this.otcTotal)))
}


/*----------------------------- 监听 ------------------------------*/

root.watch = {}


// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  // this.accounts = [...this.$store.state.currency.values()]

  // console.log('1jdslkfjlkdsjfkldsjlf23',this.accounts)
  let otcAccounts = [];
  this.otcCurrencyList.map(v=>{
    let item = this.$store.state.currency.get(v.currency);
    // console.info(item)
    otcAccounts.push(item)
  })

  /*if(this.assetAccountType == 'wallet'){
    return this.accounts = [...this.$store.state.currency.values()]
  }
    return this.otcAccounts = otcAccounts*/

  this.accounts = [...this.$store.state.currency.values()]
  this.otcAccounts = otcAccounts

  //
  // this.changeAppraisement(this.currentPrice)
  // this.changeAppraisement(this.currentPrice)
}


root.methods = {};
//切换我的钱包和币币账户
root.methods.changeAssetAccountType = function (type) {
  if(this.assetAccountType == type)return
  this.assetAccountType = type
};
// 点击币种，是否弹出币种的详细信息开关
root.methods.changeTableOpenFlag = function (obj) {
  this.tableOpenFlag = !this.tableOpenFlag

  this.tableOpenData.name = obj.currency
  this.tableOpenData.totalPrice = obj.total
  this.tableOpenData.availablePrice = obj.available
  this.tableOpenData.frozenPrice = obj.frozen
  this.tableOpenData.appraisementPrice = obj.appraisement
}

/*---------------------- socket监听价格begin ---------------------*/
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

  // socket 加载完毕
  this.priceReady = true
  // loading是否关闭
  this.loading = !(this.accountReady && this.exchangeRateReady && (this.priceReady || this.initReady))

  this.currentPrice = data

  this.$store.commit('CHANGE_APPRAISEMENT', data)
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)

}
/*---------------------- socket监听价格end ---------------------*/

/*---------------------- 初始化begin ---------------------*/

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

  this.initReady = true
  this.initData = data.data

  // this.changeAppraisement(this.initData)
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)
  // this.getPrice()
}
// 获取data出错
root.methods.error_getInitData = function (err) {
  console.warn('获取init数据出错', err)
}
/*---------------------- 初始化end ---------------------*/

/*---------------------- 计算每一行估值begin ---------------------*/
root.methods.calculationAppraisement = function (item) {

  let appraisement = 'appraisement'

  if(this.assetAccountType == 'currency'){
    appraisement = 'otcAppraisement'
  }

  if(item[appraisement] <= 0)return '---'

  return this.$globalFunc.accMul(this.$globalFunc.accMul(item[appraisement], this.exchangeRate || 0), this.$store.state.exchange_rate_dollar)

}

/*---------------------- 计算每一行估值end ---------------------*/

/*---------------------- 修改估值begin ---------------------*/

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

    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].currency !== targetName) continue
      this.accounts[i].appraisement = this.accounts[i].total * data[key][4]
      break
    }
  }

  // 特殊处理，作为base的货币也要加进去
  let baseCurrencyHandle = this.$store.state.currency.get(this.baseCurrency)
  if (baseCurrencyHandle) {
    total += baseCurrencyHandle.total
    frozen += baseCurrencyHandle.frozen
    available += baseCurrencyHandle.available
  }

  // 特殊处理，如果是基础货币
  for (let i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].currency !== this.baseCurrency) continue
    this.accounts[i].appraisement = this.accounts[i].total
  }


  this.total = total
  this.valuation = this.total * this.computedExchangeRate
  this.frozen = frozen
  this.available = available

}


/*---------------------- 修改估值end ---------------------*/

// sss===
/*---------------------- 获取汇率begin ---------------------*/

root.methods.getExchangeRate = function () {

  this.$http.send('GET_EXCHANGE__RAGE', {
    bind: this,
    callBack: this.re_getExchangeRate,
    errorHandler: this.error_getExchangeRate
  })

  this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
  // 循环请求
  this.exchangeRateInterval = setInterval(() => {
    this.$http.send('GET_EXCHANGE__RAGE', {
      bind: this,
      callBack: this.re_getExchangeRate,
      errorHandler: this.error_getExchangeRate
    })
  }, 60000)
}
// 获取人民币汇率回调
root.methods.re_getExchangeRate = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.dataMap) return
  // console.info("assetPage获取汇率！", data)
  if (data.result === 'SUCCESS') {
    this.exchangeRateReady = true
    this.exchangeRate = data.dataMap.exchangeRate.btcExchangeRate
    // this.valuation = this.exchangeRate * this.total
    this.loading = !(this.accountReady && this.exchangeRateReady && (this.priceReady || this.initReady))
  }
}
// 获取人民币汇率失败
root.methods.error_getExchangeRate = function (err) {
  // console.warn("assetPage获取汇率失败！", err)
}

/*---------------------- 获取汇率end ---------------------*/

/*---------------------- 获取币种和账户信息begin ---------------------*/
//
// 获取币种
root.methods.getOtcCurrency = function () {
  this.$http.send('GET_OTC_CURRENCY', {
    bind: this,
    callBack: this.re_getOtcCurrency,
    errorHandler: this.error_getOtcCurrency,
  })
}
// 获取币种的状态
root.methods.re_getOtcCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) {
    return
  }
  this.otcCurrencyList = data;
  // console.info(this.otcCurrencyList)
  // this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  this.getAccounts()
}
root.methods.error_getOtcCurrency = function () {

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
    // console.warn("拿回了奇怪的东西！", data)
    return
  }
  // console.warn("这是currency", data)
  // this.otcCurrencyList = data;

  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // 获取账户信息
  this.getAccounts()
}

// 获取币种出错
root.methods.error_getCurrency = function (err) {
  // console.warn('获取币种列表出错！',err)
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
    // console.warn("拿回了奇怪的东西！", data)
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  this.accountReady = true
  this.loading = !(this.accountReady && this.exchangeRateReady && (this.priceReady || this.initReady))

}

// 获取账户信息出错
root.methods.error_getAccount = function (err) {
  // console.warn('获取账户信息出错',err)
}

/*---------------------- 获取币种和账户信息end ---------------------*/

/*---------------------- 点击item，跳转detail页start ---------------------*/
root.methods.hideZeroItem = function () {
  this.agreement = !this.agreement
}

/*---------------------- 点击item，跳转detail页end ---------------------*/


/*---------------------- 点击item，跳转detail页start ---------------------*/
root.methods.jumpToDetail = function (name) {
  this.$router.push({name: 'MobileAssetRechargeAndWithdrawalsDetail',query:{currency: name},
    params:{assetAccountType:this.assetAccountType}})
}

/*---------------------- 点击item，跳转detail页end ---------------------*/



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
  // this.loading = !(this.accountReady && this.authStateReady)
}


// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功
  // console.warn('获取验证状态成功', data)
  this.authStateReady = true
  this.loading = !this.accountReady
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
}

// 点击充值
// root.methods.clickRecharge = function (name) {
//   // console.log('是否登录',this.bindMobile,this.bindGA,this.bindIdentify)
//   // if(this.bindIdentify) {
//   if (!this.bindMobile && !this.bindGA) {
//     this.popOpen = true
//     this.popType = 0
//     this.popText = '请先绑定谷歌验证或手机'
//   }
//   if (this.bindMobile || this.bindGA) {
//     // this.$store.commit('changeMobileHeaderPriceTitle',name)
//     // this.$router.push('/index/mobileAsset/mobileAssetRechargeDetail/')
//     this.$router.push('/index/mobileAsset/mobileAssetRechargeDetail?currency=' + name)
//   }
//   // }
//   // if(!this.bindIdentify) {
//   //   this.popOpen = true
//   //   this.popType = 0
//   //   this.popText = '您尚未通过实名认证'
//   // }
// }

// 点击提现
// root.methods.clickWithdraw = function (flag, name) {
//   if (flag) {
//     return;
//   }
//   // if (name === 'EOS' || name === 'DVT') {
//   //   this.popOpen = true
//   //   this.popType = 0
//   //   this.popText = name + '暂不支持提现';
//   //   return
//   // }
//
//   if (this.bindIdentify) {
//     if (!this.bindMobile && !this.bindGA) {
//       this.popOpen = true
//       this.popType = 0
//       this.popText = '请先绑定谷歌验证或手机'
//     }
//     if (this.bindMobile || this.bindGA) {
//       // this.popOpen = true
//       // this.popType = 0
//       // this.popText = '暂不支持提现功能'
//       // this.$store.commit('changeMobileRechargeRecordData',this.tableOpenData)
//       this.$router.push("/index/mobileAsset/mobileAssetWithdrawDetail?currency=" + name)
//       return
//     }
//   }
//   if (!this.bindIdentify) {
//     this.popOpen = true
//     this.popType = 0
//     this.popText = '您尚未通过实名认证'
//   }
// }

// 是否显示全部金额
root.methods.changeTotalAssetShow = function () {
  this.isTotalAssetShow = !this.isTotalAssetShow
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}

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


/*---------------------- 跳入到首页面页面 ---------------------*/
root.methods.gotoNewH5homePage = function () {
  this.$router.push({name: 'NewH5homePage'});
}
/*---------------------- 跳入到市场页面 ---------------------*/
root.methods.gotoShichang = function () {
  this.$router.push({name: 'mobileTradingHall'});
}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods.gotoZichan = function () {
  this.$router.push({name: 'MobileAssetRechargeAndWithdrawals'});
}

/*---------------------- 跳入到交易页面 ---------------------*/
root.methods.gotoJiaoyi = function () {
  this.$router.push({name: 'mobileTradingHallDetail'});
}

/*---------------------- 跳入到合约页面 ---------------------*/
root.methods.gotoContract = function () {
  this.$router.push({name: 'mobileTradingHallDetail'});
}


export default root
