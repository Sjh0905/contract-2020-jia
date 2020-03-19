const root = {}
root.name = 'MyWallet'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'RechargeAndWithdrawalsRecharge': resolve => require(['../vue/AssetPageRechargeAndWithdrawalsRecharge'], resolve),
  'RechargeAndWithdrawalsWithdrawals': resolve => require(['../vue/AssetPageRechargeAndWithdrawalsWithdrawals'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
  'PopPublic': resolve => require(['../vue/PopPublic'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    // 默认为erc20

    loading: true,
    popWindowOpen: false, //弹窗开关
    popWindowOpen2: false, //弹窗开关

    activeIndex: -1, //激活
    recharge: false,
    withdrawals: false,
    transferFlage:false,
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

    popWindowPrompt1: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定


    // 点击确认下单时
    submitBtnAjaxFlag: false,
    buyCommitToastOpen: false,
    buyTransferDetails: false,
    buyConfirmSuccess: false,//转账成功

    goToConfirmsjh:false,

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

    // 转账邮箱
    name_0:'',
    nameWA_0:'',
    // 转账UID
    testUID:'',
    testUID_0:'',
    testNumWA_0:'',
    testUID_012:'',
    // testUIDMag_0:'',
    // 转账数量
    testNum:'',
    testNum_0:'',

    name:'',//转账名字
    toUserId:'', // 收款人ID

    currencyName: '', //当前货币币种
    pswPlaceholderShow: true,
    verificationCodePlaceholderShow: true,
    isTransfer: true,//是否可以转账 false 为可以转账

    transferCurrency: '',
    feeRate: 0, //费率
    maxAmount: 500, //最高费率
    minAmount: 0, //最低数量
    minimumFee: 0, //最低费率
    userNamePlaceholderShow: true,
    bindPicked: 0, //0表示谷歌验证
    popWindowStep: 1, //1表示邮箱验证，2表示下一步验证
    popWindowLoading: false,//popWindow正在提交

    popText: '系统繁忙',
    popOpen: false,//错误弹框是否开启
    emailVerificationCode: '',//验证码
    emailVerificationCodeWA: '', //验证码错误提示
    emailVerificationSending: false,//邮箱验证发送中

    getEmailVerificationCodeInterval: null, //获取邮箱验证码倒计时container
    getEmailVerificationCodeCountdown: 60,  //获取邮箱验证码倒计时
    getEmailVerificationCode: false, //是否点击了获取邮箱验证码倒计时


    getMobileVerificationCodeInterval: null, //获取手机验证码倒计时container
    getMobileVerificationCodeCountdown: 60, //获取手机验证码倒计时
    getMobileVerificationCode: false, //获取手机验证码倒计时
    // 内部划转页面弹窗
    popWindowOpen1:false,
    assetAccountType:'wallet',//当前账户类型,默认显示我的钱包
    // bibiAccount:'币币账户',
    // account:'我的钱包',
    itemInfo:{
      currency:''
    },

    currencyValue:'',// 输入框币种信息
    transferCurrencyWA:'',// 币种错误提示
    amountInput:'',// 输入框划转的数量
    transferAmountWA:'',// 数量错误提示
    transferCurrencyAvailable:0,
    transferCurrencyObj:{},
    sending:false



  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.$store.commit('changeJoinus', false);
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
  console.log(this.currency)
  // 获取账户信息
  this.getAccounts()

  // 如果已经cookies记录的弹出过，则不弹出，如果没有，弹窗，并记录
  if (!this.$cookies.get('rechargeAddressChanged')) {
    this.$cookies.set('rechargeAddressChanged', true, 60 * 60 * 6)
    this.rechargeAddressChangePrompt = true
  }
}

root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

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

// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
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
    total = this.accAdd(total, this.accounts[i].appraisement)
  }
  return this.toFixed(total)
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
  }
  return this.toFixed(available)
}

// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  // 特殊处理
  if (this.hideZeroAsset) {
    return this.accounts.filter((val,inx) => {
      val.currencyKey = val.currency+'-'+inx;
      this.transferCurrencyObj[val.currency] = val;
      return val.total !== 0
    })
  }

  this.accounts.map((val,inx) => {
    val.currencyKey = val.currency+'-'+inx;
    // val.currency == 'USDTK' && console.log(JSON.stringify(val))
    // console.log(JSON.stringify(val.id))
    this.transferCurrencyObj[val.currency] = val;
  })
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

