const root = {}
root.name = 'AssetPageRechargeAndWithdrawalsWithdrawals'
import createKeccakHash from 'keccak'

const NEED_TO_CHANGE = new Set(['BTC'])

/*--------------------------------- 组件 --------------------------------*/

root.components = {
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'BasePopupWindow': resolve => require(['../vue/BasePopupWindow'], resolve),
}

/*--------------------------------- data --------------------------------*/

root.data = function () {
  return {

    amount: '', //提现数量
    amountWA: '', //提现数量提示
    limitAmount:'',//超出限额提示


    sending: false, //发送中
    popType: 0,
    popText: '系统繁忙',
    popOpen: false,


    feeReady: false, //获取费率完毕
    addressReady: true, //获取地址完毕
    authStateReady: false, //获取认证状态


    currencyName: '', //当前货币币种
    feeRate: 0, //费率
    maximumFee: 0, //最高费率
    minimumAmount: 0, //最低数量
    minimumFee: 0, //最低费率

    oldAddress: [], //之前的提现地址

    address: '', //提现地址
    description: '', //提现备注
    addressId: -1, //提现地址id
    addressWA: '', //提现地址错误


    // realAccount: 0, //实际到账


    selectAddress: false, //是否选择地址


    popWindowOpen: false, //是否打开弹窗

    // 删除地址
    deleteAddressPopOpen: false, //删除地址弹窗确认
    deleteAddressId: -1,//删除地址的id
    deleteMsg: '',//删除提示
    deleteAddressLoading: false, //删除中
    deleteSending: false,//点击发送
    deleteBack: false,//点击发送回执


    bindPicked: 0, //0表示谷歌验证
    popWindowStep: 2, //1表示邮箱验证，2表示下一步验证
    popWindowLoading: false,//popWindow正在提交


    emailVerificationCode: '',//验证码
    emailVerificationCodeWA: '', //验证码错误提示
    emailVerificationSending: false,//邮箱验证发送中

    getEmailVerificationCodeInterval: null, //获取邮箱验证码倒计时container
    getEmailVerificationCodeCountdown: 60,  //获取邮箱验证码倒计时
    getEmailVerificationCode: false, //是否点击了获取邮箱验证码倒计时


    step2VerificationCode: '', //第二步
    step2VerificationCodeWA: '', //第二步验证
    step2VerificationSending: false,//第二步验证发送中
    step2Error: false, // 第二步验证出错

    getMobileVerificationCodeInterval: null, //获取手机验证码倒计时container
    getMobileVerificationCodeCountdown: 60, //获取手机验证码倒计时
    getMobileVerificationCode: false, //获取手机验证码倒计时

    picker: 0, //验证类型


    memo: '',//memo
    memoWA: '',// memo错误提示

    publicKey: '',//publicKey
    publicKeyWA: '',// publicKey错误提示

    knowMemoRule: false,// 已阅读memo提示
    // TODO 去掉提现弹框
    // memoPopWindowOpen: this.haveMemo === 'yes', // memo提示弹窗
    memoPopWindowOpen: this.haveMemo === 'no', // memo提示弹窗

    currency2:'USDT',
    currency1:'USDT2',
    selectTab: (this.currency == 'USDT' && this.withdrawalsFlagUSDT) ? 1 : 2,

  }
}

/*--------------------------------- props --------------------------------*/

root.props = {}
root.props.currency = {
  type: String,
  default: 'BTC',
  required: true,
}
root.props.available = {
  type: [Number, String],
  default: 0,
  required: true,
}

root.props.haveMemo = {
  type: [Number, String],
  default: 'no',
  required: false,
}


