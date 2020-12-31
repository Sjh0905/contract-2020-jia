// import SlideBar from './slide'
// Object.definePrototype(Vue.prototype, '$SlideBarjs', { value: SlideBarjs });
import tradingHallData from "../../dataUtils/TradingHallDataUtils";
import GlobalFunction from "../../configs/globalFunctionConfigs/GlobalFunction";

const root = {}
root.name = 'ProgressBar'
const interval = '';
root.props = {}
root.computed = {}
root.methods = {}
root.watch = {}


/*----------------------------- props  begin------------------------------*/

root.props.btc_eth_rate = {
  type: Object,
  default: {}
}

root.props.socket_price = {
  type: Object,
  default: {}
}

// 18-2-7 添加的新需求 end

root.props.orderType = {
  type: Number,
  default: 0
}

root.props.fee = {
  type: Boolean,
}

root.props.symbol_config_times = {
  type: Array,
  default: function () {
    return []
  }
}
// 单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
root.props.positionModeFirst = {
  type: String,
  default: 'singleWarehouseMode'
}
// 单仓 singleWarehouse 开仓 openWarehouse 平仓 closeWarehouse
root.props.positionModeSecond = {
  type: String,
  default: 'openWarehouse'
}
// 限价 limitPrice 市价 marketPrice 限价止盈止损 limitProfitStopLoss 市价止盈止损 marketPriceProfitStopLoss
root.props.pendingOrderType = {
  type: String,
  default: 'limitPrice'
}
root.props.effectiveTime = {
  type: String,
  default: 'GTX'
}
root.props.reducePositionsSelected = {
  type: Boolean,
}
// 触发类型
root.props.latestPrice = {
  type: String,
  default: '最新价格'
}
// 最新价格/市价
root.props.latestPriceVal = {
  type: String,
  default: ''
}
// 可用余额
root.props.availableBalance = {
  type: Number,
  default: 0
}
// 标记价格
root.props.markPrice = {
  type: String,
  default: ''
}
// 多币对最新标记价格
root.props.markPriceObj = {
  type: Object,
  default: {}
}
// 全仓逐仓
root.props.marginType = {
  type: String,
  default: 'CROSSED'
}
// 委托单数量
root.props.currentLength = {
  type: Number,
  default: 0
}
root.props.positionRecords = {
  type: Array,
  default: []
}
/*----------------------------- props  end------------------------------*/

/*----------------------------- 组件  begin------------------------------*/

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
  'CalculatorBommbBox': resolve => require(['../vue/CalculatorBommbBox'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading

}
/*----------------------------- 组件  end------------------------------*/

/*----------------------------- data begin------------------------------*/

root.data = function () {
  return {
    // 加载中
    loading: false,
    triggerPrice:'', // 触发价格
    price: '',
    priceft: '',
    priceNow: '0',
    amount: '',
    currentSymbol: {
      balance: '--',
      balance_order: '--'
    },
    amountScale: 3,
    inputColor: false,

    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,

    // 可用货币数
    available: '- -',

    // 输入位数
    baseScale: 0,
    quoteScale: 0,

    currency: '',

    // DB市场的汇率 是用BDB/ETH的汇率 * BDB/ETH的时价算出来的
    bdb_rate: 0,

    // 每次切换价格时候，折合多少人民币或者美元
    changeTriggerPrice: 0,
    change_price: 0,

    popWindowOpen: false, // 弹窗开放
    // popWindowOpen1: false, // 弹窗开放

    // 当前币对是否可交易
    symbol_transaction: true,

    symbol_transaction_diy: true,

    // 点击效果
    btn_click: false,

    //进度条
    pos: {},
    startX: null,
    locked: false,
    distance: 0, //当前位置
    endDistance: 0, //上次操作结束位置
    transTime: .3, //点击拖动动画
    dragWidth: 0, //进度条宽度

    startNum: 0,
    endNum: 100,
    nowNum: 0,
    bgjcolor25: true,
    bgjcolor50: true,
    bgjcolor75: true,
    dangqzsh: false,

    // element 数据
    value:0,
    marks: {
      0: '',
      25: '',
      50: '',
      75:'',
      100:''
    },

    KKPriceRange:[],
    // 弹框提示信息
    priceCont:'',
    // 弹框打开/关闭
    popWindowOpen1:false,
    // 初始保证金率
    // initialMarginRate :[0.008, 0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.333, 0.5, 1],
    // maxPosition : [50000,250000,1000000,5000000,20000000,50000000,100000000,200000000],
    //  买卖限流
    currentLimiting:false,
    buyNetValue:0, // 买单净值
    sellNetValue:0, // 卖单净值

    totalAmount:0, //仓位总数量
    totalAmountLong:0, // 双仓开多仓位总数量
    totalAmountShort:0, //双仓开空仓位总数量
    // positionList:[], // 仓位数据
    notionalValueBoth:0, //单仓notional
    notionalValueLong:0, //多仓 notional
    notionalValueShort:0, //空仓 notional
    // currentOrders:[],

    // 平仓弹框
    closePsWindowOpen:false,
    showSplicedFrame:false,//下单拦截弹框
    callFuncName:'',//即将调用接口的函数名字
    splicedFrameText:'',
    // openOrdersBuyTotal:0, //订单总数量
    // openOrdersSellTotal:0, //订单总数量
  }
}
/*----------------------------- data end------------------------------*/

/*----------------------------- 生命周期 begin ------------------------------*/

root.created = function () {
  // 左侧price变化时更改当前price
  this.$eventBus.listen(this, 'SET_PRICE', this.RE_SET_PRICE);
  //  根据买卖设置买卖amount，买对应卖，卖对应买
  this.$eventBus.listen(this, 'SET_AMOUNT', this.RE_SET_AMOUNT);
  this.$eventBus.listen(this, 'GET_GRC_PRICE_RANGE', this.getKKPriceRange);
  //监听单仓位总数量
  this.$eventBus.listen(this, 'POSITION_TOTAL_AMOUNT', this.setTotalAmount);
  //监听双仓开多仓位总数量
  this.$eventBus.listen(this, 'POSITION_TOTAL_AMOUNT_LONG', this.setTotalAmountLong);
  // 监听双仓开空仓位总数量
  this.$eventBus.listen(this, 'POSITION_TOTAL_AMOUNT_SHORT', this.setTotalAmountShort);
  //获取当前委托
  this.$eventBus.listen(this, 'SET_CURRENT_ORDERS', this.setCurrentOrders);
  // 监听获取仓位的值
  // this.$eventBus.listen(this, 'SET_POSITION_LIST', this.setPositionListQq);
  // //监听订单做空总数量
  // this.$eventBus.listen(this, 'OPEN_ORDERS_TOTAL_SELL', this.setOpenOrdersSellAmt);

  // 获取精度
  this.getScaleConfig();

  // this.show_now_price();

  this.getKKPriceRange();
  // this.tradeMarket()
  // this.postOrdersPosition()
  // this.postOrdersCreate()
  this.initSocket()
  this.chainCal = this.$globalFunc.chainCal
  // this.price = this.latestPriceVal
}

root.mounted = function () {
  this.dragWidth = $('.dragbox').width();
}
/*----------------------------- 生命周期 end------------------------------*/

/*----------------------------- 观察 begin ------------------------------*/
// root.watch.positionRecords = function (newVal,oldVal) {
//   console.info('newVal',newVal)
//   // this.setPositionList()
//   // console.info('oldVal',oldVal)
// }
root.watch.serverTime = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.SYMBOL_ENTRANSACTION();
}
// root.watch.positionAmtLong = function (newValue, oldValue) {
//   if (newValue == oldValue) return;
// }
// root.watch.positionAmtShort = function (newValue, oldValue) {
//   if (newValue == oldValue) return;
// }
// 观察是否更改货币对
root.watch.symbol = function () {
  this.changeAvailableData();
  this.getScaleConfig();
  // 判断当前币对是否可交易
  this.SYMBOL_ENTRANSACTION();
  // 切换symbol清空价格和数量
  this.triggerPrice = '';
  this.value = 0;
  this.amount = '';
  // this.price = '';
  this.priceft = ''
}
// currency发生变化则更改估值！
root.watch.watchCurrency = function () {
  this.changeAvailableData()
}
root.watch.getTriggerPrice = function () {
  this.get_now_price();
}
root.watch.get_price = function () {
  this.get_now_price();
}
root.watch.get_lang = function () {
  this.get_now_price();
}

// 监听时价变化
root.watch.depth_price = function (newValue, oldValue) {
  // this.price = this.$globalFunc.accFixed(newValue, this.quoteScale);
}

// 监听BDB/ETH的实时价格
root.watch.topic_price = function (newValue, oldValue) {
  // bdb_rate
  let self = this;
  for (let key in newValue) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = newValue[key][4];
    }
  }
}

root.watch.value = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // console.log(newValue)
  this.computedValue()
  // this.sectionSelect(newValue/100);
}

root.watch.pendingOrderType = function (newValue, oldValue) {
  this.triggerPrice = ''
  this.value = 0
  this.amount = ''
  //初始显示的价格
  // this.price = this.latestPriceVal
  this.priceft = ''
  this.price = this.latestPriceVal
}
root.watch.positionModeSecond = function (newValue, oldValue) {
  this.triggerPrice = ''
  this.value = 0
  this.amount = ''
  //初始显示的价格
  // this.price = this.latestPriceVal
  this.priceft = ''
  this.price = this.latestPriceVal
}

root.watch.price = function (newValue, oldValue) {
    if(this.price == ''|| this.price == 0) {
      // this.priceft = this.latestPriceVal
      this.price = this.latestPriceVal
    }
}

// 监听选择的是 最新价格 还是 标记价格
root.watch.latestPrice =function (newValue, oldValue) {
  if(newValue == oldValue) return
}
/*----------------------------- 观察 end ------------------------------*/

/*----------------------------- 计算 begin ------------------------------*/

// // 杠杆分层数组
// root.computed.bracketList = function () {
//   // console.info(this.$store.state.leverageBracket)
//   return (this.$store.state.bracketList || {})[this.capitalSymbol] || []
// }
// //双仓可平多数量
// root.computed.positionAmtLong = function (){
//   console.info(this.$store.state.closeAmount[this.capitalSymbol+'positionAmtLong'])
//   return this.$store.state.closeAmount[this.capitalSymbol+'positionAmtLong'] || 0
// }
// //双仓可平空数量
// root.computed.positionAmtShort = function (){
//   console.info(this.$store.state.closeAmount[this.capitalSymbol+'positionAmtShort'])
//   return this.$store.state.closeAmount[this.capitalSymbol+'positionAmtShort'] || 0
// }
// 观察货币对是否更改
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}
// 观察账户信息是否更改
root.computed.watchCurrency = function () {
  return this.$store.state.currencyChange;
}
root.computed.isLogin = function () {
  return this.$store.state.isLogin
}
// 是否绑定谷歌验证
root.computed.bindGa = function () {
  return this.$store.state.authState.gaAuth
}
// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.mobile
}
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
root.computed.lang = function () {
  return this.$store.state.lang
}

// 深度图价格
root.computed.depth_price = function () {
  return this.$store.state.depth_price;
}

// 实时价格 需要取BDB/ETH的时价和汇率来算BDB的汇率
root.computed.topic_price = function () {
  return this.socket_price;
}

// 服务器时间
root.computed.serverTime = function () {
  return this.$store.state.serverTime;
}

//页面功能模块显示逻辑配置信息
root.computed.positionModeConfigs = function () {
  let data = tradingHallData.positionModeConfigs;
  // console.log(data);
  return data
}

// 18-2-7 添加的新需求 start

// 观察触发价格的变化，然后折合人民币或者美金
root.computed.getTriggerPrice = function () {
  return this.triggerPrice;
}

// 观察价格的变化，然后折合人民币或者美金
root.computed.get_price = function () {
  return this.price = this.latestPriceVal;
}

