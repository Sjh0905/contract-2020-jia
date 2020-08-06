const root = {}
root.name = 'orderPosition'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    records:[],
    records1:[],
    recordsIndex:0,
    tradinghallLimit: 10,
    parity:'',
    markPrice:'',
    getAssets:[],
    initialMargin:0,

    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,
  }
}
root.props = {}
root.props.effectiveTime = {
  type: String,
  default: 'GTX'
}
// 最新价格/市价
root.props.latestPriceVal = {
  type: String,
  default: ''
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.getPositionRisk()
  this.getAccount()
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}

root.computed.serverTime = function () {
  return new Date().getTime();
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 关闭提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}
/*---------------------- 开仓价格 begin ---------------------*/
root.methods.closePositionBox= function (name) {
  $("." + name).attr("style","display:none");
}
root.methods.openPositionBox = function (name) {
  $("." + name).attr("style","display:block");
}
/*---------------------- 开仓价格 end ---------------------*/
// 仓位
root.methods.getAccount = function () {
  this.$http.send("POST_CAPITAL_BIAN", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_getAccount,
    errorHandler: this.error_getAccount
  })
}
// 获取记录返回，类型为{}
root.methods.re_getAccount = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.loading = false
  this.getAssets = data.data.assets[0]
  this.initialMargin = this.getAssets.initialMargin
  // console.info('this.initialMargin',this.initialMargin)


}
// 获取记录出错
root.methods.error_getAccount = function (err) {
  console.warn("充值获取记录出错！", err)
}


// 仓位
root.methods.getPositionRisk = function () {
  this.$http.send("GET_POSITION_RISKV", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_getPositionRisk,
    errorHandler: this.error_getPositionRisk
  })
}
// 获取记录返回，类型为{}
root.methods.re_getPositionRisk = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.data || data.data.length == []) return
  this.records = data.data

  let filterRecords = []
  this.records.forEach((v,index)=>{
    if (v.positionAmt != 0) {
      filterRecords.push(v)
    }
  })
  this.records = filterRecords
  // aa.push(...records)
  this.recordsIndex = this.records.length
  this.$emit('getPositionRisk',this.recordsIndex);
  // console.info('this.records1=======',this.records)

}
// 获取记录出错
root.methods.error_getPositionRisk = function (err) {
  console.warn("充值获取记录出错！", err)
}

// 市价
root.methods.marketPrice = function (item) {

  // var v = ipt.value;//获取input的值
  let params = {
    leverage: this.$store.state.leverage,
    positionSide: item.positionSide,
    quantity: Math.abs(item.positionAmt),
    orderSide: (item.positionAmt<0) ? 'BUY':'SELL',
    stopPrice: null,
    symbol: "BTCUSDT",
    orderType: "MARKET",
  }
  this.$http.send("POST_ORDERS_POSITION", {
    bind: this,
    params: params,
    callBack: this.re_marketPrice,
    errorHandler: this.error_marketPrice
  })
}
// 获取记录返回，类型为{}
root.methods.re_marketPrice = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  if (data.code == 200) {
    this.popText = '订单已成交'
    this.popType = 1;
    this.promptOpen = true;
  }
  this.getPositionRisk()
}
// 限价
root.methods.checkPrice = function (item) {
  let markPrice = document.getElementById('markPrice').value;//获取input的节点bai
  let  params = {
    leverage: this.$store.state.leverage,
    positionSide: item.positionSide,
    price: markPrice,
    quantity: Math.abs(item.positionAmt),
    orderSide: (item.positionAmt>0) ? 'BUY':'SELL',
    stopPrice: null,
    symbol: "BTCUSDT",
    timeInForce: this.effectiveTime,
    orderType: "LIMIT",
    workingType: null,
  }
  this.$http.send("POST_ORDERS_POSITION", {
    bind: this,
    params: params,
    callBack: this.re_marketPrice,
    errorHandler: this.error_marketPrice
  })
}
// 获取记录返回，类型为{}
root.methods.re_marketPrice = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  if (data.code == 200) {
    this.popText = '订单已成交'
    this.popType = 1;
    this.promptOpen = true;
  }
  this.getPositionRisk()
}
// 获取记录出错
root.methods.error_marketPrice = function (err) {
  console.warn("充值获取记录出错！", err)
}
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