/*--------------------------------- 计算 --------------------------------*/
root.computed = {}
// 绑定谷歌验证
root.computed.bindGa = function () {
  return this.$store.state.authState.ga
}
// 绑定手机验证
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 验证类型
root.computed.showPicker = function () {
  return (this.$store.state.authState.sms && this.$store.state.authState.ga)
}
// 是否是WCG
root.computed.isWCG = function () {
  let currencyObj = this.$store.state.currency.get(this.currency)
  return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
}
root.computed.withdrawalsFlagUSDT = function(){
  let currencyObj = this.$store.state.currency.get('USDT')
  return currencyObj && currencyObj.withdrawEnabled
}
root.computed.withdrawalsFlagUSDT2 = function(){
  let currencyObj = this.$store.state.currency.get('USDT2')
  return currencyObj && currencyObj.withdrawEnabled
}

//历史订单排序
root.computed.computedAddress = function () {
  if (this.addressId == -1 || this.oldAddress.length < 1) {
    return this.oldAddress
  }
  let computedAddress = this.oldAddress.slice()
  for (let i = 0; i < computedAddress.length; i++) {
    if (this.addressId == computedAddress[i].id) {
      let targetAddress = computedAddress[i]
      computedAddress.splice(i, 1)
      computedAddress.unshift(targetAddress)
      break
    }
  }
  return computedAddress
}

root.computed.computedAmount = function () {
  let amount = parseFloat(this.amount)
  if (isNaN(amount)) amount = 0
  if (this.amount === '') amount = 0
  return amount
}

// 手续费率
root.computed.computedFee = function () {
  if (this.maximumFee == this.minimumFee) return this.maximumFee
  let fee = this.computedAmount * this.feeRate
  if (fee > this.maximumFee) fee = this.maximumFee
  if (fee < this.minimumFee) fee = this.minimumFee
  return fee
}

// 实际到账 传参
root.computed.realAccount = function () {
  if (this.computedAmount - this.computedFee < 0) {
    return 0
  }
  let ans = this.accMinus(this.computedAmount, this.computedFee)
  return ans
}

// 实际到账
root.computed.realAccountAll = function () {
   let recAll = this.toFixed(this.realAccount,8)
   return recAll
}


// 最小提币数量，目前为 后台返回的最小提现数量+手续费
root.computed.computedMinimumAmount = function () {
  // return this.accAdd(this.minimumAmount, this.computedFee)
  return this.minimumAmount;
}


// 服务器时间
root.computed.serverTime = function () {
  return this.$store.state.serverTime
}

root.computed.lang = function () {
  return this.$store.state.lang;
}

// 加载中
root.computed.loading = function () {
  return !(this.feeReady && this.addressReady && this.authStateReady)
}




/*--------------------------------- 观察 --------------------------------*/
root.watch = {}
// 观察测试服务器时间
root.watch.serverTime = function (oldVal, newVal) {
  // console.warn('this is time', this.formatDateUitl(newVal))
}


/*--------------------------------- 生命周期 --------------------------------*/

root.created = function () {
  this.selectTab=(this.currency == 'USDT' && this.withdrawalsFlagUSDT) ? 1 : 2
  this.getAuthState()
  // this.getWithdrawalsAddress1()
  this.getWithdrawalsAddress()
  this.getWithdrawalsFee()
  console.log(this.lang)
}

/*--------------------------------- 方法 --------------------------------*/

root.methods = {}
// 判断验证状态

/*------------------ 获取验证状态 begin -------------------*/
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  // 如果没有认证
  if (!this.$store.state.authState.identity || (!this.$store.state.authState.sms && !this.$store.state.authState.ga) || !this.bindEmail) {
    this.close()
    return
  }
  this.$store.state.authState.sms && (this.picker = 2)
  this.$store.state.authState.ga && (this.picker = 1)
  // 获取认证状态成功
  this.authStateReady = true
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功
  // 如果没有认证
  if (!this.$store.state.authState.identity || (!this.$store.state.authState.sms && !this.$store.state.authState.ga)) {
    this.close()
    return
  }
  this.$store.state.authState.sms && (this.picker = 2)
  this.$store.state.authState.ga && (this.picker = 1)
  this.authStateReady = true
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  this.close()
}
/*------------------ 获取验证状态 end -------------------*/