root.computed.get_lang = function () {
  return this.$store.state.lang;
}
// askPrice asummingPrice 计算使用
root.computed.sellDepthOrders = function () {
  // console.info('this.$store.state.orderBookTicker.askPrice',this.$store.state.orderBookTicker.askPrice)
  return this.$store.state.orderBookTicker.askPrice
}
// bidPrice asummingPrice 计算使用
root.computed.buyDepthOrders = function () {
  // console.info('this.$store.state.orderBookTicker.bidPrice',this.$store.state.orderBookTicker.bidPrice)
  return this.$store.state.orderBookTicker.bidPrice
}
// root.computed.leverageBracket = function () {
//   return this.$store.state.leverageBracket || []
// }
// 除去逐仓仓位保证金的钱包余额
root.computed.crossWalletBalance = function () {
  return this.$store.state.assets.crossWalletBalance
}
// 委托单数据
root.computed.currentOrders = function  () {
  // console.info(this.$store.state.currentOrders)
  return this.$store.state.currentOrders || []
}
// root.computed.positionRecordsList = function () {
//   return this.positionRecords
// }
// 买单净值
root.computed.computedBuyNetValue = function () {
  if(this.buyNetValue) return this.buyNetValue
  let buyNetValue = 0
  this.currentOrders.forEach(v=>{
    if(v.type == 'STOP' || v.type == 'TAKE_PROFIT' || v.type == 'STOP_MARKET' || v.type == 'TAKE_PROFIT_MARKET') return 0
    if(v.positionSide == 'BOTH' && v.side == 'BUY'){
      buyNetValue += v.price * Math.abs(v.origQty)
    }
    if(v.positionSide == 'LONG') {
      buyNetValue += v.price * v.origQty
    }
  })
  return this.buyNetValue = buyNetValue || 0
}
// 卖单净值
root.computed.computedSellNetValue = function () {
  if(this.sellNetValue) return this.sellNetValue
  let sellNetValue = 0
  this.currentOrders.forEach(v=>{
    if(v.type == 'STOP' || v.type == 'TAKE_PROFIT' || v.type == 'STOP_MARKET' || v.type == 'TAKE_PROFIT_MARKET') return 0
    if(v.positionSide == 'BOTH' && v.side == 'SELL'){
      sellNetValue += v.price * Math.abs(v.origQty)
    }
    if(v.positionSide == 'SHORT') {
      sellNetValue += v.price * v.origQty
    }
  })
  return this.sellNetValue = sellNetValue || 0
}
// 最大可下单值（名义价值）
root.computed.maxNotionalAtCurrentLeverage = function () {
  // let leverageBracket = this.bracketList
  let leverageBracket = this.$store.state.bracketList[this.capitalSymbol] || []
  // console.info(leverageBracket)
  let leverage = this.$store.state.leverage || 0
  let leverageArr1 = [1,2]//杠杆固定值，分别对应最大头寸，无需做范围判断，其中杠杆倍数为1时也取2对应的值
  let leverageArr2 = [2,3,4,5]//杠杆固定值，分别对应最大头寸，无需做范围判断
  let notionalCap = 0

  for (let i = 0; i < leverageBracket.length; i++) {
    let item = leverageBracket[i],ile = item.initialLeverage;

    if(leverageArr1.indexOf(leverage) > -1){
      if(leverageArr1.indexOf(ile) == -1)continue;

      notionalCap = item.notionalCap
      break;
    }
    if(leverageArr2.indexOf(leverage) > -1){
      if(leverage != ile)continue;

      notionalCap = item.notionalCap
      break;
    }

    let itemNext = leverageBracket[i+1],ileNext = itemNext.initialLeverage;
    if(leverage <= ile && leverage > ileNext){
      notionalCap = item.notionalCap;
      break;
    }
  }
  // console.info('notionalCap===',notionalCap)
  return notionalCap || 0;

  // let notionalCap = []
  // let leverageCap = []
  /*leverageBracket.forEach(v=>{
    notionalCap.push(v.notionalCap)
    leverageCap.push(v.initialLeverage)
  })
  console.info('leverageCap==',leverageCap)
  console.info('notionalCap==',notionalCap)

  if(leverage >= leverageCap[1] && leverage < leverageCap[0]) {
    return notionalCap[0]
  }
  if(leverage >= leverageCap[1] && leverage < leverageCap[2]) {
    return notionalCap[1]
  }

  console.info('leverageCap==',leverageCap)
  console.info('notionalCap==',notionalCap)*/


  // console.info('notionalCap==',notionalCap)
}
// assumingPrice
root.computed.assumingPrice = function () {
  let assumingPrc = 0
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    // console.info('this.buyDepthOrders',this.buyDepthOrders)
    assumingPrc = this.orderType ? Math.max(this.buyDepthOrders,this.price) : this.price
    return Number(assumingPrc) || 0
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    assumingPrc = this.orderType ? this.buyDepthOrders : (this.sellDepthOrders*(1 + 0.0005))
    return Number(assumingPrc) || 0
  }
}

// 保证金assumingPrice
root.computed.costAssumingPrice = function () {
  // if(JSON.stringify(this.markPriceObj) == "{}")return
  let assumingPrc = 0,markPrice = JSON.stringify(this.markPriceObj) != "{}" && Number(this.markPriceObj[this.capitalSymbol].p)
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    assumingPrc = this.orderType ? Math.max(this.buyDepthOrders,markPrice,this.price) : this.price
    return Number(assumingPrc) || 0
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    assumingPrc = this.orderType ? Math.max(this.buyDepthOrders,markPrice) : this.accMul(this.sellDepthOrders, this.accAdd(1, 0.0005))
    return Number(assumingPrc) || 0
  }
}
// 计算仓位的数据 position_national_value
root.computed.setPositionList = function () {
  //单仓和双仓空仓使用num ,双仓多仓使用numLong
  let num = 0,numLong = 0,numBoth = 0

  for (let v = 0,len = this.positionRecords.length; v < len; v++) {
    let vData = this.positionRecords[v],symbol = vData.symbol,positionAmt = Number(vData.positionAmt),
      markPrice = JSON.stringify(this.markPriceObj) != "{}" && this.markPriceObj[symbol].p ;
      // markPrice = JSON.stringify(this.markPriceObj) != "{}" && this.markPriceObj[this.capitalSymbol].p ;

    if(vData.positionSide=='BOTH'){
      numBoth += Number(this.accMul(positionAmt, Number(markPrice)))
    }
    if(vData.positionSide=='LONG'){
      numLong += Number(this.accMul(positionAmt, Number(markPrice)))
    }
    if(vData.positionSide=='SHORT'){
      num += Number(this.accMul(Math.abs(positionAmt), Number(markPrice)))
    }
  }
  // 单仓的 position_notional_value
  this.notionalValueBoth = numBoth || 0
  // 双仓空仓的 position_notional_value
  this.notionalValueShort = num || 0
  // 双仓多仓的 position_notional_value
  this.notionalValueLong = numLong || 0
  // console.info('notionalValueBoth==',this.notionalValueBoth,'notionalValueShort',this.notionalValueShort,'notionalValueLong',this.notionalValueLong)
  return
}

