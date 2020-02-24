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


    // 提现所有金额
    withdrawInputPrice: '',
    // 提现手续费
    withdrawServerPrice: '',


    // 默认提现地址
    defaultName: '',
    defaultAddress: '',
    defaultID: '',
    defaultMemo: '',


    // 获取所有地址
    oldAddress: '',
    showAddressToast: false, // 显示旧地址栏


    // description: '', //提现备注

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

    // 提现货币名
    title: location.search.substr(1).split("=")[1] || '',
    // 提现货币信息
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
// 跳到提现页，此页的数据获取
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

// 提现数量
root.computed.withdrawPrice = function () {
  if (Number(this.withdrawInputPrice) > Number(this.mobileRechargeRecordData.available)) {
    this.withdrawInputPrice = this.mobileRechargeRecordData.available
  }
  return this.withdrawInputPrice
}

// 手续费率
root.computed.computedFee = function () {
  let fee = this.withdrawPrice * this.feeRate
  if (fee > this.maximumFee) fee = this.maximumFee
  if (fee < this.minimumFee) fee = this.minimumFee
  return fee
}

// 实际到账
root.computed.realAccount = function () {
  if (this.withdrawPrice - this.computedFee < 0) {
    return 0
  }
  let ans = this.accMinus(this.withdrawPrice, this.computedFee)
  return ans

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
  this.$store.commit('changeMobileHeaderTitle', this.title + '提现');
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

/*---------------------- 实时监听提现数字显示 ---------------------*/
// 实时监听提现的数字
root.methods.changeWithdrawInputPrice = function () {
  let inputNum = 0
  this.withdrawInputPrice !== '' && (inputNum = parseFloat(this.withdrawInputPrice))


  if (inputNum > this.mobileRechargeRecordData.available) {
    this.withdrawInputPrice = this.mobileRechargeRecordData.available
  }

  if (this.withdrawInputPrice === '') {
    return;
  }

  this.withdrawInputPrice = inputNum
}

/*---------------------- 点击全部按钮效果 ---------------------*/
// 点击全部 按钮
root.methods.writeAllWithdrawPrice = function () {
  this.withdrawInputPrice = parseFloat(this.toFixed(this.mobileRechargeRecordData.available, 8))
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


// 点击新增地址，显示全部内容
root.methods.openNewAddressToast = function () {
  this.showNewAddressToast = true
  this.showAllOldAddress = true
}


// 点击全提
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



// 点击选择地址
root.methods.chooseAddressItem = function (item) {
  let oldID = this.defaultID;

  let oldItem = this.oldAddress[0];

  this.defaultName = item.description
  this.defaultAddress = item.address
  this.defaultID = item.id
  if(this.isMemo === true) {
    this.defaultMemo = item.memoAddress
  }

  this.showAllOldAddress = false

  let newOldAddress = [];

  let that = this

  for(let i = 0;i<that.oldAddress.length;i++) {
    if(that.oldAddress[i].id === item.id){
      newOldAddress.unshift(that.oldAddress[i]);
    } else {
      newOldAddress.push(that.oldAddress[i]);
    }
  }

  this.oldAddress = newOldAddress



}

// 点击删除地址
root.methods.deleteAddressItem = function (item) {
  let id = item.id
  console.log('点击删除按钮', item.id)
  for (let i = 0; i < this.oldAddress.length; i++) {
    if (this.oldAddress[i].id === id) {
      this.deleteSend(id)
    }
  }
}

/*---------------------- 点击删除地址 start ---------------------*/
// 发送删除地址
root.methods.deleteSend = function (itemID) {
  // console.log(itemID)
  itemID = itemID + ''
  this.$http.send('POST_DELETE_ADDRESS', {
    bind: this,
    params: {
      addressId: itemID
    },
    callBack: this.re_confirmDeleteAddress,
    errorHandler: this.error_confirmDeleteAddress
  })
}

// 发送删除提现地址请求结果
root.methods.re_confirmDeleteAddress = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // this.deleteAddressLoading = false
  // this.deleteBack = true
  console.warn('删除地址回调', data)
  if (data.errorCode) {
    if (data.errorCode === 0) {
      this.popOpen = true
      this.popType = 1
      this.popText = '删除地址成功'
      return
    }
    if (data.errorCode === 1) {
      this.popOpen = true
      this.popType = 0
      this.popText = '删除失败'
      return
    }
    if (data.errorCode === 2) {
      this.popOpen = true
      this.popType = 0
      this.popText = '没有这个地址'
      return
    }
    return
  }
  // // 重新请求
  // this.deleteMsg = this.$t('assetPageRechargeAndWithdrawalsWithdrawals.deleteAddressWrongMsg_2')
  // // 如果删除的是选择的地址
  // if (this.deleteAddressId === this.addressId) {
  //   this.addressId = ''
  // }
}

// 发送删除提现地址请求失败结果
root.methods.error_confirmDeleteAddress = function (err) {
  console.warn('删除地址失败！', err)
}

/*---------------------- 点击删除地址 end ---------------------*/

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}