/*------------------------------ 观察 -------------------------------*/
root.watch = {}

// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
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

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

// 计算币种对USDT的估值
root.methods.USDTAppraisement = function (item) {
  // console.log('item======',item)
  let currency = item.currency
  let appraisement = item.appraisement // 对BTC的估值
  let total = item.total
  if (!total && !appraisement) return 0;
  if (currency == "USDT" || currency == "YY")return this.$globalFunc.accFixedCny(total, 2);

  let rate = this.exchangeRate || 0; // BTC_USDT 的价格
  return this.$globalFunc.accFixedCny((appraisement * rate), 2)
}

root.methods.isERC20 = function () {
  let currencyObj = this.$store.state.currency.get(this.currency)
  // return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
  return currencyObj && (this.currency == "USDT" && this.selectTab == 2) ? "USDT2" : this.currency;
}

// // 划转输入框交换位置
// root.methods.changeAccount = function () {
//   let empty = ''
//   empty = this.bibiAccount
//   this.bibiAccount = this.account
//   this.account = empty
// }

//切换我的钱包和币币账户
root.methods.changeAssetAccountType = function () {
  this.assetAccountType = this.assetAccountType == 'wallet' ? 'currency':'wallet'
};

// 打开划转
root.methods.openTransfer = function (index, item) {
  console.log(item)
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

  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.popWindowTitle = this.$t('bind_email_pop_title')
    this.popWindowPrompt = this.$t('bind_email_pop_article')
    this.popWindowStyle = '3'
    this.popWindowOpen = true
    return
  }

  // 如果没有绑定谷歌或手机，不允许打开提现
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }


  //todo 修改密码后不能提现


  this.recharge = false
  this.transferss = false
  this.withdrawals = false
  this.activeIndex !== index && (this.transferFlage = true)
  if (this.activeIndex === index) {
    this.transferFlage = !this.transferFlage
    if (this.transferFlage === false) {
      this.activeIndex = -1
      return
    }
  }
  this.popWindowOpen1 = true
  this.transferCurrencyAvailable = item.available
  this.itemInfo = item
  this.currencyValue = this.itemInfo.currency
  // 再次打开清空输入框
  this.amountInput = ''
  this.transferAmountWA = ''

}


root.methods.errorHandler = function (err, state, text) {
  console.error('数据出错！', err, state, text)
}

root.methods.changeTransferCurrency = function (currency){
  console.log('changeTransferCurrency==============',currency)
  // this.itemInfo = val
  this.transferCurrencyAvailable = this.transferCurrencyObj[currency].available || 0;
}

// 点击全提
root.methods.allMention = function () {
  this.amountInput = this.transferCurrencyAvailable
}

root.methods.popWindowClose_transfer = function () {
  // this.popWindowOpen1 = false
  this.click_rel_em()
}