// 单仓最多可开
root.computed.canMore = function () {
  this.setPositionList
  let crossWalletBalanceSing = Number(this.crossWalletBalance) // 全仓钱包余额
  // 向上取整IMR
  let leverage = this.leverage
  let availableBalance = this.$store.state.assets.availableBalance || 0
  // let availableBalance = this.availableBalance || 0
  let markPrice = JSON.stringify(this.markPriceObj) != "{}" && Number(this.markPriceObj[this.capitalSymbol].p) || 0
  let price = Number(this.price) || 0 // 输入框价格
  // let temp = this.orderType ? -1 : 1;
  // let priceStep = Math.abs(Math.min(0 , temp * (markPrice - price))) || 0  // TODO:简化后
  let buy = Math.abs(Math.min(0 , 1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sell = Math.abs(Math.min(0 , -1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let buyMarket = Math.abs(Math.min(0 , 1 * (markPrice - this.assumingPrice))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sellMarket = Math.abs(Math.min(0 , -1 * (markPrice - this.assumingPrice))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let positionAmt = Number(this.totalAmount) || 0 // TODO:有仓位时：单仓取数量之和；双仓取数量绝对值之和无仓位时取0
  // present initial margin = max（position notional+open order bid notional，position notional-open order ask notional）* 1 / leverage
  let positionNotionalValue = this.notionalValueBoth
  let initialMargin =  Math.max((positionNotionalValue + this.computedBuyNetValue), (positionNotionalValue - this.computedSellNetValue)) * leverage

  let buyCanOpen = 0
  let sellCanOpen = 0
  let openAmountSingle

  // 计算notionalAferTrade的值
  // notional after trade = max(abs(position_notional_value + open order's bid_notional + new order's bid_notional), abs(position_notional_value - open order's ask_notional))
//   afterTrade = Math.max(Math.abs( markPrice * positionAmt + this.computedBuyNetValue + this.assumingPrice * buyCanOpen
// ), Math.abs(markPrice * positionAmt - this.computedBuyNetValue ))

  // let afterTradeBuy =  Math.max(Math.abs(markPrice * positionAmt + open order's bid_notional + new order's bid_notional), abs(markPrice * positionAmt - open order's ask_notional))
  // let afterTradeSell =  Math.max(Math.abs(markPrice * positionAmt + open order's bid_notional), abs(markPrice * positionAmt - open order's ask_notional-new order's bid_notional))

  // 单仓全仓
  if(this.positionModeFirst=='singleWarehouseMode' && this.marginType == 'CROSSED'){
    // 限价或者限价止盈止损
    if(this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
      if(price == '' || price == 0) return buyCanOpen = 0, sellCanOpen = 0;
      // max bid order Qty1 = max[0, Avail for Order + present initial margin - (position_notional_value + open order's bid_notional) * IMR] / {contract_multiplier * (assuming price * IMR + abs(min[0, side * (mark price - order's Price)]))}

      // let funName = this.orderType ? this.accAdd : this.accMinus
      // funName(markPrice * positionAmt,)
      //
      // let cals = {
      //   0:{fName:this.accAdd,nValue:buyNetValue},
      //   1:{fName:this.accMinus,nValue:sellNetValue},
      // }
      // let cals2 = [
      //   [this.accAdd,buyNetValue],
      //   [this.accMinus,sellNetValue],
      // ]
      // let canOpen = Math.max(0,(availableBalance + initialMargin - (cals2[this.orderType][0](mp,this[cals2[this.orderType][1]]) * leverage)) / (1*(this.assumingPrice *  leverage) + priceStep))
      // 第一步：获取最大可买和最大可卖
      // position size >= 0
      if(positionAmt >= 0){
        buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedSellNetValue) * leverage)) / (1*(this.assumingPrice *  leverage) + buy))
        sellCanOpen = Math.max(0,((availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage) +  1* Math.abs(positionAmt)*1*sell ) / (1 * (this.assumingPrice *  leverage) + sell)))
        if(sellCanOpen >= Math.abs(positionAmt)){
          sellCanOpen = Math.max(0, (availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage)))
        }
      }
      if(positionAmt < 0){
        buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage) + Math.abs(positionAmt) * 1 * buy ) / (1*(this.assumingPrice *  leverage) + buy))
        sellCanOpen = Math.max(0,(availableBalance + initialMargin + ((positionNotionalValue- this.computedSellNetValue) * leverage + Math.abs(positionAmt) *1 * sell)) / (1 * (this.assumingPrice * leverage) + sell))
        if (buyCanOpen >= Math.abs(positionAmt)) {
          buyCanOpen = Math.max(0, (availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage)) / (1 * this.assumingPrice * leverage))
        }
      }
      // console.info('buyCanOpen==',buyCanOpen,'sellCanOpen===',sellCanOpen)
      // position size < 0
      // sellCanOpen = Math.max(0,(availableBalance + initialMargin - ((markPrice * positionAmt - this.computedBuyNetValue) * leverage)) / (1*(this.assumingPrice * leverage) + sell))
      // max sell order Qty1 = max[0, Avail for Order + present initial margin + (position_notional_value - open order's ask_notional) * IMR + abs(position size) * contract_multiplier * abs{min[0, side * (mark price - order's Price)]}] / {contract_multiplier * (assuming price * IMR + abs(min[0, side * (mark price - order's Price)]))}
      // position size >= 0

      // 第二步进行验证：买单的 notional after trade
      // notional after trade = max(abs(position_notional_value + open order's bid_notional + new order's bid_notional), abs(position_notional_value - open order's ask_notional))
      let afterTradeBuy = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue + (this.assumingPrice * Number(buyCanOpen)))
        , Math.abs(positionNotionalValue - this.computedSellNetValue))
      // 卖单的 notional after trade
      // notional after trade = max(abs(position_notional_value + open order's bid_notional), abs(position_notional_value - open order's ask_notional - new order's ask_notional))
      let afterTradeSell = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue),
        Math.abs((positionNotionalValue) - this.computedSellNetValue - (this.assumingPrice * Number(sellCanOpen))))
      if(afterTradeBuy > this.maxNotionalAtCurrentLeverage){
        buyCanOpen = (this.maxNotionalAtCurrentLeverage - positionNotionalValue - this.computedBuyNetValue) / this.assumingPrice
      }
      if(afterTradeSell > this.maxNotionalAtCurrentLeverage){
        sellCanOpen =  (this.maxNotionalAtCurrentLeverage + positionNotionalValue - this.computedSellNetValue) / this.assumingPrice
      }
      sellCanOpen = sellCanOpen < 0 ? 0 : sellCanOpen
      buyCanOpen = buyCanOpen < 0 ? 0 : buyCanOpen
      // 如果是只减仓
      if(this.reducePositionsSelected){
        if(positionAmt > 0) {
          return this.orderType ? sellCanOpen = Math.abs(positionAmt) : buyCanOpen = 0
        }
        if(positionAmt < 0) {
          return this.orderType ? sellCanOpen = 0 : buyCanOpen = Math.abs(positionAmt)
        }
        return
      }
      return this.orderType ? sellCanOpen : buyCanOpen
    }

    // 市价或者市价止盈止损
    if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
      // buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((markPrice * positionAmt + this.buyNetValue) * leverage)) / (1*(this.assumingPrice *  leverage) + buyMarket))
      // sellCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1*(this.assumingPrice * leverage) + sellMarket))
      // console.info('sellNetValue===',this.sellNetValue)
      if(positionAmt >= 0){
        buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage))) / (1*(this.assumingPrice * leverage + buyMarket))
        // buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage))) / (1*((this.sellDepthOrders*(1 + 0.0005)) * leverage + buyMarket))
        sellCanOpen = Math.max(0,(availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage) +  Math.abs(positionAmt) * 1 * sellMarket)) / (1 * (this.assumingPrice *  leverage) + sellMarket)
        // sellCanOpen = Math.max(0,(availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage) +  Math.abs(positionAmt) * 1 * sellMarket)) / (1 * (this.buyDepthOrders *  leverage) + sellMarket)
        if(buyCanOpen >= Math.abs(positionAmt)){
          sellCanOpen = Math.max(0, (availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage))) / (1 * (this.assumingPrice * leverage))
          // sellCanOpen = Math.max(0, (availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage))) / (1 * (this.buyDepthOrders * leverage))
        }
      }
      if(positionAmt < 0){
        buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage) + Math.abs(positionAmt) * 1 * buyMarket )) / (1*(this.assumingPrice *  leverage) + buyMarket)
        // buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage) + Math.abs(positionAmt) * 1 * buyMarket )) / (1*((this.sellDepthOrders*(1 + 0.0005)) *  leverage) + buyMarket)
        sellCanOpen = Math.max(0,(availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage))) / (1 * (this.assumingPrice * leverage) + sellMarket)
        // sellCanOpen = Math.max(0,(availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage))) / (1 * (this.buyDepthOrders * leverage) + sellMarket)
        if (buyCanOpen >= Math.abs(positionAmt)) {
          buyCanOpen = Math.max(0, (availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage))) / (1 * this.assumingPrice * leverage)
          // buyCanOpen = Math.max(0, (availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage))) / (1 * (this.sellDepthOrders*(1 + 0.0005)) * leverage)
        }
      }
      // 第二步进行验证
      let afterTradeBuyM = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue + (this.assumingPrice * Number(buyCanOpen))
      // let afterTradeBuyM = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue + ((this.sellDepthOrders*(1 + 0.0005)) * Number(buyCanOpen))
      ), Math.abs(positionNotionalValue - this.computedSellNetValue))

      // notional after trade = max(abs(position_notional_value + open order's bid_notional), abs(position_notional_value - open order's ask_notional - new order's ask_notional))
      let afterTradeSellM = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue),
        Math.abs(positionNotionalValue - this.computedSellNetValue - (this.assumingPrice * Number(sellCanOpen))))
        // Math.abs(positionNotionalValue - this.computedSellNetValue - (this.buyDepthOrders * Number(sellCanOpen))))
      // 第三步，重新计算最大可开数量
      if(afterTradeBuyM > this.maxNotionalAtCurrentLeverage){
        buyCanOpen = (this.maxNotionalAtCurrentLeverage - (positionNotionalValue) - this.computedBuyNetValue) / this.assumingPrice
        // buyCanOpen = (this.maxNotionalAtCurrentLeverage - (positionNotionalValue) - this.computedBuyNetValue) / (this.sellDepthOrders*(1 + 0.0005))
      }
      if(afterTradeSellM > this.maxNotionalAtCurrentLeverage){
        sellCanOpen =  (this.maxNotionalAtCurrentLeverage + (positionNotionalValue) - this.computedSellNetValue) / this.assumingPrice
        // sellCanOpen =  (this.maxNotionalAtCurrentLeverage + (positionNotionalValue) - this.computedSellNetValue) / this.buyDepthOrders
        // console.info('sellCanOpen==',sellCanOpen)
      }
      sellCanOpen = sellCanOpen < 0 ? 0 : sellCanOpen
      buyCanOpen = buyCanOpen < 0 ? 0 : buyCanOpen
      // 如果是只减仓
      if(this.reducePositionsSelected && this.pendingOrderType == 'marketPriceProfitStopLoss'){
        if(positionAmt > 0) {
          return this.orderType ? sellCanOpen = Math.abs(positionAmt) : buyCanOpen = 0
        }
        if(positionAmt < 0) {
          return this.orderType ? sellCanOpen = 0 : buyCanOpen = Math.abs(positionAmt)
        }
        return
      }
      // 将可平仓数量存储到store里面
      openAmountSingle = {
        openAmtBuy:buyCanOpen,
        openAmtSell:sellCanOpen,
      }
      this.$store.commit('CHANGE_OPEN_AMOUNT_SINGLE',openAmountSingle)
      return this.orderType ? sellCanOpen : buyCanOpen
    }
  }

  // 单仓逐仓
  if(this.positionModeFirst=='singleWarehouseMode' && this.marginType == 'ISOLATED'){
    // 限价或者限价止盈止损
    if(this.pendingOrderType == 'limitPrice' || this.pendingOrderType == 'limitProfitStopLoss'){
      if(price == '' || price == 0) return buyCanOpen = 0; sellCanOpen = 0;
      if(positionAmt >= 0){
        buyCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin - ((positionNotionalValue + this.computedBuyNetValue)*leverage)) / (1 * (this.assumingPrice * leverage) + buy))
        sellCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin + ((positionNotionalValue - this.computedSellNetValue)*leverage) + Math.abs(positionAmt) * 1 * sell) / (1 * (this.assumingPrice * leverage) + sell))
        if(buyCanOpen >= Math.abs(positionAmt)){
          sellCanOpen = Math.max(0, (Math.min(crossWalletBalanceSing,availableBalance) + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage)))
        }
      }
      if(positionAmt < 0){
        buyCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage) + Math.abs(positionAmt) * 1 * buy ) / (1*(this.assumingPrice *  leverage) + buy))
        sellCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage) + sell))
        if (buyCanOpen >= Math.abs(positionAmt)) {
          buyCanOpen = Math.max(0, (Math.min(crossWalletBalanceSing,availableBalance) + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage)) / (1 * this.assumingPrice * leverage))
        }
      }
      // 第二步进行验证
      let afterTradeBuyIslated = Math.max(Math.abs( positionNotionalValue + this.computedBuyNetValue + this.assumingPrice * Number(buyCanOpen)
      ), Math.abs(markPrice * positionAmt - this.computedSellNetValue))

      // notional after trade = max(abs(position_notional_value + open order's bid_notional), abs(position_notional_value - open order's ask_notional - new order's ask_notional))
      let afterTradeSellIslated = Math.max(Math.abs( positionNotionalValue + this.computedBuyNetValue),
        Math.abs((markPrice * positionAmt) - this.computedSellNetValue - (this.assumingPrice * Number(sellCanOpen))))
      // 第三步，重新计算最大可开数量
      if(afterTradeBuyIslated > this.maxNotionalAtCurrentLeverage){
        buyCanOpen = (this.maxNotionalAtCurrentLeverage - positionNotionalValue - this.computedBuyNetValue) / this.assumingPrice
      }
      if(afterTradeSellIslated > this.maxNotionalAtCurrentLeverage){
        sellCanOpen =  (this.maxNotionalAtCurrentLeverage + positionNotionalValue - this.computedSellNetValue) / this.assumingPrice
        // console.info('sellCanOpen==',sellCanOpen)
      }
      sellCanOpen = sellCanOpen < 0 ? 0 : sellCanOpen
      buyCanOpen = buyCanOpen < 0 ? 0 : buyCanOpen
      // 如果是只减仓
      if(this.reducePositionsSelected && this.pendingOrderType == 'limitProfitStopLoss'){
        if(positionAmt > 0) {
          return this.orderType ? sellCanOpen = Math.abs(positionAmt) : buyCanOpen = 0
        }
        if(positionAmt < 0) {
          return this.orderType ? sellCanOpen = 0 : buyCanOpen = Math.abs(positionAmt)
        }
        return
      }
      return this.orderType ? sellCanOpen : buyCanOpen
      // console.info('单仓做多计算结果逐仓（BUY）',Math.max(0,(Math.min(crossWalletBalance,availableBalance) + initialMargin - ((markPrice * positionAmt + this.buyNetValue)*leverage)) / (1 * (this.assumingPrice * leverage) + buy)))
      // console.info('单仓做多计算结果逐仓（SELL）',Math.max(0,Math.min(crossWalletBalance,availableBalance) + initialMargin - ((markPrice*positionAmt + this.sellNetValue) * leverage) / (1*(this.assumingPrice*leverage) + sell)))
    }
    // 市价或者市价止盈止损
    if(this.pendingOrderType== 'marketPrice' || this.pendingOrderType == 'marketPriceProfitStopLoss'){
      if(positionAmt >= 0){
        buyCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin - ((positionNotionalValue + this.computedBuyNetValue)*leverage)) / (1 * (this.assumingPrice * leverage) + buyMarket))
        sellCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin + ((positionNotionalValue - this.computedSellNetValue)*leverage) + Math.abs(positionAmt) * 1 * sellMarket) / (1 * (this.assumingPrice * leverage) + sellMarket))
        if(buyCanOpen >= Math.abs(positionAmt)){
          sellCanOpen = Math.max(0, (Math.min(crossWalletBalanceSing,availableBalance) + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage)))
        }
      }
      if(positionAmt < 0){
        buyCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage) + Math.abs(positionAmt) * 1 * buy ) / (1*(this.assumingPrice *  leverage) + buy))
        sellCanOpen = Math.max(0,(Math.min(crossWalletBalanceSing,availableBalance) + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage) + sell))
        if (buyCanOpen >= Math.abs(positionAmt)) {
          buyCanOpen = Math.max(0, (Math.min(crossWalletBalanceSing,availableBalance) + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage)) / (1 * this.assumingPrice * leverage))
        }
      }

      // 第二步进行验证
      let afterTradeBuyIsolatedM = Math.max(Math.abs( positionNotionalValue + this.computedBuyNetValue + this.assumingPrice * Number(buyCanOpen)
      ), Math.abs(markPrice * positionAmt - this.computedSellNetValue))

      // notional after trade = max(abs(position_notional_value + open order's bid_notional), abs(position_notional_value - open order's ask_notional - new order's ask_notional))
      let afterTradeSellIsolatedM = Math.max(Math.abs( positionNotionalValue + this.computedBuyNetValue),
        Math.abs(positionNotionalValue - this.computedSellNetValue - (this.assumingPrice * Number(sellCanOpen))))

      // 第三步，重新计算最大可开数量
      if(afterTradeBuyIsolatedM > this.maxNotionalAtCurrentLeverage){
        buyCanOpen = (this.maxNotionalAtCurrentLeverage - positionNotionalValue - this.computedBuyNetValue) / this.assumingPrice
      }
      if(afterTradeSellIsolatedM > this.maxNotionalAtCurrentLeverage){
        sellCanOpen =  (this.maxNotionalAtCurrentLeverage + positionNotionalValue - this.computedSellNetValue) / this.assumingPrice
        // console.info('sellCanOpen==',sellCanOpen)
      }
      sellCanOpen = sellCanOpen < 0 ? 0 : sellCanOpen
      buyCanOpen = buyCanOpen < 0 ? 0 : buyCanOpen
      // 如果是只减仓
      if(this.reducePositionsSelected && this.pendingOrderType == 'marketPriceProfitStopLoss'){
        if(positionAmt > 0) {
          return this.orderType ? sellCanOpen = Math.abs(positionAmt) : buyCanOpen = 0
        }
        if(positionAmt < 0) {
          return this.orderType ? sellCanOpen = 0 : buyCanOpen = Math.abs(positionAmt)
        }
        return
      }
      // 将可平仓数量存储到store里面
      openAmountSingle = {
        openAmtBuy:buyCanOpen,
        openAmtSell:sellCanOpen,
      }
      this.$store.commit('CHANGE_OPEN_AMOUNT_SINGLE',openAmountSingle)
      return this.orderType ? sellCanOpen : buyCanOpen
    }
  }
}

