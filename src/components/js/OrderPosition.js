import tradingHallData from '../../dataUtils/TradingHallDataUtils'
const root = {}
root.name = 'orderPosition'
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
    markPrice:'',
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
// 最新价格/市价
root.props.availableBalance = {
  type: Number,
  default: 0
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  this.$eventBus.listen(this, 'GET_POSITION', this.positionRisk)
  this.positionSocket()
  this.getPositionRisk()
  this.getAdlQuantile()
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
root.computed.computedRecords = function () {
  this.socketRecords.forEach(v=>{
    // console.info('v===',v)
  })
}
// 存储订单/交易更新推送Key值的映射关系
// root.computed.socketPositionOrders = function () {
//   let data = tradingHallData.socketPositionOrders
//   console.log('data===',data);
//   return data
// }

/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 增加 或 减少保证金接口
root.methods.commitModifyMargin = function () {
  if(this.increaseAmount == '') {
    this.popText = '请输入数量'
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(this.reduceAmount == '') {
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
      type:this.styleType
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
  this.modifyMarginMoney = item.isolatedMargin
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
      // let socketRecords = message.a.P || []
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
      // console.info('message====',message)
      this.getPositionRisk()

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

  console.log('this is getAdlQuantile',data);
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
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.popOpen = false
  this.$eventBus.notify({key:'GET_POSITION'})
  this.promptOpen = true;

  if(data.code == 303) {
    this.popType = 0;
    this.popText = '下单失败';
    return
  }
  if(data.code == 302) {
    this.popType = 0;
    this.popText = '参数错误';
    return
  }
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
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$eventBus.notify({key:'GET_POSITION'})
  this.promptOpen = true;

  if(data.code == 303) {
    this.popType = 0;
    this.popText = '下单失败';
    return
  }
  if(data.code == 302) {
    this.popType = 0;
    this.popText = '参数错误';
    return
  }
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
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