/*------------------ 获取提现费率 begin -------------------*/




// 获取提现费率
root.methods.getWithdrawalsFee = function () {
  this.$http.send('POST_WITHDRAW_FEE_INFO', {
    bind: this,
    params: {
      currency: this.currency == "USDT" ? this.isERC20() : this.currency
    },
    callBack: this.re_getWithdrawalsFee,
    errorHandler: this.error_getWithdrawalsFee
  })
}
root.methods.re_getWithdrawalsFee = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.dataMap) {
    return
  }
  // console.log(data)
  this.currencyName = data.dataMap.withdrawRule.currency == "USDT2" ? "USDT" :data.dataMap.withdrawRule.currency;
  this.feeRate = data.dataMap.withdrawRule.feeRate
  this.maximumFee = data.dataMap.withdrawRule.maximumFee
  this.minimumAmount = data.dataMap.withdrawRule.minimumAmount
  this.minimumFee = data.dataMap.withdrawRule.minimumFee
  // 获取费率成功
  this.feeReady = true
  // 获取限额数量
  this.limitAmount=data.dataMap.withdrawSingle.amount

}
root.methods.error_getWithdrawalsFee = function (err) {
  // console.warn("获取最小费率失败", err)
}




/*------------------ 获取提现费率 end -------------------*/


/*------------------ 获取提现地址 begin -------------------*/


root.methods.isERC20 = function () {
  let currencyObj = this.$store.state.currency.get(this.currency)
  // return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
  return currencyObj && (this.currency == "USDT" && this.selectTab == 2) ? "USDT2" : this.currency;
}

// 切换状态
root.methods.toggleStatus= function (tab) {
  this.selectTab = tab
  // if (this.selectTab === 2) {
  this.getWithdrawalsAddress();
  this.getWithdrawalsFee();
  // }
  // if (this.selectTab === 1) {
  //   this.getWithdrawalsAddress1()
  // }
}


// 获取地址
root.methods.getWithdrawalsAddress = function () {
  let params = {"currency": this.currency == "USDT" ? this.isERC20() : this.currency}
  this.$http.send("POST_WITHDRAW_ADDRESS", {
    bind: this,
    // params: {
    //   currency: this.currency1
    // },
    params,
    callBack: this.re_getWithdrawalsAddress,
    errorHandler: this.error_getWithdrawalsAddress,
  })
}

// 获取地址回调
root.methods.re_getWithdrawalsAddress = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.dataMap) {
    return
  }
  this.oldAddress = data.dataMap.withdrawAddressList
  this.oldAddress.sort((a, b) => {
    return b.createdAt - a.createdAt
  })
  console.log(data)

  if (this.oldAddress.length !== 0 && this.addressId == -1) {
    this.addressId = this.oldAddress[0].id
    this.description = this.oldAddress[0].description
    this.address = this.oldAddress[0].address
    this.memo = this.oldAddress[0].memoAddress
    this.publicKey = this.oldAddress[0].publicKey//接口暂时没有这个字段，先不写
  }
  // 如果长度为0，初始化成输入框
  if (this.oldAddress.length === 0) {
    this.selectAddress = false
    this.addressId = -1
    this.description = ''
    this.address = ''
    this.memo = ''
    this.publicKey = ''
  }
  this.addressReady = true
  this.feeReady  = true
  this.authStateReady = true
}

// 获取地址出错
root.methods.error_getWithdrawalsAddress = function (err) {
  console.warn("出错！", err)
}


/*------------------ 获取提现地址 end -------------------*/


// 输入提现数量
root.methods.inputNumber = function () {
  let amount = 0
  this.amount !== '' && (amount = parseFloat(this.amount))

  // this.realAccount = amount - this.computedFee

  if (amount > this.available) {
    this.amount = this.available
  }
}

