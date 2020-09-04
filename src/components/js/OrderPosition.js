import tradingHallData from '../../dataUtils/TradingHallDataUtils'
const root = {}
root.name = 'orderPosition'
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
// 最新价格/市价
root.props.availableBalance = {
  type: Number,
  default: 0
}
// 最新标记价格
root.props.markPrice = {
  type: String,
  default: ''
}
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    loading:true,
    records:[],
    socketRecords:[],
    recordsIndex:0,
    tradinghallLimit: 10,
    parity:'',
    // markPrice:'',
    getAssets:[],
    initialMargin:0,

    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,

    modifyMarginOpen:false, // 修改逐仓弹框
    styleType:1,  // 1 为增加逐仓保证金；2 为减少逐仓保证金
    increaseAmount:'',  // 增加保证金金额
    reduceAmount:'',  // 减少保证金金额
    modifyMarginMoney: '',
    liquidationPrice:'',
    AmountText:'',  // 修改逐仓保证金输入弹框
    symbol:'' ,// 仓位币种
    positionSide:'', // 仓位方向
    marketPriceClick: false, //市价不能多次点击设置
    checkPriceClick: false, //限价不能多次点击设置
    popOpen:false,   // 一键平仓弹框
    waitForCancel: false, //是否开启等待

    // crossWalletBalance:'' ,// 全仓可用保证金
    // isolatedWalletBalance:'', // 逐仓仓可用保证金
    // walletBalance:'', // 钱包余额
    // reduceMoreAmount: 0 , // 最多可减少
    priceCheck:0,  // 平仓价格在多少
    order:{},
    priceCheck1:0,
    positionAmt:0, // 当前仓位的数量
    entryPrice: 0, // 当前仓位的开仓价格
    marginType:'',
  }
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
root.watch.markPrice = function(newVal,oldVal) {
  // console.info(newVal)
}
root.watch.walletBalance = function(newVal,oldVal) {
  // console.info(newVal)
}
root.watch.crossWalletBalance = function(newVal,oldVal) {
  // console.info(newVal)
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.$eventBus.listen(this, 'GET_POSITION', this.positionRisk)
  this.positionSocket()
  this.getPositionRisk()
  this.getAdlQuantile()
  this.getAccount()
  // console.info('钱包总余额===',this.$store.state.walletBalance,'除去逐仓仓位的钱包总余额===',this.$store.state.crossWalletBalance)
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.reduceMostAmount1 = function (){
  // 计算最多可减少     // isolatedWalletBalance, isolatedWalletBalance + size * (Latest_Mark_Price - Entry_Price) - Latest_Mark_Price * abs(size) * IMR
  let isolatedWalletBalance = this.accMinus(this.walletBalance,this.crossWalletBalance) // 逐仓钱包余额
  let leverage = this.$store.state.leverage
  let reduceMoreAmount = 0
  // console.info('this.walletBalance,this.crossWalletBalance',this.walletBalance,this.crossWalletBalance)
  let priceDiff= this.accMul(this.positionAmt ,this.accMinus(Number(this.markPrice) , Number(this.entryPrice)))
  let markPosition = this.accDiv(this.accMul(Number(this.markPrice) , Math.abs(this.positionAmt)) , leverage)
  if(this.marginType == "isolated") {
    reduceMoreAmount = this.accMinus(this.accAdd(Number(isolatedWalletBalance) , priceDiff) , markPosition || 1)
  } else {
    reduceMoreAmount = this.accMinus(this.accAdd(Number(isolatedWalletBalance) , priceDiff) , markPosition || 1)
  }
  reduceMoreAmount = reduceMoreAmount < 0 ? reduceMoreAmount = 0 : this.toFixed(reduceMoreAmount,2)
  // console.info('this.reduceMoreAmount===', reduceMoreAmount, this.markPrice)
  return reduceMoreAmount
}
// 钱包余额
root.computed.walletBalance = function () {
  return this.$store.state.assets.walletBalance
}
// 除去逐仓仓位保证金的钱包余额
root.computed.crossWalletBalance = function () {
  return this.$store.state.assets.crossWalletBalance
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
// 存储订单/交易更新推送Key值的映射关系
// root.computed.socketPositionOrders = function () {
//   let data = tradingHallData.socketPositionOrders
//   console.log('data===',data);
//   return data
// }

/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 增加 或 减少保证金接口
root.methods.commitModifyMargin = function () {
  if((this.styleType == 1 && this.increaseAmount == '') || (this.styleType == 2 && this.reduceAmount == '')) {
    this.popText = '请输入数量'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  this.$http.send("POST_POSITION_MARGIN", {
    bind: this,
    params: {
      symbol: this.symbol,
      positionSide: this.positionSide,
      amount:this.styleType == 1? this.increaseAmount : this.reduceAmount,
      type:this.styleType,  // 1是增加逐仓保障金；2 是减少逐仓保证金
    },
    callBack: this.re_commitModifyMargin,
    errorHandler: this.error_commitModifyMargin
  })
}
root.methods.re_commitModifyMargin = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.getPositionRisk()
  this.increaseAmount = ''
  this.reduceAmount = ''
  this.modifyMarginClose()
}
root.methods.error_commitModifyMargin = function (err) {
  console.log('err===',err)
}

root.methods.selectType = function (type) {
  this.styleType = type
}
// 打开逐仓弹框
root.methods.openModifyMargin = function (item) {
  // console.info('item===',item)
  // this.reduceMostAmount(item)
  this.positionAmt = item.positionAmt || 0
  this.entryPrice = item.entryPrice || 0
  this.marginType = item.marginType || ''
  // this.modifyMarginMoney = item.isolatedMargin
  this.liquidationPrice =item.liquidationPrice
  this.symbol = item.symbol
  this.modifyMarginOpen = true
  if(item.positionSide != 'BOTH'){
    this.positionSide = item.positionSide
    return
  }
  this.positionSide = 'BOTH'
}



// 关闭逐仓弹框
root.methods.modifyMarginClose = function () {
  this.modifyMarginOpen = false
}


// 接收仓位 socket 信息
root.methods.positionSocket = function () {
  let socketPositionOrders = this.socketPositionOrders
  // 获取仓位的数据
  this.$socket.on({
    key: 'ACCOUNT_UPDATE', bind: this, callBack: (message) => {
      if(!message) return
      let socketRecords = message.a.B[0] || {}

      let socketAssets = {
        walletBalance:socketRecords.wb || 0,
        crossWalletBalance:socketRecords.cw || 0
      }
      this.$store.commit('CHANGE_ASSETS', socketAssets)
      // socketRecords.wb &&
      // socketRecords.cw && this.$store.commit('CHANGE_ASSETS', {crossWalletBalance:socketRecords.cw})
      // console.info('this.walletBalance',this.walletBalance,socketRecords.wb,socketRecords.cw,
      //   this.$globalFunc.accAdd(this.crossWalletBalance,10000000)
      // )

      this.getPositionRisk()

      // socketRecords.forEach(v=>{
      //   // for(let k in socketPositionOrders){
      //   //   let smk = socketPositionOrders[k];
      //   //   smk && (v[smk] = v[k])
      //   // }
      //   // for (let i = 0; i <this.records.length ; i++) {
      //   //   let item = this.records[i]
      //   //   if(v.positionSide == item.positionSide){
      //   //     this.records = socketRecords
      //   //     break;
      //   //   }
      //   // }
      // })
      // this.records = socketRecords



      // this.socketRecords.forEach(v=>{
      //   if(v.ps == "BOTH") {
      //     console.info('v===',v)
      //   }
      //   if(v.ps == "LONG") {
      //     console.info('v===',v)
      //     console.info('this.records',this.records)
      //   }
      //   if(v.ps == "SHORT") {
      //     console.info('v===',v)
      //   }
      // })
    }
  })
}

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
  // if (this.priceCheck != 0) {
  //   this.priceCheck = (localStorage.getItem('PRICE_CHECK'));
  // }
  this.$http.send("GET_BALAN__BIAN", {
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
  this.$http.send("GET_POSITION_RISK", {
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
  this.recordsIndex = filterRecords.length || 0
  this.$emit('getPositionRisk',this.recordsIndex);
  // this.priceCheck = localStorage.setItem('priceCheck');
}
// 获取记录出错
root.methods.error_getPositionRisk = function (err) {
  console.warn("充值获取记录出错！", err)
}

// 自动减仓持仓ADL队列估算
root.methods.getAdlQuantile = function () {
  this.$http.send("GET_ADL_QUANTILE", {
    bind: this,
    query: {
      timestamp: this.serverTime
    },
    callBack: this.re_getAdlQuantile,
    errorHandler: this.error_getAdlQuantile
  })
}
// 自动减仓持仓ADL队列估算返回
root.methods.re_getAdlQuantile = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  // console.log('this is getAdlQuantile',data);
}
// 自动减仓持仓ADL队列估算返回出错
root.methods.error_getAdlQuantile = function (err) {
  console.warn("自动减仓持仓ADL队列估算返回出错！", err)
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
  this.marketPriceClick = true
  this.$http.send("POST_ORDERS_POSITION", {
    bind: this,
    params: params,
    callBack: this.re_marketPrice,
    errorHandler: this.error_marketPrice
  })
}
// 获取记录返回，类型为{}
root.methods.re_marketPrice = function (data) {
  this.marketPriceClick = false

  if(data.code == 303) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = '下单失败';
    return
  }
  if(data.code == 302) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = '参数错误';
    return
  }
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.popOpen = false
  this.$eventBus.notify({key:'GET_POSITION'})
  this.promptOpen = true;

  if(data.data.status == 'NEW') {
    this.popType = 1;
    this.popText = '下单成功';
    return
  }
  if(data.data.status == 'PARTIALLY_FILLED') {
    this.popType = 1;
    this.popText = '您的订单成交了一部分';
    return
  }
  if(data.data.status == 'FILLED') {
    this.popType = 1;
    this.popText = '完全成交';
    return
  }
  if(data.data.status == 'CANCELED') {
    this.popType = 1;
    this.popText = '自己撤销的订单';
    return
  }
  if(data.data.status == 'EXPIRED') {
    this.popType = 0;
    this.popText = '您的订单已过期';
    return
  }
  if(data.data.status == 'NEW_INSURANCE') {
    this.popType = 1;
    this.popText = '风险保障基金(强平)';
    return
  }
  if(data.data.status == 'NEW_ADL') {
    this.popType = 1;
    this.popText = '自动减仓序列(强平)';
    return
  }
  this.getPositionRisk()
}
// 限价
root.methods.checkPrice = function (item) {
  let markPrice = document.getElementById('markPrice').value;//获取input的节点bai
  let params = {
    leverage: this.$store.state.leverage,
    positionSide: item.positionSide,
    price: markPrice,
    quantity: Math.abs(item.positionAmt),
    orderSide: (item.positionAmt > 0) ? 'SELL':'BUY',
    // stopPrice: null,
    symbol: "BTCUSDT",
    timeInForce: this.effectiveTime,
    orderType: "LIMIT",
    // workingType: null,
  }
  this.checkPriceClick = true
  this.$http.send("POST_ORDERS_POSITION", {
    bind: this,
    params: params,
    callBack: this.re_marketPrice,
    errorHandler: this.error_marketPrice
  })
}
// 获取记录返回，类型为{}
root.methods.re_marketPrice = function (data) {
  this.checkPriceClick = false

  if(data.code == 303) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';
    return
  }
  if(data.code == 302) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '参数错误';
    return
  }
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$eventBus.notify({key:'GET_POSITION'})
  this.promptOpen = true;
  this.priceCheck = data.data.price

  // this.priceCheck = localStorage.setItem('PRICE_CHECK',data.data.price);
  //
  // if (this.priceCheck != 0) {
  //   this.priceCheck = JSON.parse(localStorage.getItem('PRICE_CHECK'));
  // }
  console.info('this.priceCheck',this.priceCheck)
  this.order = data.data

  if(data.data.status == 'NEW') {
    this.popType = 1;
    this.popText = '下单成功';
    return
  }
  if(data.data.status == 'PARTIALLY_FILLED') {
    this.popType = 1;
    this.popText = '您的订单成交了一部分';
    return
  }
  if(data.data.status == 'FILLED') {
    this.popType = 1;
    this.popText = '完全成交';
    return
  }
  if(data.data.status == 'CANCELED') {
    this.popType = 1;
    this.popText = '自己撤销的订单';
    return
  }
  if(data.data.status == 'EXPIRED') {
    this.popType = 0;
    this.popText = '您的订单已过期';
    return
  }
  if(data.data.status == 'NEW_INSURANCE') {
    this.popType = 1;
    this.popText = '风险保障基金(强平)';
    return
  }
  if(data.data.status == 'NEW_ADL') {
    this.popType = 1;
    this.popText = '自动减仓序列(强平)';
    return
  }

  this.getPositionRisk()
}

