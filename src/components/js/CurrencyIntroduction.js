const root = {}
root.name = 'CurrencyIntroduction'


/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve)
}

/*------------------------ data begin ------------------------*/
root.data = function () {
  return {
    currencyIntroduction: null,
    loading: true,
    btcshow:false,
    ethshow:false,
    ltcshow:false
  }
}


/*------------------------ 生命周期 begin ------------------------*/

root.created = function () {
  this.getCurrencyIntroduction(this.symbol)

}

/*------------------------ 生命周期 end ------------------------*/


/*------------------------ 计算 begin ------------------------*/
root.computed = {}
root.computed.symbol = function () {
  return this.$store.state.symbol.split('_')[0]
}
root.computed.lang = function () {
  return this.$store.state.lang
}
/*------------------------ 计算 end ------------------------*/

/*------------------------ 观察 begin ------------------------*/
root.watch = {}

root.watch.symbol = function () {
  // console.warn("haha", this.symbol)
  this.getCurrencyIntroduction(this.symbol)
}
root.watch.lang = function () {
  this.getCurrencyIntroduction(this.symbol)
}


/*------------------------ 方法 begin ------------------------*/
root.methods = {}

// 获取币种简介
root.methods.getCurrencyIntroduction = function (symbol) {
  this.loading = true
  let params = {}

  switch (this.lang) {
    case 'CA':
      params.languageId = 3
      break;
    case 'EN':
      params.languageId = 2
      break;
    case 'CH':
      params.languageId = 1
      break;
    default:
      params.languageId = 3
  }

  params.currency = symbol

  this.$http.send('GET_CURRENCY_INTRODUCTION', {
    bind: this,
    params: params,
    callBack: this.re_getCurrencyIntroduction,
    errorHandler: this.error_getCurrencyIntroduction,
  })
}
// 获取币种简介回调
root.methods.re_getCurrencyIntroduction = function (data) {
  typeof data == 'string' && (data = JSON.parse(data))
  this.currencyIntroduction = data.currencyInfo
  this.loading = false
}
// 获取币种简介出错
root.methods.error_getCurrencyIntroduction = function (err) {
  this.currencyIntroduction = null
  this.loading = false
}

//BTC展开
root.methods.btcopeninfo = function () {
  this.btcshow = true;
}

//BTC收起
root.methods.btccloseinfo = function () {
  this.btcshow = false;
}

//ETH展开
root.methods.ethopeninfo = function () {
  this.ethshow = true;
}

//ETH收起
root.methods.ethcloseinfo = function () {
  this.ethshow = false;
}

//LTC展开
root.methods.ltcopeninfo = function () {
  this.ltcshow = true;
}

//LTC收起
root.methods.ltccloseinfo = function () {
  this.ltcshow = false;
}

export default root