root.methods.click_rel_em = function () {
  this.popWindowOpen1 = false
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
  if (this.amountInput > this.transferCurrencyAvailable) {
    this.transferAmountWA = this.$t('transferAmountWA3')
    return false
  }
  if (this.amountInput <= '0') {
    this.amountInput = '0'
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
  // if (this.amountInput === '0') {
  //   this.transferAmountWA = this.$t('transferAmountWA2')
  //   canSend = false
  // }
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

  // if (this.sending) return
  // let canSend = true
  // canSend = this.testTransferAmount() && canSend
  // this.testTransferAmount()
  // if (this.currencyValue === '') {
  //   this.transferCurrencyWA = this.$t('transferCurrencyWA')
  //   canSend = false
  // }
  // if (this.amountInput == '') {
  //   this.transferAmountWA = this.$t('transferAmountWA')
  //   canSend = false
  // }
  // if (this.amountInput == '0') {
  //   this.transferAmountWA = this.$t('transferAmountWA2')
  //   canSend = false
  // }
  //
  // if (!canSend) {
  //   // console.log("不能发送！")
  //   return
  // }
  this.$http.send('POST_TRANSFER_SPOT', {
    bind: this,
    params: {
      currency: this.currencyValue,
      amount: this.amountInput,
      system: this.assetAccountType == 'wallet' ? 'SPOTS':'WALLET'
    },
    callBack: this.re_transferCommit,
    errorHandler: this.error_transferCommit
  })

  // this.popWindowOpen1 = false
}
// 划转回调
root.methods.re_transferCommit = function (data){
  console.log('发送成功====================')
  this.sending = false
  typeof data === 'string' && (data = JSON.parse(data))
  console.log(data.errorCode)

  if( data.errorCode ){
    data.errorCode == 1 &&  (this.popupPromptText = '用户未登录')
    data.errorCode == 2 &&  (this.popupPromptText = '划转金额小于零')
    data.errorCode == 3 &&  (this.popupPromptText = '收款账户系统不存在')

    this.popupPromptOpen = true
    this.popupPromptType = 0

    setTimeout(() => {
          this.popupPromptOpen = true
        }, 100)
        // console.log('用户登录')
  }

  this.popupPromptOpen = true
  this.popupPromptType = 0
  this.popupPromptText = '划转成功'
  this.popWindowOpen1 = false



  // if(data.errorCode === 1) {
  //   this.popupPromptOpen = true
  //   this.popupPromptType = 0
  //   this.popupPromptText = '用户未登录'
  //     // this.$t('popText3')
  //   setTimeout(() => {
  //     this.popupPromptOpen = true
  //   }, 100)
  //   console.log('用户登录')
  // }
  // if(data.errorCode === 2) {
  //   this.popupPromptOpen = true
  //   this.popupPromptType = 0
  //   this.popupPromptText = '划转金额小于零'
  //   // this.$t('popText3')
  //   setTimeout(() => {
  //     this.popupPromptOpen = true
  //   }, 100)
  //   console.log(' 划转金额小于零')
  // }
  // if(data.errorCode === 3) {
  //   this.popupPromptOpen = true
  //   this.popupPromptType = 0
  //   this.popupPromptText = '收款账户系统不存在'
  //   // this.$t('popText3')
  //   setTimeout(() => {
  //     this.popupPromptOpen = true
  //   }, 100)
  //   console.log(' 收款账户系统不存在')
  // }


}
//划转错误回调
root.methods.error_transferCommit = function (err){
  console.log(err)
  this.sending = false
}

// 判断是否可以转账
root.methods.transferDisabledss = function (transferCurrency) {
  this.$http.send('GET_TRANSFER_AMOUNT_INFO',{
    bind: this,
    query:{
      currency:transferCurrency
    },
    callBack: this.re_transferDisabled,
    errorHandler: this.error_transferDisabled
  })
  // this.currencyTitle = this.$route.query.currency
}
root.methods.re_transferDisabled = function (data) {
  console.log(data)
  // console.log(this.currencyName)
  // 是否可以转账 false 为可以转账
  this.isTransfer = data.dataMap.insideTransferAccount.transferDisabled
  // 提现费率
  this.feeRate = data.dataMap.insideTransferAccount.feeRate
  // 最大转账数量
  this.maxAmount = data.dataMap.insideTransferAccount.maxAmount
  // 最小转账数量
  this.minAmount = data.dataMap.insideTransferAccount.minAmount //+ data.dataMap.withdrawRule.minimumFee
  // 最小手续费
  this.minimumFee = data.dataMap.insideTransferAccount.minimumFee

  // 获取费率成功
  this.feeReady = true

  if (this.isTransfer == true) {
    this.popupPromptText = this.$t('withdrawalsIsNotOpen')
    this.popWindowClose = false
    this.popWindowOpen2 = false
    this.popupPromptOpen = true

    this.popupPromptType = 0

    return
  }
}
root.methods.error_transferDisabled = function (error) {
  console.log(error)
}

// 内部转账弹窗
root.methods.buyCommitToastClose = function () {
  this.popWindowOpen2 = false
  this.buyCommitToastOpen = false
}
// 确认转账细节
root.methods.buyTransferDetailsClose = function () {
  this.buyTransferDetails = false
}
//转账成功
root.methods.buyConfirmSuccessClose = function () {
  this.buyConfirmSuccess = false
}

// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  // alert(type);
  if(type == 'userName'){
    this.userNamePlaceholderShow = false;
  }

  if(type == 'psw'){
    this.pswPlaceholderShow = false;
  }

  if(type == 'verificationCode'){
    this.verificationCodePlaceholderShow = false;
  }

  if(type == 'pswConfirm'){
    this.pswConfirmPlaceholderShow = false;
  }

  if(type == 'referee'){
    this.refereePlaceholderShow = false;
  }


}

