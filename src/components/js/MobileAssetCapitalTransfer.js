const root = {}
root.name = 'MobileAssetCapitalTransfer'

import createKeccakHash from 'keccak'


const NEED_TO_CHANGE = new Set(['BTC'])

root.props = {}

root.data = function () {
  return {
    // 进入页面是loading状态
    loading: true,

    // 获取accounts
    accountLoadingFlag: false,
    // 获取socket
    socketLoadingFlag: false,
    // 获取initData
    initDataLoadingFlag: false,


    // 获取认证状态
    authStateReady: false,

    // 弹窗是否显示
    windowToastFlag: false,


    withdrawMinPrice: 0,

    // 获取费率信息
    feeRate: 0, //费率
    maximumFee: 0, //最高费率
    minimumAmount: 0, //最低数量
    minimumFee: 0, //最低费率

    // initData
    initData: {},


    // 划转所有金额
    transferInputAmount: '',
    // 划转手续费
    withdrawServerPrice: '',


    // 默认划转地址
    defaultName: '',
    defaultAddress: '',
    defaultID: '',
    defaultMemo: '',


    // 获取所有地址
    oldAddress: '',
    showAddressToast: false, // 显示旧地址栏


    // description: '', //划转备注

    // 新建address
    newName: '',
    newAddress: '',
    // 新建memo
    newMemo: '',

    newPublicKey:'',

    showAllOldAddress: false, // 展示所有旧地址栏

    showNewAddressToast: false, // 展示新地址栏显示

    // mobileToast 邮箱弹窗是否显示
    mobileToastOneFlag: false,

    // 二级验证通过
    mobileToastTwoFlag: false,


    // 邮箱验证码 及 错误提示
    sendMailMsg: ' ',
    mailCode: '',
    mailCodeWA: '',


    // 获取mailcode
    getMailCode: false,
    // 获取mail验证码倒计时container
    getEmailVerificationCodeInterval: null,
    // 获取邮箱验证码的倒计时
    getEmailVerificationCodeCountdown: 60,


    // 二级验证页页面样式
    // 顶部选择框 选择了哪一项
    secondPicker: 1,


    // 手机验证码 及 错误提示
    phoneCode: '',
    phoneCodeWA: '',


    // 获取手机验证码倒计时container
    getMobileVerificationCodeInterval: null,
    // 获取手机验证码倒计时
    getMobileVerificationCodeCountdown: 60,
    // 获取手机验证码倒计时
    getMobileVerificationCode: false,

    // 谷歌验证码 及 错误提示
    googleCode: '',
    googleCodeWA: '',

    // 二级验证 验证码选择
    secondCode: '',
    // 二级验证 提交验证码时 开关
    submitStepThreeFlag: true,

    // 划转货币名
    title: location.search.substr(1).split("=")[1] || '',
    // 划转货币信息
    accounts: [],

    // 此币种信息
    mobileRechargeRecordData: '',


    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',


    // eos加memo中间连接符
    remarkMemoConnect: 'a0f0bc95016c862498bbad29d1f4d9d4',
    // 是否是memo币对
    isMemo: false,
    // 是否展示memotoast弹窗
    memoToastShow: false,
    // memo选择框
    memoAgreement: false,

    // 是否是WCG币对
    // isWCG: false,
    selectTab: 1,

    assetAccountType:'wallet',//当前账户类型,默认显示我的钱包


  }
}


root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'MobileCheckbox': resolve => require(['../mobileVue/MobileCompentsVue/MobileCheckbox'], resolve),
}

root.created = function () {
  !this.withdrawalsFlagUSDT && this.withdrawalsFlagUSDT2 && (this.selectTab = 2)

  // 获取title
  this.getTitle()

  // 获取账户认证状态信息
  this.getAuthState()

  // 获取初始数据
  this.getInitData()

  // socket获取价格
  this.getPrice()

  // 获取币种资料 确认是否有memo
  this.getCurrency()

}

