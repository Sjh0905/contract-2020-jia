// const root = {}
// // root.name = 'MobileTransfer'
// // /*------------------------------ 组件 ------------------------------*/
// // //root.components = {
// // //  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
// // //}
// // /*------------------------------ data -------------------------------*/
// // root.data = function () {
// //   return {}
// // }
// // /*------------------------------ 生命周期 -------------------------------*/
// // root.created = function () {}
// // root.mounted = function () {}
// // root.beforeDestroy = function () {}
// // /*------------------------------ 计算 -------------------------------*/
// // root.computed = {}
// // /*------------------------------ 观察 -------------------------------*/
// // root.watch = {}
// // /*------------------------------ 方法 -------------------------------*/
// // root.methods = {}
// // export default root


const root = {}
root.name = 'MobileTransfer'

/*---------------------- 组件 -----------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'MobileConfirm': resolve => require(['../vue/MobileConfirm'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.data = function () {
  return {
    // email输入框内容+提示语
    emailInput:'2570167180@qq.com',
    userNameWA:'',

    // UID内容+提示语
    UIDInput:'100013',
    UIDInputWA:'',

    // 转账数量+提示语
    amountInput:'',
    amountInputWA:'',

    transfer:{},
    showtransfer:false,

    // 转账用户的名字
    userName:'',

    // 当前币种
    currentCurrency:'',

    // 最大转账数量
    maxAmount:0,

    feeRate: 0, //费率
    dayMaxAmount: 0, //每日限额
    singleMaxAmount: 0, //每次限额
    minAmount: 0, //最低数量
    minimumFee: 0, //最低费率
    // 手续费

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    userNamePlaceholderShow:false,
    available:0
  }



}


root.computed = {}
root.computed.amount = function () {
  let balance = this.$route.params.accountsComputed
  this.$route.params.accountsComputed.forEach(v => {
    console.log(v)
  })
}

/*---------------------- 生命周期 ---------------------*/


root.created = function () {
  this.currentCurr()
  this.transferAble()
}


/*---------------------- 方法 ---------------------*/
root.methods ={}
root.methods.currentCurr = function () {
  console.log(this.$route.query.currency)
  this.currentCurrency = this.$route.query.currency

}


// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 判断转账数量的限制
root.methods.transferAble = function () {
  console.log('this.$route.query.currency=====',this.$route.query.currency)

  this.$http.send('GET_TRANSFER_AMOUNT_INFO',{
    bind: this,
    query:{
      currency:this.$route.query.currency
      // currency:this.name
      // currency:this.currencyObj
    },
    callBack: this.re_transferAble,
    errorHandler: this.error_transferAble
  })
  // this.currencyTitle = this.$route.query.currency
}
root.methods.re_transferAble = function (data) {
  // this.minAmount = data.dataMap.insideTransferAccount.minAmount
  // this.maxAmount = data.dataMap.insideTransferAccount.maxAmount

  // 是否可以转账 true 为可以转账
  this.isTransfer = data.dataMap.insideTransferAccount.transferDisabled
  // 提现费率
  this.feeRate = data.dataMap.insideTransferAccount.feeRate
  // 最大转账数量
  this.singleMaxAmount = data.dataMap.insideTransferAccount.singleMaxAmount
  this.dayMaxAmount = data.dataMap.insideTransferAccount.dayMaxAmount
  // 最小转账数量
  this.minAmount = data.dataMap.insideTransferAccount.minAmount //+ data.dataMap.withdrawRule.minimumFee
  // 最小手续费
  this.minimumFee = data.dataMap.insideTransferAccount.minimumFee
  // this.$route.query.currency
  console.log(data,this.maxAmount)
}
root.methods.error_transferAble = function (error) {
  // console.log(this.$route.query.currency)
  console.log(error)
}

// 输入邮箱
root.methods.testEmail = function () {
  this.userNamePlaceholderShow = true
  /*let userNameFlag = this.$globalFunc.testEmail(this.userName);
  let mobileFlag = this.$globalFunc.testMobile(this.userName);*/

  this.userNameWA = '0'
  if (this.emailInput == '') {
    this.userNameWA = '请输入邮箱'
    return false
  }
  if (!this.$globalFunc.testEmail(this.emailInput)) {
    this.userNameWA = '邮箱格式错误'
    return false
  }
  this.userNameWA = ''
  console.log(this.userNameWA)
  return true
}

// 输入UID
root.methods.testUID = function () {
  this.userNamePlaceholderShow = true
  /*let userNameFlag = this.$globalFunc.testEmail(this.userName);
  let mobileFlag = this.$globalFunc.testMobile(this.userName);*/
  if (this.UIDInput === '') {
    this.UIDInputWA = '请输入收款人的UID'
    return false
  }
  if (!this.$globalFunc.testNumber(this.UIDInput)) {
    this.UIDInputWA = this.$t('请输入正确的UID')
    return false
  }
  this.UIDInputWA = ''
  console.log(this.UIDInput)
  return true
}