// 判断UID
root.methods.testUID_01 = function () {
  this.testUID_012 = '0'
  if (this.testUID_0 === '') {
    this.testUIDMsg_0 = this.$t('testUIDMsg_0')
    return false
  }
  if (!this.$globalFunc.testNumber(this.testUID_0)) {
    this.testUIDMsg_0 = this.$t('testUIDMsg_1')
    return false
  }
  this.testUIDMsg_0 = ''
  return true
}

// 判断转账数量
root.methods.testNum_01 = function () {
  this.testNumWA_0 = '0'
  if (this.testNum_0 === '') {
    this.testNumMsg_0 = this.$t('testNumMsg_0')
    return false
  }
  if (this.$globalFunc.testSpecial(this.testNum)) {
    this.testNumMsg_0 = this.$t('nameMsg_1')
    return false
  }
  if ((this.testNum_0) < this.minAmount) {
    this.testNumMsg_0 = this.$t('testNumMsg_03')
    return false
  }
  // if (this.testNum_0 > this.maxAmount) {
  //   this.testNumMsg_0 = this.$t('testNumMsg_04')
  //   return false
  // }
  this.testNumMsg_0 = ''
  return true
}

// 判断邮箱
root.methods.testName_0 = function () {
  this.nameWA_0 = '0'
  if (this.name_0 === '') {
    this.nameMsg_0 = this.$t('nameMsg_0')
    return false
  }
  if (!this.$globalFunc.emailOrMobile(this.name_0)) {
    this.nameMsg_0 = this.$t('nameMsg_1')
    return false
  }
  this.nameMsg_0 = ''
  return true
}

// 判断输入用户
// root.methods.testUserName = function () {
//
//   this.userNamePlaceholderShow = true
//
//   /*let userNameFlag = this.$globalFunc.testEmail(this.userName);
//   let mobileFlag = this.$globalFunc.testMobile(this.userName);*/
//
//   if (this.userName === '') {
//     this.userNameWA = ''
//     return true
//   }
//   if (!this.$globalFunc.testMobile(this.userName)) {
//     this.userNameWA = this.$t('register.userNameWA_0_M')
//     // this.userNameWA = '请输入正确的手机号'
//     return false
//   }
//   if (!this.$globalFunc.testEmail(this.userName)) {
//     this.userNameWA = this.$t('register.userNameWA_0')
//     return false
//   }

  /*//如果既不是邮箱格式也不是手机格式
  if (!userNameFlag && !mobileFlag) {
    this.userNameWA = this.$t('register.userNameWA_0')
    return false
  }

  //如果是手机
  mobileFlag && (this.registerType = 0)
  //如果是邮箱
  userNameFlag && (this.registerType = 1)*/

//   this.userNameWA = ''
//   return true
// }



