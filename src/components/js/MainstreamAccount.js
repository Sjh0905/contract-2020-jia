import axios from "axios";

const root = {}
root.name = 'MainstreamAccount'

/*----------------------------- 组件 ------------------------------*/

// 组件
root.components = {
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
}

/*----------------------------- data ------------------------------*/

// 数据
root.data = function () {
  return {
    // 默认为erc20

    loading: true,
    popWindowOpen: false, //弹窗开关

    activeIndex: -1, //激活
    recharge: false,
    withdrawals: false,
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


    // toast提示
    popupPromptOpen: false,
    popupPromptType: 0,
    popupPromptText: '',

    // 2018-4-4  BDB汇率
    bdb_rate: 0,
    change_price: 0,  // 当前价格
    show_key: '-1',  // 展示当前价格

    rechargeAddressChangePrompt: false, //充值地址变更的弹窗提示

    hideZeroAsset: false, //隐藏零资产币种

    // 内部划转变量
    popWindowOpen1:false,
    assetAccountType:'wallet',//当前账户类型,默认显示币币账户
    // bibiAccount:'币币账户',
    // account:'我的钱包',
    itemInfo:{
      currency:''
    },

    currencyValue:'',// 输入框币种信息
    transferCurrencyWA:'',// 币种错误提示
    amountInput:'',// 输入框划转的数量
    transferAmountWA:'',// 数量错误提示
    transferCurrencyAvailable:0,  //我的钱包可用余额
    // transferCurrencyOTCAvailable:0, //法币账户可用余额
    transferCurrencyMainAvailable: 0, //法币账户可用余额
    transferCurrencyObj:{},
    sending:false,

    // otcCurrencyList:[],//法币币种列表
    mainsCurrencyList:['BCH','BTC','EOS','ETH','LTC']
  }
}

/*----------------------------- 生命周期 ------------------------------*/


// 开始初始化请求
root.created = function () {
  this.$store.commit('changeJoinus', false);
  this.getInitData()
  // 获取验证状态
  this.getAuthState()
  // 监听socket
  this.getPrice()
  // let currency = [...this.$store.state.currency]
  // if (!currency) {
  // 获取币种状态
  this.getCurrency()
  // 获取账户信息
  this.getAccounts()
  // 如果已经cookies记录的弹出过，则不弹出，如果没有，弹窗，并记录
  if (!this.$cookies.get('rechargeAddressChanged')) {
    this.$cookies.set('rechargeAddressChanged', true, 60 * 60 * 6)
    this.rechargeAddressChangePrompt = true
  }
}

/*----------------------------- 计算 ------------------------------*/


// 计算
root.computed = {}
// 人民币汇率,由于后台接口返回了0.001，所以前端改为price接口获取，
// 直接由本地仓库计算好拿过来就行啦,这里其实返回的是btcExchangeRate，
// 为了和之前的变量名一致，叫exchangeRate
root.computed.exchangeRate = function () {
  return this.$store.state.exchange_rate.btcExchangeRate
}

// 计算当前的服务器时间
root.computed.serverT = function () {
  return this.$store.state.serverTime / 1000
}


root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

// 计算汇率
root.computed.computedExchangeRate = function () {
  if (this.lang === 'CH') {
    return this.exchangeRate * this.$store.state.exchange_rate_dollar
  }
  return this.exchangeRate
}

// 账户总资产
root.computed.total = function () {
  let total = 0
  for (let i = 0; i < this.accounts.length; i++) {
    total = this.accAdd(total, this.accounts[i].mainAppraisement)
  }
  return total
}

//换算成人民币的估值
root.computed.valuation = function () {
  return this.total * this.computedExchangeRate
}

// 账户可用
root.computed.available = function () {
  let available = 0
  for (let i = 0; i < this.accounts.length; i++) {
    available = this.accAdd(available, this.accMul(this.accounts[i].available, this.accounts[i].rate))
    console.info(this.accounts[i].rate)
  }
  return this.toFixed(available)
}

// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  // 特殊处理
  if (this.hideZeroAsset) {
    return this.accounts.filter((val,inx) => {
      val.currencyKey = val.currency+'-'+inx;
      console.info('val',val)
      // this.transferCurrencyObj[val.currency] = val;
      return val.mainTotal !== 0
    })
  }

  this.accounts.map((val,inx) => {
    val.currencyKey = val.currency+'-'+inx;
    // val.currency == 'USDTK' && console.log(JSON.stringify(val))
    // console.log(JSON.stringify(val.id))
    // this.transferCurrencyObj[val.currency] = val;
  })
  // console.info('this.accounts====',this.accounts)
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
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}
// 当前语言
root.computed.lang = function () {
  return this.$store.state.lang;
}
// 当前汇率
root.computed.btc_rate = function () {
  return this.$store.state.exchange_rate.btcExchangeRate;
}


/*----------------------------- 监听 ------------------------------*/


// 监听
root.watch = {}
// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {

  let accounts = [...this.$store.state.currency.values()];
  // let otcAccounts = [];
  // this.mainsCurrencyList.map(v=>{
  //   let item = this.$store.state.currency.get(v.currency);
  //   otcAccounts.push(item)
  // })
  let mainsAccounts = []
  this.mainsCurrencyList.map(v =>{
    let item = this.$store.state.currency.get(v)
    mainsAccounts.push(item)
  })
  this.accounts = mainsAccounts
  // console.log('this.accounts zpy============== ',this.accounts)
}

root.watch.loading = function (newVal, oldVal) {
  if (oldVal && !newVal) {
    if (this.$route.query.symbol) {
      let currencyArr = [...this.$store.state.currency.values()]
      for (let i = 0; i < currencyArr.length; i++) {
        if (this.$route.query.symbol === currencyArr[i].currency) {
          this.openRecharge(i)
          return
        }
      }
    }
  }
}


/*----------------------------- 方法 ------------------------------*/

root.methods = {}

// // 去交易
// root.methods.goToDeal = function (item) {
//   let symbol = item.currency+'_USDT'
//   let haveSymbol =  this.$store.state.tradingParameters.find(v=>v.name==symbol)
//   if(!haveSymbol){
//     this.$router.push({name: 'tradingHall'})
//     return
//   }
//   this.$store.commit('SET_SYMBOL', symbol);
//
//   let user_id = this.$store.state.authMessage.userId;
//   let user_id_symbol = user_id + '-' + symbol;
//   !user_id && this.$cookies.set('unlogin_user_symbol_cookie', symbol, 60 * 60 * 24 * 30,"/");
//   // !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24)
//   !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24 * 30,"/");
//   this.$router.push({name: 'tradingHall'})
// }

// 计算当前币对折合多少人民币  2018-4-4 start
root.methods.get_now_price = function (key, price, e) {
  if (price == 0) return;
  let rate = this.btc_rate || 0;
  if (this.lang === 'CH') {
    this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    this.change_price = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  // 展示价格
  this.show_key = key;
}
root.methods.hide_now_price = function () {
  this.show_key = '-1';
}
// 2018-4-4  end


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
  this.$store.commit('CHANGE_PRICE_TO_BTC', this.initData)
}
// 获取data出错
root.methods.error_getInitData = function (err) {
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
  this.$globalFunc.handlePrice(this.$store.state.currency, data)
  if (!data) return
  for (let key in data) {
    let targetName = key.split('_')[0]
    let baseName = key.split('_')[1]
    if (baseName !== this.baseCurrency) continue
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].currency !== targetName) continue
      this.accounts[i].appraisement = this.accounts[i].mainTotal * data[key][4]
      break
    }
  }
  // 特殊处理，如果是基础货币
  for (let i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].currency !== this.baseCurrency) continue
    this.accounts[i].appraisement = this.accounts[i].mainTotal
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
  this.priceReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
  // 记录最近的price
  this.currentPrice = data
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)
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
  if (!data) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  this.getAccounts()
}
// 获取币种失败
root.methods.error_getCurrency = function (err) {
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
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  // 关闭loading
  this.currencyReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
}
// 获取账户信息失败
root.methods.error_getAccount = function (err) {
}


// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}
// 弹出绑定身份，跳转到实名认证界面
root.methods.goToBindIdentity = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'authenticate'})
}
// 去绑定谷歌验证
root.methods.goToBindGA = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'bindGoogleAuthenticator'})
}
// 去绑定手机号
root.methods.goToBindMobile = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'bindMobile'})
}
// 去绑定邮箱
root.methods.goToBindEmail = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'bindEmail'})
}

/*---------- 打开划转  begin ----------*/
// 打开划转
root.methods.openTransfer = function (index, item) {
  // if (item.currency !=='USDT' && this.serverT < item.withdrawOpenTime) {
  //   this.popupPromptOpen = true
  //   this.popupPromptText = this.$t('TransferIsNotOpen')
  //   this.popupPromptType = 0
  //   return
  // }
  //
  // if (item.withdrawDisabled) {
  //   this.popupPromptOpen = true
  //   this.popupPromptText = this.$t('TransferIsNotOpen')
  //   this.popupPromptType = 0
  //   return
  // }

  // 如果没有实名认证不允许打开划转
  if (!this.bindIdentify) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popWindowOpen = true
    return
  }

  // 如果没有绑定邮箱，不允许打开划转
  if (!this.bindEmail) {
    this.popWindowTitle = this.$t('bind_email_pop_title')
    this.popWindowPrompt = this.$t('bind_email_pop_article')
    this.popWindowStyle = '3'
    this.popWindowOpen = true
    return
  }

  // 如果没有绑定谷歌或手机，不允许打开划转
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }


  //todo 修改密码后不能提现


  // this.recharge = false
  // this.transferss = false
  // this.activeIndex !== index && (this.withdrawals = true)
  // if (this.activeIndex === index) {
  //   this.withdrawals = !this.withdrawals
  //   if (this.withdrawals === false) {
  //     this.activeIndex = -1
  //     return
  //   }
  // }
  this.popWindowOpen1 = true

  // 主流账户可用余额
  // this.transferCurrencyOTCAvailable = item.mainAvailable
  this.transferCurrencyMainAvailable = item.mainAvailable
  // 我的钱包可用余额
  this.transferCurrencyAvailable = item.available
  this.itemInfo = item
  this.currencyValue = this.itemInfo.currency
  // 再次打开清空输入框
  this.amountInput = ''
  this.transferAmountWA = ''
}

// 划转弹窗关闭
root.methods.popWindowClose1 = function () {
  // this.popWindowOpen1 = false
  this.click_rel_em()
}

//切换我的钱包和币币账户
root.methods.changeAssetAccountType = function () {
  this.assetAccountType = this.assetAccountType == 'wallet' ? 'currency':'wallet'
}

// 关闭划转弹窗
root.methods.click_rel_em = function () {
  this.popWindowOpen1 = false
}

root.methods.changeTransferCurrency = function (currency){

  console.info('changeTransferCurrency==============',currency)
  // this.itemInfo = val
  this.transferCurrencyAvailable = this.transferCurrencyObj[currency].available || 0;
}

// 判断划转数量
root.methods.testTransferAmount  = function () {
  if (this.$globalFunc.testSpecial(this.amountInput)) {
    this.transferAmountWA = this.$t('transferAmountWA1')
    return false
  }
  // if (this.amountInput == '0') {
  //   this.transferAmountWA = this.$t('transferAmountWA2')
  //   return false
  // }

  if(this.assetAccountType == ' currency'){
    if (Number(this.amountInput) > Number(this.transferCurrencyAvailable)) {
      this.transferAmountWA = this.$t('transferAmountWA3')
      return false
    }
    return true
  }
  if(this.assetAccountType == 'wallet'){
    if (Number(this.amountInput) > Number(this.transferCurrencyMainAvailable)) {
      this.transferAmountWA = this.$t('transferAmountWA3')
      return false
    }
    return true
  }

  if (Number(this.amountInput) <= 0) {
    this.amountInput = 0
    this.transferAmountWA = this.$t('transferAmountWA4')
    return false
  }
  return true
}

// 可以提交
root.methods.canCommit = function () {
  let canSend = true
  canSend = this.testTransferAmount() && canSend
  if (this.currencyValue === '') {
    this.transferCurrencyWA = this.$t('transferCurrencyWA')
    return canSend = false
  }
  if (this.amountInput === '') {
    this.transferAmountWA = this.$t('transferAmountWA')
    return canSend = false
  }
  return canSend
}