/*---------------------- 点击提交后，获取邮箱验证码前操作 start ---------------------*/


root.methods.submitStepOne = function () {
  // let amount = parseFloat(this.accMinus(this.withdrawPrice, this.mobileRechargeRecordData.available)
  // console.warn('this is price',this.withdrawPrice,this.computedFee,this.mobileRechargeRecordData.available,this.minimumAmount)
  if (!this.withdrawPrice) {
    // 请输入您的提现地址
    this.popOpen = true
    this.popType = 0
    // this.popText = '请输入提现数量'
    this.popText = '请输入提现数量'
    return
  }
  // console.warn('this is price', `withdrawPrice:${this.withdrawPrice},available:${this.mobileRechargeRecordData.available},computedFee:${this.computedFee},answer:${this.accAdd(this.accMinus(this.withdrawPrice, this.mobileRechargeRecordData.available), this.computedFee)}`)
  // console.warn(`this is computed`,parseFloat(this.accMinus(this.withdrawPrice, this.mobileRechargeRecordData.available)) > 0)

  // if(parseFloat(this.withdrawPrice) - parseFloat(this.mobileRechargeRecordData.available) + parseFloat(this.computedFee) > 0){
  if (parseFloat(this.accMinus(this.withdrawPrice, this.mobileRechargeRecordData.available)) > 0) {
    this.popOpen = true
    this.popType = 0
    this.popText = '提现数量填写超限'
    return
  }
  if (parseFloat(this.accMinus(this.withdrawPrice, this.minimumAmount)) < 0) {
    this.popOpen = true
    this.popType = 0
    this.popText = '提现数量过少'
    return
  }


  if (this.isMemo===false && (this.newName != '' || this.newAddress != '')) {
    this.defaultAddress = this.newAddress
    this.defaultName = this.newName
  }

  if (this.isMemo===true && (this.newName != '' || this.newAddress != '' || this.newMemo != '')) {
    this.defaultAddress = this.newAddress
    this.defaultName = this.newName
    this.defaultMemo = this.newMemo
  }


  if (this.defaultName === '') {
    // 请输入您的提现地址
    this.popOpen = true
    this.popType = 0
    this.popText = '地址备注不能为空'
    return
  }

  let isERC20 = this.isERC20();
  let currency = this.title == "USDT" ? isERC20 : this.title
  let currencyObj = this.$store.state.currency.get(currency)


  // console.warn('新的地址',this.defaultAddress.length,this.defaultName,this.$globalFunc.testETHAddress(this.defaultAddress),currencyObj)

  if (currencyObj && currencyObj.addressAliasTo === 'ETH') {
    this.defaultAddress = this.toChecksumAddress(this.defaultAddress)
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'ACT' || this.mobileRechargeRecordData.currency === 'ACT') && !this.$globalFunc.testACTAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'BTC' || this.mobileRechargeRecordData.currency === 'BTC') && !this.$globalFunc.testBTCAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'OMNI' || this.mobileRechargeRecordData.currency === 'OMNI') && !this.$globalFunc.testOMNIAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'ETH' || this.mobileRechargeRecordData.currency === 'ETH') && !this.$globalFunc.testETHAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'EOSFORCEIO' || this.mobileRechargeRecordData.currency === 'EOSFORCEIO') && !this.$globalFunc.testEOSAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'EOSIO' || this.mobileRechargeRecordData.currency === 'EOSIO') && !this.$globalFunc.testEOSAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.mobileRechargeRecordData.currency === 'WCG') && !this.$globalFunc.testWCGAddress(this.defaultAddress)) {
    this.popOpen = true
    this.popType = 0
    this.popText = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    return
  }



  if (this.defaultAddress === '') {
    // 请输入您的提现地址
    this.popOpen = true
    this.popType = 0
    this.popText = '提现地址不能为空'
    return
  }
  if (this.isMemo===true && this.defaultMemo === '') {
    // 请输入您的提现地址
    this.popOpen = true
    this.popType = 0
    this.popText = 'memo不能为空'
    return
  }

  if (this.isWCG && this.newPublicKey === '') {
    // 请输入您的publicKey
    this.popOpen = true
    this.popType = 0
    this.popText = 'publicKey不能为空'
    return
  }

  this.mobileToastOneFlag = true
  this.$store.commit('changeMobileHeaderTitle', '提现确认');
  this.getMailVerificationCode();

}