root.computed = {}
// 跳到划转页，此页的数据获取
// root.computed.mobileRechargeRecordData = function () {
//   return this.$store.state.mobileRechargeRecordData;
//
// }
// 监听是否是eos币种带memo
// root.computed.isEOSType = function () {
//   return this.$store.state.currency
// }
// 是否是WCG
root.computed.isWCG = function () {

  let currencyObj = this.$store.state.currency.get(this.title)
  return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.title === 'WCG')
}

root.computed.withdrawalsFlagUSDT = function(){
  if (!this.$store.state.currency.get('USDT') ) {
    let currencyO =  JSON.parse(sessionStorage.getItem("withdrawalsFlagUSDT"))
    return currencyO && currencyO.depositEnabled
  }
  let currencyObj = this.$store.state.currency.get('USDT')
  sessionStorage.setItem("withdrawalsFlagUSDT",JSON.stringify(currencyObj))
  return currencyObj && currencyObj.withdrawEnabled
}

root.computed.withdrawalsFlagUSDT2 = function(){
  if (!this.$store.state.currency.get('USDT2') ) {
    let currencyO =  JSON.parse(sessionStorage.getItem("withdrawalsFlagUSDT2"))
    return currencyO && currencyO.depositEnabled
  }
  let currencyObj = this.$store.state.currency.get('USDT2')
  sessionStorage.setItem("withdrawalsFlagUSDT2",JSON.stringify(currencyObj))
  return currencyObj && currencyObj.withdrawEnabled
}

// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  return this.accounts
}

// 计算计价货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}

// 监听修改值传入进去
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// 验证类型
root.computed.secondShowPicker = function () {
  return (this.$store.state.authState.sms && this.$store.state.authState.ga)
}

// 划转数量
root.computed.transferAmount = function () {
  if (Number(this.transferInputAmount) > Number(this.mobileRechargeRecordData.available)) {
    this.transferInputAmount = this.mobileRechargeRecordData.available
  }
  return this.transferInputAmount
}

// 服务器时间
root.computed.serverTime = function () {
  return this.$store.state.serverTime
}

// ---------------------- 监听 ---------------------------
root.watch = {}

// 监听vuex中的变化
root.watch.currencyChange = function () {
  this.accounts = [...this.$store.state.currency.values()]
}


// ---------------------- 方法 ---------------------------

root.methods = {};

/*---------------------- 进入页面获取title ---------------------*/
// 进入页面获取title
root.methods.getTitle = function () {
  this.title = location.search.substr(1).split("=")[1]
  this.$store.commit('changeMobileHeaderTitle', this.title + '划转');
}

/*---------------------- 进入页面获取title ---------------------*/

//切换我的钱包和币币账户
root.methods.changeAssetAccountType = function () {
  this.assetAccountType = this.assetAccountType == 'wallet' ? 'currency':'wallet'
};

// 获取币种
root.methods.getCurrency = function () {
  this.$http.send("GET_CURRENCY", {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency
  })
}

root.methods.isERC20 = function () {
  // let currencyObj = this.$store.state.currency.get(this.title)
  // return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
  return (this.title == "USDT" && this.selectTab == 2) ? "USDT2" : this.title;
}

// 获取币种回调
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap || !data.dataMap.currencys) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)

  let object = this.$store.state.currency.get(this.title)

  console.log('object', object)
  if(object.memo === 'yes') {
    this.isMemo = true
    this.memoToastShow = true
  }

  // 获取账户信息
  this.getAccounts()
}

// 获取币种出错
root.methods.error_getCurrency = function (err) {
}


/*---------------------- 进入页面获取币种详情 ---------------------*/

root.methods.getAccounts = function () {
  this.$http.send("ACCOUNTS", {
    bind: this,
    callBack: this.re_getAccounts,
    errorHandler: this.error_getAccounts
  })
}

// 获取币种回调
root.methods.re_getAccounts = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.accounts) {
    return
  }
  // console.log("这是accounts", data.accounts)
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)

  this.accounts = this.$store.state.currency

  let isERC20 = this.isERC20();
  let currency = this.title == "USDT" ? isERC20 : this.title
  this.mobileRechargeRecordData = this.$store.state.currency.get(currency)

  this.accountLoadingFlag = true;

  if (this.accountLoadingFlag && this.socketLoadingFlag && this.initDataLoadingFlag) {
    this.loading = false;
  }
}