//sss 打开内部转账
root.methods.internalTransfer = function (index, item) {
  this.transferCurrency = item.currency
  this.transferDisabledss(item.currency)

  console.log('item.currency=========================', item.currency)
  this.transferCurrency = item.currency

  //sss屏蔽 2020.20.20 S

  // if (this.isTransfer == true) {
  //   this.popWindowOpen = false
  //   this.popupPromptOpen = true
  //   this.popupPromptText = this.$t('withdrawalsIsNotOpen')
  //   this.popupPromptType = 0
  //   return
  // }

  // 如果没有实名认证不允许打开转账
  // if (!this.bindIdentify) {
  //   this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
  //   this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
  //   this.popWindowPrompt1 = ''
  //   this.popWindowStyle = '0'
  //   this.popWindowOpen = true
  //   return
  // }
  // 如果没有绑定邮箱，不允许打开转账
  // if (!this.bindEmail) {
  //   this.popWindowTitle = this.$t('bind_email_pop_title')
  //   this.popWindowPrompt = this.$t('bind_email_pop_article')
  //   this.popWindowPrompt1 = ''
  //   this.popWindowStyle = '3'
  //   this.popWindowOpen = true
  //   return
  // }
  //
  // // 如果没有绑定谷歌或手机，不允许打开提现
  // if (!this.bindGA && !this.bindMobile) {
  //   this.popWindowTitle = this.$t('popWindowTitleWithdrawalsneibu')
  //   this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
  //   this.popWindowPrompt1 = ''
  //   this.popWindowStyle = '1'
  //   this.popWindowOpen = true
  //   return
  // }

  //sss屏蔽 2020.20.20 E


  // if (this.bindIdentify && this.isTransfer == false) {
    this.popWindowTitle = this.$t('iKnowthe1')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals1')
    this.popWindowPrompt1 = this.$t('popWindowPromptWithdrawals2')
    this.popWindowStyle = '5'
    this.popWindowOpen2 = true
  // }

  this.recharge = false
  this.withdrawals = false
  this.transferFlage = false
  this.activeIndex !== index && (this.transferss = true)
  if (this.activeIndex === index) {
    this.transferss = !this.transferss
    if (this.transferss === false) {
      this.activeIndex = -1
      return
    }
  }
  this.activeIndex = index

  return
}

//我已知晓，继续转账按钮
//sss 屏蔽
root.methods.goToBindTransfer = function () {
  this.popWindowOpen = false
  this.buyCommitToastOpen = true;
}
//sss 屏蔽

//确认转账按钮 （详情）
root.methods.goToConfirm = function () {
  this.buyTransferDetails = false
  this.buyConfirmSuccess = false
  this.buyCommitToastOpen = false
  this.goToConfirmsjh = true
}
//确认转账按钮 上一步
root.methods.popWindowClose1 = function () {
  this.popWindowOpen = false
  this.buyCommitToastOpen = true
  this.buyTransferDetails = false
}

//内部转账 验证码弹框
root.methods.goToConfirmsjhclose = function () {
  this.goToConfirmsjh = false
  this.popWindowOpen = false
  // this.clearPopWindow()
  this.sending = false
  this.buyTransferDetails = true
}

//内部转账 第一步确认转账按钮getGoToConfirmTransfer
root.methods.getGoToConfirmTransfer = function () {
  //sss 要删除 S
  // this.name = data.dataMap.UserProfile.name
  // this.popWindowOpen = false
  // this.buyCommitToastOpen = false
  // this.buyTransferDetails = true
  //sss 要删除 E
  // this.buyTransferDetails = true
  // this.buyCommitToastOpen = false

  //sss 屏蔽 S
  let canSend = true
  canSend = this.testName_0() && canSend
  canSend = this.testUID_01() && canSend
  canSend = this.testNum_01() && canSend

  // if (this.idCode_0 === '') {
  //   this.idCodeMsg_0 = this.$t('idCodeMsg_0_1')
  //   canSend = false
  // }
  if (!this.$globalFunc.testEmail(this.name_0)) {
    this.nameMsg_0 = this.$t('registerUserNameWA_0')
    canSend = false
  }
  if (this.name_0 === '') {
    this.nameMsg_0 = this.$t('nameMsg_0')
    canSend = false
  }
  if (this.testUID_0 === '') {
    this.testUIDMsg_0 = this.$t('testUIDMsg_0')
    canSend = false
  }
  if (this.testNum_0 === '') {
    this.testNumMsg_0 = this.$t('testNumMsg_0')
    canSend = false
  }
  if (this.testNum_0 < this.minAmount) {
    this.testNum_0 = this.minAmount
    this.testNumMsg_0 = this.$t('testNumMsg_03')
    canSend = false
  }
  if (this.testNum_0 > this.maxAmount) {
    this.testNum_0 = this.maxAmount
    this.testNumMsg_0 = this.$t('testNumMsg_04')
    canSend = false
  }
  if (!canSend) {
    // console.log("不能发送！")
    return false
  }
  // // console.log('55555555555555555555555555555555',this.name_0,this.testUID_0,this.testNum_0)

  this.$http.send('GET_VERIFYIDENTITY_USER',{
    bind: this,
    params:{
      email:this.name_0,
      userId:this.testUID_0,
      username:this.name
    },
    callBack: this.re_getGoToConfirmTransfer,
    errorHandler: this.error_getGoToConfirmTransfer,
  })

  // console.log('888888888888',this.name_0,this.testUID_0,data)

  //sss 屏蔽 E

}

