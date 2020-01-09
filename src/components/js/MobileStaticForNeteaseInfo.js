const root = {}
root.name = 'MobileStaticForNeteaseInfo'

import Clipboard from "clipboard";

/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    loading: false,

    // 发送落地页 请求
    postLandFlag: false,
    // 发送获取费率请求
    postSymbolFlag: true,
    // 请求btAmount请求
    postStrokeCapitalFlag: true,

    // bt对btc的汇率
    btToBtcRate: 0,

    btAmount: 0,



    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',
  }
}


/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}
/*------------------------------ 生命周期 -------------------------------*/


root.created = function () {
  // this.postLandValidate()
  // this.postStrokeCapital()
  // this.getSymbol()
}


/*------------------------------ 计算 -------------------------------*/
root.computed = {}

root.computed.currency = function () {
  return this.$route.query.currency
}

root.computed.btAmountFixed = function () {
  return this.toFixed(this.btAmount,8)
}

root.computed.btChangeBtc = function () {
  return this.toFixed(this.accMul(this.btAmount,this.btToBtcRate),8)
}

/*------------------------------ 方法 -------------------------------*/
root.methods = {}

root.methods.checkLoading = function () {
  this.loading = !(this.postLandFlag && this.postSymbolFlag && this.postStrokeCapitalFlag)
}

// 点击弹窗复制链接按钮
root.methods.copyAddress = function () {
  // 此处是定义拷贝按钮，需要html也做响应处理
  let copyBtn = new Clipboard('.info-body-first-box-copy-window');
  let that = this
  copyBtn.on('success', function (e) {
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function (e) {
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 获取bt对btc

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

// 落地页验签
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
  // console.log('data',data)
  if(data.result){
    this.postLandFlag = true;
    this.checkLoading();
    return
  }
  this.postLandFlag = true;
  this.checkLoading();
  this.$router.push({name: 'MobileStaticNoJurisdiction'})
}

// 获取页面请求的bt值
root.methods.postStrokeCapital = function () {
  let params = {
    'corOrgId': this.$route.query.corOrgId,
    'corOrgUID': this.$route.query.corOrgUID,
    'currency': this.$route.query.currency
  }

  this.$http.send('NETEASE_STROKE_CAPITAL', {
    bind: this,
    params: params,
    callBack: this.re_postStrokeCapital,
    errorHandler: this.error_postStrokeCapital
  })
}

root.methods.re_postStrokeCapital = function (data) {
  typeof(data) === 'string' && (data = JSON.parse(data))
  console.log('data',data)
  this.btAmount = data.dataMap.strokeCapital
  this.postStrokeCapitalFlag = true

  this.checkLoading();
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

export default root
