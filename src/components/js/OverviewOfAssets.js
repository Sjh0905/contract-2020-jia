const root = {}
root.name = 'OverviewOfAssets'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupT': resolve => require(['../vue/PopupT'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading: true,
    popWindowOpen: false, //弹窗开关
    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示

    popWindowPrompt1: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定

    priceReady: false,    //socket准备
    currencyReady: false, //currency准备，只有加载完全部的loading才会关闭！
    authStateReady: false, //认证状态准备

    // 币种集合
    accounts: [],
    // 内部划转页面弹窗
    popWindowOpen1:false,
    bibiAccount:'币币账户',
    account:'我的钱包',
    itemInfo:{
      currency:''
    },

    currencyValue:'',// 输入框币种信息
    transferCurrencyWA:'',// 币种错误提示
    amountInput:'',// 输入框划转的数量
    transferAmountWA:'',// 数量错误提示
    transferCurrencyAvailable:0,
    transferCurrencyObj:{},
    sending:false,

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // 获取验证状态
  this.getAuthState()
}

root.mounted = function () {}

root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 当前语言
root.computed.lang = function () {
  return this.$store.state.lang;
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

  console.log(this.accounts)
  return this.accounts
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

root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

/*------------------------------ 观察 -------------------------------*/
root.watch = {}

// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}


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
  // // 获取认证状态成功
  this.authStateReady = true
  this.loading = (this.currencyReady && this.authStateReady)
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  console.log('data================================',data)
  // 获取认证状态成功
  this.authStateReady = true
  this.loading = (this.currencyReady && this.authStateReady)
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
}

// 弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}

// 打开内部划转
root.methods.openTransfer = function () {


  // // 如果没有实名认证不允许打开划转
  if (!this.bindIdentify) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowPromptWithdrawals')
    this.popWindowPrompt1 = ''
    this.popWindowStyle = '0'
    this.popWindowOpen = true
    return
  }
  //
  // // // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.popWindowTitle = this.$t('bind_email_pop_title')
    this.popWindowPrompt = this.$t('bind_email_pop_article')
    this.popWindowPrompt1 = ''
    this.popWindowStyle = '3'
    this.popWindowOpen = true
    return
  }
  //
  // // 如果没有绑定谷歌或手机，不允许打开提现
  if (!this.bindGA && !this.bindMobile) {
    this.popWindowTitle = this.$t('popWindowTitleTransfer')
    this.popWindowPrompt = this.$t('popWindowTitleBindGaWithdrawals')
    this.popWindowPrompt1 = ''
    this.popWindowStyle = '1'
    this.popWindowOpen = true
    return
  }
  //
  // //todo 修改密码后不能提现
  //
  // // this.recharge = false
  // // this.transferss = false
  // // this.activeIndex !== index && (this.withdrawals = true)
  // // if (this.activeIndex === index) {
  // //   this.withdrawals = !this.withdrawals
  // //   if (this.withdrawals === false) {
  // //     this.activeIndex = -1
  // //     return
  // //   }
  // // }
  this.popWindowOpen1 = true

  // this.transferCurrencyAvailable = item.available
  // this.itemInfo = item
  // this.currencyValue = this.itemInfo.currency
}

// 划转输入框交换位置
root.methods.changeAccount = function () {
  let empty = ''
  empty = this.bibiAccount
  this.bibiAccount = this.account
  this.account = empty
}

root.methods.popWindowClose1 = function () {
  this.popWindowOpen1 = false
  // this.click_rel_em()
}

root.methods.click_rel_em = function () {
  this.popWindowOpen1 = false
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
// 判断划转数量
root.methods.testTransferAmount  = function () {
  if (this.$globalFunc.testSpecial(this.amountInput)) {
    this.transferAmountWA = this.$t('transferAmountWA1')
    return false
  }
  if (this.amountInput == '0') {
    this.transferAmountWA = this.$t('transferAmountWA2')
    return false
  }
  if (this.amountInput > this.transferCurrencyAvailable) {
    this.transferAmountWA = this.$t('transferAmountWA3')
    return false
  }
  if (this.amountInput <= '0') {
    this.amountInput = '0'
    this.transferAmountWA = this.$t('transferAmountWA4')
    return false
  }

  this.amountInput = ''
  return true
}
// 划转提交
root.methods.commit = function () {

  if (this.sending) return
  let canSend = true
  canSend = this.testTransferAmount() && canSend
  if (this.currencyValue === '') {
    this.transferCurrencyWA = this.$t('transferCurrencyWA')
    canSend = false
  }
  if (this.amountInput === '') {
    this.transferAmountWA = this.$t('transferAmountWA')
    canSend = false
  }
  if (this.amountInput === '0') {
    this.transferAmountWA = this.$t('transferAmountWA2')
    canSend = false
  }
  console.log('发送成功====================')
  if (!canSend) {
    // console.log("不能发送！")
    return
  }
  this.$http.send('POST_TRANSFER_LIST', {
    bind: this,
    params: {
      currency:this.currencyValue,
      amount:this.amountInput,
      system:this.bibiAccount==='币币账户'?'WALLET':'SPOTS'
    },
    callBack: this.re_transfer,
    errorHandler: this.error_transfer
  })

  this.sending = true

  this.popWindowOpen1 = false
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

// 计算当前的服务器时间
root.computed.serverT = function () {
  return this.$store.state.serverTime / 1000
}

// 弹框跳安全中心
root.methods.goToSecurityCenter = function () {
  this.popWindowOpen = false
  this.$router.push({name: 'securityCenter'})
}



export default root
