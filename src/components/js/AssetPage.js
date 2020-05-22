import axios from "axios";

const root = {}
root.name = 'AssetPage'

/*------------------------------ 组件 -------------------------------*/


root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve)
}

/*------------------------------ data -------------------------------*/


root.data = function () {
  return {
    loading: true, //加载中
    // total: 0, //总资产

    accountReady: false, //currency加载完毕
    priceReady: false,  //socket加载完毕，只有这两个加载完了loading才能打开
    initReady: false, //init数据加载完毕


    // frozen: 0,  //冻结
    // available: 0, //可用
    limit: 3, //提现额度
    // exchangeRate: 0, //人民币汇率
    exchangeRateReady: false, //人民币汇率拿到
    exchangeRateInterval: null, //循环拿汇率
    accounts: [], // 账户信息

    currentPrice: {}, //最近的一次价格变动

    initData: {},

    // 安全警示开关
    securityOpen: false,

  }
}

/*------------------------------ 计算 -------------------------------*/

root.computed = {}
// 人民币汇率,由于后台接口返回了0.001，所以前端改为price接口获取，
// 直接由本地仓库计算好拿过来就行啦,这里其实返回的是btcExchangeRate，
// 为了和之前的变量名一致，叫exchangeRate
root.computed.exchangeRate = function () {
  return this.$store.state.exchange_rate.btcExchangeRate
}
// 计算account是否
root.computed.accountChange = function () {
  return this.$store.state.currencyChange
}
// 计算计价货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 计算汇率
root.computed.computedExchangeRate = function () {
  if (this.lang === 'CH') {
    return this.exchangeRate * this.$store.state.exchange_rate_dollar
  }
  return this.exchangeRate
}
//换算成人民币的估值
root.computed.valuation = function () {
  return this.total * this.computedExchangeRate
}
// 语言 CH中文
root.computed.lang = function () {
  return this.$store.state.lang
}
// 是否登录
root.computed.isLogin = function () {
  return this.$store.state.isLogin
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

/*------------------------------ 检测 -------------------------------*/


root.watch = {}

// 账户修改
root.watch.accountChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
}

/*------------------------------ 生命周期 -------------------------------*/

root.created = function () {
  this.getPrice()
  this.getInitData()
  this.getExchangeRate()
  this.getUSDThl();

  let currency = [...this.$store.state.currency.values()]
  if (currency.length === 0) {
    // 发送请求
    this.getCurrency()
    return
  }
  this.getAccounts()
}

// _cc 组件销毁前清除获取汇率定时器
root.beforeDestroy = function () {
  // this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
}

/*------------------------------ 方法 ---------------------------------*/

root.methods = {}

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
  // console.warn('获取了初始化数据', data)

  this.initReady = true
  this.initData = data

  this.$store.commit('CHANGE_PRICE_TO_BTC', data)

}
// 获取data出错
root.methods.error_getInitData = function (err) {
  // console.warn('获取init数据出错', err)
}
/*---------------------- 初始化end ---------------------*/


//sss===

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
  // console.warn("assetPage获取汇率！", data)
  if (data.result === 'SUCCESS') {
    this.exchangeRateReady = true;
    this.exchangeRate = data.dataMap.exchangeRate.btcExchangeRate;
    this.$store.commit('SET_EXCHANGE_RATE', data.dataMap.exchangeRate);
  }

}
// 获取人民币汇率失败
root.methods.error_getExchangeRate = function (err) {
  // console.warn("assetPage获取汇率失败！", err)
}

/*---------------------- 获取汇率end ---------------------*/


/*---------------------- 获取币种和账户信息begin ---------------------*/


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
  // 没登录不请求
  if (!this.isLogin) {
    return
  }
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
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)

  this.accountReady = true
  this.loading = !this.accountReady
  // this.loading = !(this.accountReady && this.exchangeRateReady)

}

// 获取账户信息出错
root.methods.error_getAccount = function (err) {
  // console.warn('获取账户信息出错',err)
}

//sss===

//获取USDT汇率
root.methods.getUSDThl = function(){
  // var doollar = localStorage.getItem("exchange_rate_dollar_usdt");
  // this.$store.commit('changeExchange_rate_dollar', doollar);
  // // 循环请求
  // this.exchangeRateInterval = setInterval(() => {
  //   axios('https://otc-api.huobi.co/v1/data/market/detail',{timeout: 50000}).then(({data}) =>{
  //     if(data.success){
  //       var detaildata = data.data.detail;
  //       detaildata.forEach((item) => {
  //         if(item.coinName == 'USDT'){
  //           this.$store.commit('changeExchange_rate_dollar', item.buy);
  //           localStorage.setItem("exchange_rate_dollar_usdt",item.buy);
  //         }
  //       })
  //     }else{
  //       this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //       this.$store.commit('changeExchange_rate_dollar',this.dollar_usdt);
  //     }
  //   }).catch(response =>{
  //     this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //     this.$store.commit('changeExchange_rate_dollar',this.dollar_usdt);
  //   })
  // }, 6000)
}

/*---------------------- 获取币种和账户信息end ---------------------*/


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

  this.priceReady = true
  // this.loading = !(this.accountReady && this.exchangeRateReady)

  this.currentPrice = data
  // console.warn('this is socket data',data)
  this.$store.commit('CHANGE_APPRAISEMENT', data)
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)

}
/*---------------------- socket监听价格end ---------------------*/


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
/*---------------------- 修改估值 end ---------------------*/


// 安全警示切换
root.methods.changeSecurityOpen = function () {
  this.securityOpen = !this.securityOpen
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