// 双仓可开数量
root.computed.canBeOpened = function () {
  this.setPositionList
  // this.setPositionListWx
  // let crossWalletBalance = Number(this.crossWalletBalance) // 全仓钱包余额
  // 向上取整IMR
  let leverage = this.leverage
  let availableBalance = this.$store.state.assets.availableBalance || 0
  // let availableBalance = this.availableBalance || 0
  let markPrice = JSON.stringify(this.markPriceObj) != "{}" && Number(this.markPriceObj[this.capitalSymbol].p) || 0
  let price = Number(this.price) || 0 // 输入框价格
  // console.info(price)
  // console.info(markPrice)
  // let temp = this.orderType ? -1 : 1;
  // let priceStep = Math.abs(Math.min(0 , temp * (markPrice - price))) || 0  // TODO:简化后
  let buy = Math.abs(Math.min(0 , 1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sell = Math.abs(Math.min(0 , -1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  // let buyMarket = Math.abs(Math.min(0 , 1 * (markPrice - this.assumingPrice))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let buyMarket = Math.abs(Math.min(0 , 1 * (markPrice - (this.sellDepthOrders*(1 + 0.0005))))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  // let sellMarket = Math.abs(Math.min(0 , -1 * (markPrice - this.assumingPrice))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let sellMarket = Math.abs(Math.min(0 , -1 * (markPrice - this.buyDepthOrders))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  // let shortPositionAmt = Number(this.totalAmountShort) // TODO:有仓位时：数量取和；无仓位时取0
  // let longPositionAmt = Number(this.totalAmountLong) // TODO:有仓位时：数量取和；无仓位时取0

  //多仓位使用这个变量
  let positionNotionalLong,positionNotionalShort
  positionNotionalLong = this.notionalValueLong
  positionNotionalShort = this.notionalValueShort
  // console.info('positionNotionalLong==',positionNotionalLong,'positionNotionalShort===',positionNotionalShort)
  // console.info(this.notionalValueLong,this.notionalValueShort)

  let buyCanOpen = 0
  let sellCanOpen = 0
  let afterTradeBuy = 0
  let afterTradeSell = 0
  let openAmount

  // if(this.marginType == 'CROSSED'){
    // 限价或者限价止损
    if(this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
      // if(this.price == 0 || this.price == '') return buyCanOpen = 0; sellCanOpen = 0;
      //Avail for Order / {assuming price * IM + abs(min[0, side * (mark price - order's Price)])}
      // buyCanOpen = availableBalance / (this.assumingPrice * leverage + buy)
      buyCanOpen = this.accDiv(availableBalance,(this.assumingPrice * leverage + buy))
      sellCanOpen = this.accDiv(availableBalance,(this.assumingPrice * leverage + sell))
      // 根据买卖最大可下单量计算出notional after trade
      // 计算可开多数量
      let afterTradeLongB = Math.max(Math.abs( positionNotionalLong + this.computedBuyNetValue + (this.assumingPrice * Number(buyCanOpen))), Math.abs(positionNotionalLong - this.computedSellNetValue))
      // let afterTradeShortB = Math.max(Math.abs( positionNotionalShort + this.computedBuyNetValue), Math.abs(positionNotionalShort - this.computedSellNetValue))
      let afterTradeShortB = Math.max(Math.abs( positionNotionalLong + this.computedBuyNetValue), Math.abs(positionNotionalLong - this.computedSellNetValue))

      // 计算可开空数量
      // let afterTradeLongS = Math.max(Math.abs( positionNotionalLong + this.computedBuyNetValue), Math.abs(positionNotionalLong - this.computedSellNetValue))
      let afterTradeLongS = Math.max(Math.abs( positionNotionalShort + this.computedBuyNetValue), Math.abs(positionNotionalShort - this.computedSellNetValue))
      let afterTradeShortS = Math.max(Math.abs(positionNotionalShort + this.computedBuyNetValue), Math.abs(positionNotionalShort - this.computedSellNetValue + (this.assumingPrice * Number(sellCanOpen))))

      afterTradeBuy = afterTradeLongB + afterTradeShortB
      afterTradeSell = afterTradeLongS + afterTradeShortS
      // if(this.maxNotionalAtCurrentLeverage == undefined){
      //   console.info('this.maxNotionalAtCurrentLeverage',this.maxNotionalAtCurrentLeverage)
      // }
      if(afterTradeBuy > this.maxNotionalAtCurrentLeverage) {
        buyCanOpen = (this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPrice
      }
      if(afterTradeSell > this.maxNotionalAtCurrentLeverage) {
        sellCanOpen = (this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPrice
      }
      sellCanOpen = sellCanOpen < 0 ? 0 : sellCanOpen
      buyCanOpen = buyCanOpen < 0 ? 0 : buyCanOpen
      // console.info('buyCanOpen===',longPositionAmt * markPrice)
      // console.info('sellCanOpen===',shortPositionAmt * markPrice)
      return this.orderType ? sellCanOpen : buyCanOpen
      // Qty = Avail for Order / {assuming price * IM + abs(min[0, side * (mark price - order's Price)])}
    }

    // 市价或者市价止盈止损
    if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
      // buyCanOpen = availableBalance / (this.assumingPrice * leverage + buyMarket)
      buyCanOpen = availableBalance / (((this.sellDepthOrders*(1 + 0.0005)) * leverage + buyMarket) || 1)

      // console.info('buyCanOpen',buyCanOpen,availableBalance,this.assumingPrice,leverage,buyMarket)
      // console.info('this.sellDepthOrders',this.sellDepthOrders,'this.buyDepthOrders',this.buyDepthOrders)
      // sellCanOpen = availableBalance / (this.assumingPrice * leverage + sellMarket)
      sellCanOpen = availableBalance / (this.buyDepthOrders * leverage + sellMarket)
      // 计算可开多数量
      let afterTradeLongB = Math.max(Math.abs( positionNotionalLong + this.computedBuyNetValue + this.assumingPrice * Number(buyCanOpen)), Math.abs(positionNotionalLong - this.computedSellNetValue))
      // let afterTradeLongB = Math.max(Math.abs( positionNotionalLong + this.computedBuyNetValue + ((this.sellDepthOrders*(1 + 0.0005)) * Number(buyCanOpen))), Math.abs(positionNotionalLong - this.computedSellNetValue))
      // let afterTradeShortB = Math.max(Math.abs(positionNotionalShort + this.computedBuyNetValue) || 0, Math.abs(positionNotionalShort - this.computedSellNetValue) || 0)
      let afterTradeShortB = Math.max(Math.abs(positionNotionalLong + this.computedBuyNetValue) || 0, Math.abs(positionNotionalLong - this.computedSellNetValue) || 0)

      // 计算可开空数量
      // let afterTradeLongS = Math.max(Math.abs( positionNotionalLong + this.computedBuyNetValue), Math.abs(positionNotionalLong - this.computedSellNetValue))
      let afterTradeLongS = Math.max(Math.abs( positionNotionalShort + this.computedBuyNetValue), Math.abs(positionNotionalShort - this.computedSellNetValue))
      // let afterTradeShortS = Math.max(Math.abs(positionNotionalShort + this.computedBuyNetValue), Math.abs(positionNotionalShort - this.computedSellNetValue + this.buyDepthOrders * Number(sellCanOpen)))
      let afterTradeShortS = Math.max(Math.abs(positionNotionalShort + this.computedBuyNetValue), Math.abs(positionNotionalShort - this.computedSellNetValue + this.assumingPrice * Number(sellCanOpen)))

      afterTradeBuy = afterTradeLongB + afterTradeShortB
      afterTradeSell = afterTradeLongS + afterTradeShortS
      // console.info('afterTradeBuy==',this.assumingPrice,buyCanOpen,'afterTradeSell',afterTradeSell)
      // if(this.maxNotionalAtCurrentLeverage == undefined || this.maxNotionalAtCurrentLeverage == 0){
      //   console.info('this.maxNotionalAtCurrentLeverage',this.maxNotionalAtCurrentLeverage)
      // }
      if(afterTradeBuy > this.maxNotionalAtCurrentLeverage) {
        // buyCanOpen =(this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / (this.sellDepthOrders*(1 + 0.0005))
        buyCanOpen =(this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPrice
      }
      if(afterTradeSell > this.maxNotionalAtCurrentLeverage) {
        // sellCanOpen =(this.maxNotionalAtCurrentLeverage - (afterTradeShortS + afterTradeLongB)) / this.buyDepthOrders
        sellCanOpen =(this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPrice
      }
      // console.info('this is sellCanOpen==',sellCanOpen)
      sellCanOpen = sellCanOpen < 0 ? 0 : sellCanOpen
      buyCanOpen = buyCanOpen < 0 ? 0 : buyCanOpen
      // 将可平仓数量存储到store里面
      openAmount = {
        openAmtLong:buyCanOpen,
        openAmtShort:sellCanOpen,
      }
      this.$store.commit('CHANGE_OPEN_AMOUNT',openAmount)
      return this.orderType ? sellCanOpen : buyCanOpen
    }
  // }
  // 双仓逐仓
  // if(this.marginType == 'ISOLATED'){
  //   // 限价或者限价止损
  //   if(this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
  //     if(this.price == 0 || this.price == '') return buyCanOpen = 0; sellCanOpen = 0;
  //     //Avail for Order / {assuming price * IM + abs(min[0, side * (mark price - order's Price)])}
  //     buyCanOpen = Math.min(crossWalletBalance,availableBalance) / (this.assumingPrice * leverage + buy)
  //     sellCanOpen = Math.min(crossWalletBalance,availableBalance) / (this.assumingPrice * leverage + sell)
  //     // 根据买卖最大可下单量计算出notional after trade
  //     // 计算可开多数量
  //     let afterTradeLongB = Math.max(Math.abs( markPrice * positionAmt + this.computedBuyNetValue + this.assumingPrice * Number(buyCanOpen)), Math.abs(markPrice * positionAmt - this.computedSellNetValue))
  //     let afterTradeShortB = Math.max(Math.abs(markPrice * positionAmt + this.computedBuyNetValue), Math.abs(markPrice * positionAmt - this.computedSellNetValue))
  //     afterTradeBuy = afterTradeLongB + afterTradeShortB
  //
  //     // 计算可开空数量
  //     let afterTradeLongS = Math.max(Math.abs( markPrice * positionAmt + this.computedBuyNetValue), Math.abs(markPrice * positionAmt - this.computedSellNetValue))
  //     let afterTradeShortS = Math.max(Math.abs(markPrice * positionAmt + this.computedBuyNetValue), Math.abs(markPrice * positionAmt - this.computedSellNetValue + this.assumingPrice * Number(sellCanOpen)))
  //     afterTradeSell = afterTradeLongS + afterTradeShortS
  //
  //     if(afterTradeBuy > this.maxNotionalAtCurrentLeverage) {
  //       buyCanOpen =(this.maxNotionalAtCurrentLeverage - afterTradeShortB) / this.assumingPrice
  //     }
  //     if(afterTradeSell > this.maxNotionalAtCurrentLeverage) {
  //       sellCanOpen =(this.maxNotionalAtCurrentLeverage - afterTradeLongS) / this.assumingPrice
  //     }
  //
  //     return this.orderType ? sellCanOpen : buyCanOpen
  //     // Qty = Avail for Order / {assuming price * IM + abs(min[0, side * (mark price - order's Price)])}
  //   }
  //   // 市价或者市价止盈止损
  //   if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
  //     buyCanOpen = Math.min(crossWalletBalance,availableBalance) / (this.assumingPrice * leverage + buyMarket)
  //     sellCanOpen = Math.min(crossWalletBalance,availableBalance) / (this.assumingPrice * leverage + sellMarket)
  //     // 计算可开多数量
  //     let afterTradeLongB = Math.max(Math.abs( markPrice * positionAmt + this.computedBuyNetValue + this.assumingPrice * Number(buyCanOpen)), Math.abs(markPrice * positionAmt - this.computedSellNetValue))
  //     let afterTradeShortB = Math.max(Math.abs(markPrice * positionAmt + this.computedBuyNetValue), Math.abs(markPrice * positionAmt - this.computedSellNetValue))
  //     afterTradeBuy = afterTradeLongB + afterTradeShortB
  //     if(afterTradeBuy > this.maxNotionalAtCurrentLeverage) {
  //       buyCanOpen =(this.maxNotionalAtCurrentLeverage - afterTradeShortB) / this.assumingPrice
  //     }
  //
  //     // 计算可开空数量
  //     let afterTradeLongS = Math.max(Math.abs( markPrice * positionAmt + this.computedBuyNetValue), Math.abs(markPrice * positionAmt - this.computedSellNetValue))
  //     let afterTradeShortS = Math.max(Math.abs(markPrice * positionAmt + this.computedBuyNetValue), Math.abs(markPrice * positionAmt - this.computedSellNetValue + this.assumingPrice * Number(sellCanOpen)))
  //     afterTradeSell = afterTradeLongS + afterTradeShortS
  //     if(afterTradeSell > this.maxNotionalAtCurrentLeverage) {
  //       sellCanOpen =(this.maxNotionalAtCurrentLeverage - afterTradeLongS) / this.assumingPrice
  //     }
  //
  //     console.info('sellCanOpen===',sellCanOpen)
  //     console.info('buyCanOpen===',buyCanOpen)
  //     return this.orderType ? sellCanOpen : buyCanOpen
  //   }
  // }
}

//以下为保证金计算 ==============S

////计算Sell的margin required时
root.computed.sellMarginRequire = function () {
  // return this.orderType ? (this.costAssumingPrice * 1 * this.amount) : 0
  return this.orderType ? this.chainCal().accMul(this.costAssumingPrice, 1).accMul(Number(this.amount)).getResult() : 0
}
//计算BUY的margin required时
root.computed.buyMarginRequire = function () {
  // return this.orderType ?  0 : (this.costAssumingPrice * 1 * this.amount)
  return this.orderType ?  0 : this.chainCal().accMul(this.costAssumingPrice, 1).accMul(Number(this.amount)).getResult()
}
//有仓位 标记价格*数量 无仓位 0
root.computed.positionNotionalValue = function () {
  let markPrice = JSON.stringify(this.markPriceObj) != "{}" && this.markPriceObj[this.capitalSymbol].p || 0
  return (this.totalAmount != 0) ? this.accMul(markPrice, this.totalAmount) : 0
}

 // TODO: 合并完代码记得修改未提出来部分
// 杠杆  开仓保证金率
root.computed.leverage = function () {
  return Number(this.$globalFunc.accFixedCny(this.accDiv(1 , Number(this.$store.state.leverage) || 1),4))
  // return this.$globalFunc.accFixedCny(this.accDiv(1 , this.$store.state.leverage || 1),4)
}
//新委托实际数量
root.computed.newOrderActualAmount = function () {
  if (Number(this.totalAmount) >= 0) {
    // return this.orderType ? Math.max(0,Number(this.amount) - Math.abs(Number(this.totalAmount))) : Number(this.amount)
    return this.orderType ? Math.max(0,this.accMinus(Number(this.amount), Math.abs(this.totalAmount))) : Number(this.amount)
  }
  if (Number(this.totalAmount) < 0) {
    // return this.orderType ? Number(this.amount) : Math.max(0,Number(this.amount) + Math.abs(Number(this.totalAmount)))
    return this.orderType ? Number(this.amount) : Math.max(0,this.accAdd(Number(this.amount), Math.abs(this.totalAmount)))
  }
}
//双 向的assumingPrice===========
root.computed.twoWayAssumingPrice = function () {
  // if(JSON.stringify(this.markPriceObj) == "{}")return
  let twoWayAssumingPrc = 0,markPrice = JSON.stringify(this.markPriceObj) != "{}" && this.markPriceObj[this.capitalSymbol].p
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    // twoWayAssumingPrc = this.orderType ? Math.max(this.buyDepthOrders,(Number(this.markPrice),this.price)) : this.price
    twoWayAssumingPrc = this.orderType ? Math.max(this.buyDepthOrders,(markPrice,this.price)) : this.price
    return Number(twoWayAssumingPrc) || 0
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    // twoWayAssumingPrc = this.orderType ? Math.max(this.buyDepthOrders, (Number(this.markPrice))) : this.sellDepthOrders * (1+0.0005)
    twoWayAssumingPrc = this.orderType ? Math.max(this.buyDepthOrders, (markPrice)) : this.accMul(this.sellDepthOrders, this.accAdd(1, 0.0005))
    return Number(twoWayAssumingPrc) || 0
  }
}
// 保证金计算
root.computed.securityDeposit = function () {
  let markPrice = JSON.stringify(this.markPriceObj) != "{}" && this.markPriceObj[this.capitalSymbol].p
  // 单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
  if (this.positionModeFirst == 'singleWarehouseMode') {
    //下单所需保证金
    // let presentNotional = Number(Math.max(Math.abs((this.positionNotionalValue + this.computedBuyNetValue), Math.abs(this.positionNotionalValue - this.computedSellNetValue))))
    // let totalAfterTrade = Number(Math.max(Math.abs(this.positionNotionalValue + this.computedBuyNetValue + this.buyMarginRequire), Math.abs(this.positionNotionalValue - this.computedSellNetValue - this.sellMarginRequire)))
    // let presentTotalInitialMargin = Number(presentNotional * this.leverage)
    // let assumingTotalInitialMargin = Number(totalAfterTrade * this.leverage)
    // let marginReuired = Number(Math.max(assumingTotalInitialMargin - presentTotalInitialMargin, 0))  //TODO: 结果

    let presentNotional = Math.max(Math.abs(this.accAdd(this.positionNotionalValue, this.computedBuyNetValue), Math.abs(this.accMinus(this.positionNotionalValue, this.computedSellNetValue))))
    let totalAfterTrade = Math.max(Math.abs(this.chainCal().accAdd(this.positionNotionalValue, this.computedBuyNetValue).accAdd(this.buyMarginRequire).getResult()), Math.abs(this.chainCal().accMinus(this.positionNotionalValue, this.computedSellNetValue).accMinus(this.sellMarginRequire).getResult()))
    let presentTotalInitialMargin = this.accMul(presentNotional, this.leverage)
    let assumingTotalInitialMargin = this.accMul(totalAfterTrade, this.leverage)
    let marginReuired = Math.max(this.accMinus(assumingTotalInitialMargin, presentTotalInitialMargin), 0)  //TODO: 结果
    //开仓亏损
    let openLost
    //限价和限价止损单
    if (this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss') {
      // openLost = Number(this.newOrderActualAmount * 1 * Math.abs(Math.min(0, (this.orderType ? -1 : 1) * (Number(this.markPrice) - Number(this.price)))))
      let lost = this.accMul((this.orderType ? -1 : 1), this.accMinus(markPrice, this.price))
      openLost = this.chainCal().accMul(this.newOrderActualAmount, 1).accMul(Math.abs(Math.min(0, lost))).getResult()
    }
    //市价和市价止损单
    if (this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss') {
      // openLost = Number(this.newOrderActualAmount * 1 * Math.abs(Math.min(0, (this.orderType ? -1 : 1) * (Number(this.markPrice) - Number(this.costAssumingPrice)))))
      let openL = Math.abs(Math.min(0, this.accMul((this.orderType ? -1 : 1), this.accMinus(markPrice, this.costAssumingPrice))))
      openLost = this.chainCal().accMul(this.newOrderActualAmount, 1).accMul(openL).getResult()
    }
    //开仓成本
    let cost = this.chainCal().accAdd(marginReuired, openLost).proFixed(2).getResult()
    // console.info('this is twoWayCost ===',cost)

    return cost
  }

  if (this.positionModeFirst == 'doubleWarehouseMode') {
    // let twoWaymarginReuired = Number(this.twoWayAssumingPrice * Number(this.amount || 0) * this.leverage)
    let twoWaymarginReuired = this.chainCal().accMul(this.twoWayAssumingPrice, Number(this.amount)).accMul(this.leverage).getResult()
    //开仓亏损
    let twoWayopenLost
    //限价和限价止损单
    if (this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss') {
      // twoWayopenLost = Number(Number(this.amount || 0) * Math.abs(Math.min(0,(this.orderType ? -1 : 1) * (Number(this.markPrice) - this.price))))
      let twoLost = this.accMul((this.orderType ? -1 : 1), this.accMinus(markPrice, this.price))
      twoWayopenLost = this.accMul(Number(this.amount), Math.abs(Math.min(0,twoLost)))
    }
    //市价和市价止损单
    if (this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss') {
      // twoWayopenLost = Number(Number(this.amount || 0) * Math.abs(Math.min(0,(this.orderType ? -1 : 1) * (Number(this.markPrice) - this.twoWayAssumingPrice))))
      let twoOpenL = this.accMul((this.orderType ? -1 : 1), this.accMinus(markPrice, this.twoWayAssumingPrice))
      twoWayopenLost = this.accMul(Number(this.amount), Math.abs(Math.min(0,twoOpenL)))
    }

    //开仓成本
    let twoWayCost = this.chainCal().accAdd(twoWaymarginReuired, twoWayopenLost).proFixed(2).getResult()
    // console.info('this is twoWayCost ===',twoWayCost)

    return twoWayCost
  }
}
//以下为保证金计算 ==============E

/*----------------------------- 计算 end ------------------------------*/


/*----------------------------- 方法 begin ------------------------------*/
//设置单仓仓位数量
root.methods.setTotalAmount = function(totalAmount){
  this.totalAmount = totalAmount
}
//设置双仓开多仓位数量
root.methods.setTotalAmountLong = function(totalAmountLong){
  this.totalAmountLong = totalAmountLong
}
//设置双仓开空仓位数量
root.methods.setTotalAmountShort = function(totalAmountShort){
  this.totalAmountShort = totalAmountShort
}
//设置双仓开空仓位数量
root.methods.setCurrentOrders = function(currentOrders){
  this.currentOrders = [...currentOrders]
}


// root.methods.setPositionListQq = function(total){
//   this.positionInfoData = total
// }
// root.computed.setPositionListWx = function () {
//   //单仓和双仓空仓使用num ,双仓多仓使用numLong
//   let num = 0,numLong = 0,numBoth = 0
//   for (let v = 0,len = this.positionInfoData.length; v < len; v++) {
//     let vData = this.positionInfoData[v],symbol = vData.symbol,positionAmt = Number(vData.positionAmt);
//     if(vData.positionSide=='BOTH'){
//       numBoth += Number(this.accMul(positionAmt, Number(this.markPriceObj[symbol].p)))
//     }
//     if(vData.positionSide=='LONG'){
//       numLong += Number(this.accMul(positionAmt, Number(this.markPriceObj[symbol].p)))
//     }
//     if(vData.positionSide=='SHORT'){
//       num += Number(this.accMul(Math.abs(positionAmt), Number(this.markPriceObj[vData.symbol].p)))
//     }
//   }
//   // 单仓的 position_notional_value
//   this.notionalValueBoth = numBoth
//   console.info(this.notionalValueBoth)
//   // 双仓空仓的 position_notional_value
//   this.notionalValueShort = num
//   // 双仓多仓的 position_notional_value
//   this.notionalValueLong = numLong
//   return
// }





// //设置委托做多总数量
// root.methods.setOpenOrdersBuyAmt = function(totalAmount){
//   this.openOrdersBuyTotal = totalAmount
//   console.info('this is openOrdersTotalBuy====',this.openOrdersBuyTotal)
// }
// //设置委托做空总数量
// root.methods.setOpenOrdersSellAmt = function(totalAmount){
//   this.openOrdersSellTotal = totalAmount
//   console.info('this is openOrdersTotalSell====',this.openOrdersSellTotal)
// }

// socket推送
root.methods.initSocket = function (){
  // 获取买卖单净值
  this.$socket.on({
    key: 'ORDER_TRADE_UPDATE', bind: this, callBack: (messageObj, stream) => {
      let message = messageObj.o || {}
      if (!message) return
      this.buyNetValue = Number(message.b) || 0
      this.sellNetValue = Number(message.a) || 0
    }
  })
  // // 获取深度图信息
  // this.$socket.on({
  //   key: 'depthUpdate', bind: this, callBack: (message) => {
  //     // console.log('depth is ===',message);
  //     this.bidPrice = Number(message.b[0][0]);
  //     this.askPrice = Number(message.a[0][0]);
  //   }
  // })
}
// 处理滑动条显示框内容
root.methods.formatTooltip=(val)=>{
  return val + '%';
}
/*---------------------- hover弹框 begin ---------------------*/
root.methods.closePositionBox= function (name) {
  $("." + name).attr("style","display:none");
}
root.methods.openPositionBox = function (name) {
  $("." + name).attr("style","display:block");
}
/*---------------------- hover弹框 end ---------------------*/


/*----------------------------- 方法 ------------------------------*/

//开启拦截弹窗
root.methods.openSplicedFrame = function (btnText,callFuncName) {

  if(!this.openClosePsWindowClose())return

  this.splicedFrameText = "";

  let triggerArr = ['limitProfitStopLoss','marketPriceProfitStopLoss'];
  //拼接触发价格
  if(triggerArr.includes(this.pendingOrderType)){
   this.splicedFrameText += ('触发价' + this.triggerPrice + 'USDT，')
  }
  //限价价格
  if(this.pendingOrderType.indexOf('limit') >-1){
    this.splicedFrameText += ('价格' + this.price + 'USDT，')
  }
  //当前市价
  if(this.pendingOrderType.indexOf('market') > -1){
    this.splicedFrameText += ('交易方式为市价，')
  }
  //数量
  this.splicedFrameText += ('数量' + this.amount + this.symbol.split('_')[0])
  //操作类型
  this.splicedFrameText += ('，确定'+btnText + '?')

  this.callFuncName = callFuncName;
  this.showSplicedFrame = true
}
//关闭下单弹框
root.methods.confirmFrame = function () {
  if(this.loading)return false
  this[this.callFuncName]();//调用对应的接口
  this.showSplicedFrame = false
}
//关闭下单弹框
root.methods.closeFrame = function () {
  this.showSplicedFrame = false
}


// 关闭平仓弹框
root.methods.closePsWindowClose = function (){
  this.closePsWindowOpen = false
}
// 非法数据拦截
root.methods.openClosePsWindowClose = function (){
    // 限价价格非空判断
  let limitArr = ['limitProfitStopLoss','limitPrice'],triggerArr = ['limitProfitStopLoss','marketPriceProfitStopLoss'],closeAmountArr = ['totalAmountShort','totalAmountLong']

  if(this.loading)return false

  if(triggerArr.includes(this.pendingOrderType) && (this.triggerPrice == '' || this.triggerPrice == 0)){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的触发价格';
    this.loading = false
    this.currentLimiting = false
    return false
  }

  if(limitArr.includes(this.pendingOrderType) && (this.price == '' || this.price == 0)){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的价格';
    this.loading = false
    this.currentLimiting = false
    return false
  }

  if(this.amount == '' || this.amount == 0){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的数量';
    this.loading = false
    this.currentLimiting = false
    return false
  }
  //平仓数量超出提示
  // if(this.positionModeSecond == 'closeWarehouse' && ((!this.orderType && Math.abs(this.positionAmtShort) < Number(this.amount)) || (this.orderType && Math.abs(this.positionAmtLong) < Number(this.amount))) ){
  if(this.positionModeSecond == 'closeWarehouse' && Math.abs(this[closeAmountArr[this.orderType]]) < Number(this.amount)) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '您输入的数量超过可平数量';
    this.currentLimiting = false
    this.loading = false
    return false
  }

  return true
}
// 平仓确定按钮
// root.methods.closePositions = function (){
//   if(this.positionModeSecond == 'closeWarehouse' && this.pendingOrderType =="marketPrice"){
//     this.postOrdersPosition()
//   }
//   // if(this.positionModeSecond == 'closeWarehouse' && this.pendingOrderType =="marketPriceProfitStopLoss"){
//   //   this.postFullStop()
//   //   this.closePsWindowClose()
//   // }
// }
// 止盈止损接口
root.methods.postFullStop = function () {
  this.loading = true

  // if(JSON.stringify(this.markPriceObj) == "{}")return
  let params = {},markPrice = JSON.stringify(this.markPriceObj) != "{}" && this.markPriceObj[this.capitalSymbol].p
  let latestOrMarkPrice = this.latestPrice == '最新价格' ? Number(this.latestPriceVal) : Number(markPrice)
  // 如果是平空或者平多，买入量不得大于可平数量
  if((this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3) && ((!this.orderType && Math.abs(this.totalAmountShort) < Number(this.amount)) || (this.orderType && Math.abs(this.totalAmountLong) < Number(this.amount)))){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '您输入的数量超过可平数量';
    this.currentLimiting = false
    this.loading = false
    return
  }
  if(this.amount == '' || this.amount == 0){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的数量';
    this.loading = false
    this.currentLimiting = false
    return
  }
  if(this.triggerPrice == ''){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的触发价格';
    this.loading = false
    this.currentLimiting = false
    return
  }
  // 单仓 限价止盈止损
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'limitProfitStopLoss') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: "BOTH",
      price: this.price ? this.price : this.latestPriceVal,
      quantity: Number(this.amount),
      reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: this.triggerPrice,
      symbol: this.capitalSymbol,
      timeInForce: this.effectiveTime,
      orderType: (this.orderType && Number(this.triggerPrice) < latestOrMarkPrice) || (!this.orderType && (Number(this.triggerPrice) >= latestOrMarkPrice)) ? "STOP" : "TAKE_PROFIT",
      workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
    }
  }
  // 单仓 市价止盈止损
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'marketPriceProfitStopLoss') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: "BOTH",
      quantity: Number(this.amount),
      reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: this.triggerPrice,
      symbol: this.capitalSymbol,
      orderType: (this.orderType && (Number(this.triggerPrice) < latestOrMarkPrice)) || (!this.orderType && (Number(this.triggerPrice) >= latestOrMarkPrice)) ? "STOP_MARKET" : "TAKE_PROFIT_MARKET",
      workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
    }
  }
  // 双仓 开仓 限价止盈止损
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 2 && this.pendingOrderType == 'limitProfitStopLoss') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'SHORT':'LONG',
      price: this.price,
      quantity: Number(this.amount),
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: this.triggerPrice,
      symbol: this.capitalSymbol,
      timeInForce: this.effectiveTime,
      orderType: ((this.orderType && (Number(this.triggerPrice) < latestOrMarkPrice)) || (!this.orderType && (Number(this.triggerPrice) >= latestOrMarkPrice))) ? 'STOP' : 'TAKE_PROFIT',
      workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
    }
  }
  // 双仓 开仓 市价止盈止损
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 2 && this.pendingOrderType == 'marketPriceProfitStopLoss') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'SHORT':'LONG',
      quantity: Number(this.amount),
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: this.triggerPrice,
      symbol: this.capitalSymbol,
      orderType: ((!this.orderType && Number(this.triggerPrice) < latestOrMarkPrice) || (this.orderType && Number(this.triggerPrice) >= latestOrMarkPrice)) ? "TAKE_PROFIT_MARKET" : "STOP_MARKET",
      workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
    }
  }
  // 双仓 平仓 限价止盈止损
  if (this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3 && this.pendingOrderType == 'limitProfitStopLoss') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'LONG':'SHORT',
      price: this.price,
      quantity: Number(this.amount),
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: this.triggerPrice,
      symbol: this.capitalSymbol,
      timeInForce: this.effectiveTime,
      orderType: ((this.orderType && Number(this.triggerPrice) < latestOrMarkPrice)||(!this.orderType && Number(this.triggerPrice) >= latestOrMarkPrice)) ? 'STOP':'TAKE_PROFIT',
      workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
    }
  }
  // 双仓 平仓 市价止盈止损
  if (this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3 && this.pendingOrderType == 'marketPriceProfitStopLoss') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'LONG':'SHORT',
      quantity: Number(this.amount),
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: this.triggerPrice,
      symbol: this.capitalSymbol,
      orderType: ((this.orderType && Number(this.triggerPrice) < latestOrMarkPrice) || (!this.orderType && Number(this.triggerPrice) >=  latestOrMarkPrice)) ? "STOP_MARKET" : "TAKE_PROFIT_MARKET",
      workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
    }
  }
  // Object.assign(params, {type: "LIMIT",});
  this.$http.send('POST_STOP_POSITION',{
    bind: this,
    params,
    callBack: this.re_postFullStop,
    errorHandler: this.error_postFullStop
  })
}
root.methods.re_postFullStop = function (data) {
  this.currentLimiting = false
  this.loading = false

  if(data.code == 303 && data.errCode == '2022') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';
    return
  }

  if(data.code == '303' && data.errCode == '2019') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '杠杆账户余额不足';//杠杆账户余额不足
    return
  }
  if(data.code == '303' && data.errCode == '4061') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == '303' && data.errCode == '4077') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }

  if(data.code == '303' && data.errCode == '2021') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单可能被立刻触发';//当前无仓位，不能下单
    return
  }
  if(data.code == '303') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';//当前无仓位，不能下单
    return
  }

  if(data.code == '304') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '用户无权限';//用户无权限
    return
  }
  if(data.code == '305') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '合约带单暂不支持限价交易';//用户无权限
    return
  }
  if(data.code == '307') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '仓位模式变更同步中，请于1分钟后操作';//仓位模式变更同步中，请于1分钟后操作
    return
  }
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.data) return
  this.promptOpen = true;
  // 监听仓位和委托单条数
  this.$eventBus.notify({key:'GET_ORDERS'})
  this.$eventBus.notify({key:'GET_POSITION'})
  this.$eventBus.notify({key:'GET_BALANCE'})
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
  this.popType = 0;
  this.popText = '下单失败';
}
root.methods.error_postFullStop = function (err) {
  console.info('止盈止损接口错误回调',err)
}