// 获取币种出错
root.methods.error_getAccounts = function (err) {
  console.log('获取账户信息出错！', err)
}

/*---------------------- 关闭memo弹框系列 ---------------------*/

root.methods.closeMemoToast = function () {
  this.memoToastShow = false;
}

root.methods.changeAgreement = function () {
  this.memoAgreement = !this.memoAgreement
}

root.methods.memoConfirm = function () {
  if(this.memoAgreement === false) return;
  this.memoToastShow = false
}


/*---------------------- 点击弹窗效果 ---------------------*/
// 点击弹窗 关闭按钮
root.methods.closeWindowToast = function () {
  this.windowToastFlag = false
}
// 点击弹窗 关闭按钮
root.methods.openWindowToast = function () {
  this.windowToastFlag = true
}

/*---------------------- 实时监听划转数字显示 ---------------------*/
// 实时监听划转的数字
root.methods.changeTransferInputAmount = function () {
  let inputNum = 0
  this.transferInputAmount !== '' && (inputNum = parseFloat(this.transferInputAmount))


  if (inputNum > this.mobileRechargeRecordData.available) {
    this.transferInputAmount = this.mobileRechargeRecordData.available
  }

  if (this.transferInputAmount === '') {
    return;
  }

  this.transferInputAmount = inputNum
}

/*---------------------- 点击全部按钮效果 ---------------------*/
// 点击全部 按钮
root.methods.writeAllTransferAmount = function () {
  this.transferInputAmount = parseFloat(this.toFixed(this.mobileRechargeRecordData.available, 8))
}


/*---------------------- 进入页面，请求账户信息 start ---------------------*/
// 判断认证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  this.$store.state.authState.sms && (this.secondPicker = 2)
  this.$store.state.authState.ga && (this.secondPicker = 1)
  // 获取认证状态成功
  this.authStateReady = true
  // this.loading = !(this.feeReady && this.addressReady && this.authStateReady)
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功


  this.$store.state.authState.sms && (this.secondPicker = 2)
  this.$store.state.authState.ga && (this.secondPicker = 1)


  this.authStateReady = true
  // this.loading = !(this.feeReady && this.addressReady && this.authStateReady)

}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
  this.close()
}
/*---------------------- 进入页面，请求账户信息 end ---------------------*/

/*---------------------- 进入页面，获取估值对btc汇率 start ---------------------*/

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

  let currentPrice = data
  // this.changeAppraisement(currentPrice)

  this.$store.commit('CHANGE_APPRAISEMENT', data)
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)

  this.socketLoadingFlag = true;

  if (this.accountLoadingFlag && this.socketLoadingFlag && this.initDataLoadingFlag) {
    this.loading = false;
  }

}
/*---------------------- socket监听价格end ---------------------*/

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

  // console.log('data',data)

  // this.initReady = true

  this.initData = data
  //
  // this.changeAppraisement(this.initData)
  this.$store.commit('CHANGE_PRICE_TO_BTC', data)
  this.initDataLoadingFlag = true;

  if (this.accountLoadingFlag && this.socketLoadingFlag && this.initDataLoadingFlag) {
    this.loading = false;
  }

}
// 获取data出错
root.methods.error_getInitData = function (err) {
  console.warn('获取init数据出错', err)
}

