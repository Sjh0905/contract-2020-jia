const root = {}

root.name = 'MobileStaticForNetease'


root.data = function () {
  return {
    loading: true,
    // 发送落地页 请求
    postLandFlag: false,
    // 发送获取费率请求
    postSymbolFlag: false,

    // bt对btc的汇率
    btToBtcRate: 0,

    popType: 0,
    popOpen: false,
    popText: '系统繁忙',
  }
}

root.created = function () {
  this.postLandValidate()

  this.getSymbol()

}

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

root.computed = {}

root.computed.amount = function () {
  return this.toFixed(this.$route.query.amount || 0,3)
}

root.computed.currency = function () {
  return this.$route.query.currency
}

root.computed.btChangeBtc = function () {
  return this.toFixed(this.accMul(this.amount,this.btToBtcRate),8)
}

root.methods = {}

root.methods.checkLoading = function () {
  this.loading = !(this.postLandFlag && this.postSymbolFlag)
}

root.methods.getSymbol = function () {
  let symbol = this.$route.query.currency + '_BTC'
  let query = {
    'symbol': symbol
  }

  this.$http.send('NETEASE_FIND_EXCHANGE_RATE', {
    bind: this,
    query: query,
    callBack: this.re_getSymbol,
    errorHandler: this.error_getSymbol
  })
}

root.methods.re_getSymbol = function (data) {
  // console.log('data',data);
  this.btToBtcRate = data.rate;
  this.postSymbolFlag = true;
  this.checkLoading();

}

root.methods.postLandValidate = function () {
  let params = {
    'corOrgId': this.$route.query.corOrgId,
    'corOrgUID': this.$route.query.corOrgUID
  }


  let headers = {
    'timestamp': this.$route.query.timestamp,
    'uniqueId': this.$route.query.uniqueId,
    'requestHost': window.location.hostname,
    'apiKey': this.$route.query.apiKey,
    'apiSignature': this.$route.query.apiSignature,
  }

  this.$http.send('NETEASE_LAND_VALIDATE', {
    bind: this,
    headers: headers,
    params: params,
    callBack: this.re_postLandValidate,
    errorHandler: this.error_postLandValidate
  })
}

root.methods.re_postLandValidate = function (data) {
  typeof(data) === 'string' && (data = JSON.parse(data))
  if(data.result){
    this.postLandFlag = true;
    this.checkLoading();
    return
  }
  this.postLandFlag = true;
  this.checkLoading();
  this.$router.push({name: 'MobileStaticNoJurisdiction'})
}

root.methods.error_postLandValidate = function (err) {
  this.postLandFlag = true;
  this.checkLoading();
  this.popOpen = true
  this.popType = 0
  this.popText = '系统繁忙'
}

root.methods.jumpToRegister = function () {
  this.$router.push({name: 'RegisterForPhone',query:this.$route.query})
}

root.methods.jumpToBind = function () {
  this.$router.push({name: 'MobileStaticForNeteaseBind',query:this.$route.query})
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

// 关闭弹窗
root.methods.popClose = function () {
  this.popOpen = false
}


export default root