// 开仓
root.methods.postOrdersCreate = function () {
  this.loading = true
  if(this.amount == ''|| this.amount == 0){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的数量';
    this.loading = false
    this.currentLimiting = false
    return
  }
  let params = {}
  // 单仓 限价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'limitPrice' && this.checkPrice != '2') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: "BOTH",
      price: this.price ? this.price.toString() : this.latestPriceVal,
      quantity: Number(this.amount),
      reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: null,
      symbol: this.capitalSymbol,
      timeInForce: this.effectiveTime,
      orderType: "LIMIT",
      workingType: null
    }
  }
  // 单仓 市价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'marketPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: "BOTH",
      // price: this.latestPriceVal,
      quantity: Number(this.amount),
      reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      symbol: this.capitalSymbol,
      orderType: "MARKET",
    }
  }
  // 双仓 限价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 2 && this.pendingOrderType == 'limitPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'SHORT' : 'LONG',
      price: this.price ? this.price : this.latestPriceVal,
      quantity: Number(this.amount),
      // reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      symbol: this.capitalSymbol,
      timeInForce: this.effectiveTime,
      orderType: "LIMIT",
    }
  }
  // 双仓 市价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 2 && this.pendingOrderType == 'marketPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'SHORT' : 'LONG',  // 开多传 "LONG" ，开空传 "SHORT"
      // price: this.latestPriceVal,
      quantity: Number(this.amount),
      // reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      symbol: this.capitalSymbol,
      orderType: "MARKET",
    }
  }
  this.$http.send('POST_ORDERS_CREATE',{
    bind: this,
    params,
    callBack: this.re_postOrdersCreate,
    errorHandler: this.error_postOrdersCreate
  })
}
root.methods.re_postOrdersCreate = function (data) {
  this.currentLimiting = false
  this.loading = false
  if(data.code == 303 && data.errCode == 2022) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';
    return
  }

  if(data.code == '303' && data.errCode == '2019') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '杠杆账户余额不足';//当前无仓位，不能下单
    return
  }

  if(data.code == '303' && data.errCode == '4061') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == '303' && data.errCode == '4077') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }

  if(data.code == '303' && data.errCode == '2021') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单可能被立刻触发';//当前无仓位，不能下单
    return
  }
  if(data.code == '303') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';//当前无仓位，不能下单
    return
  }

  if(data.code == '304') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '用户无权限';//用户无权限
    return
  }
  if(data.code == '305') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '合约带单暂不支持限价交易';//用户无权限
    return
  }

  if(data.code == '307') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '仓位模式变更同步中，请于1分钟后操作';//仓位模式变更同步中，请于1分钟后操作
    return
  }
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.data) return
  // console.info('下单失败',data,data.errCode,data.code)
  this.promptOpen = true;
  // 当前委托
  this.$eventBus.notify({key:'GET_ORDERS'})
  this.$eventBus.notify({key:'GET_POSITION'})
  this.$eventBus.notify({key:'GET_BALANCE'})
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
  this.popType = 0;
  this.popText = '下单失败';
}
root.methods.error_postOrdersCreate = function (err) {
  console.info('err======',err)
}