//一键平仓
root.methods.closePositions = function () {
  this.popOpen = true
}
//一键平仓
root.methods.closePop = function () {
  this.popOpen = false
}

// 确认全平
root.methods.ensurePop = async function () {
  this.records.forEach(v=>{
    this.marketPrice(v)
  })
  this.closePop()
}

// 获取记录出错
root.methods.error_marketPrice = function (err) {
  console.warn("充值获取记录出错！", err)
}


//取消平仓
root.methods.cancelThePosition = async function () {
  let params = {
    orderId: this.order.orderId,
    symbol: this.order.symbol,
    timestamp: this.order.updateTime
  }
  await this.$http.send('GET_CAPITAL_CANCEL', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
// 返回
root.methods.re_cancelOrder = function (data) {
  // this.$eventBus.notify({key: 'CANCEL_ORDER'})
  this.priceCheck = 0
  this.getPositionRisk()

}
root.methods.error_cancelOrder = function (err) {
  console.warn("撤单错误！", err)
}

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

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

// max[0, min(crossWalletBalance, Avail for Order) + present initial margin - (position_notional_value + open order's bid_notional) * IMR] / {contract_multiplier * (assuming price * IMR + abs(min[0, side * (mark price - order's Price)]))}
// min(crossWalletBalance, Avail for Order) + present initial margin - (position_notional_value + open order's bid_notional) * IMR
// 46703.37279291 + 47.37672 - (11894.87 + 0)*1/3
// {contract_multiplier * (assuming price * IMR + abs(min[0, side * (mark price - order's Price)]))}
//1*(11894.87 * 1/3 + 1 *(11894.87 - 11891.63))
// min(crossWalletBalance, Avail for Order) + present initial margin - (position_notional_value + open order's bid_notional) * IMR
// 46703.37279291 + 3948.06 - (11880.84 + 0)*1/3 / 1*(11891.63*1/3 + 1 *(11880.84-11891.63))
export default root