//sss 屏蔽 S

root.methods.re_getGoToConfirmTransfer = function(data){
  typeof data === 'string' && (data = JSON.parse(data))
  this.name = data.dataMap.userProfile.name
  this.toUserId = data.dataMap.userProfile.userId
  console.log(data)
  // console.log('data==================',data.dataMap.UserProfile.name)
  // console.log(this.name_0,this.testUID_0)
  // console.log('resDataMap==================ggggggggg=',data)
  if (data.errorCode) {
    if (data.errorCode == 1) {
      this.popupPromptOpen = true
      this.buyTransferDetails = false
      this.popupPromptText = this.$t('emailVerificationCodeWA_1') // 用户未登录
      this.popupPromptType = 0
      return
    }
    if (data.errorCode == 2) {
      this.popupPromptOpen = true
      // this.buyTransferDetails = false
      this.popupPromptText = this.$t('step2VerificationCodeWA_10')  //收款人不存在
      this.popupPromptType = 0
      return
    }
    if (data.errorCode == 3) {
      this.popupPromptOpen = true
      this.buyTransferDetails = false
      this.popupPromptText =this.$t('step2VerificationCodeWA_UID') // 传入用户邮箱和传入UID不是同一人
      this.popupPromptType = 0
      return
    }
    if (data.errorCode == 4) {
      this.popupPromptOpen = true
      this.buyTransferDetails = false
      this.popupPromptText = this.$t('step2VerificationCodeWA_Authentication')  //转账用户未进行实名认证'
      this.popupPromptType = 0
      return
    }
    if (data.errorCode == 5) {
      this.popupPromptOpen = true
      this.buyTransferDetails = false
      this.popupPromptText = this.$t('step2VerificationCodeWA_receiving')  //收款用户未进行实名认证'
      this.popupPromptType = 0
      return
    }
    if (data.errorCode == 6) {
      this.popupPromptOpen = true
      this.buyTransferDetails = false
      this.popupPromptText = this.$t('step2VerificationCodeWA_incoming')  // 没有传入用户邮箱或UID
      this.popupPromptType = 0
      return
    }
    if (data.errorCode == 7) {
      this.popupPromptOpen = true
      this.buyTransferDetails = false
      this.popupPromptText = '收款用户不能转账用户相同'
      this.popupPromptType = 0
      return
    }
    return
  }

  this.popWindowOpen2 = false
  this.buyCommitToastOpen = false
  this.buyTransferDetails = true

}

root.methods.error_getGoToConfirmTransfer = function(data){
  console.log('resDataMap=========rrrrr=========ggggggggg=',data)
}

//sss 屏蔽 E

//查看转账记录
root.methods.goToTransferRecord = function () {
  this.buyConfirmSuccess = false
  this.$router.push({name: 'transferRecord'})
}

// 表单验证，邮箱验证码
root.methods.testEmailVerification = function () {
  if (this.emailVerificationCode === '') {
    this.emailVerificationCodeWA = ''
    return false
  }
  // this.emailVerificationCodeWA = ''
  return true
}
// 表单验证，手机验证码
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