// 平仓
root.methods.postOrdersPosition = function () {
  this.loading = true
  if(this.amount == '' || this.amount == 0){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '请输入正确的数量';
    this.loading = false
    this.currentLimiting = false
    return
  }
  let params = {}
  // 双仓 平仓 限价 平多 传LONG ; 平空 传SHORT
  if (this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3 && this.pendingOrderType == 'limitPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? "LONG":'SHORT',
      // price: this.latestPriceVal,
      price: this.price,
      quantity: Number(this.amount),
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: null,
      symbol: this.capitalSymbol,
      timeInForce: this.effectiveTime,
      orderType: "LIMIT",
      workingType: null,
    }
  }
  // 双仓 平仓 市价  平多 传LONG ; 平空 传SHORT
  if (this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3 && this.pendingOrderType == 'marketPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? "LONG":'SHORT',
      quantity: Number(this.amount),
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: null,
      symbol: this.capitalSymbol,
      orderType: "MARKET",
    }
  }
  // 如果是平空或者平多，买入量不得大于可平数量
  if((!this.orderType && Math.abs(this.totalAmountShort) < Number(this.amount)) || (this.orderType && Math.abs(this.totalAmountLong) < Number(this.amount))){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '您输入的数量超过可平数量';
    this.currentLimiting = false
    this.loading = false
    return
  }

  this.$http.send('POST_ORDERS_POSITION',{
    bind: this,
    params,
    callBack: this.re_postOrdersPosition,
    errorHandler: this.error_postOrdersPosition
  })
}
root.methods.re_postOrdersPosition = function (data) {
  // console.info('下单失败',data,data.code,data.errCode)
  this.currentLimiting = false
  this.loading = false

  // if(data.code == '303' && data.errCode == '2022') {
  //   this.promptOpen = true;
  //   this.popType = 0;
  //   this.popText = '下单失败';//当前无仓位，不能下单
  //   return
  // }
  // if(data.code == '303' && data.errCode == '2021') {
  //   this.promptOpen = true;
  //   this.popType = 0;
  //   this.popText = '订单可能被立刻触发';//当前无仓位，不能下单
  //   return
  // }
  if(data.code == '303') {
    this.promptOpen = true;
    this.popType = 0;
    if(data.errCode == '2022'){
      this.popText = '下单失败';//当前无仓位，不能下单
      return
    }
    if(data.errCode == '2021'){
      this.popText = '订单可能被立刻触发';//当前无仓位，不能下单
      return
    }
    this.popText = '下单失败';//当前无仓位，不能下单
    return
  }
  if(data.code == '303' && data.errCode == '2019') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '杠杆账户余额不足';//当前无仓位，不能下单
    return
  }

  if(data.code == '303' && data.errCode == '4061') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }
  if(data.code == '303' && data.errCode == '4077') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单的持仓方向和用户设置不一致';//订单的持仓方向和用户设置不一致
    return
  }

  if(data.code == '303' && data.errCode == '2021') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '订单可能被立刻触发';//当前无仓位，不能下单
    return
  }
  if(data.code == '303') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '下单失败';//当前无仓位，不能下单
    return
  }

  if(data.code == 304) {
    this.popType = 0;
    this.promptOpen = true;
    this.popText = '用户无权限';
    return
  }
  if(data.code == '305') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '合约带单暂不支持限价交易';//用户无权限
    return
  }
  if(data.code == '307') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '仓位模式变更同步中，请于1分钟后操作';//用户无权限
    return
  }
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.data) return
  // 监听仓位和委托单条数
  this.$eventBus.notify({key:'GET_ORDERS'})
  this.$eventBus.notify({key:'GET_POSITION'})
  this.$eventBus.notify({key:'GET_BALANCE'})
  if(data.code != '303') {
    this.promptOpen = true;
    this.closePsWindowClose();
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
    return
  }

  this.popType = 0;
  this.popText = '下单失败';
}
root.methods.error_postOrdersPosition = function (err) {
  console.info('err====',err)
}

