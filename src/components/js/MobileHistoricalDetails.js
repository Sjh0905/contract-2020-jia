const root = {}
root.name = 'MobileHistoricalDetails'

/*------------------------------ 组件 -------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
}

/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    loading: true,
    limit: 10,
    orderDetail: [],
    loadingMoreShow: false, //加载更多
    loadingMoreShowing: false, //正在加载更多

    replaced: false,//是否抵扣

    originalCurrency: '',//费率币种
    replacedCurrency: '',//抵扣币种
    originalFee: 0, //原来的手续费
    refundedFee: 0, //抵扣金额
    replacedFee: 0, //抵扣手续费

    feeDetailReady: false, //获取费率详情成功
    orderDetailReady: false,//获取各订单成功
    historicaList : [], // 历史成交订单
    historicaList0 : [], // 历史成交订单
    commission:'', // 手续费
    commissionAsset:'' , // 手续费单位
  }
}

/*------------------------------ props -------------------------------*/

root.props = {}
// order的id，必须
// root.props.orderId = {
//   type: Number,
//   required: true
// }
// // 货币对，必须
// root.props.symbol = {
//   type: String,
//   required: true
// }
// root.props.startTime = {
//   type: Number,
//   required: true
// }
// root.props.endTime = {
//   type: Number,
//   required: true
// }

/*------------------------------ 生命周期 -------------------------------*/

root.created = function () {
  // this.getDetail()
  this.getHistorTrans()
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:false
      }
    }))
  }
  // this.getFeeDetail()
  // this.getHistorTrans()
}


/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 计算总交易量
root.computed.totalAmount = function () {
  let total = 0
  this.histortyOrderDetail.forEach(v=>{
    total += v.quoteQty
  })
  return this.toFixed(total ,8)
}
// 计算总盈亏
root.computed.totalRealizedPnl = function () {
  let realizedPnl = 0
  this.histortyOrderDetail.forEach(v=>{
    realizedPnl += v.realizedPnl
  })
  return this.toFixed(realizedPnl ,8)
}
// 计算总手续费
root.computed.totalCommission = function () {
  let commission = 0
  this.histortyOrderDetail.forEach(v=>{
    commission += v.commission
  })
  return this.toFixed(commission ,8)
}
root.computed.histortyOrderDetail = function () {
  return this.historicaList || []
}
// 均值
root.computed.averagePrice = function () {
  let avargePrice = 0, price = 0, amount = 0
  this.orderDetail.forEach(v => {
    // amount += v.amount
    amount = this.accAdd(amount, v.amount)
    // price += v.price * v.amount
    price = this.accAdd(price, this.accMul(v.price, v.amount))
  })
  // avargePrice = price / (amount === 0 ? 1 : amount)
  avargePrice = this.accDiv(price, (amount === 0 ? 1 : amount))
  return avargePrice
}
// 总计成交数量
root.computed.amount = function () {
  let amount = 0
  this.orderDetail.forEach(v => {
    // amount += v.amount
    amount = this.accAdd(amount, v.amount)
  })
  return amount
}

// 总成交价
root.computed.filledPrice = function () {
  let filledPrice = 0
  this.orderDetail.forEach(v => {
    // filledPrice += v.amount * v.price
    filledPrice = this.accAdd(filledPrice, this.accMul(v.amount, v.price))
  })
  return filledPrice
}
// 总费率
root.computed.totalFee = function () {
  let fee = 0
  this.orderDetail.forEach(v => {
    // fee += v.fee
    // console.log('========================',v)
    fee = this.accAdd(fee, v.fee)
    // console.log(fee)
  })
  return fee
}

// 中英文
root.computed.lang = function () {
  return this.$store.state.lang
}

// 实际到账
root.computed.actualAccount = function () {
  let actualAccount = 0
  this.orderDetail.forEach(v => {
    // actualAccount += v.amount - v.fee
    actualAccount = this.accAdd(actualAccount, this.accMinus(v.amount, v.fee))
  })
  return actualAccount
}

// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
  })
  return quoteScale_obj;
}


/*------------------------------ 方法 -------------------------------*/

root.methods = {}

root.methods.jumpToBack = function () {
  history.go(-1)
}

// root.methods.totalVolume = function (order) {
//   let volume = 0
//   volume = this.toFixed(this.accMul(order.price,order.qty) , 8)
//   return volume
// }

// 历史成交
root.methods.getHistorTrans = function () {
  // let symbol = this.$globalFunc.toOnlyCapitalLetters(this.symbol)
  this.$http.send('GET_CAPITAL_DEAL',{
    bind: this,
    query:{
      symbol:'BTCUSDT',
      // startTime:this.startTime,
      // endTime:this.endTime,
      startTime:this.$route.query.startTime,
      endTime:this.$route.query.endTime,
    },
    callBack: this.re_getHistorTrans,
    errorHandler:this.error_getHistorTrans
  })
}
// 历史成交正确回调
root.methods.re_getHistorTrans = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data) return
  this.loading = false
  console.info('data====',data.data)
  this.historicaList = data.data || []
  this.historicaList0 = data.data[0] || []

  this.orderDetailReady = true
}
// 历史成交错误回调
root.methods.error_getHistorTrans = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

// // 获取订单详情
// root.methods.getDetail = function () {
//   this.$http.send('GET_CAPITAL_ALL_FLOW', {
//     bind: this,
//     query: {
//       symbol: this.symbol,
//       orderId:this.orderId
//     },
//     callBack: this.re_getDetail,
//     errorHandler: this.error_getDetail,
//   })
// }
// // 获取订单详情回调
// root.methods.re_getDetail = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data))
//   if (!data) return false
//   this.orderDetail = data.data || []
//   this.orderDetailReady = true
//   this.loading = !this.orderDetailReady
// }
// // 获取订单详情失败
// root.methods.error_getDetail = function (err) {
//   console.warn("order detail获取数据失败！", err)
// }

// // 获取费率
// root.methods.getFeeDetail = function () {
//   this.$http.send('POST_FEE_DETAIL', {
//     bind: this,
//     params: {
//       orderId: this.orderId,
//       // orderId: '2817743'
//     },
//     callBack: this.re_getFeeDetail,
//     errorHandler: this.error_getFeeDetail
//   })
// }
// // 获取费率回调
// root.methods.re_getFeeDetail = function (data) {
//   typeof data === 'string' && (data = JSON.parse(data))
//   if (!data) return
//   // console.warn("获取费率详情！", data)
//   this.feeDetailReady = true
//   this.loading = !(this.orderDetailReady && this.feeDetailReady)
//   if (data.errorCode) {
//     this.originalFee = this.totalFee
//     return
//   }
//   this.replaced = true
//   let fundObj = data.dataMap.extOrderFeeRefund
//   this.originalCurrency = fundObj.originalFeeCurrency
//   this.replacedCurrency = fundObj.replacedFeeCurrency
//   this.originalFee = fundObj.originalFee
//   this.refundedFee = fundObj.refundedFee
//   this.replacedFee = fundObj.replacedFee
//
// }
// // 获取费率失败
// root.methods.error_getFeeDetail = function (err) {
//   console.warn("获取费率详情出错！", err)
//   this.feeDetailReady = true
//   this.loading = !this.orderDetailReady
// }

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


export default root