// 提交邮箱验证
root.methods.commitEmailVerification = function (data) {
  let canSend = true
  canSend = this.testEmailVerification() && canSend
  if (this.emailVerificationCode === '') {
    this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_4')
    canSend = false
  }
  if (!canSend) {
    // console.warn('不能发送')
    return false
  }

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      // type: 'email',
      // purpose: 'transfer',
      // code: this.emailVerificationCode,
      type:'email',
      // this.picker == 1 ? 'ga' : 'mobile',
      examinee:'',
      purpose: 'transfer',
      code: this.emailVerificationCode,
      //this.step2VerificationCode
      currency: this.transferCurrency,  // TODO：这里要切换币种
      toEmail:this.name_0,
      toUserId:this.userId,
      amount: parseFloat(this.testNum_0),
      fee: 0,
    },
    callBack: this.re_commitEmailVerification,
    errorHandler: this.error_commitEmailVerification
  })

  // typeof data === 'string' && (data = JSON.parse(data))
  // this.popWindowLoading = false
  // this.step2VerificationSending = false

  // let resDataMap = data.dataMap
  console.log('resDataMap==================ggggggggg=',data)


  //
  // if (data.errorCode === 0) {
  //   this.popWindowStep = 2
  //   this.popWindowLoading = true
  //   this.emailVerificationSending = true
  //
  // }

  // this.popWindowStep = 2
  // this.popWindowLoading = true
  // this.emailVerificationSending = true

}

// 提交邮箱验证成功
root.methods.re_commitEmailVerification = function (data) {
  console.log('...........',data)
  // typeof data === 'string' && (data = JSON.parse(data))

  // let resDataMap = data.dataMap;

  // this.popWindowLoading = false
  // this.emailVerificationSending = false
  if (data.errorCode) {
    if (data.errorCode === 1) {
      this.emailVerificationSending = false
      this.popupPromptText = this.$t('iKnowthe2')
      this.popupPromptType = 0
      this.popupPromptOpen = true
    }
    if (data.errorCode === 2) {
      this.emailVerificationSending = false
      this.popupPromptText = this.$t('iKnowthe3')
      this.popupPromptType = 0
      this.popupPromptOpen = true
    }
    if (data.errorCode === 3) {
      this.emailVerificationSending = false
      this.popupPromptText = this.$t('iKnowthe4')
      this.popupPromptType = 0
      this.popupPromptOpen = true
    }
    if (data.errorCode === 4) {
      this.emailVerificationSending = false
      this.popupPromptText = this.$t('iKnowthe5')
      this.popupPromptType = 0
      this.popupPromptOpen = true
    }
    // this.popWindowStep = 2
    // this.popWindowLoading = true
    // this.emailVerificationSending = true
    // if (data.errorCode === 0) {
    //   this.popWindowStep = 2
    //   this.popWindowLoading = true
    //   this.emailVerificationSending = true
    // }
    return
  }
  this.popWindowStep = 2
  this.popWindowLoading = false
  this.emailVerificationSending = true
}
// 提交邮箱验证失败
root.methods.error_commitEmailVerification = function (err) {
  // console.warn('提交邮箱验证码失败', err)
  // this.popWindowLoading = false
  // this.emailVerificationSending = false
  // // this.popOpen = false
  // this.popText = this.$t('popText_1')
  // this.popType = 0
  // this.popOpen = true
}


// 获取邮箱验证码
root.methods.getEmailVerification = function () {
  // if (this.getEmailVerificationCode) {
  //   return
  // }
  // let isERC20 = this.isERC20();
  // let currency = this.currency == "USDT" ? isERC20 : this.currency
    let params = {
      type: 'email',
      purpose: 'transfer',
      // transferTime: this.formatDateUitl(this.serverT),
      num:'',
      currency: this.transferCurrency,
      amount: parseFloat(this.testNum_0),
      toEmail: this.name_0,
      toUserId: this.toUserId
    }
  console.log('params===========',params)
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params:params,
    callBack: this.re_getEmailVerification,
    errorHandler: this.error_getEmailVerification,
  })

  this.getEmailVerificationCodeCountdown = 60
  this.getEmailVerificationCode = true
  this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
  this.getEmailVerificationCodeInterval = setInterval(() => {
    this.getEmailVerificationCodeCountdown--
    if (this.getEmailVerificationCodeCountdown < 0) {
      this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
      this.getEmailVerificationCodeCountdown = 60
      this.getEmailVerificationCode = false
    }
  }, 2000)
}
// 获取邮箱验证码
root.methods.re_getEmailVerification = function (data) {
  console.log(data.dataMap.code)
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('获取邮箱验证码==============',data)
  if (data.errorCode) {
    data.errorCode === 5 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_5'))
    data.errorCode === 1 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_1'))
    data.errorCode === 2 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_2'))
    data.errorCode === 3 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_3'))
    data.errorCode === 6 && (this.emailVerificationCodeWA = '收款账户不存在')
    data.errorCode === 0 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_0'))

    this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
    this.getEmailVerificationCodeCountdown = 60
    this.getEmailVerificationCode = false
    this.emailVerificationCode = data.dataMap.code
  }
}
// 获取邮箱验证码出错
root.methods.error_getEmailVerification = function (err) {
  // console.warn('获取邮箱验证码出错', err)
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
      purpose: 'transfer',
      mun: '',
      currency: this.transferCurrency,
      amount: parseFloat(this.testNum_0),
      areaCode: this.step2VerificationCode,
      toEmail: this.name_0,
      toUserId: this.testUID_0
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
  }, 2000)
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
  if (!data.dataMap || !data.dataMap.currencys) {
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
  // console.warn('请求更新accounts', data.accounts)
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  // 关闭loading
  this.currencyReady = true
  this.loading = !(this.currencyReady && this.authStateReady)

}
// 获取账户信息失败
root.methods.error_getAccount = function (err) {
  // console.warn("获取账户内容失败", err)
}


// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}

// 内部转账弹窗关闭
root.methods.popWindowClose2 = function () {
  this.popWindowOpen2 = false
}

// 弹框跳安全中心
root.methods.goToSecurityCenter = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'securityCenter'})
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


// 打开提现
root.methods.openWithdrawals = function (index, item) {

  if (item.currency !=='USDT' && this.serverT < item.withdrawOpenTime) {
    this.popupPromptOpen = true
    this.popupPromptText = this.$t('withdrawalsIsNotOpen')
    this.popupPromptType = 0
    return
  }

  if (item.withdrawDisabled) {
    this.popupPromptOpen = true
    this.popupPromptText = this.$t('withdrawalsIsNotOpen')
    this.popupPromptType = 0
    return
  }

  // 如果没有实名认证不允许打开提现
  if (!this.bindIdentify) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowStyle = '0'
    this.popWindowOpen = true
    return
  }

  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.popWindowTitle = this.$t('bind_email_pop_title')
    this.popWindowPrompt = this.$t('bind_email_pop_article')
    this.popWindowStyle = '3'
    this.popWindowOpen = true
    return
  }

  // 如果没有绑定谷歌或手机，不允许打开提现
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleWithdrawals')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }


  //todo 修改密码后不能提现


  this.recharge = false
  this.transferss = false
  this.transferFlage = false
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

// 打开充值
root.methods.openRecharge = function (index, item) {

  // 如果没有实名认证不允许打开充值
  // 充值取消实名认证的限制
  // if (!this.bindIdentify) {
  //   this.popWindowTitle = this.$t('popWindowTitleRecharge')
  //   this.popWindowPrompt = this.$t('popWindowPromptRecharge')
  //   this.popWindowStyle = '0'
  //   this.popWindowOpen = true
  //   return
  // }
  // 如果没有绑定邮箱，不允许打开充值
  if (!this.bindEmail) {
    this.popWindowTitle = this.$t('bind_email_pop_title')
    this.popWindowPrompt = this.$t('bind_email_pop_article')
    this.popWindowStyle = '3'
    this.popWindowOpen = true
    return
  }

  // 如果没有绑定谷歌或手机，不允许打开充值
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleRecharge')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaRecharge')
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }

  this.withdrawals = false
  this.transferss = false
  this.transferFlage = false
  this.activeIndex !== index && (this.recharge = true)
  if (this.activeIndex === index) {
    this.recharge = !this.recharge
    if (this.recharge === false) {
      this.activeIndex = -1
      return
    }
  }
  this.rechargeAddressChangePrompt = true
  this.activeIndex = index
}




// 关闭toast弹窗
root.methods.closePopupPrompt = function () {
  this.popupPromptOpen = false
}

// 关闭充值地址变更的弹窗提示
root.methods.closeRechargeAddressChangePrompt = function () {
  this.rechargeAddressChangePrompt = false
}

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

root.methods.closeWhatTransfer= function () {
  $(".transfer-explain").attr("style","display:none");
}

root.methods.openWhatTransfer = function () {
  $(".transfer-explain").attr("style","display:block");
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

export default root