// 输入地址
root.methods.blurInputAddress = function () {
  this.addressWA = ''
}

// 备注地址输入限制
root.methods.blurInputDescription = function () {
  this.addressWA = ''
}
// 备注输入限制
root.methods.InputChangeDescription = function () {
  if (this.description.length > 20) {
    this.description = this.description.slice(0, 20)
  }
}


// 输入提现数量后检测
root.methods.blurInputNumber = function () {
  if (this.amount === '') {
    this.amountWA = ''
    return false
  }
  let num = (this.amount.toString()).search(/^\d+(\.\d+)?$/)
  if (num == -1) {
    this.amountWA = this.$t('amountWA_1')
    return false
  }
  if (parseFloat(this.accMinus(this.amount, this.available)) > 0) {
    this.amountWA = this.$t('amountWA_2')
    return false
  }
  // console.log(this.amount+"-----------amountamount-----------"+this.computedMinimumAmount);
  if (parseFloat(this.accMinus(this.amount, this.computedMinimumAmount)) < 0) {
    this.amountWA = this.$t('amountWA_3')
    return false
  }

  // console.warn("this is number", parseFloat(this.accMinus(this.amount, this.computedMinimumAmount)))

  this.amountWA = ''
  return true

}

// 提现全部
root.methods.withdrawalAll = function () {
  this.amount = parseFloat(this.toFixed(this.available, 8))
  this.blurInputNumber()
}

// 点击选择地址
root.methods.clickAddress = function (item) {
  this.description = item.description
  this.address = item.address
  this.addressId = item.id
  this.selectAddress = false
  this.addressWA = ''
  this.memo = item.memoAddress
  // this.publicKey = item.publicKey//接口暂时没有这个字段，先不写
}
// 点击添加新地址
root.methods.clickAddNewAddress = function () {
  this.address = ''
  this.description = ''
  this.selectAddress = false
  this.addressId = -1
  this.addressWA = ''
  this.memo = ''
  this.publicKey = ''
}

//点击删除地址
root.methods.clickDeleteAddress = function (item) {
  // console.warn('this is item', item)
  this.deleteMsg = this.$t('deleteAddressTitle')
  this.deleteAddressPopOpen = true
  this.deleteAddressId = item.id
  this.deleteSending = false
  this.deleteBack = false
  this.deleteAddressLoading = false
}
// 确认删除地址
root.methods.confirmDeleteAddress = function () {
  this.deleteMsg = this.$t('deleteAddressDeleting')
  this.deleteSending = true
  this.deleteAddressLoading = true


  this.$http.send('POST_DELETE_ADDRESS', {
    bind: this,
    params: {
      addressId: this.deleteAddressId
    },
    callBack: this.re_confirmDeleteAddress,
    errorHandler: this.error_confirmDeleteAddress
  })
}
// 确认删除地址回调
root.methods.re_confirmDeleteAddress = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.deleteAddressLoading = false
  this.deleteBack = true
  console.warn('删除地址回调', data)
  if (data.errorCode) {
    data.errorCode === 1 && (this.deleteMsg = this.$t('deleteAddressWrongMsg_0'))
    data.errorCode === 2 && (this.deleteMsg = this.$t('deleteAddressWrongMsg_1'))
    return
  }
  // 重新请求
  this.deleteMsg = this.$t('deleteAddressWrongMsg_2')
  // 如果删除的是选择的地址
  if (this.deleteAddressId === this.addressId) {
    this.addressId = -1
  }
  this.getWithdrawalsAddress()
}
// 确认删除地址出错
root.methods.error_confirmDeleteAddress = function (err) {
  console.warn('删除地址失败！', err)
  this.deleteAddressLoading = false
  this.deleteBack = true
}


// 切换选择地址
root.methods.changeSelectAddress = function () {
  this.selectAddress = !this.selectAddress
}