/*---------------------- 点击提交后，获取邮箱验证码前操作 end ---------------------*/

/*---------------------- 获取邮箱验证码 ---------------------*/

// 获取邮箱验证码
root.methods.getMailVerificationCode = function () {
  if (this.getMailCode) {
    return
  }
  // 暂时不需要
  // let isERC20 = this.isERC20();
  // let currency = this.title == "USDT" ? isERC20 : this.title

  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: {
      type: 'email',
      purpose: 'withdraw',
      withdrawTime: this.formatDateUitl(this.serverTime),
      currency: this.mobileRechargeRecordData.currency,  //TODO:这里的币种不用切换，针对USDT2一说
      amount: parseFloat(this.withdrawInputPrice),
    },
    callBack: this.re_getEmailVerification,
    errorHandler: this.error_getEmailVerification,
  })

  this.getEmailVerificationCodeCountdown = 60
  this.getMailCode = true
  this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
  this.getEmailVerificationCodeInterval = setInterval(() => {
    this.getEmailVerificationCodeCountdown--
    if (this.getEmailVerificationCodeCountdown < 0) {
      this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
      this.getEmailVerificationCodeCountdown = 60
      this.getMailCode = false
    }
  }, 1000)
}


// 获取邮箱验证码
root.methods.re_getEmailVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('data', data)

  if (data.errorCode) {
    if (data.errorCode === 1) {
      this.mailCodeWA = '用户未登录'
    }
    if (data.errorCode === 2) {
      this.mailCodeWA = '发送过于频繁'
    }
    if (data.errorCode === 3) {
      this.mailCodeWA = '发送异常'
    }
    if (data.errorCode === 4) {
      this.mailCodeWA = '用户无权限'
    }
    if (data.errorCode === 5) {
      this.mailCodeWA = '修改登录密码未超过24h'
    }




    this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
    this.getEmailVerificationCodeCountdown = 60
    this.getMailCode = false

  }
  if (!data.errorCode) {
    this.sendMailMsg = '已向您的邮箱发送验证码'
  }

}
// 获取邮箱验证码出错
root.methods.error_getEmailVerification = function (err) {
  console.warn('获取邮箱验证码出错', err)
}
// 再点击邮箱，把错误提示关闭
root.methods.closeMailWrong = function () {
  this.mailCodeWA = ''
}

/*---------------------- 提交邮箱验证码 ---------------------*/
// 邮箱验证码页点击提交
root.methods.submitStepTwo = function () {
  if (this.mailCode === '' || this.mailCode.length != 6) {
    this.mailCodeWA = '输入错误的邮箱验证码'
    return
  }
  this.submitSendMail()
  //
}

root.methods.submitSendMail = function () {
  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: 'email',
      purpose: 'withdraw',
      code: this.mailCode,
    },
    callBack: this.re_commitEmailVerification,
    errorHandler: this.error_commitEmailVerification
  })
}