// 判断当前币是否可交易
root.methods.SYMBOL_ENTRANSACTION = function () {
  let self = this;
  this.symbol_config_times.forEach((v, i) => {
    if (v.name == self.symbol && self.serverTime < v.startTime) {
      self.symbol_transaction = false;
      return;
    }
    if (v.name == self.symbol && self.serverTime >= v.startTime) {
      self.symbol_transaction = true;
      return;
    }
  });
}
// 输入的数量
root.methods.computedValue = function () {
  // 判定除数不为0的情况
  if (Number(this.latestPriceVal) == 0) return 0
  let val = this.accDiv(this.value , 10 * 10)
  let num = 0
  // 单仓可开使用
  if(this.positionModeFirst == 'singleWarehouseMode'){
    num = this.toFixed(this.accMul(this.canMore, val),3)
    if(num==0) return this.amount=''
    return this.amount = this.orderType ? num : num
  }
  // 双仓开仓使用
  if(this.positionModeSecond == 'openWarehouse'){
    num = this.toFixed(this.accMul(this.canBeOpened, val),3)
    if(num==0) return this.amount=''
    return this.amount = this.orderType ? num : num
  }
  // 双仓平仓使用
  if(this.positionModeSecond == 'closeWarehouse'){
    num = this.orderType ? this.toFixed(this.accMul(Math.abs(this.totalAmountLong), val),3) : this.toFixed(this.accMul(Math.abs(this.totalAmountShort), val),3)
    if(num==0) return this.amount=''
    return this.amount = this.orderType ? num : num
  }

  // let ValueAmount = this.toFixed(this.accMul(num1 , 10 * 10),3)

}


// 获取grc交易价格区间
root.methods.getKKPriceRange = function () {
  this.$http.send('KK_PRICE_RANGE',
    {
      bind: this,
      callBack: this.re_getKKPriceRange,
      errorHandler: this.error_getKKPriceRange
    })
}
// 获取grc交易价格区间成功
root.methods.re_getKKPriceRange = function (data) {
  // console.info('当前服务器时间 获取grc交易价格区间成功',data);
  if(!data || !data.kkPriceRange)return
  this.KKPriceRange = data.kkPriceRange;

  this.$store.commit('SET_KK_PRICE_RANGE',data.kkPriceRange)

}
// 获取grc交易价格区间报错
root.methods.error_getKKPriceRange = function () {
  console.log('当前服务器时间 获取grc交易价格区间报错');
}

// 添加减少金额或数量
root.methods.plusNum = function (type) {
  let plus = !!this[type] ? this[type] : 0;
  if (!plus) return;
  if ((plus + '').indexOf('.') < 0) {
    plus++;
    this[type] = plus;
  } else {
    let num = (plus + '').split('.')[1].length;
    let float = 1 / Math.pow(10, num);
    let new_float = Number(plus) + Number(float);
    new_float > 0 && (this[type] = new_float.toFixed(num));
  }
}
root.methods.reduceNum = function (type) {
  let reduce = !!this[type] ? this[type] : 0;
  if (!reduce) return;
  if ((reduce + '').indexOf('.') < 0) {
    !!reduce ? reduce-- : '';
    reduce > 0 && (this[type] = reduce);
  } else {
    let num = (reduce + '').split('.')[1].length;
    let float = 1 / Math.pow(10, num);
    let new_float = reduce - float;
    new_float > 0 && (this[type] = new_float.toFixed(num));
  }
}

// 获取汇率
root.methods.get_rate = function () {
  if (!this.btc_eth_rate.dataMap) return;
  let rate;
  let rateObj = this.btc_eth_rate.dataMap.exchangeRate;
  let type = this.symbol.split('_')[1];
  switch (type) {
    case 'BTC':
      rate = rateObj.btcExchangeRate;
      break;
    case 'ETH':
      rate = rateObj.ethExchangeRate;
      break;
    case 'BDB':
      rate = rateObj.ethExchangeRate * this.bdb_rate;
      break;
    case 'USDT':
      rate = 1;
      break;
    default:
      rate = 0;
      break;
  }
  return rate;
}

// 换算当前价格
root.methods.get_now_price = function () {
  let lang = this.$store.state.lang;
  let price = this.price;
  let triggerPrice = this.triggerPrice;
  let rate = this.get_rate() || 0;
  if (lang === 'CH') {
    // this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
    this.changeTriggerPrice = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (triggerPrice * rate), 2));
  } else {
    // this.change_price = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
}

// 2018-4-4  显示交易额价格
root.methods.turnover_money = function (currency) {
  let lang = this.$store.state.lang;
  let price = currency;
  let rate = this.get_rate() || 0;
  let currency_money;
  if (lang === 'CH') {
    currency_money = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    currency_money = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  return currency_money;
}

// 获取精度
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}

// 设置当前price
root.methods.RE_SET_PRICE = function (price) {
  // console.log('comparePriceNow===============',price)
  this.price = price
  this.priceNow = price;
}
// 根据买卖设置买卖amount
root.methods.RE_SET_AMOUNT = function (obj) {
  // console.log('orderType===============',amount)
  if (obj.type == this.orderType) {
    this.amount = obj.amount;
  }
}

// 切换买卖百分比时候自动计算数量
// root.methods.sectionSelect = function (num) {
//   // if (!this.isLogin) return;
//   if (this.orderType) {
//     // this.amount = (this.available * num).toFixed(this.baseScale);
//     this.amount = this.$globalFunc.accFixed(this.available * num, this.baseScale);
//     return
//   }
//   if (this.price) {
//     // this.price == 0 || (this.amount = (this.available * num / this.price).toFixed(this.baseScale));
//     this.price == 0 || (this.amount = this.$globalFunc.accFixed(this.available * num / this.price, this.baseScale))
//   }
// }

// 获取可用资产
root.methods.changeAvailableData = function () {
  if (!this.isLogin) {
    return;
  }
  let list = '';
  // console.log('this.$store.state.currency', this.$store.state.currency)
  this.orderType === 0 ? (list = this.$store.state.currency.get(this.symbol.split('_')[1])) : (list = this.$store.state.currency.get(this.symbol.split('_')[0]));
  // this.available = list.available;
  this.available = this.$globalFunc.accFixed(list ? list.available : 0, 8);
}

// root.methods.accMul = function (arg1, arg2) {
//   if (!arg1 || !arg2) return;
//   var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
//   try {
//     m += s1.split(".")[1].length
//   } catch (e) {
//   }
//   try {
//     m += s2.split(".")[1].length
//   } catch (e) {
//   }
//   let num = Number(s1.replace(".", "") * s2.replace(".", "")) / Math.pow(10, m);
//   return this.$globalFunc.accFixed(num, 4);
// }

// 科学计数法转换
root.methods.scientificToNumber = function (num) {
  var str = num.toString();
  var reg = /^(\d+)(e)([\-]?\d+)$/;
  var arr, len,
    zero = '';
  if (!reg.test(str)) {
    if (!num.toString().split('.')[1] || num.toString().split('.')[1].length < 7) {
      return num;
    } else {
      // return num.toFixed(8)
      return this.$globalFunc.accFixed(num, 8);
    }
  } else {
    arr = reg.exec(str);
    len = Math.abs(arr[3]) - 1;
    for (var i = 0; i < len; i++) {
      zero += '0';
    }
    return '0.' + zero + arr[1];
  }
}

// 获取当前价格
// root.methods.show_now_price = function () {
//   this.price = this.$store.state.depth_price;
//   // console.log("this.price--------"+this.price);
//   // latestPriceVal
// }

// 关闭提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

//页面功能模块显示逻辑判断
root.methods.isHasModule = function (type) {
  let isHas = '';
  //单仓模式
  if(this.positionModeFirst == 'singleWarehouseMode'){
    isHas = this.positionModeConfigs[this.positionModeFirst][this.pendingOrderType][type]
    // console.log('ProgressBar 单仓模式-' + type,isHas);
    return isHas
  }
  //双仓模式
  isHas = this.positionModeConfigs[this.positionModeFirst][this.positionModeSecond][this.pendingOrderType][type]
  // console.log('ProgressBar 双仓模式-' + type,isHas);
  return isHas
}

// input框选择颜色
root.methods.changeColor = function (para) {
  this.inputColor = para;
  this.get_now_price();
}
// 按钮点击效果
root.methods.BTN_CLICK = function () {
  let self = this;
  if (this.btn_click) return;
  this.btn_click = true;
  setTimeout(() => {
    self.btn_click = false;
  }, 300);
}

//检测币对交易价格，false 不通过 true 通过
root.methods.checkPriceRange = function () {
  let len = this.KKPriceRange.length;
  if(len == 0)return true

  let minPrice = this.KKPriceRange[0];
  let maxPrice = this.KKPriceRange[len-1];


  if(minPrice > 0 && this.price < minPrice){
    this.popText = (this.lang == 'CH' ? '价格不能低于' : 'Price cannot be less than') + minPrice;
    this.popType = 0;
    this.promptOpen = true;
    return false
  }
  if(maxPrice > 0 && this.price > maxPrice){
    this.popText = (this.lang == 'CH' ? '价格不能高于' : 'Price cannot be higher than') + maxPrice;
    this.popType = 0;
    this.promptOpen = true;
    return false
  }

  return true;
}

// 关闭弹窗
root.methods.popWindowClose1 = function () {
  this.popWindowOpen1 = false

}

// 点击确定
root.methods.popIdenComfirms = function () {
  this.popWindowOpen1 = false
  // let orderType1 = this.orderType1;
  this.tradeMarket(false)
}

root.methods.comparePriceNow = function () {

  if (this.priceNow <= 0 || this.price <=0)return true
  let multiple = this.accDiv(this.price,Number(this.priceNow));
  // console.log('wwwww===========',this.price,this.priceNow)


  let priceCont = ''

  multiple == 1/2 && (priceCont = '挂单价格等于时价1/2，确定下单吗？')
  multiple < 1/2 && (priceCont = '挂单价格低于时价1/2，确定下单吗？')
  multiple == 2 && (priceCont = '挂单价格等于时价2倍，确定下单吗？')
  multiple > 2 && (priceCont = '挂单价格高于时价2倍，确定下单吗？')
  if(priceCont == '')return true

  this.priceCont = priceCont;
  return false;
}