// 关闭选择地址
root.methods.closeSelectAddress = function () {
  this.selectAddress = false
}

// 关闭此组件
root.methods.close = function () {
  this.$emit('close')
}
// 关闭弹窗提示
root.methods.popClose = function () {
  this.popOpen = false
}
// 关闭删除地址的弹窗提示
root.methods.closeDeleteAddressPop = function () {
  this.deleteAddressPopOpen = false
}

// 关闭memo弹窗提示
root.methods.memoPopWindowClose = function () {
  this.memoPopWindowOpen = false
  this.close()
}
root.methods.memoPopWindowGoAhead = function () {
  this.memoPopWindowOpen = false
}


/*------------------ 提交 begin -------------------*/

// 提交，进行验证
root.methods.commit = function () {
  // console.log("blurInputNumber---------"+this.blurInputNumber());
  let canSend = true
  this.addressWA = ''
  canSend = this.blurInputNumber() && canSend
  if (this.amount === '') {
    this.amountWA = this.$t('amountWA_4')
    canSend = false
  }
  if (this.description === '') {
    this.addressWA = this.$t('amountWA_6')
    canSend = false
  }

  let isERC20 = this.isERC20();
  let currency = this.currency == "USDT" ? isERC20 : this.currency

  let currencyObj = this.$store.state.currency.get(currency)
  if (currencyObj && (currencyObj.addressAliasTo === 'ACT' || this.currency === 'ACT') && !this.$globalFunc.testACTAddress(this.address)) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }
  if (currencyObj && (currencyObj.addressAliasTo === 'BTC' || this.currency === 'BTC') && !this.$globalFunc.testBTCAddress(this.address)) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'OMNI' || this.currency === 'OMNI') && !this.$globalFunc.testOMNIAddress(this.address)) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'ETH' || this.currency === 'ETH') && !this.$globalFunc.testETHAddress(this.toChecksumAddress(this.address))) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'EOSFORCEIO' || this.currency === 'EOSFORCEIO') && !this.$globalFunc.testEOSAddress(this.address)) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'EOSIO' || this.currency === 'EOSIO') && !this.$globalFunc.testEOSAddress(this.address)) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG') && !this.$globalFunc.testWCGAddress(this.address)) {
    this.addressWA = this.$t('assetPageRechargeAndWithdrawals.wrongAddressInput')
    canSend = false
  }


  if (this.address === '') {
    this.addressWA = this.$t('amountWA_5')
    canSend = false
  }

  if (this.haveMemo === 'yes' && this.memo === '') {
    this.memoWA = this.$t('memoWA')
    canSend = false
  } else {
    this.memoWA = ''
  }

  if (currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG') && this.publicKey === '') {
    this.publicKeyWA = this.$t('publicKeyWA')
    canSend = false
  } else {
    this.publicKeyWA = ''
  }


  if (!canSend) {
    return
  }


  this.beginVerification()
  this.sending = true
}


/*------------------ 提交 end -------------------*/

/*------------------ 弹窗 begin -------------------*/
//关闭弹窗
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
  this.clearPopWindow()
  this.sending = false
}


//清空popWindow
root.methods.clearPopWindow = function () {
  this.popWindowOpen = false

  this.popWindowStep = 1 //1表示邮箱验证，2表示下一步验证
  this.popWindowLoading = false//popWindow正在提交


  this.emailVerificationCode = ''//验证码
  this.emailVerificationCodeWA = '' //验证码错误提示
  this.emailVerificationSending = false//邮箱验证发送中

  // this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
  // this.getEmailVerificationCodeCountdown = 60 //获取邮箱验证码倒计时
  // this.getEmailVerificationCode = true //是否点击了获取邮箱验证码倒计时

  this.step2VerificationCode = '' //第二步
  this.step2VerificationCodeWA = '' //第二步验证
  this.step2VerificationSending = false//第二步验证发送中

  // this.getMobileVerificationCodeInterval && clearInterval(this.getMobileVerificationCodeInterval) //获取手机验证码倒计时container
  // this.getMobileVerificationCodeCountdown = 60 //获取手机验证码倒计时
  // this.getMobileVerificationCode = true //获取手机验证码倒计时

}