// 输入转账数量
root.methods.testAmount = function () {
  this.userNamePlaceholderShow = true


  /*let userNameFlag = this.$globalFunc.testEmail(this.userName);
  let mobileFlag = this.$globalFunc.testMobile(this.userName);*/
  // if (!this.amountInput) {
  //   this.popOpen = true
  //   this.amountInputWA = '请输入数量'
  //   return false
  // }

// 获取币种可用余额
//   let currencyObj = this.$store.state.currency.get(this.$route.query.currency)
//   let currencyAmount = currencyObj.available
//   // console.log(currencyAmount)
//   if (this.amountInput >= currencyAmount) {
//     // this.popOpen = true
//     this.amountInputWA = '输入数量超出您的转账余额'
//     // this.popText = '输入数量超出您的转账余额'
//     this.amountInput = this.minAmount
//     return false
//   }

  if (this.amountInput === '') {
    this.amountInputWA = '转账数量不可为空'
    return false
  }

  if (this.amountInput > this.singleMaxAmount) {
    this.amountInput = this.singleMaxAmount
    this.amountInputWA = '输入数量超出每次转账数量'
    return false
  }

  // if (this.amountInput >= this.maxAmount) {
  //   // this.amountInputWA = '转账数量超出最大范围'
  //   // this.popText = '输入数量超出最大范围'
  //   this.amountInputWA = '输入数量超出最大范围，'
  //   this.amountInput = this.amountInput
  //   return false
  // }

  if (this.amountInput < this.minAmount) {
    // this.popOpen = true
    this.amountInputWA = '转账数量小于最小值'
    this.popText = '转账数量小于最小值'
    this.amountInput = this.minAmount
    return false
  }
  this.amountInputWA = ''
  return true
}

// 获取焦点后关闭placheholder
root.methods.closePlaceholder = function (type) {
  console.log(type)
  if(type == 'emailInput'){
    this.userNamePlaceholderShow = false;
  }

  if(type == 'UIDInput'){
    this.pswPlaceholderShow = false;
  }

  if(type == 'verificationCode'){
    this.verificationCodePlaceholderShow = false;
  }
  //
  // if(type == 'pswConfirm'){
  //   this.pswConfirmPlaceholderShow = false;
  // }
  //
  // if(type == 'referee'){
  //   this.refereePlaceholderShow = false;
  // }
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

// 点击确认转账
root.methods.ConfirmTransfer = function () {
  this.transferAble()
  if (this.sending) return
  let canSend = true
  // 判断邮箱
  canSend = this.testEmail() && canSend
  canSend = this.testUID() && canSend
  canSend = this.testAmount() && canSend
  // 请输入email
  if (this.emailInput === '') {
    this.emailInput = this.$t('')
    canSend = false
  }
  // 请输入UID
  if (this.UIDInput === '') {
    this.UIDInput = this.$t('')
    canSend = false
  }
  // 请输入转账数量
  if (this.amountInput === '') {
    this.amountInputWA = '转账数量不可为空'
    canSend = false
  }
  if (this.amountInput > this.singleMaxAmount) {
    this.amountInput = this.singleMaxAmount
    this.amountInputWA = '输入数量超出每次转账数量'
    canSend = false
  }
  if (!canSend) {
    console.log("不能发送！")
    return
  }

  this.$http.send('POST_VERIFYIDENTITY_USER', {
    bind: this,
    params:{
      email:this.emailInput,
      userId:this.UIDInput,
      username:this.name
    },
    callBack: this.re_ConfirmTransfer,
    errorHandler: this.error_ConfirmTransfer
  })
  // this.sending = false
  // this.popType = 2
  // this.popOpen = true

  // 显示确认转账
  // this.showtransfer = true
  // let obj = {email:this.userNameWA,UID:this.UIDInput,amount:this.amountInput}
  // this.$router.push( {name : 'MobileConfirm',query : {email:this.emailInput,UID:this.UIDInput,amount:this.amountInput}})
}
// 确认转账的正确回调
root.methods.re_ConfirmTransfer = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.log('data', data)
  if (data.errorCode) {
    if (data.errorCode === 1) {
      this.popType = 0
      this.popOpen = true
      this.popText = '用户未登录'
      return
    }
    if (data.errorCode === 2) {
      this.popType = 0
      this.popOpen = true
      this.popText = '收款人不存在'
      return
    }
    if (data.errorCode === 3) {
      this.popType = 0
      this.popOpen = true
      this.popText = '传入用户邮箱和传入userId不是同一人'
      return
    }
    if (data.errorCode === 4) {
      this.popType = 0
      this.popOpen = true
      this.popText = '转账用户未进行实名认证'
      return
    }
    if (data.errorCode === 5) {
      this.popType = 0
      this.popOpen = true
      this.popText = '收款用户未进行实名认证'
      return
    }
    if (data.errorCode === 6) {
      this.popType = 0
      this.popOpen = true
      this.popText = '没有传入用户邮箱或userId'
      return
    }
    if (data.errorCode === 7) {
      this.popType = 0
      this.popOpen = true
      this.popText = '收款用户不能转账用户相同'
      return
    }

  }
  if (data.errorCode === 0) {
    this.showtransfer = true
    // this.sendMailMsg = '已向您的邮箱发送验证码'
    return
  }
  this.userName = data.dataMap.UserProfile.name
  // this.showtransfer = true
  console.log(this.userName)
}

root.methods.error_ConfirmTransfer = function () {
  console.log('提交错误')
}


// 确认转账
// root.methods.gotoConfirm = function () {
//   this.$router.push('MobileConfirm')
// }

// 返回充值 提现 转账页面
root.methods.gotoDetail = function () {
  this.$router.go('-1')
  // mobileAssetRechargeAndWithdrawalsDetail
}

export default root