root.methods.re_commitEmailVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('点击提交了', data)

  let resDataMap = data.dataMap;

  if (data.errorCode) {
    data.errorCode === 1 && (this.mailCodeWA = '用户未登录')
    data.errorCode === 2 && (this.mailCodeWA = '验证码错误/过期')
    data.errorCode === 3 && (this.mailCodeWA = '系统繁忙')

    if (data.errorCode === 2 && resDataMap.times) {
      this.SHOW_TIPS_FREQUENCY((resDataMap.times - resDataMap.wrong), resDataMap.times, (resDataMap.lock / 60));
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
      return
    }

    if (data.errorCode === 100 && resDataMap.lock) {
      this.SHOW_TIPS(resDataMap.lock / 60);
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
      return
    }
    return
  }
  this.mailCodeWA = ''
  this.mobileToastOneFlag = false
  this.mobileToastTwoFlag = true
  this.$store.commit('changeMobileHeaderTitle', '提现确认');
}

root.methods.error_commitEmailVerification = function (err) {
  this.popText = '系统繁忙'
  this.popType = 0
  this.popOpen = true
}
/*---------------------- 如果有两个验证，选择验证 ---------------------*/
root.methods.changeSecondPicker = function (num) {
  this.secondPicker = num
}

/*---------------------- 获取验证码 ---------------------*/
// 获取手机验证码
root.methods.getMobileVerification = function () {
  if (this.getMobileVerificationCode) {
    return
  }
  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: {
      type: 'mobile',
      purpose: 'withdraw'
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
  }, 1000)
}
// 获取手机验证码
root.methods.re_getMobileVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  // console.warn('获取手机验证码！')
  this.phoneCodeWA = ''
  if (data.errorCode) {
    data.errorCode === 1 && (this.phoneCodeWA = '用户未登录')
    data.errorCode === 2 && (this.phoneCodeWA = '未绑定手机')
    data.errorCode === 3 && (this.phoneCodeWA = '已发送')
    data.errorCode === 4 && (this.phoneCodeWA = '系统异常')


    this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
    this.getMobileVerificationCode = false
    this.getMobileVerificationCodeCountdown = 60
  }
}
// 获取手机验证码出错
root.methods.error_getMobileVerification = function (err) {
  // console.warn('获取手机验证码出错！')
}

/*---------------------- 点击提交所有信息 start ---------------------*/
root.methods.submitStepThree = function () {
  if (!this.checkStepThree()) return
  let address = this.defaultAddress


  let currencyObj = this.$store.state.currency.get(this.mobileRechargeRecordData.currency)


  // if (currencyObj && currencyObj.addressAliasTo === 'ETH') {
  //   address = this.toChecksumAddress(address)
  // }


  if (!this.submitStepThreeFlag) return
  this.submitStepThreeFlag = false
  let description = '';
  if(this.isMemo === true){
    description = this.defaultName + this.remarkMemoConnect + this.defaultMemo
  }
  if(this.isMemo === false){
    description = this.defaultName
    if(this.isWCG){
      description = this.defaultName + this.remarkMemoConnect + this.newPublicKey
    }
  }

  let isERC20 = this.isERC20();
  let currency = this.title == "USDT" ? isERC20 : this.title

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: this.secondPicker == 1 ? 'ga' : 'mobile',
      purpose: 'withdraw',
      code: this.secondPicker == 1 ? this.googleCode : this.phoneCode,
      currency: currency,//TODO：这里的币种要切换
      description: description,
      address: address,
      amount: parseFloat(this.realAccount),
    },
    callBack: this.re_commitStep2Verification,
    errorHandler: this.error_commitStep2Verification
  })
}