// 打开验证，第一步邮箱
root.methods.beginVerification = function () {
  if (this.picker == 0) {
    this.popText = this.$t('popText_3')
    this.popType = 0
    this.popOpen = true
    this.sending = false
    return
  }


  this.clearPopWindow()
  if(this.realAccountAll<=this.limitAmount){
    this.popWindowOpen = true
  }

  //获取邮箱验证码
  this.getEmailVerification()

}

// 进行验证第二步，手机、谷歌
root.methods.beginVerificationStep2 = function () {
  if (this.picker == 0) {
    this.popText = this.$t('popText_3')
    this.popType = 0
    this.popOpen = true
    this.sending = false
    return
  }
  this.popWindowStep = 2
  this.step2Error = false
  if (!this.showPicker && this.picker == 2) {
    this.getMobileVerification()
  }
}


// 获取邮箱验证码
root.methods.getEmailVerification = function () {
  if (this.getEmailVerificationCode) {
    return
  }
  // let isERC20 = this.isERC20();
  // let currency = this.currency == "USDT" ? isERC20 : this.currency

  this.$http.send('POST_VERIFICATION_CODE', {
    bind: this,
    params: {
      type: 'email',
      purpose: 'withdraw',
      withdrawTime: this.formatDateUitl(this.serverTime),
      currency: this.currencyName,
      amount: parseFloat(this.amount),
    },
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
  }, 1000)
}

// 获取邮箱验证码
root.methods.re_getEmailVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (data.errorCode) {

    data.errorCode === 1 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_5'))
    data.errorCode === 2 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_6'))
    data.errorCode === 3 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_7'))
    data.errorCode === 4 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_8'))
    data.errorCode === 5 && (this.emailVerificationCodeWA = this.$t('changePassword'))

    this.getEmailVerificationCodeInterval && clearInterval(this.getEmailVerificationCodeInterval) //获取邮箱验证码倒计时container
    this.getEmailVerificationCodeCountdown = 60
    this.getEmailVerificationCode = false
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
root.methods.commitEmailVerification = function () {
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
      type: 'email',
      purpose: 'withdraw',
      code: this.emailVerificationCode,
    },
    callBack: this.re_commitEmailVerification,
    errorHandler: this.error_commitEmailVerification
  })

  this.popWindowLoading = true
  this.emailVerificationSending = true


}
// 提交邮箱验证成功
root.methods.re_commitEmailVerification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  let resDataMap = data.dataMap;

  this.popWindowLoading = false
  this.emailVerificationSending = false
  if (data.errorCode) {
    data.errorCode === 1 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_9'))
    data.errorCode === 2 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_10'))
    data.errorCode === 3 && (this.emailVerificationCodeWA = this.$t('emailVerificationCodeWA_11'))
    // data.errorCode === 4 && (this.emailVerificationCodeWA = '用户无权提现')

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

  this.beginVerificationStep2()
}
// 提交邮箱验证失败
root.methods.error_commitEmailVerification = function (err) {
  // console.warn('提交邮箱验证码失败', err)
  this.popWindowLoading = false
  this.emailVerificationSending = false
  // this.popOpen = false
  this.popText = this.$t('popText_1')
  this.popType = 0
  this.popOpen = true
}