// 划转提交
root.methods.transferCommit = function () {
  if (this.sending) return
  if (!this.canCommit()) {
    return
  }
  this.sending = true
  // this.popupPromptType = 2
  // this.popupPromptOpen = true
  this.$http.send('POST_TRANSFER_SPOT', {
    bind: this,
    params: {
      currency: this.currencyValue,
      amount: this.amountInput,
      transferFrom: this.assetAccountType == 'wallet' ? 'BINANCE':'WALLET',
      transferTo: this.assetAccountType != 'wallet' ? 'BINANCE':'WALLET'
    },
    callBack: this.re_transferCommit,
    errorHandler: this.error_transferCommit
  })
}
// 划转回调
root.methods.re_transferCommit = function (data){
  console.log('发送成功====================')
  this.sending = false
  typeof data === 'string' && (data = JSON.parse(data))
  this.popupPromptOpen = true
  this.popupPromptType = 0
  if( data.errorCode ){
    data.errorCode == 1 &&  (this.popupPromptText = '用户未登录')
    data.errorCode == 2 &&  (this.popupPromptText = '数量错误')
    data.errorCode == 3 &&  (this.popupPromptText = '系统账户不存在')
    data.errorCode == 4 &&  (this.popupPromptText = '余额不足')
  }
  if(data.errorCode == 0) {
    this.popupPromptText = '划转成功'
    this.popupPromptType = 1
    setTimeout(() => {
      this.popupPromptOpen = true
    }, 1000)
  }
  this.popWindowOpen1 = false
}
//划转错误回调
root.methods.error_transferCommit = function (err){
  console.log(err)
  this.sending = false
}

// 点击全提
root.methods.allMention = function () {
  if( this.assetAccountType == 'wallet'){
    this.amountInput = this.transferCurrencyMainAvailable
    return
  }
  this.amountInput = this.transferCurrencyAvailable
}
/*---------- 打开划转  end ----------*/

// 关闭toast弹窗
root.methods.closePopupPrompt = function () {
  this.popupPromptOpen = false
}

// // 关闭充值地址变更的弹窗提示
// root.methods.closeRechargeAddressChangePrompt = function () {
//   this.rechargeAddressChangePrompt = false
// }

//判断充值按钮能否打开
root.methods.rechargeFlag = function (item) {
  let currencyObj = this.$store.state.currency.get(item.currency)
  let rechargeOpenTime = currencyObj && currencyObj.rechargeOpenTime
  //只有当USDT MONI类型未开放提现时才判断USDT2是否开放，当两个都未开放时才拦截
  if(item.currency == 'USDT' && (currencyObj && !currencyObj.depositEnabled)){
    let currencyUSDT2 = this.$store.state.currency.get('USDT2')
    if(currencyUSDT2 && !currencyUSDT2.depositEnabled)return false
  }
  if(item.currency != 'USDT' && rechargeOpenTime && this.serverT < rechargeOpenTime)return false
  return true
}

//判断提现按钮能否打开
root.methods.withdrawalsFlag = function (item) {
  let currencyObj = this.$store.state.currency.get(item.currency)
  let withdrawOpenTime = currencyObj && currencyObj.withdrawOpenTime
  //只有当USDT MONI类型未开放提现时才判断USDT2是否开放，当两个都未开放时才拦截
  if(item.currency == 'USDT' && (currencyObj && !currencyObj.withdrawEnabled)){
    let currencyUSDT2 = this.$store.state.currency.get('USDT2')
    if(currencyUSDT2 && !currencyUSDT2.withdrawEnabled)return false
  }
  if(item.currency != 'USDT' && withdrawOpenTime && this.serverT < withdrawOpenTime)return false
  return true
}

/*-------------- 鼠标移入什么是划转，展示具体信息  begin------------------*/
root.methods.closeWhatTransfer= function () {
  $(".transfer-explain").attr("style","display:none");
}
root.methods.openWhatTransfer = function () {
  $(".transfer-explain").attr("style","display:block");
}
/*-------------- 鼠标移入什么是划转，展示具体信息  end------------------*/

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

export default root