// 提交谷歌或手机验证码成功
root.methods.re_commitStep2Verification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.submitStepThreeFlag = true

  this.googleCodeWA = ''
  this.phoneCodeWA = ''

  let resDataMap = data.dataMap;

  if (data.errorCode) {
    if (this.secondPicker == 1) {
      data.errorCode === 1 && (this.googleCodeWA = '用户未登录')
      data.errorCode === 2 && (this.googleCodeWA = '验证超时，请刷新重试')
      data.errorCode === 3 && (this.googleCodeWA = '用户认证数据异常，详情请提交工单')
      data.errorCode === 4 && (this.googleCodeWA = '验证码错误/过期')
      data.errorCode === 5 && (this.googleCodeWA = '提现地址不可超过10个，请删除历史提现地址后重试')
      data.errorCode === 6 && (this.googleCodeWA = '提现地址错误')
      data.errorCode === 7 && (this.googleCodeWA = '资金冻结失败')
      data.errorCode === 8 && (this.googleCodeWA = '不支持的币种类型')
      data.errorCode === 9 && (this.googleCodeWA = '缺少此币种提币规则')
      data.errorCode === 10 && (this.googleCodeWA = '小于最小提币数量')
    }
    if (this.secondPicker == 2) {
      data.errorCode === 1 && (this.phoneCodeWA = '用户未登录')
      data.errorCode === 2 && (this.phoneCodeWA = '验证超时，请刷新重试')
      data.errorCode === 3 && (this.phoneCodeWA = '用户认证数据异常，详情请提交工单')
      data.errorCode === 4 && (this.phoneCodeWA = '验证码错误/过期')
      data.errorCode === 5 && (this.phoneCodeWA = '提现地址不可超过10个，请删除历史提现地址后重试')
      data.errorCode === 6 && (this.phoneCodeWA = '提现地址错误')
      data.errorCode === 7 && (this.phoneCodeWA = '资金冻结失败')
      data.errorCode === 8 && (this.phoneCodeWA = '不支持的币种类型')
      data.errorCode === 9 && (this.phoneCodeWA = '缺少此币种提币规则')
      data.errorCode === 10 && (this.phoneCodeWA = '小于最小提币数量')
    }
    if (this.secondPicker == 2 && data.errorCode === 4 && resDataMap.times) {
      this.SHOW_TIPS_FREQUENCY((resDataMap.times - resDataMap.wrong), resDataMap.times, (resDataMap.lock / 60));
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
      return
    }

    if (data.errorCode == '100' && resDataMap.lock) {
      this.SHOW_TIPS(resDataMap.lock / 60);
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
      return
    }



    return
  }


  this.popType = 1
  this.popText = this.$t('申请成功')
  this.popOpen = true
  setTimeout(() => {
    this.$router.push('/index/mobileAsset/MobileAssetRechargeAndWithdrawRecord?id=2')
  }, 1000)


}
//提交谷歌或手机验证码失败
root.methods.error_commitStep2Verification = function (err) {
  // console.warn('提交谷歌或手机验证码失败', err)

  // this.popWindowLoading = false
  // this.step2VerificationSending = false

  this.submitStepThreeFlag = true

  this.popText = '系统繁忙'
  this.popType = 0
  this.popOpen = true
}

/*------------------ 提现地址修改 begin -------------------*/
root.methods.toChecksumAddress = function (address) {
  address = address.toLowerCase().replace('0x', '')
  var hash = createKeccakHash('keccak256').update(address).digest('hex')
  let ret = '0x'

  for (let i = 0; i < address.length; i++) {
    if (parseInt(hash[i], 16) >= 8) {
      ret += address[i].toUpperCase()
    } else {
      ret += address[i]
    }
  }
  return ret
}

/*------------------ 提现地址修改 end -------------------*/


// 点击提交，先检查所有信息
root.methods.checkStepThree = function () {
  if (this.secondPicker == 1) {
    if (this.googleCode === '' || this.googleCode.length != 6) {
      this.googleCodeWA = '请输入正确的谷歌验证码'
      return false
    }
    this.secondCode = this.googleCode
    this.googleCodeWA = ''
    return true
  }
  if (this.secondPicker == 2) {
    if (this.phoneCode === '' || this.phoneCode.length != 6) {
      this.phoneCodeWA = '请输入正确的手机验证码'
      return false
    }
    this.secondCode = this.phoneCode
    this.phoneCodeWA = ''
    return true
  }
}

/*---------------------- 点击提交所有信息 end ---------------------*/

/*---------------------- 修改弹窗验证码输错显示信息 begin ---------------------*/


// 提示toast次数错误
root.methods.SHOW_TIPS_FREQUENCY = function (frequency, total_frequency, hours) {
  this.popText = this.$t('falseHints.vfc_1') + frequency + this.$t('falseHints.vfc_2') + total_frequency + this.$t('falseHints.vfc_3') + hours + this.$t('falseHints.hour');
}

// 提示toast错误太多了
root.methods.SHOW_TIPS = function (hours) {
  this.popText = this.$t('falseHints.vfc_error1') + hours + this.$t('falseHints.vfc_error2');
}

/*---------------------- 修改弹窗验证码输错显示信息 end ---------------------*/



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