//提交谷歌或手机验证码
root.methods.commitStep2Verification = function () {
  let canSend = true
  this.picker === 1 && (canSend = this.testGACodeVerification() && canSend)
  this.picker === 2 && (canSend = this.testMobileVerification() && canSend)
  if (this.step2VerificationCode === '') {
    this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_5')
    canSend = false
  }
  if (!canSend) {
    return false
  }

  let address = this.address
  let currencyObj = this.$store.state.currency.get(this.currency)

  if (currencyObj && currencyObj.addressAliasTo === 'ETH') {
    address = this.toChecksumAddress(address)
  }


  let description = this.description
  // 如果有memo，拼接到description上
  if (this.haveMemo === 'yes') {
    if(currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')){
      description += 'a0f0bc95016c862498bbad29d1f4d9d4' + this.publicKey
    }else {
      description += 'a0f0bc95016c862498bbad29d1f4d9d4' + this.memo
    }
  }

  let isERC20 = this.isERC20();
  let currency = this.currency == "USDT" ? isERC20 : this.currency

  this.$http.send('POST_COMMON_AUTH', {
    bind: this,
    params: {
      type: this.picker == 1 ? 'ga' : 'mobile',
      purpose: 'withdraw',
      code: this.step2VerificationCode,
      currency: currency,  // TODO：这里要切换币种
      description: description,
      address: address,
      amount: parseFloat(this.realAccount),
    },
    callBack: this.re_commitStep2Verification,
    errorHandler: this.error_commitStep2Verification
  })

  this.popWindowLoading = true
  this.step2VerificationSending = true
}

// 提交谷歌或手机验证码成功
root.methods.re_commitStep2Verification = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.popWindowLoading = false
  this.step2VerificationSending = false

  let resDataMap = data.dataMap

  if (data.errorCode) {
    switch (data.errorCode) {
      case 1:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_11')
        break;
      case 2:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_12')
        break;
      case 3:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_13')
        break;
      case 4:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_14')
        break;
      case 5:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_15')
        break;
      case 6:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_16')
        break;
      case 7:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_17')
        break;
      case 8:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_18')
        break;
      case 9:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_19')
        break;
      case 10:
        this.step2VerificationCodeWA = this.$t('step2VerificationCodeWA_20')
        break;
      case 100:
        break;
      default:
        this.step2VerificationCodeWA = '系统繁忙，请稍后再试'
    }

    if (data.errorCode === 4 && this.picker === 2 && resDataMap.times) {
      this.SHOW_TIPS_FREQUENCY((resDataMap.times - resDataMap.wrong), resDataMap.times, (resDataMap.lock / 60));
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
      return
    }

    if (data.errorCode === 100 && resDataMap.lock && this.picker === 2) {
      this.SHOW_TIPS(resDataMap.lock / 60);
      setTimeout(() => {
        this.popType = 0;
        this.popOpen = true;
      }, 200);
      return
    }

    if (data.errorCode !== 4) {
      this.step2Error = true
    }


    return
  }


  this.popType = 1
  this.popText = this.$t('popText_4')
  this.popOpen = true
  setTimeout(() => {
    this.close()
  }, 1000)


}
//提交谷歌或手机验证码失败
root.methods.error_commitStep2Verification = function (err) {
  // console.warn('提交谷歌或手机验证码失败', err)

  this.popWindowLoading = false
  this.step2VerificationSending = false

  this.popText = this.$t('popText_1')
  this.popType = 0
  this.popOpen = true
}


/*------------------ 弹窗 end -------------------*/


/*------------------ 提现地址修改 begin -------------------*/
root.methods.toChecksumAddress = function (address) {
  address = address.toLowerCase().replace('0x', '')
  let hash = createKeccakHash('keccak256').update(address).digest('hex')
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
// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}
// 弹窗
root.methods.openbox = function () {
  if(this.realAccountAll>this.limitAmount){
   this.$confirm(this.$t('limit'), {
          customClass: this.lang==="CA"?'englishStyle':"",
          confirmButtonText: '确定',
          cancelButtonText: this.$t('iKnowthe'),
          type: 'warning'
        }).then(() => {

        }).catch(() => {

        });}
   return false;
}


export default root