root.methods.changeAppraisement = function (dataObj) {
  typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj))

  let data = this.$globalFunc.mergeObj(dataObj, this.initData)

  // console.log('data',data)

  this.initData = data

  this.$globalFunc.handlePrice(this.$store.state.currency, data)


  if (!data) return


  let total = 0
  let frozen = 0
  let available = 0
  //
  for (let key in data) {
    let targetName = key.split('_')[0]
    let baseName = key.split('_')[1]
    if (baseName !== this.baseCurrency) continue
    let targetObj = this.$store.state.currency.get(targetName)
    // if (!targetObj) continue
    // total += targetObj.total * data[key][4]
    // frozen += targetObj.frozen * data[key][4]
    // available += targetObj.available * data[key][4]

    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].currency !== targetName) continue
      this.accounts[i].appraisement = this.accounts[i].total * data[key][4]
      break
    }
  }
  //
  // // 特殊处理，作为base的货币也要加进去
  // let baseCurrencyHandle = this.$store.state.currency.get(this.baseCurrency)
  // if (baseCurrencyHandle) {
  //   total += baseCurrencyHandle.total
  //   frozen += baseCurrencyHandle.frozen
  //   available += baseCurrencyHandle.available
  // }
  //
  // 特殊处理，如果是基础货币
  for (let i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].currency !== this.baseCurrency) continue
    this.accounts[i].appraisement = this.accounts[i].total
  }
  //
  //
  //
  // this.total = total
  // this.valuation = this.total * this.computedExchangeRate
  // this.frozen = frozen
  // this.available = available
}


/*---------------------- 进入页面，获取估值对btc汇率 end ---------------------*/


/*---------------------- 进入页面，获取地址信息 start ---------------------*/

// 切换状态
root.methods.toggleStatus= function (tab) {
  this.selectTab = tab
  console.log('this.selectTab===========',this.selectTab);
  // if(this.selectTab === 2){

  // }
}

/*---------------------- 进入页面，获取地址信息 end ---------------------*/


// 点击全部
root.methods.changeOldAddressToast = function (type) {
  this.showAllOldAddress = !type
  if (type === true) {
    // 收起
    if (this.newName != '' && this.newAddress != '' && this.isMemo === false) {
      this.defaultName = this.newName
      this.defaultAddress = this.newAddress
    }
    if (this.newName != '' && this.newAddress != '' && this.newMemo != '' && this.isMemo === true) {
      this.defaultName = this.newName
      this.defaultAddress = this.newAddress
      this.defaultMemo = this.newMemo
    }

  }
}


// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}


/*---------------------- 点击提交 start ---------------------*/


root.methods.submitStepOne = function () {
  if (!this.transferAmount) {
    // 请输入您的划转地址
    this.popOpen = true
    this.popType = 0
    // this.popText = '请输入划转数量'
    this.popText = '请输入划转数量'
    return
  }

  if (parseFloat(this.accMinus(this.transferAmount, this.mobileRechargeRecordData.available)) > 0) {
    this.popOpen = true
    this.popType = 0
    this.popText = '划转数量填写超限'
    return
  }
  if (parseFloat(this.accMinus(this.transferAmount, this.minimumAmount)) < 0) {
    this.popOpen = true
    this.popType = 0
    this.popText = '划转数量过少'
    return
  }

  this.postTransferSpot();

}

/*---------------------- 点击提交 end ---------------------*/

// 划转提交
root.methods.postTransferSpot = function () {
  if (this.loading) return

  this.loading = true

  this.$http.send('POST_TRANSFER_SPOT', {
    bind: this,
    params: {
      currency: this.title,
      amount: this.transferAmount,
      system: this.assetAccountType == 'wallet'?'SPOTS':'WALLET'//assetAccountType:要转出的账户，system需要传到账账户
    },
    callBack: this.re_postTransferSpot,
    errorHandler: this.error_postTransferSpot
  })

}


// 划转提交
root.methods.re_postTransferSpot = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('data', data)

  if (data.errorCode) {
    data.errorCode === 1 && (this.popText = '用户未登录')
    data.errorCode === 2 && (this.popText = '划转金额小于零')
    data.errorCode === 3 && (this.popText = '收款账户系统不存在')

    this.popType = 0
    this.popOpen = true

    return
  }

  this.popType = 1
  this.popText = '申请成功'
  this.popOpen = true
  setTimeout(() => {
    this.$router.push('/index/mobileAsset/MobileAssetRechargeAndWithdrawRecord?id=4')
  }, 1000)

}
// 划转提交
root.methods.error_postTransferSpot = function (err) {
  this.popType = 0
  this.popText = '系统繁忙'
  this.popOpen = true
  console.warn('划转提交出错', err)
}


// 再点击邮箱，把错误提示关闭
root.methods.closeMailWrong = function () {
  this.mailCodeWA = ''
}


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
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

// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}



export default root