// 买卖提交
root.methods.tradeMarket = function (popWindowOpen1,type) {
  // console.log(this.priceNow)

  this.orderType1 = type;
  // this.popWindowOpen = false;
  if (!this.symbol_transaction_diy) return;
  // 按钮添加点击效果
  this.BTN_CLICK();

  let txt = !this.orderType ? this.lang == 'CH' ? '买入' : 'Buy' : this.lang == 'CH' ? '卖出' : 'Sell';
  let symbol = this.$store.state.symbol;
  // 判断有没有登录
  if (!this.$store.state.authState.userId) {
    this.$router.push({name: 'login'})
    return
  }
  // 暂未开放
  if (!this.symbol_transaction) return;
  // 判断实名认证
  // if (!this.$store.state.authState.identity) {
  // 	this.$router.push('/index/personal/auth/authenticate')
  // 	return
  // }

  // 判断是否绑定邮箱，如果没有绑定，提示绑定
  if (!this.bindEmail) {
    this.$eventBus.notify({key: 'BIND_EMAIL_POP'})
    return
  }
  // 判断是否绑定谷歌或手机，如果都没绑定
  if (!this.bindGa && !this.bindMobile) {
    this.$eventBus.notify({key: 'BIND_AUTH_POP'})
    return
  }

  if (!this.orderType && Number(this.price * this.amount) > Number(this.available)) {
    // alert('您的持仓不足')
    this.popText = this.lang == 'CH' ? '您的余额不足,请充值' : 'Insufficient funds. Please make a deposit first.';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  // if (this.orderType && Number(this.amount) > Number(this.available)) {
  //   // alert('您的持仓不足')
  //   this.popText = this.lang == 'CH' ? '您的余额不足,请充值' : 'Insufficient funds. Please make a deposit first.';
  //   this.popType = 0;
  //   this.promptOpen = true;
  //   return
  // }

  if (this.orderType && Number(this.amount) > Number(this.available)) {
    // alert('您的持仓不足')
    this.popText = this.lang == 'CH' ? '您的余额不足,请充值' : 'Insufficient funds. Please make a deposit first.';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  // 添加price、amount不为数字和为0时的校验
  if (!this.orderType && this.price == 0) {
    this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '价' : 'Invalid price';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  if(!this.orderType && popWindowOpen1){
    this.popWindowOpen1 = !this.comparePriceNow();
    if(this.popWindowOpen1)return;
  }

  if(symbol == 'KK_USDT' && !this.orderType && !this.checkPriceRange())return;

  if (!this.orderType && this.amount == 0) {
    this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '量' : 'Invalid amount';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if (this.orderType && this.price == 0) {
    this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '价' : 'Invalid price';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if(this.orderType && popWindowOpen1){
    this.popWindowOpen1 = !this.comparePriceNow();
    if(this.popWindowOpen1)return;
  }


  if(symbol == 'KK_USDT' && this.orderType && !this.checkPriceRange())return;

  if (this.orderType && this.amount == 0) {
    this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '量' : 'Invalid amount';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  let params = {
    symbol: this.$store.state.symbol,
    price: this.price,
    amount: this.amount,
    type: this.orderType,
    source: 'WEB', //访问来源
    // customFeatures: this.fee ? 65536 : 0
  };
  //燃烧抵扣不再需要
  if (this.fee) {
    Object.assign(params, {customFeatures: 65536});
  }
  // 如果当前是BTC市场的话，price*amount<0.001不允许提交
  // 如果当前是ETH市场的话，price*amount<0.01不允许提交
  // 如果当前是BDB市场的话，price*amount<100不允许提交
  let turnover = Number(this.price) * Number(this.amount);
  // let turnoverAamount = Number(this.amount);
  let miniVolume;
  let maxAmount;
  let tradingParameters = this.$store.state.tradingParameters;
  for (var i = 0; i < tradingParameters.length; i++) {
    let item = tradingParameters[i];
    let name = item.name;
    if (name == this.$store.state.symbol) {
      miniVolume = item.miniVolume;
      maxAmount = item.maxAmount;
    }
  }
  if (Number(turnover) < Number(miniVolume)) {
    this.popType = 0;
    this.popText = this.lang == 'CH' ? '交易额不能小于' + miniVolume : 'Minimum trading amount' + miniVolume;
    this.promptOpen = true;
    return;
  }

  // if (Number(maxAmount)>0) {
  //   if ((Number(turnoverAamount)>Number(maxAmount))) {
  //     this.popType = 0;
  //     this.popText = this.lang == 'CH' ? '数量不能大于' + maxAmount : 'Quantity cannot be greater than' + maxAmount;
  //     this.promptOpen = true;
  //     return;
  //
  //   }
  // }



  // if (Number(turnoverAamount) > Number(maxAmount)) {
  //   this.popType = 0;
  //   this.popText = this.lang == 'CH' ? '交易数量不能高于' + maxAmount : 'Minimum trading amount' + maxAmount;
  //   this.promptOpen = true;
  //   return;
  // }
  // console.info(params);
  // return;
  this.$http.send('TRADE_ORDERS',
    {
      bind: this,
      params: params,
      callBack: this.Callback,
      errorHandler: this.RE_ERROR
    })
  // this, {symbol:this.$store.state.symbol + '_BTC',price:this.price,amount:this.amount,orderType:this.orderType}, this.Callback)
  // symbol：货币对，如BTC_USD
  // price：价格
  // amount:数量
  // orderType：类型：BUY_LIMIT 定价买  定价卖 SELL_LIMIT
}

root.methods.Callback = function (data) {
  // console.info('data,',data)

  this.popType = 1;
  this.popText = this.lang == 'CH' ? '挂单成功' : 'Order has been made';
  this.promptOpen = true;
  // 清空数量
  this.amount = '';
  this.$http.send('ACCOUNTS', {bind: this, callBack: this.RE_ACCOUNTS})

  // setTimeout(()=>{
  //   this.$http.send('ACCOUNTS', {bind: this, callBack: this.RE_ACCOUNTS})
  // },5000)


  if (data.error == 'ORDER_GRANTER_THAN_MAXAMOUNT') {

    let maxAmount = this.orderType && this.orderType.split("|")[1] || "最大值"

      this.popType = 0;
      this.popText = this.lang == 'CH' ? '交易数量不能高于' + maxAmount : 'Minimum trading amount' + maxAmount;
      this.promptOpen = true;
      return;
  }

}

root.methods.RE_ERROR = function (err) {
  let err_type = err.response.data.data;
  let message = err.response.data.message
  let txt = '';
  switch (err_type) {
    case 'amount':
      txt = this.lang == 'CH' ? '最多交易10000000个!' : 'Maximum order amount: 10000000';
      break;
    case 'symbol':
      txt = this.lang == 'CH' ? '暂未开放!' : 'Unavailable now';
      break;
    case 'null':
      txt = this.lang == 'CH' ? '余额不足,请充值!' : 'Insufficient funds. Please make a deposit first';
      break;
    case 'account_freeze_failed':
      txt = this.lang == 'CH' ? '资产冻结失败!' : 'Fail to freeze funds';
      break;
    default:
      txt = this.lang == 'CH' ? '暂不可用!' : 'Unavailable now';
      break;
  }
  if (message == 'user_cannot_trade') {
    // txt = '无法交易'
    this.popWindowOpen = true
    return
  }

  if(message == 'minPrice'){
    txt = this.lang == 'CH' ? '价格不能低于'+err_type : 'Price cannot be less than: '+err_type;
  }

  if(message == 'maxPrice'){
    txt = this.lang == 'CH' ? '价格不能高于'+err_type : 'Price cannot be higher than: '+err_type;
  }

  if(message == 'ORDER_GRANTER_THAN_MAXAMOUNT'){

    txt = this.lang == 'CH' ? '数量不能大于'+err_type.split("|")[1] || "最大值"
      : 'Quantity cannot be greater than: '+err_type.split("|")[1] || "最大值";
  }
  // console.warn("this is wrong", err)
  this.popText = txt;
  this.popType = 0;
  this.promptOpen = true;
}

root.methods.RE_ACCOUNTS = function (data) {
  // console.log('ACCOUNTS=====ProgressBar.js====', data)
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.accounts) {
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts);
}

// 输入内容精度限制
root.methods.keyBoard = function (id) {
  // 只能输入数字和浮点数
  this.inputnumbers(id);
  // 限制位数
  let l, l2
  if ((id === 'pro-bar-price0') || (id === 'pro-bar-price1') || (id === 'pro-bar-trigger-price0') || (id === 'pro-bar-trigger-price1')) {
    l = this.quoteScale
  }
  if ((id === 'pro-bar-amount0') || (id === 'pro-bar-amount1')) {
    l2 = this.baseScale
  }
  this.triggerPrice.indexOf('.') > 0 && (this.triggerPrice.split('.')[1].length > l) && (this.triggerPrice = this.triggerPrice.split('.')[0] + '.' + this.triggerPrice.split('.')[1].substr(0, l));
  this.price.indexOf('.') > 0 && (this.price.split('.')[1].length > l) && (this.price = this.price.split('.')[0] + '.' + this.price.split('.')[1].substr(0, l));
  this.amount.indexOf('.') > 0 && (this.amount.split('.')[1].length > l2) && (this.amount = this.amount.split('.')[0] + '.' + this.amount.split('.')[1].substr(0, l2));
}

// 金额和数量只能输入数字
root.methods.inputnumbers = function (id) {
  let value = $('#' + id).val().replace(/[^0-9.]/g, '').replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");

  if (id.indexOf('pro-bar-trigger-price') > -1) {
    this.triggerPrice = value
    return
  }

  if (id.indexOf('pro-bar-price') > -1) {
    this.price = value;
    return
  }

  // else {
    this.amount = value;
  // }
}

// 登录
root.methods.goLogin = function () {
  this.$router.push('/index/sign/login')
}
// 注册
root.methods.goRegister = function () {
  this.$router.push('/index/register')
}

// 关闭弹窗
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}

// // 关闭弹窗
// root.methods.popWindowClose1 = function () {
//   this.popWindowOpen1 = false
// }

// 弹窗提示提交工单
root.methods.goToCommitOrder = function () {
  // this.popWindowOpen = false
  // this.$router.push({name: 'wordOrder'})
}


// 弹窗联系客服
root.methods.goToCustomerService= function () {
  qimoChatClick();
  this.popWindowOpen = false;
}



//进度条控件方法
root.methods.mousePos = function(e) {
  var pos = {};
  pos.x = e.pageX;
  this.pos = pos;
  return pos;
}
root.methods.timeDown = function(e) { // 当鼠标指针移动到元素上方，并按下鼠标左键时
  this.transTime = 0;
  this.mousePos(e);
  this.startX = this.pos.x;
  this.locked = true;
  this.endDistance = this.distance;
}
root.methods.timeMove = function(e) { // 当鼠标指针移动到元素上方移动时
  if (!this.locked) return;
  var pos = this.mousePos(e);
  var moveX = pos.x - this.startX;
  if (this.distance >= this.dragWidth) {
    this.distance = this.dragWidth - 10;
  } else {
    if ((this.distance <= 0 && moveX < 0) || (this.distance >= this.dragWidth && moveX > 0)) return;
    this.distance = this.endDistance + moveX;
    this.countNum(this.distance);
  }
  if(this.distance>249){
    this.distance = 249;
  }
  var bard25 = document.getElementById("bard25");
  var bard50 = document.getElementById("bard50");
  var bard75 = document.getElementById("bard75");

  if(this.distance > bard25.offsetLeft){
    this.bgjcolor25 = false;
  }else{
    this.bgjcolor25 = true;
  }
  if(this.distance > bard50.offsetLeft){
    this.bgjcolor50 = false;
  }else{
    this.bgjcolor50 = true;
  }
  if(this.distance > bard75.offsetLeft){
    this.bgjcolor75 = false;
  }else{
    this.bgjcolor75 = true;
  }

}
root.methods.timeEnd =  function(e) {
  this.transTime = .3;
  this.locked = false;
}
root.methods.timeClick =  function(e) { //点击拖动到指定位置
  var x = e.offsetX,
    moveX = x - this.distance;
  this.distance += moveX;
  this.countNum(this.distance);
  var bard25 = document.getElementById("bard25");
  var bard50 = document.getElementById("bard50");
  var bard75 = document.getElementById("bard75");

  if(this.distance > bard25.offsetLeft){
    this.bgjcolor25 = false;
  }else{
    this.bgjcolor25 = true;
  }
  if(this.distance > bard50.offsetLeft){
    this.bgjcolor50 = false;
  }else{
    this.bgjcolor50 = true;
  }
  if(this.distance > bard75.offsetLeft){
    this.bgjcolor75 = false;
  }else{
    this.bgjcolor75 = true;
  }
}

root.methods.timeClick2 =  function(num) { //点击拖动到指定位置
  this.distance = num;
  this.countNum(this.distance);
  var bard25 = document.getElementById("bard25");
  var bard50 = document.getElementById("bard50");
  var bard75 = document.getElementById("bard75");

  if(this.distance > bard25.offsetLeft){
    this.bgjcolor25 = false;
  }else{
    this.bgjcolor25 = true;
  }
  if(this.distance > bard50.offsetLeft){
    this.bgjcolor50 = false;
  }else{
    this.bgjcolor50 = true;
  }
  if(this.distance > bard75.offsetLeft){
    this.bgjcolor75 = false;
  }else{
    this.bgjcolor75 = true;
  }
}
root.methods.countNum = function(num) {
  var len = this.endNum - this.startNum;
  var scale = (this.dragWidth / len).toFixed(2);
  this.nowNum = this.startNum + Math.round(num / scale);
  if(this.nowNum > this.endNum){
    this.nowNum = this.endNum;
  }
  if(this.nowNum < this.startNum){
    this.nowNum = this.startNum;
  }
  if(this.nowNum > this.startNum  &&  this.nowNum < this.endNum){
    this.dangqzsh = true;
  }else{
    this.dangqzsh = false;
  }
  this.sectionSelect(this.nowNum/100);

}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  // return this.$globalFunc.accFixed(num , acc)
  return this.$globalFunc.accFixed(num == Infinity ? 0 : num , acc)
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

/*----------------------------- 方法 begin ------------------------------*/
export default root
