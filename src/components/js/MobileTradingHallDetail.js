import tradingHallData from "../../dataUtils/TradingHallDataUtils";

const root = {};

let interval;

root.name = 'MobileTradingHallDetail';

/*------------------------------ data begin -------------------------------*/

root.data = function () {
  return {
    /*合约仓位模式begin*/
    positionModeFirst:'doubleWarehouseMode',//单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
    // positionModeFirst:'doubleWarehouseMode',//单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
    positionModeFirstTemp:'',//临时存储值，等用户点击弹窗确认按钮后才真正改变positionModeFirst的值
    positionModeSecond:'openWarehouse',//单仓 singleWarehouse 开仓 openWarehouse 平仓 closeWarehouse
    pendingOrderType:'marketPrice',//限价 limitPrice 市价 marketPrice 限价止盈止损 limitProfitStopLoss 市价止盈止损 marketPriceProfitStopLoss
    /*合约仓位模式end*/
    // 双仓修改
    openSide:'long',

    /*下拉框1 begin*/
    optionVal:'市价单',
    optionData:['限价单','市价单','限价止盈止损','市价止盈止损'],
    optionData2:['限价单','市价单','触发限价','触发市价'],
    // optionData3:['市价单','触发限价','触发市价'],
    optionDataMap:{
      '限价单':'limitPrice',
      '市价单':'marketPrice',
      '限价止盈止损':'limitProfitStopLoss',
      '市价止盈止损':'marketPriceProfitStopLoss',
      '触发限价':'limitProfitStopLoss',
      '触发市价':'marketPriceProfitStopLoss',
      '触发限价止盈止损':'limitProfitStopLoss',
      '触发市价止盈止损':'marketPriceProfitStopLoss',
    },
    /*下拉框1 end*/

    /*下拉框2 begin*/
    latestPrice:'最新',
    latestPriceOption:['标记','最新'],
    /*下拉框2 end*/

    triggerPrice:'', // 触发价格
    checkPrice:1, // 限价---被动委托，生效时间选择
    reducePositionsSelected: false,//只减仓状态

    //买卖列表
    buy_sale_list: {},

    // socket推送信息
    socket_tick: {}, // header单个币对价格
    socket_snap_shot: {}, //深度图
    socket24hrTicker:[],//symbol24小时ticker信息
    socketTickObj: {}, // 单个归集交易推送
    apiTickArr: [], // 第一次接口获取的最新归集交易
    latestPriceVal: '' ,   // 最新价格，用于价格输入框显示
    latestPriceArr: [] ,   // 最新价格数组，用于判断价格升降和盘口显示

    recordsIndex:0, // 仓位数量
    recordsIndexS:0, // 当前币对的仓位数量
    currOrderLenObj:{},
    effectiveTime:'GTX',

    // 是否可用BDB抵扣 TODO------------------ 新旧分割线-----------------
    BDBInfo: true,
    BDBReady: false,

    orderType: this.$store.state.buy_or_sale_type || 0,

    // 买卖form右侧
    is_right: false,

    // 买卖数量和价格列表
    // price: '0',
    cnyPrice: '- -',

    sellOrders: [],
    buyOrders: [],

    // 交易时价格和数量
    price: '',
    amount: '',
    fee: '',
    // 买卖可用数量
    currentSymbol: {
      balance: '--',
      balance_order: '--'
    },
    // 估值
    cny_valuation: '-- ',

    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,


    currentOrder: [],
    currentInterval: null,
    clickOrder: new Set(),
    historyOrder: [],

    orderDetail: [],

    // 输入位数
    baseScale: 0,
    quoteScale: 0,
    // 价格显示位数
    price_quoteScale: 8,

    //socket价格数据
    // socket_tick: {},
    // 18-2-10 新加买卖信息对象，用来接收socket和ajax返回的数据 深度图
    // buy_sall_list: {},
    // 货币对列表价格
    socket_price: {},


    toastOpen: false, //账号存在异常的弹出窗
    toastType: 2,
    toastText: '',

    // BDB 汇率
    bdb_rate: 0,

	  numed:0,
	  numed2:0,

    // 最新成交页开关
    latestFlag: false,

    // 最新成交列表
    list: [],
    // 点击效果
    btn_click: false,
    toastNobindShow: false,

    isDisplayMarket:false,

    currency_list:[],
    KKPriceRange:[],
    popIdenOpen: false, // 弹窗开放
    priceCont:'',

    // 调整杠杆 Start
    leverage:20, // 杠杆倍数
    popWindowAdjustingLever:false,
    popTextLeverage:'',
    value: 0,
    marks: {
      ETHUSDT:{
        1: '1X',
        20: '20X',
        40: '40X',
        60: '60X',
        80: '80X',
        100:'100X',
      },
      BTCUSDT:{
        1: '1X',
        25: '25X',
        50: '50X',
        75:'75X',
        100:'100X',
        125:'125X',
      }
    },
    calculatorClass:['radiusa_blu1','radiusa_blu2','radiusa_blu3','radiusa_blu4','radiusa_blu5'],
    // 显示的最大头寸数值
    // maximumPosition : ['50,000','250,000','100,0000','5,000,000','20,000,000','50,000,000','100,000,000','200,000,000'],
    maxNotionalValue: '',   // 当前杠杆倍数下允许的最大名义价值
    listType:'holdPosition',// 当前委托currentDelegation，持有仓位holdPosition
    //调整杠杆 End


    //保证金模式Strat
    popWindowSecurityDepositMode: false,
    // cardType:1, //仓位模式选择初始值
    marginModeType: 'quanCang',  // "quanCang":全仓  "zhuCang":逐仓
    marginType: 'CROSSED', // 全仓逐仓
    marginModeTypeTemp:'',// 临时存储值，等用户点击弹窗确认按钮后才真正改变 marginModeType 的值
    //保证金模式End

    // 仓位模式 Start
    popWindowPositionModeBulletBox:false,
    //  仓位模式 End

    // 资金费率  下次资金费时间
    markPrice: '', // 标记价格
    markPriceObj: {}, // 多币对标记价格
    lastFundingRate: '', // 资金费率
    nextFundingTime: '',   // 下次资金费时间

    totalAmount:0, //仓位总数量
    totalAmountLong:0, // 双仓开多仓位总数量
    totalAmountShort:0, //双仓开空仓位总数量

    descriptionOpen:false,
    titleDescript:'',
    descriptionText:'',

    showSplicedFrame:false,//下单拦截弹框
    callFuncName:'',//即将调用接口的函数名字
    splicedFrameText:'',
    marketPriceClick: false, //市价不能多次点击设置

    availableBalance:0,

    openBottleOpen:false,  // 开平器组件弹窗
    positionList:[],
  }
}

/*------------------------------ 生命周期 begin -------------------------------*/


root.created = function () {
  //监听单仓位总数量
  this.$eventBus.listen(this, 'POSITION_TOTAL_AMOUNT', this.setTotalAmount);
  //监听双仓开多仓位总数量
  this.$eventBus.listen(this, 'POSITION_TOTAL_AMOUNT_LONG', this.setTotalAmountLong);
  //监听双仓开空仓位总数量
  this.$eventBus.listen(this, 'POSITION_TOTAL_AMOUNT_SHORT', this.setTotalAmountShort);

  this.$eventBus.listen(this, 'GET_GRC_PRICE_RANGE', this.getKKPriceRange);
  this.getKKPriceRange();
	this.$store.commit('SET_HALL_SYMBOL', true);
	this.$store.commit('changeMobileTradingHallFlag', false)

	let self = this

  if (this.$store.state.buy_or_sale_type === 1 || this.$store.state.buy_or_sale_type === '') {
    this.$store.commit('changeMobileHeaderTitle', '买入');
  }
  if (this.$store.state.buy_or_sale_type === 2) {
    this.$store.commit('changeMobileHeaderTitle', '卖出');
  }
  if (this.$store.state.buy_or_sale_type === 3) {
    this.$store.commit('changeMobileHeaderTitle', '当前委托');
  }
  if (this.$store.state.buy_or_sale_type === 4) {
    this.$store.commit('changeMobileHeaderTitle', '历史委托');
  }

  this.checkPrice ==2 ? this.effectiveTime='GTX' : this.effectiveTime='GTC'

  // 获取精度
  this.getScaleConfig();
  // 拉取列表数据
  this.getDepth();
  // 订阅socket
  this.initSocket();

  // 获取订单
  this.loading = false
  this.getOrder()

  // 获取认证状态
  this.getAuthState()

  // 拉取最新成交数据
  // this.GET_LATEST_DEAL();

  // interval = setInterval(this.GET_LATEST_DEAL, 2000);

  this.getScaleConfig();
  this.positionRisk()  // 获取仓位信息（全逐仓、杠杆倍数）
  this.getPositionsideDual() // 获取仓位模式
  this.getMarkPricesAndCapitalRates()  // 获取币安最新标记价格和资金费率
  this.getLatestrice()
  this.isFirstVisit();
  this.getBalance()

  this.$eventBus.listen(this,'GET_BALANCE',this.getBalance)
  this.chainCal = this.$globalFunc.chainCal
  if(JSON.parse(sessionStorage.getItem("opener_states")) == null){
    sessionStorage.setItem("opener_states",1)
  }
  if(JSON.parse(sessionStorage.getItem("opener_states")) =='0'){
    this.openBottleOpen = true
  }


}

/*------------------------------ 组件 begin -------------------------------*/

root.components = {}
root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'MobileTrade': resolve => require(['../vue/MobileTrade'], resolve),
  'CurrentOrder': resolve => require(['../vue/MobileCurrentOrder'], resolve),
  // 'HistoryOrder': resolve => require(['../vue/MobileHistoryOrder'], resolve),
  'PositionList': resolve => require(['../vue/MobilePositionList'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
  'H5StockCross': resolve => require(['../vue/H5StockCross'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'MobileBottleOpener': resolve => require(['../vue/MobileBottleOpener'], resolve),
  'MobileMarketPrice': resolve => require(['../mobileVue/MobileMarketPrice'], resolve),

}

/*------------------------------ 计算 begin -------------------------------*/

root.computed = {}
//不加下划线币对集合
root.computed.sNameList = function () {
  return this.$store.state.sNameList || []
}
// 除去逐仓仓位保证金的钱包余额
root.computed.crossWalletBalance = function () {
  return this.$store.state.assets.crossWalletBalance
}
// 单仓保证金assumingPrice
root.computed.costAssumingPrice = function () {
  let assumingPrc = 0
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    assumingPrc = this.orderType ? Math.max(this.buyDepthOrders,this.markPrice,this.price) : this.price
    return Number(assumingPrc) || 0
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    assumingPrc = this.orderType ? Math.max(this.buyDepthOrders,this.markPrice) : this.accMul(this.sellDepthOrders, this.accAdd(1, 0.0005))
    return Number(assumingPrc) || 0
  }
}
//双向的assumingPrice===========
root.computed.twoWayAssumingPrice = function () {
  let twoWayAssumingPrcBuy = 0,twoWayAssumingPrcSell =0
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    // twoWayAssumingPrc = this.orderType ? Math.max(this.buyDepthOrders,(Number(this.markPrice),this.price)) : this.price
    twoWayAssumingPrcBuy = this.price || 0
    twoWayAssumingPrcSell = Math.max(this.buyDepthOrders,(this.markPrice,this.price)) || 0
    return [twoWayAssumingPrcBuy,twoWayAssumingPrcSell]
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    // twoWayAssumingPrc = this.orderType ? Math.max(this.buyDepthOrders, (Number(this.markPrice))) : this.sellDepthOrders * (1+0.0005)
    twoWayAssumingPrcBuy = this.accMul(this.sellDepthOrders, this.accAdd(1, 0.0005)) || 0
    twoWayAssumingPrcSell = Math.max(this.buyDepthOrders, (this.markPrice)) || 0
    return [twoWayAssumingPrcBuy,twoWayAssumingPrcSell]
  }
}
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


root.computed.sellDepthOrders = function () {
  // console.info('this.$store.state.orderBookTicker.askPrice',this.$store.state.orderBookTicker.askPrice)
  return this.$store.state.orderBookTicker.askPrice
}
root.computed.buyDepthOrders = function () {
  // console.info('this.$store.state.orderBookTicker.bidPrice',this.$store.state.orderBookTicker.bidPrice)
  return this.$store.state.orderBookTicker.bidPrice
}
// 委托单数据
root.computed.currentOrders = function  () {
  return this.$store.state.currentOrders || []
}

root.computed.positionAmtLong = function (){
  return this.$store.state.closeAmount.positionAmtLong || 0
}

root.computed.positionAmtShort = function (){
  return this.$store.state.closeAmount.positionAmtShort || 0
}
//新委托实际数量
root.computed.newOrderActualAmount = function () {
  if (Number(this.totalAmount) >= 0) {
    // return this.orderType ?crossWalletBalanceSing Math.max(0,Number(this.amount) - Math.abs(Number(this.totalAmount))) : Number(this.amount)
    return this.orderType ? Math.max(0,this.accMinus(Number(this.amount), Math.abs(this.totalAmount))) : Number(this.amount)
  }
  if (Number(this.totalAmount) < 0) {
    // return this.orderType ? Number(this.amount) : Math.max(0,Number(this.amount) + Math.abs(Number(this.totalAmount)))
    return this.orderType ? Number(this.amount) : Math.max(0,this.accAdd(Number(this.amount), Math.abs(this.totalAmount)))
  }
}
// 杠杆  开仓保证金率
root.computed.leverageSe = function () {
  return Number(this.$globalFunc.accFixedCny(this.accDiv(1 , Number(this.$store.state.leverage) || 1),4))
  // return this.$globalFunc.accFixedCny(this.accDiv(1 , this.$store.state.leverage || 1),4)
}
//有仓位 标记价格*数量 无仓位 0
root.computed.positionNotionalValue = function () {
  // return (this.totalAmount != 0) ? (Number(this.markPrice) * Number(this.totalAmount)) : 0
  return (this.totalAmount != 0) ? this.accMul(this.markPrice, this.totalAmount) : 0
}
//计算BUY的margin required时
root.computed.buyMarginRequire = function () {
  // return this.orderType ?  0 : (this.costAssumingPrice * 1 * this.amount)
  return this.orderType ?  0 : this.chainCal().accMul(this.costAssumingPrice, 1).accMul(Number(this.amount)).getResult()
}
// 最大可下单值（名义价值）
root.computed.maxNotionalAtCurrentLeverage = function () {
  let leverageBracket = this.$store.state.leverageBracket || []
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
// assumingPrice
root.computed.assumingPrice = function () {
  let assumingPrc = 0
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    // console.info('this.buyDepthOrders',this.buyDepthOrders)
    assumingPrc = this.orderType ? Math.max(this.buyDepthOrders,this.price) : this.price
    return Number(assumingPrc) || 0
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    assumingPrc = this.orderType ? this.buyDepthOrders : this.sellDepthOrders * (1+0.0005)
    return Number(assumingPrc) || 0
  }
}
// 双仓使用assumingPrice
root.computed.assumingPriceDouble = function () {
  let assumingPrcBuy = 0,assumingPrcSell=0
  if(this.pendingOrderType== 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    // console.info('this.buyDepthOrders',this.buyDepthOrders)
    assumingPrcBuy = Number(this.price) || 0
    assumingPrcSell = Number(Math.max(this.buyDepthOrders,this.price)) || 0
    return [assumingPrcBuy,assumingPrcSell]
  }
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    assumingPrcBuy = this.sellDepthOrders * (1+0.0005) || 0
    assumingPrcSell = this.buyDepthOrders || 0
    return [assumingPrcBuy,assumingPrcSell]
  }
}
//有仓位 标记价格*数量 无仓位 0
root.computed.positionNotionalValue = function () {
  // return (this.totalAmount != 0) ? (Number(this.markPrice) * Number(this.totalAmount)) : 0
  return (this.totalAmount != 0) ? this.accMul(this.markPrice, this.totalAmount) : 0
}
// 保证金计算
root.computed.securityDeposit = function () {

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
    let presentTotalInitialMargin = this.accMul(presentNotional, this.leverageSe)
    let assumingTotalInitialMargin = this.accMul(totalAfterTrade, this.leverageSe)
    let marginReuired = Math.max(this.accMinus(assumingTotalInitialMargin, presentTotalInitialMargin), 0)  //TODO: 结果
    //开仓亏损
    let openLost
    //限价和限价止损单
    if (this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss') {
      // openLost = Number(this.newOrderActualAmount * 1 * Math.abs(Math.min(0, (this.orderType ? -1 : 1) * (Number(this.markPrice) - Number(this.price)))))
      let lost = this.accMul((this.orderType ? -1 : 1), this.accMinus(this.markPrice, this.price))
      openLost = this.chainCal().accMul(this.newOrderActualAmount, 1).accMul(Math.abs(Math.min(0, lost))).getResult()
    }
    //市价和市价止损单
    if (this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss') {
      // openLost = Number(this.newOrderActualAmount * 1 * Math.abs(Math.min(0, (this.orderType ? -1 : 1) * (Number(this.markPrice) - Number(this.costAssumingPrice)))))
      let openL = Math.abs(Math.min(0, this.accMul((this.orderType ? -1 : 1), this.accMinus(this.markPrice, this.costAssumingPrice))))
      openLost = this.chainCal().accMul(this.newOrderActualAmount, 1).accMul(openL).getResult()
    }
    //开仓成本
    let cost = this.chainCal().accAdd(marginReuired, openLost).proFixed(2).getResult()
    // console.info('this is twoWayCost ===',cost)

    return cost
  }

  if (this.positionModeFirst == 'doubleWarehouseMode') {
    // let twoWaymarginReuired = Number(this.twoWayAssumingPrice * Number(this.amount || 0) * this.leverage)
    let twoWaymarginReuiredBuy = this.chainCal().accMul(this.twoWayAssumingPrice[0], Number(this.amount)).accMul(this.leverageSe).getResult()
    let twoWaymarginReuiredSell = this.chainCal().accMul(this.twoWayAssumingPrice[1], Number(this.amount)).accMul(this.leverageSe).getResult()
    //开仓亏损
    let twoWayopenLostBuy,twoWayopenLostSell
    //限价和限价止损单
    if (this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss') {
      // twoWayopenLost = Number(Number(this.amount || 0) * Math.abs(Math.min(0,(this.orderType ? -1 : 1) * (Number(this.markPrice) - this.price))))
      let twoLostBuy = this.accMul(1, this.accMinus(this.markPrice, this.price))
      let twoLostSell = this.accMul(-1, this.accMinus(this.markPrice, this.price))
      twoWayopenLostBuy = this.accMul(Number(this.amount), Math.abs(Math.min(0,twoLostBuy)))
      twoWayopenLostSell = this.accMul(Number(this.amount), Math.abs(Math.min(0,twoLostSell)))
    }
    //市价和市价止损单
    if (this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss') {
      // twoWayopenLost = Number(Number(this.amount || 0) * Math.abs(Math.min(0,(this.orderType ? -1 : 1) * (Number(this.markPrice) - this.twoWayAssumingPrice))))
      let twoOpenLBuy = this.accMul(1, this.accMinus(this.markPrice, this.twoWayAssumingPrice[0]))
      let twoOpenLSell = this.accMul(-1, this.accMinus(this.markPrice, this.twoWayAssumingPrice[1]))
      twoWayopenLostBuy = this.accMul(Number(this.amount), Math.abs(Math.min(0,twoOpenLBuy)))
      twoWayopenLostSell = this.accMul(Number(this.amount), Math.abs(Math.min(0,twoOpenLSell)))
    }

    //开仓成本
    let twoWayCostBuy = this.chainCal().accAdd(twoWaymarginReuiredBuy, twoWayopenLostBuy).proFixed(2).getResult()
    let twoWayCostSell = this.chainCal().accAdd(twoWaymarginReuiredSell, twoWayopenLostSell).proFixed(2).getResult()
    // console.info('this is twoWayCost ===',twoWayCost)

    return [twoWayCostBuy,twoWayCostSell]
  }
}

// 单仓最多可开
root.computed.canMore = function () {
  let crossWalletBalanceSing = Number(this.crossWalletBalance) // 全仓钱包余额
  // 向上取整IMR
  let leverage = Number(this.$globalFunc.accFixedCny(this.accDiv(1 , Number(this.$store.state.leverage) || 1),4))
  let availableBalance = this.$store.state.assets.availableBalance || 0
  // let availableBalance = this.availableBalance || 0
  let markPrice = Number(this.markPrice) || 0
  let price = this.price || 0 // 输入框价格
  // let temp = this.orderType ? -1 : 1;
  // let priceStep = Math.abs(Math.min(0 , temp * (markPrice - price))) || 0  // TODO:简化后
  let buy = Math.abs(Math.min(0 , 1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sell = Math.abs(Math.min(0 , -1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let buyMarket = Math.abs(Math.min(0 , 1 * (markPrice - this.assumingPrice))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sellMarket = Math.abs(Math.min(0 , -1 * (markPrice - this.assumingPrice))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let positionAmt = this.totalAmount || 0 // TODO:有仓位时：单仓取数量取和；双仓取数量绝对值之和无仓位时取0
  // present initial margin = max（position notional+open order bid notional，position notional-open order ask notional）* 1 / leverage
  let initialMargin =  Math.max((markPrice * positionAmt) + this.computedBuyNetValue, (markPrice * positionAmt) - this.computedSellNetValue) * leverage
  let positionNotionalValue = positionAmt * markPrice
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
        , Math.abs(markPrice * positionAmt - this.computedSellNetValue))
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
      sellCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1*(this.assumingPrice * leverage) + sellMarket))
      // console.info('sellNetValue===',this.sellNetValue)
      if(positionAmt >= 0){
        buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage)) / (1*(this.assumingPrice * leverage + buyMarket)))
        sellCanOpen = Math.max(0,((availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage) +  Math.abs(positionAmt) * 1 * sellMarket) / (1 * (this.assumingPrice *  leverage) + sellMarket)))
        if(buyCanOpen >= Math.abs(positionAmt)){
          sellCanOpen = Math.max(0, (availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage)))
        }
      }
      if(positionAmt < 0){
        buyCanOpen = Math.max(0,(availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage) + Math.abs(positionAmt) * 1 * buyMarket ) / (1*(this.assumingPrice *  leverage) + buyMarket))
        sellCanOpen = Math.max(0,(availableBalance + initialMargin + ((positionNotionalValue - this.computedSellNetValue) * leverage)) / (1 * (this.assumingPrice * leverage) + sellMarket))
        if (buyCanOpen >= Math.abs(positionAmt)) {
          buyCanOpen = Math.max(0, (availableBalance + initialMargin - ((positionNotionalValue + this.computedBuyNetValue) * leverage)) / (1 * this.assumingPrice * leverage))
        }
      }
      // 第二步进行验证
      let afterTradeBuyM = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue + (this.assumingPrice * Number(buyCanOpen))
      ), Math.abs(markPrice * positionAmt - this.computedSellNetValue))

      // notional after trade = max(abs(position_notional_value + open order's bid_notional), abs(position_notional_value - open order's ask_notional - new order's ask_notional))
      let afterTradeSellM = Math.max(Math.abs( (positionNotionalValue) + this.computedBuyNetValue),
        Math.abs((markPrice * positionAmt) - this.computedSellNetValue - (this.assumingPrice * Number(sellCanOpen))))
      // 第三步，重新计算最大可开数量
      if(afterTradeBuyM > this.maxNotionalAtCurrentLeverage){
        buyCanOpen = (this.maxNotionalAtCurrentLeverage - (positionNotionalValue) - this.computedBuyNetValue) / this.assumingPrice
      }
      if(afterTradeSellM > this.maxNotionalAtCurrentLeverage){
        sellCanOpen =  (this.maxNotionalAtCurrentLeverage + (positionNotionalValue) - this.computedSellNetValue) / this.assumingPrice
        // console.info('sellCanOpen==',sellCanOpen)
      }
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
  // let crossWalletBalance = Number(this.crossWalletBalance) // 全仓钱包余额
  // 向上取整IMR
  let leverage = Number(this.$globalFunc.accFixedCny(this.accDiv(1 , Number(this.$store.state.leverage) || 1),4))
  let availableBalance = this.$store.state.assets.availableBalance || 0
  // let availableBalance = this.availableBalance || 0
  let markPrice = Number(this.markPrice) || 0
  let price = this.price || 0 // 输入框价格
  // let temp = this.orderType ? -1 : 1;
  // let priceStep = Math.abs(Math.min(0 , temp * (markPrice - price))) || 0  // TODO:简化后
  let buy = Math.abs(Math.min(0 , 1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sell = Math.abs(Math.min(0 , -1 * (markPrice - price))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let buyMarket = Math.abs(Math.min(0 , 1 * (markPrice - this.assumingPriceDouble[0]))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 买(!orderType)
  let sellMarket = Math.abs(Math.min(0 , -1 * (markPrice - this.assumingPriceDouble[1]))) || 0  // TODO:适用 LIMIT, STOP, TAKE PROFIT 卖(orderType)
  let shortPositionAmt = Number(this.totalAmountShort) // TODO:有仓位时：数量取和；无仓位时取0
  let longPositionAmt = Number(this.totalAmountLong) // TODO:有仓位时：数量取和；无仓位时取0

  let buyCanOpen = 0
  let sellCanOpen = 0
  let afterTradeBuy = 0
  let afterTradeSell = 0
  let openAmount

  // if(this.marginType == 'CROSSED'){
  // 限价或者限价止损
  if(this.pendingOrderType == 'limitPrice'||this.pendingOrderType == 'limitProfitStopLoss'){
    if(this.price == 0 || this.price == '') return buyCanOpen = 0; sellCanOpen = 0;
    //Avail for Order / {assuming price * IM + abs(min[0, side * (mark price - order's Price)])}
    buyCanOpen = availableBalance / (this.assumingPriceDouble[0] * leverage + buy)
    sellCanOpen = availableBalance / (this.assumingPriceDouble[1] * leverage + sell)
    // 根据买卖最大可下单量计算出notional after trade
    // 计算可开多数量
    let afterTradeLongB = Math.max(Math.abs( longPositionAmt * markPrice + this.computedBuyNetValue + (this.assumingPriceDouble[0] * Number(buyCanOpen))), Math.abs(longPositionAmt*markPrice - this.computedSellNetValue))
    let afterTradeShortB = Math.max(Math.abs( shortPositionAmt * markPrice + this.computedBuyNetValue), Math.abs(shortPositionAmt*markPrice - this.computedSellNetValue))
    afterTradeBuy = afterTradeLongB + afterTradeShortB

    // 计算可开空数量
    let afterTradeLongS = Math.max(Math.abs( longPositionAmt * markPrice + this.computedBuyNetValue), Math.abs(longPositionAmt*markPrice - this.computedSellNetValue))
    let afterTradeShortS = Math.max(Math.abs(shortPositionAmt * markPrice + this.computedBuyNetValue), Math.abs(shortPositionAmt*markPrice - this.computedSellNetValue + (this.assumingPriceDouble[1] * Number(sellCanOpen))))
    afterTradeSell = afterTradeLongS + afterTradeShortS

    if(afterTradeBuy > this.maxNotionalAtCurrentLeverage) {
      buyCanOpen = (this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPriceDouble[0]
    }
    if(afterTradeSell > this.maxNotionalAtCurrentLeverage) {
      sellCanOpen = (this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPriceDouble[1]
    }
    // console.info('buyCanOpen===',longPositionAmt * markPrice)
    // console.info('sellCanOpen===',shortPositionAmt * markPrice)
    // return this.orderType ? sellCanOpen : buyCanOpen
    return [buyCanOpen,sellCanOpen]
    // Qty = Avail for Order / {assuming price * IM + abs(min[0, side * (mark price - order's Price)])}
  }

  // 市价或者市价止盈止损
  if(this.pendingOrderType== 'marketPrice'||this.pendingOrderType == 'marketPriceProfitStopLoss'){
    buyCanOpen = availableBalance / (this.assumingPriceDouble[0] * leverage + buyMarket)
    sellCanOpen = availableBalance / (this.assumingPriceDouble[1] * leverage + sellMarket)
    // 计算可开多数量
    let afterTradeLongB = Math.max(Math.abs( longPositionAmt * markPrice + this.computedBuyNetValue + this.assumingPriceDouble[0] * Number(buyCanOpen)), Math.abs(longPositionAmt * markPrice - this.computedSellNetValue))
    let afterTradeShortB = Math.max(Math.abs(shortPositionAmt * markPrice + this.computedBuyNetValue), Math.abs(shortPositionAmt * markPrice - this.computedSellNetValue))
    afterTradeBuy = afterTradeLongB + afterTradeShortB

    // 计算可开空数量
    let afterTradeLongS = Math.max(Math.abs( longPositionAmt * markPrice + this.computedBuyNetValue), Math.abs(longPositionAmt * markPrice - this.computedSellNetValue))
    let afterTradeShortS = Math.max(Math.abs(shortPositionAmt * markPrice + this.computedBuyNetValue), Math.abs(shortPositionAmt * markPrice - this.computedSellNetValue + this.assumingPriceDouble[1] * Number(sellCanOpen)))
    afterTradeSell = afterTradeLongS + afterTradeShortS

    if(afterTradeBuy > this.maxNotionalAtCurrentLeverage) {
      buyCanOpen =(this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPriceDouble[0]
    }
    if(afterTradeSell > this.maxNotionalAtCurrentLeverage) {
      sellCanOpen =(this.maxNotionalAtCurrentLeverage - (afterTradeShortB + afterTradeLongS)) / this.assumingPriceDouble[1]
    }
    // return this.orderType ? sellCanOpen : buyCanOpen
    // 将可平仓数量存储到store里面
    openAmount = {
      openAmtLong:buyCanOpen,
      openAmtShort:sellCanOpen,
    }
    this.$store.commit('CHANGE_OPEN_AMOUNT',openAmount)
    return [buyCanOpen,sellCanOpen]
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
// 计算是否有仓位和当前委托(调整保证金模式)
root.computed.isHasOrders = function (){
  // 如果当前币对的仓位和订单数量为0，不能切换全逐仓
  if(!this.currOrderLenObj[this.capitalSymbol] && !this.recordsIndexS) return true
  return false
}
// 计算是否有仓位和当前委托（调整单双仓）
root.computed.isHasOrdersOrPosition = function (){
  if(!this.currentLength && !this.recordsIndex) return true
  return false
}
// 最大头寸值
root.computed.maximumPosition = function () {
  return this.$store.state.bracketNotionalcap[this.capitalSymbol] || []
}
// 杠杆倍数
root.computed.initialLeverage = function () {
  return this.$store.state.bracketLeverage[this.capitalSymbol] || []
}
root.computed.currencyList = function(){
  return this.$store.state.symbol.currencyList
}
//加下划线币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}
root.computed.name = function () {
  return this.$store.state.symbol.split('_')[1];
}
//页面功能模块显示逻辑配置信息
root.computed.positionModeConfigs = function () {
  let data = tradingHallData.positionModeConfigs;
  // console.log(data);
  return data
}
// 实时价格
root.computed.isNowPrice = function () {

  let nowPrice = this.latestPriceArr[this.latestPriceArr.length-1]

  document.title = nowPrice+" "+this.symbol.replace('_', '/')+" "+this.$t('document_title');
  return (nowPrice || this.latestPriceVal).toString();//当nowPrice为 0 或者 undefined时返回latestPriceVal，避免出现0
}
// 实时价格的升降
root.computed.direction = function () {

  let currPrice = this.latestPriceArr[this.latestPriceArr.length-1];
  let prePrice = this.latestPriceArr[this.latestPriceArr.length-2];

  let step = currPrice - prePrice,className = 'txt-white'
  step > 0 && (className = 'txt-price-green')
  step < 0 && (className = 'txt-price-red')

  return className;
}

// 深度图百分比  如果是 ETH->BTC的，数量超过10就满，BDB->BTC或BDB->ETH的，超过10万才满,ICC->BTC超过100万才满
root.computed.deep = function () {
  let symbol = this.$store.state.symbol;
  let tradingParameters = this.$store.state.tradingParameters;
  let deeps = {};
  for (var i = 0; i < tradingParameters.length; i++) {
    let name = tradingParameters[i].name;
    let buy_amount = tradingParameters[i].maxAmount || 1000000;
    let sall_amount = tradingParameters[i].sellAmount || buy_amount;
    if (name == symbol) {
      let buy_deeps = (buy_amount/100).toFixed(2);
      let sall_deeps = (sall_amount/100).toFixed(2);
      deeps = {
        buy_deeps: buy_deeps,
        sall_deeps: sall_deeps,
      }
    }
  }
  return deeps;
}

// 是否绑定谷歌验证
root.computed.bindGa = function () {
  return this.$store.state.authState.ga
}
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 获取价格区间
root.computed.KKPriceRangeH5 = function () {
  // return ['0.2504','0.2506']
  return this.$store.state.KKPriceRange;
}
// 最大头寸计算
root.computed.maxPosition = function () {
  let maxPosition = '',initialLeverage = this.initialLeverage

  if(this.value > initialLeverage[1] && this.value <= initialLeverage[0]) {
    maxPosition = this.maximumPosition[0]
    return maxPosition
  }
  if(this.value > initialLeverage[2] && this.value <= initialLeverage[1]) {
    maxPosition = this.maximumPosition[1]
    return maxPosition
  }
  if(this.value > initialLeverage[3] && this.value <= initialLeverage[2]) {
    maxPosition = this.maximumPosition[2]
    return maxPosition
  }
  if(this.value > initialLeverage[4] && this.value <= initialLeverage[3]) {
    maxPosition = this.maximumPosition[3]
    return maxPosition
  }
  if(this.value > initialLeverage[5] && this.value <= initialLeverage[4]) {
    maxPosition = this.maximumPosition[4]
    return maxPosition
  }
  if(this.value == initialLeverage[5]) {
    maxPosition = this.maximumPosition[5]
    return maxPosition
  }
  if(this.value ==  initialLeverage[6]) {
    maxPosition = this.maximumPosition[6]
    return maxPosition
  }
  if(this.value == initialLeverage[7]) {
    maxPosition = this.maximumPosition[7]
    return maxPosition
  }
  maxPosition = ''
  return maxPosition
}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 检验是否是安卓
root.computed.isAndroid = function () {
  return this.$store.state.isAndroid ? true : false
}
/*------------------------------ 方法 begin -------------------------------*/

root.methods = {}
root.methods.selectOpenType = function (type) {
  if(this.positionModeFirst == 'doubleWarehouseMode'){
    this.openSide = type
  }
  // if(this.positionModeFirst == 'singleWarehouseMode'){
  //   this.openSide = type
  // }
}
// 获取用户可用余额
root.methods.getBalance = function () {
  this.$http.send('GET_BALAN_ACCOUNT',{
    bind: this,
    callBack: this.re_getBalance,
    errorHandler:this.error_getBalance
  })
}
// 获取用户可用余额正确回调
root.methods.re_getBalance = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data || !data.data[0])return
  this.availableBalance  = data.data[0].availableBalance || 0
}
// 获取用户可用余额错误回调
root.methods.error_getBalance = function (err) {
  console.log('获取用户可用余额',err)
}
// 非法数据拦截
root.methods.openClosePsWindowClose = function (){
  // 限价价格非空判断
  let limitArr = ['limitProfitStopLoss','limitPrice'],triggerArr = ['limitProfitStopLoss','marketPriceProfitStopLoss'],closeAmountArr = ['positionAmtShort','positionAmtLong']

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
//开启拦截弹窗
root.methods.openSplicedFrame = function (btnText,callFuncName,orderType) {
  this.orderType = orderType;


  if(this.$route.query.isApp) {
    if(!this.$store.state.authState.userId){
      window.postMessage(JSON.stringify({
        method: 'toLogin'
      }))
      return
    }
  }

  if(!this.openClosePsWindowClose())return

  // this[callFuncName]();//调用对应的接口
  // return;

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

// 止盈止损接口
root.methods.postFullStop = function () {
  this.loading = true
  // 如果是平空或者平多，买入量不得大于可平数量

  let params = {}
  let latestOrMarkPrice = this.latestPrice == '最新' ? Number(this.latestPriceVal) : Number(this.markPrice)
  if((this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3) && ((!this.orderType && Math.abs(this.positionAmtShort) < Number(this.amount)) || (this.orderType && Math.abs(this.positionAmtLong) < Number(this.amount)))){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '您输入的数量超过可平数量';
    this.currentLimiting = false
    this.loading = false
    return
  }
  // if(this.amount == '' || this.amount == 0){
  //   this.promptOpen = true;
  //   this.popType = 0;
  //   this.popText = '请输入正确的数量';
  //   this.loading = false
  //   this.currentLimiting = false
  //   return
  // }
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
      workingType: this.latestPrice == '最新'? 'CONTRACT_PRICE':'MARK_PRICE',
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
      workingType: this.latestPrice == '最新'? 'CONTRACT_PRICE':'MARK_PRICE',
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
      workingType: this.latestPrice == '最新'? 'CONTRACT_PRICE':'MARK_PRICE',
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
      workingType: this.latestPrice == '最新'? 'CONTRACT_PRICE':'MARK_PRICE',
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
      workingType: this.latestPrice == '最新'? 'CONTRACT_PRICE':'MARK_PRICE',
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
      workingType: this.latestPrice == '最新'? 'CONTRACT_PRICE':'MARK_PRICE',
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
    this.popText = '仓位模式变更同步中，请于1分钟后操作';//用户无权限
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
  // if(this.amount == ''|| this.amount == 0){
  //   this.promptOpen = true;
  //   this.popType = 0;
  //   this.popText = '请输入正确的数量';
  //   this.loading = false
  //   this.currentLimiting = false
  //   return
  // }
  let params = {}
  // 单仓 限价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'limitPrice') {
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
    this.popText = '仓位模式变更同步中，请于1分钟后操作';//用户无权限
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
  // console.info('err======',err)
}

// 平仓
root.methods.postOrdersPosition = function () {
  this.loading = true
  // if(this.amount == '' || this.amount == 0){
  //   this.promptOpen = true;
  //   this.popType = 0;
  //   this.popText = '请输入正确的数量';
  //   this.loading = false
  //   this.currentLimiting = false
  //   return
  // }
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
  if((!this.orderType && Math.abs(this.positionAmtShort) < Number(this.amount)) || (this.orderType && Math.abs(this.positionAmtLong) < Number(this.amount))){
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
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.data) return
  // 监听仓位和委托单条数
  this.$eventBus.notify({key:'GET_ORDERS'})
  this.$eventBus.notify({key:'GET_POSITION'})
  this.$eventBus.notify({key:'GET_BALANCE'})
  if(data.code != '303') {
    this.promptOpen = true;
    // this.closePsWindowClose();
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
  // console.info('err====',err)
}







root.methods.openDescript = function (title) {
  this.descriptionOpen = true
  this.titleDescript = title
  this.descriptionText = this.descriptInfo(title)
}

root.methods.descriptInfo = function (title) {
  let msg = ''
  switch (title) {
    case '资金费率':
      msg = '买方及卖方在下个资金时段要交换的资金费率。'
      break;
    case '被动委托':
      msg = '订单不会立即在市场成交，否则将被取消。'
      break;
    // case '保证金':
    //   msg = '仓位占用的保证金'
    //   break;
    case '只减仓':
      msg = '只减仓订单仅允许减少仓位的委托，确保你的仓位不会增加。'
      break;
    // case '开仓价格':
    //   msg = '持仓的平均买入/卖出成交价格。'
    //   break;
    // case '标记价格':
    //   msg = '该合约的实时标记价格。此标记价格将用于计算盈亏及保证金，可能与合约最新成交价格有所偏差，以避免价格操纵。'
    //   break;
    // case '强平价格':
    //   msg = '若多仓的标记价格低于此强平价格，或是空仓的标记价格高于此强平价格，你的持仓将被强平。'
    //   break;
    // case 'PNL(ROE%)':
    //   msg = '保证金比率越低，仓位的风险相对较小。当保证金比率到达100%时，仓位将被强平。'
    //   break;
    default:
      msg = '---'
  }
  return msg
}
// 关闭解释弹窗
root.methods.descriptionClose = function () {
  this.descriptionOpen = false
}

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
// 获取币安最新标记价格和资金费率
root.methods.getMarkPricesAndCapitalRates = function () {
  this.$http.send('GET_MARKET_PRICE',{
    bind: this,
    // query:{
    //   symbol:this.capitalSymbol
    // },
    callBack: this.re_getMarkPricesAndCapitalRates,
    errorHandler:this.error_getMarkPricesAndCapitalRates
  })
}
// 获取币安最新标记价格和资金费率正确回调
root.methods.re_getMarkPricesAndCapitalRates = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data)return;

  this.sNameList.map(sv=>{
    for (let i = 0,len = data.data.length; i < len; i++) {
      let v = data.data[i];
      if(sv == v.symbol){
        //接口返回的字段名转换成和socket一致
        v.s = v.symbol
        v.p = (v.markPrice || '').toString();
        v.r = v.lastFundingRate
        v.T = v.nextFundingTime

        this.markPriceObj[sv] = v;
        break;
      }
    }
  })

  //当前选中币对数据
  let msg =this.markPriceObj[this.capitalSymbol];
  if(msg){
    msg.p > 0 && (this.markPrice = msg.p)// 标记价格
    msg.r > 0 && (this.lastFundingRate = msg.r)// 资金费率
    msg.T > 0 && (this.nextFundingTime = msg.T)//下个资金时间
  }

  /*// console.info('data========',data.data[0])
  this.markPrice = (data.data[0].markPrice || '').toString()
  this.lastFundingRate = data.data[0].lastFundingRate || '--'
  this.nextFundingTime = data.data[0].nextFundingTime || '--'*/
//
}
// 获取币安最新标记价格和资金费率错误回调
root.methods.error_getMarkPricesAndCapitalRates = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}


// TODO 仓位模式Start
//打开仓位模式
root.methods.turnOnLocationMode = function () {
  this.positionModeFirstTemp = this.positionModeFirst;//打开弹窗前需要初始化positionModeFirstTemp的值，必须和positionModeFirst一致
  this.popWindowPositionModeBulletBox = true
}
// TODO 仓位模式
root.methods.popWindowClosePositionModeBulletBox = function () {
  this.popWindowPositionModeBulletBox = false
  this.positionModeFirstTemp = this.positionModeFirst;//直接关闭弹窗后需要还原positionModeFirstTemp的值，必须和positionModeFirst一致
}
// TODO 仓位模式选择
root.methods.positionModeSelected = function (type) {
  this.positionModeFirstTemp = type
}
// 获取仓位模式
root.methods.getPositionsideDual = function () {
  this.$http.send('GET_POSITIONSIDE_DUAL',{
    bind: this,
    callBack: this.re_getPositionsideDual,
    errorHandler:this.error_getPositionsideDual
  })
}
// 获取仓位模式正确回调
root.methods.re_getPositionsideDual = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(data.data.dualSidePosition){
    this.dualSidePosition = true
    this.positionModeFirst = 'doubleWarehouseMode'
    return
  }
  this.dualSidePosition = false
  this.positionModeFirst = 'singleWarehouseMode'
}
// 获取仓位模式错误回调
root.methods.error_getPositionsideDual = function (err) {
  console.log('获取币安获取仓位模式接口',err)
}

// 仓位模式选择确认
root.methods.positionModeSelectedConfirm = function () {
  // 如果是相同仓位切换，直接关闭
  if((this.dualSidePosition == false && this.positionModeFirstTemp == 'singleWarehouseMode') || (this.dualSidePosition == true && this.positionModeFirstTemp == 'doubleWarehouseMode')){
    this.popWindowPositionModeBulletBox = false
    return
  }
  if(!this.isHasOrdersOrPosition){
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '您可能存在挂单或仓位，不支持调整仓位模式';
    return
  }
  this.$http.send('POST_SINGLE_DOUBLE',{
    bind: this,
    params:{
      dualSidePosition: this.positionModeFirst == 'singleWarehouseMode' ? "true" : "false",
      // timestamp: this.serverTime
    },
    callBack: this.re_positionModeSelectedConfirm,
    errorHandler:this.error_positionModeSelectedConfirm
  })
}
// 仓位模式选择确认正确回调
root.methods.re_positionModeSelectedConfirm = function (data) {
  if (data.code == 304) {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '用户无权限';
    return
  }
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  this.promptOpen = true;
  if (data.code == 200) {
    this.popType = 1;
    this.popText = '调整仓位模式成功';
    this.positionModeFirst = this.positionModeFirstTemp;
    this.getPositionsideDual()
    this.popWindowPositionModeBulletBox = false
    // 将输入框和进度条清空
    this.numed2 = 0
    this.amount = ''
    return
  }

  this.popType = 0;
  this.popText = '调整仓位模式失败';
}
// 仓位模式选择确认错误回调
root.methods.error_positionModeSelectedConfirm = function (err) {
  console.log('仓位模式选择确认接口',err)
}


// 跳转计算器
root.methods.goToCalculator = function () {
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'toH5Route',
        parameters: {
          url: window.location.origin + '/index/mobileCalculator?isApp=true&isWhite=true',
          loading: false,
          navHide: false,
          title: '',
          requireLogin:true,
          isTransparentNav:true
        }
      })
    );
    return
  }

  this.$router.push({name: 'mobileCalculator'})
}

// 保证金模式弹框 start
// 打开全仓逐仓弹窗
root.methods.openSecurityDepositMode = function () {
  this.marginModeTypeTemp = this.marginModeType
  this.popWindowSecurityDepositMode = true
}

//保证金模式
root.methods.popWindowCloseSecurityDepositMode = function () {
  this.marginModeTypeTemp = this.marginModeType
  this.popWindowSecurityDepositMode = false
}

// 切换保证金模式
root.methods.securityDepositMode = function (cardType) {
  this.marginModeTypeTemp = cardType
}

// 切换全仓逐仓
root.methods.marginModeConfirm = function () {
  if ((this.marginType == 'CROSSED' && this.marginModeTypeTemp == 'quanCang')|| (this.marginType == 'ISOLATED' && this.marginModeTypeTemp == 'zhuCang')) {
    this.popType = 0;
    this.popText = '暂不需要调整保证金模式';
    this.promptOpen = true;
    return
  }
  if(!this.isHasOrders){
    this.popType = 0;
    this.popText = '您可能存在挂单或仓位，不支持调整保证金模式';
    this.promptOpen = true;
    return
  }

  // if (this.marginModeTypeTemp == 'zhuCang') {
  //   this.marginModeType = 'zhuCang'
  //   return
  // }
  this.$http.send('POST_MARGIN_TYPE',{
    bind: this,
    params:{
      "symbol": this.capitalSymbol,
      "marginType": this.marginType == 'ISOLATED' ? "CROSSED": "ISOLATED"
    },
    callBack: this.re_marginModeConfirm,
    errorHandler:this.error_marginModeConfirm
  })
}
root.methods.re_marginModeConfirm = function (data) {
  if(data.code == 304) {
    this.popType = 0;
    this.popText = '用户无权限';
    this.promptOpen = true;
    return
  }
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(data.code == 200) {
    this.popType = 1;
    this.popText = '调整保证金模式成功';
    this.promptOpen = true;
    if (this.marginType == 'ISOLATED') {
      this.marginModeType = 'quanCang'
      this.popWindowCloseSecurityDepositMode()
      this.positionRisk()
      return
    }
    if (this.marginType == 'CROSSED') {
      this.marginModeType = 'zhuCang'
    }
    this.positionRisk()
    this.popWindowCloseSecurityDepositMode()
    return
  }
  this.popType = 0;
  this.popText = '调整保证金模式失败';
  this.promptOpen = true;
}
root.methods.error_marginModeConfirm = function (err) {
}

//订单大分类
root.methods.changeOptionData = function (v) {
  this.optionVal = v
  this.pendingOrderType = this.optionDataMap[v]
}
//最新、标记
root.methods.changeLatestPriceOption = function (v) {
  this.latestPrice = v
}

//仓位模式二级切换 Start
root.methods.changePositionModeSecond = function (type) {
  this.positionModeSecond = type;
  // if(this.positionModeSecond == 'openWarehouse') {
  //   this.optionVal = '市价单'
  // }
}
//仓位模式二级切换 End

//页面功能模块显示逻辑判断 Start
root.methods.isHasModule = function (type) {
  let isHas = '';
  //单仓模式
  if(this.positionModeFirst == 'singleWarehouseMode'){
    isHas = this.positionModeConfigs[this.positionModeFirst][this.pendingOrderType][type]
    // console.log('singleWarehouseMode-' + type,isHas);
    return isHas
  }
  //双仓模式
  isHas = this.positionModeConfigs[this.positionModeFirst][this.positionModeSecond][this.pendingOrderType][type]
  // console.log(type,isHas);
  return isHas
}
//页面功能模块显示逻辑判断 End

//被动委托 start
root.methods.priceLimitSelection = function (checkPrice) {
  this.checkPrice = checkPrice
  if(checkPrice == 2) {
    this.effectiveTime = 'GTX'
    return
  }
  this.effectiveTime = 'GTC'
}
//被动委托 end

//只减仓 start
root.methods.changeReducePositions = function(){
  this.reducePositionsSelected = !this.reducePositionsSelected
}
//只减仓 end

// 获取仓位子组件的值
root.methods.getIndex = function (index) {
  this.recordsIndex = index
}
//设置开平器仓位数据
root.methods.setKaipingqiPos = function(records){

  let filterRecords = []

  for (let i = 0; i < records.length ; i++) {
    let v = records[i];
    if (v.marginType == 'cross' && v.positionAmt != 0 && v.symbol == this.capitalSymbol) {
      filterRecords.push(v)
      continue;
    }
    //逐仓保证金：isolatedMargin - unrealizedProfit,开仓量或逐仓保证金不为0的仓位才有效
    if(v.marginType == 'isolated' && v.symbol == this.capitalSymbol){
      v.securityDeposit = this.accMinus(v.isolatedMargin,v.unrealizedProfit)
      // v.securityDeposit = Number(v.isolatedMargin) - Number(v.unrealizedProfit)

      //由于开头判断条件用括号包装，会被编译器解析成声明函数括号，所以前一行代码尾或本行代码头要加分号、或者本行代码改为if判断才行
      // (v.positionAmt != 0 || v.securityDeposit != 0) && filterRecords.push(v);
      if((v.positionAmt != 0 || v.securityDeposit != 0) && v.symbol == this.capitalSymbol) {
        // v.inputMarginPrice = this.toFixed(v.markPrice,2)
        filterRecords.push(v)
      }
    }
  }
  this.positionList = filterRecords
}

// 获取仓位信息
root.methods.positionRisk = function () {
  this.$http.send('GET_POSITION_RISK',{
    bind: this,
    callBack: this.re_positionRisk
  })
}
root.methods.re_positionRisk = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data || data.data == []) return

  let filterRecords = [],records
  records = data.data
  records.forEach(v=>{
    if (v.symbol == this.capitalSymbol) {
      this.leverage = v.leverage
      this.$store.commit("CHANGE_LEVERAGE", v.leverage);
      if(v.marginType == 'isolated'){
        this.marginType = 'ISOLATED'
        this.marginModeType = 'zhuCang'
        return
      }
      this.marginType = 'CROSSED'
      this.marginModeType = 'quanCang'
    }
  })

  this.setKaipingqiPos(records);
}
// 调整杠杆接口调取
root.methods.postLevelrage = function () {

  if(!this.isLogin){
    window.location.replace(this.$store.state.contract_url + 'index/sign/login')
  }
  this.$http.send('POST_LEVELRAGE',{
    bind: this,
    params:{
      "symbol":this.capitalSymbol,
      "leverage": this.value,
    },
    callBack: this.re_postLevelrage
  })
}
root.methods.re_postLevelrage = function (data) {
  // console.info('超过当前杠杆的最大允许持仓量',data,data.code)
  if (data.code == 303 && data.errCode == 2027) {
    this.popTextLeverage = '超过当前杠杆的最大允许持仓量';
    return
  }

  if (data.code == 304) {
    this.popTextLeverage = '用户无权限';
    return
  }
  if (data.code == 306) {
    this.popTextLeverage = '您可能存在挂单或仓位，不支持调整杠杆';
    return
  }
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.promptOpen = true;
  if (data.code == 200) {
    this.leverage = data.data.leverage || ''
    this.popType = 1;
    this.popText = '调整杠杆成功';
    this.maxNotionalValue = data.data.maxNotionalValue || ''
    this.positionRisk()
    this.popWindowCloseAdjustingLever()
  }
}
//打开调整杠杆 Strat
root.methods.openLever = function () {
  this.popTextLeverage=''
  this.popWindowAdjustingLever = true
  this.value = this.$store.state.leverage
}
//打开调整杠杆 End

// 关闭调整杠杆 Strat
root.methods.popWindowCloseAdjustingLever = function () {
  this.popWindowAdjustingLever = false
}
// 关闭调整杠杆 End

// 处理滑动条显示框内容
root.methods.formatTooltip =(val)=>{
  return  val + 'X';
}


root.methods.RE_FEE = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  if (data.dataMap.TTFEE === 'no') {
    this.fee = ''
  }
  if (data.dataMap.TTFEE === 'yes') {
    this.fee = 65536
  }
}
// 获取币安最新价格接口
root.methods.getLatestrice = function () {
  this.$http.send('GET_TICKER_PIRCE',{
    bind: this,
    query:{
      symbol:this.capitalSymbol
    },
    callBack: this.re_getLatestrice,
    errorHandler:this.error_getLatestrice
  })
}
// 获取币安最新价格接口正确回调
root.methods.re_getLatestrice = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data || !data.data[0]) return
  // this.marketSymbolList = this.$globalFunc.mergeObj(data.data[0], this.marketSymbolList);

  let price = data.data[0].price
  this.latestPriceVal = (price || '').toString()

  // this.setTransactionPrice(this.latestPriceVal);//第一次进入页面价格要赋值
  // this.latestPriceVal = ((price != undefined || price != null) &&  price) || ''
  // this.latestPriceVal = (Number(price) || '').toString()

  // try{
  //   data.data[0].price = null;//1.null
  //   // delete data.data[0].price;//2.undefined
  //   this.latestPriceVal = String(data.data[0].price) || ''
  // }catch (ex) {
  //   console.error('this is err data.data[0].price.toString()',ex);
  // }
}
// 获取币安最新价格接口错误回调
root.methods.error_getLatestrice = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

// 获取深度信息
root.methods.getDepth = function () {
  this.$http.send('GET_DEPTH', {
    bind: this,
    query:{
      symbol:this.capitalSymbol,
      limit: 20
    },
    callBack: this.re_getDepth
  });
}
// 获取深度信息正确回调
root.methods.re_getDepth = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data)return
  let d = data.data
  d.a = d.asks
  d.b = d.bids
  this.buy_sale_list = d;
  this.trade_loading = false
  // console.info('this.buy_sale_list======',this.buy_sale_list)
}

// 获取实时成交归集交易
root.methods.getAggTrades = function () {
  let query = {
    // symbol: this.symbol
    symbol: this.capitalSymbol,
    limit:80
  };
  this.$http.send("GET_AGG_TRADES", {
    bind: this,
    query,
    callBack: this.re_getAggTrades,
    errorHandler: this.error_getAggTrades
  })
}
root.methods.re_getAggTrades = function (data) {
  // console.log("getAggTrades---------",data);
  if(!data)return
  data = data.data || {}
  this.apiTickArr = data;
  let price1 = data[data.length - 1] && data[data.length - 1].p || 0;//最后一条价格最新

  if(this.latestPriceArr.length == 0){//如果一条数据都没有，至少填两条
    let price2 = data[data.length - 2] && data[data.length - 2].p || 0;

    this.latestPriceArr = [price2,price1]
    return
  }

  this.latestPriceArr.push(price1)
}
// 获取实时成交归集交易接口错误回调
root.methods.error_getAggTrades = function (err) {
  console.log('获取实时成交归集交易接口出错',err)
}

// 初始化socket
root.methods.initSocket = function () {
  let that = this;
  // 订阅某个币对的信息
  // this.$socket.emit('UNSUBSCRIBE', {symbol: this.$store.state.symbol});
  // this.$socket.emit('SUBSCRIBE', ["btcusdt@depth"]);

  this.$socket.off({key: '', bind: this});
  // let subscribeSymbol = this.$store.state.subscribeSymbol;
  let subscribeSymbol = this.$globalFunc.toOnlyCapitalLetters(this.$store.state.symbol);
  // 获取最新标记价格
  this.$socket.on({
    key: 'markPriceUpdate', bind: this, callBack: (message) => {

      this.sNameList.map(sv=>{
        for (let i = 0,len = message.length; i < len; i++) {
          let v = message[i];
          if(sv == v.s){
            this.markPriceObj[sv] = v;
            break;
          }
        }
      })
      //当前选中币对数据
      let msg =this.markPriceObj[subscribeSymbol];
      if(msg){
        msg.p > 0 && (this.markPrice = msg.p)// 标记价格
        msg.r > 0 && (this.lastFundingRate = msg.r)// 资金费率
        msg.T > 0 && (this.nextFundingTime = msg.T)//下个资金时间
      }

      /*if(message.s === subscribeSymbol){
        message.p > 0 && (this.markPrice = message.p)// 标记价格
        message.r > 0 && (this.lastFundingRate = message.r)// 资金费率
        message.T > 0 && (this.nextFundingTime = message.T)//下个资金时间
      }*/
    }
  })

  // 获取币安24小时价格变动
  /*this.$socket.on({
    key: '24hrTicker', bind: this, callBack: (message) => {
      // console.log('24hrTicker is ===',message);

      this.socket24hrTicker = message;
      var tickerData = message.find(v=>v.s === subscribeSymbol)

      if(tickerData){
        tickerData.P && (this.priceChangePercent = tickerData.P)// 24小时价格变化(百分比)
        tickerData.h > 0 && (this.highPrice = tickerData.h)// 24小时内最高成交价
        tickerData.l > 0 && (this.lowPrice = tickerData.l)// 24小时内最低成交加
        tickerData.v && (this.volume = tickerData.v)// 24小时内成交量
      }
    }
  })*/

  // 获取深度图信息
  this.$socket.on({
    key: 'depthUpdate', bind: this, callBack: (message) => {
      // console.log('depth is ===',message);
      message.asks = message.a;
      message.bids = message.b;
      this.socket_snap_shot = message
    }
  })

  // 获取最新成交，归集交易
  this.$socket.on({
    key: 'aggTrade', bind: this, callBack: (message) => {
      if(!message)return

      this.socket_tick = message.s === subscribeSymbol && message || {}
      this.socketTickObj = message.s === subscribeSymbol && message || {}

      let currPrice = this.socketTickObj && this.socketTickObj.p || 0
      let lpal = this.latestPriceArr.length - 50;

      lpal == -50 && (this.latestPriceArr = [0,currPrice])//说明length是0
      lpal > -50 && this.latestPriceArr.push(currPrice);//length > 0
      lpal > 0 && this.latestPriceArr.splice(0,lpal);//避免数组溢出

      // this.latestPriceVal = this.socketTickObj && this.socketTickObj.p || this.latestPriceVal
      // 取消板块loading
      this.trade_loading = false;
      // console.log('aggTrade is ===',message);
    }
  })

}

root.methods.getPriceChangeOrders = function(transactionData){

  if(this.symbol == 'KK_USDT' && this.KKPriceRangeH5.length >0){
    let minPrice = this.KKPriceRangeH5[0] || 0;
    let maxPrice = this.KKPriceRangeH5[this.KKPriceRangeH5.length -1] || 10;

    // console.log('this is minPrice',minPrice,'maxPrice',maxPrice);

    if(transactionData instanceof Array)
      transactionData = transactionData.filter(v => !!v && v.price >= minPrice && v.price <= maxPrice)

    transactionData = transactionData.splice(0, 9)
    return transactionData
  }

  transactionData = transactionData.splice(0, 9)
  return transactionData

}

// 全站交易
root.methods.DISPLAY_LATEST = function (message) {
  if (message instanceof Array && message.length > 0) {
    var list = message.splice(0, 20);
    this.list = list;
  }
  if (!!message.symbol) {
    var lists = this.list;
    lists.unshift(message);
    var list = lists.splice(0, 20);
    this.list = list;
  }
}

// 获取不同symbol的精度
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}

// 计算深度图实时价格
root.methods.getDepthCny = function (list, price, symbol) {
  let self = this;
  let rate = 0;
  for (let key in list) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = list[key][4];
    }
  }

  switch (symbol) {
    case 'BTC':
      rate = this.$store.state.exchange_rate.btcExchangeRate || 0
      break;
    case 'ETH':
      rate = this.$store.state.exchange_rate.ethExchangeRate || 0
      break;
    case 'BDB':
      rate = (this.$store.state.exchange_rate.ethExchangeRate * self.bdb_rate) || 0
      break;
    case 'USDT':
      rate = 1;
      break;
    default:
      rate = 0;
      break;
  }

  this.cnyPrice = !(price * rate) ? 0 : this.$globalFunc.accFixedCny(price * rate * this.$store.state.exchange_rate_dollar, 2);
}

// 判断验证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState
    })
    return
  }
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
}

// 切换到市场列表
root.methods.CHANGE_SYMBOL = function () {
  this.$router.push('/index/mobileTradingHall');
  this.$store.commit('changeMobileTradingHallFlag', true);
}


// 关闭提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

// 按钮点击效果
root.methods.BTN_CLICK = function () {
  let self = this;
  if (this.btn_click) return;
  this.btn_click = true;
  setTimeout(()=>{
    self.btn_click = false;
  },300);
}

// 关闭弹窗
root.methods.popIdenClose = function () {
  this.popIdenOpen = false
}

// 点击确定
root.methods.popIdenComfirms = function () {
  this.popIdenOpen = false
  let orderTypeOrigin = this.orderTypeOrigin;
  this.tradeMarket(false,orderTypeOrigin)
}

// root.methods.comparePriceNow = function () {
//   if (this.price <= 0 || this.price <=0)return true
//   let multiple = this.accDiv(this.price,Number(this.price));
//
//   let priceCont = ''
//   multiple == 1/2 && (priceCont = '挂单价格等于时价1/2，确定下单吗？')
//   multiple < 1/2 && (priceCont = '挂单价格低于时价1/2，确定下单吗？')
//   multiple == 2 && (priceCont = '挂单价格等于时价2倍，确定下单吗？')
//   multiple > 2 && (priceCont = '挂单价格高于时价2倍，确定下单吗？')
//   if(priceCont == '')return true
//
//   this.priceCont = priceCont;
//   return false;
// }

// 提交买入或卖出
root.methods.tradeMarket = function (popIdenOpen,type) {
  this.orderTypeOrigin = type;
  // 按钮添加点击效果
  this.BTN_CLICK();

  let available = !type ? this.currentSymbol.balance : this.currentSymbol.balance_order;
  if (!this.$store.state.authMessage.userId) {
    this.$router.push('/index/sign/login')
    return
  }
  // if (!!this.$store.state.authState && !this.$store.state.authState.identity) {
  //   this.popText = '您的账号还未认证,请先进行认证';
  //   this.popType = 0;
  //   this.promptOpen = true;
  //   return
  // }

  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.toastNobindShow = true
    return
  }

  // 判断是否绑定谷歌或手机，如果都没绑定
  if (!this.bindGa && !this.bindMobile) {
    // this.$eventBus.notify({key: 'BIND_AUTH_POP'})
    this.popText = '请绑定谷歌验证或手机';
    this.popType = 0;
    this.promptOpen = true;
    return
  }


  if (!type && Number(this.price * this.amount) > Number(available)) {
    // alert('您的持仓不足')
    this.popText = '您的余额不足,请充值';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  if (type && Number(this.amount) > Number(available)) {
    // alert('您的持仓不足')
    this.popText = '您的余额不足,请充值';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  let txt = !type ? '买入' : '卖出';
  let symbol = this.$store.state.symbol;

  if(symbol == 'KK_USDT' && !this.checkPriceRange()) return;
  if (!type && this.price == 0) {
    this.popText = '请输入正确的' + txt + '价';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  // if(!type && popIdenOpen){
  //   this.popIdenOpen = !this.comparePriceNow();
  //   if(this.popIdenOpen)return;
  // }

  if (!type && this.amount == 0) {
    this.popText = '请输入正确的' + txt + '量';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if (type && this.price == 0) {
    this.popText = '请输入正确的' + txt + '价';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  // if(type && popIdenOpen){
  //   this.popIdenOpen = !this.comparePriceNow();
  //   if(this.popIdenOpen)return;
  // }

  if (type && this.amount == 0) {
    this.popText = '请输入正确的' + txt + '量';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  let params = {
    symbol: this.capitalSymbol,
    price: this.price,
    amount: this.amount,
    type: type,
    source: 'H5', //访问来源
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
  let turnoverAmount = Number(this.amount);
  let miniVolume;
  let maxAmount;
  let tradingParameters = this.$store.state.tradingParameters;
  for (var i = 0; i < tradingParameters.length; i++) {
    let item = tradingParameters[i];
    let name = item.name;
    if (name == this.symbol) {
      miniVolume = item.miniVolume;
      maxAmount = item.maxAmount;
    }
  }
  if (Number(turnover) < Number(miniVolume)) {
      this.popType = 0;
      this.popText = '交易额不能小于' + miniVolume;
      this.promptOpen = true;
      return;
  }
  // if (Number(turnoverAmount) < Number(maxAmount)) {
  //     this.popType = 0;
  //     this.popText = '交易数量不能高于' + maxAmount;
  //     this.promptOpen = true;
  //     return;
  // }
  //
  // if(symbol == 'KK_USDT' && Number(turnoverAmount) > Number(maxAmount)) {
  //   this.popType = 0;
  //   this.popText = '交易数量不能高于' + maxAmount;
  //   this.promptOpen = true;
  //   return;
  // }
  // if (Number(maxAmount)>0) {
  //   if(Number(turnoverAmount) > (Number(maxAmount))) {
  //     this.popType = 0;
  //     this.popText = '数量不能大于' + maxAmount;
  //     this.promptOpen = true;
  //     return;
  //   }
  // }


  this.$http.send('TRADE_ORDERS',
    {
      bind: this,
      params: params,
      callBack: this.successCallback,
      errorHandler: this.RE_ERROR
    })
}

// 买入卖出成功后执行的回调函数
root.methods.successCallback = function (data) {
  // alert('交易成功')
  this.popType = 1;
  this.popText = '挂单成功';
  this.promptOpen = true;
  // 清空数量
  this.amount = '';
  // console.log('TRADE_ORDERS', data)
  this.$http.send('ACCOUNTS', {
    bind: this,
    callBack: this.RE_ACCOUNTS
  })
}

root.methods.RE_ERROR = function (err) {
  let message = err.response.data.message
  let err_type = err.response.data.data;
  let txt = '';
  if (err_type == 'amount') {
    txt = '最多交易10000000个!';
  }
  if (err_type == 'symbol') {
    txt = '暂未开放!';
  }
  if (err_type == 'null') {
    txt = '余额不足,请充值!';
  }
  if (message == 'user_cannot_trade') {
    // txt = '无法交易'
    this.toastOpen = true
    return
  }

  if (message == 'ORDER_GRANTER_THAN_MAXAMOUNT') {
    // txt = '无法交易'
    // txt = '数量不能大于'+err_type.split("|")[1] || "最大值"
    // this.toastOpen = true
    this.popText = '数量不能大于'+err_type.split("|")[1] || "最大值";
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  // alert('你先去充点钱再来玩')
  this.popText = '暂不可用';
  this.popType = 0;
  this.promptOpen = true;

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
  // console.log('获取grc交易价格区间成功',data);
  if(!data || !data.kkPriceRange)return
  this.KKPriceRange = data.kkPriceRange;

  this.$store.commit('SET_KK_PRICE_RANGE',data.kkPriceRange)
}
// 获取grc交易价格区间报错
root.methods.error_getKKPriceRange = function () {
  // console.log('获取grc交易价格区间报错');
}

//检测币对交易价格，false 不通过 true 通过
root.methods.checkPriceRange = function () {
  let len = this.KKPriceRange.length;
  if(len == 0) return true

  let minPrice = this.KKPriceRange[0];
  let maxPrice = this.KKPriceRange[len-1];

  if(minPrice > 0 && this.price < minPrice){
    this.popText = (this.lang === 'CH' ?  'Price cannot be less than' : '价格不能低于') + minPrice;
    this.popType = 0;
    this.promptOpen = true;
    return false
  }
  if(maxPrice > 0 && this.price > maxPrice){
    this.popText = (this.lang === 'CH' ? 'Price cannot be higher than' :  '价格不能高于') + maxPrice;
    this.popType = 0;
    this.promptOpen = true;
    return false
  }

  return true;
}


// 更新价格
root.methods.setTransactionPrice = function (price) {
  this.price = this.$globalFunc.accFixed(price, this.quoteScale);
  // 计算估值
  // this.cnyValuation(price, this.amount);
}

// 计算人民币估值 amount*price*rate 修改成price*rate*6.7
/*root.methods.cnyValuation = function (price, amount) {
  let self = this;
  for (let key in this.socket_price) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = this.socket_price[key][4];
    }
  }
  // 判断BTC或ETH汇率
  let symbol = this.$store.state.symbol.split('_')[1];
  // let rate = symbol.indexOf('BTC') > -1 ? this.$store.state.exchange_rate.btcExchangeRate : this.$store.state.exchange_rate.ethExchangeRate;
  let rate = 0;
  switch (symbol) {
    case 'BTC':
      rate = this.$store.state.exchange_rate.btcExchangeRate || 0
      break;
    case 'ETH':
      rate = this.$store.state.exchange_rate.ethExchangeRate || 0
      break;
    case 'BDB':
      rate = (this.$store.state.exchange_rate.ethExchangeRate * self.bdb_rate) || 0
      break;
    case 'USDT':
      rate = 1;
      break;
    default:
      rate = 0;
      break;
  }
  let new_price = !price ? 0 : price;
  // let new_amount = !amount ? 0 : amount;
  this.cny_valuation = this.$globalFunc.accFixedCny(new_price * rate * this.$store.state.exchange_rate_dollar, 2);
}*/

// 获取可用数量
root.methods.RE_ACCOUNTS = function (data) {
  var arr = data.accounts;
  var arr2 = [];
  var arr3 = [];
  arr.map(v => arr3.indexOf(v.currency) === -1 && arr2.push({currency: v.currency || ""}) && arr3.push(v.currency));
  // console.log('arrrrrrrrrrrrrrr',arr2, arr3)
  var [newArr, tmpArr] = [[], []];
  newArr = arr2.map((v) => {
    tmpArr = [];
    tmpArr = arr.filter(va => va.currency === v.currency)
    tmpArr.map((va) => {
      "SPOT_AVAILABLE" == va.type && (v.SPOT_AVAILABLE = v.SPOT_AVAILABLE + va.balance || va.balance || 0);
      "SPOT_FROZEN" == va.type && (v.SPOT_FROZEN = v.SPOT_FROZEN + va.balance || va.balance || 0);
    });
    return v;
  });
  // console.log('newArr========!', newArr);
  var a = '', b = '';
  newArr.forEach(
    v => {
      if (v.currency == this.$store.state.symbol.split('_')[1]) {
        a = v
      }
      (v.currency == this.$store.state.symbol.split('_')[0]) && (b = v);
    }
  )
  // console.log('==a', a)
  // console.log('===============b', b)
  // console.log('==a', a)
  this.currentSymbol.balance = a.SPOT_AVAILABLE || 0;
  this.currentSymbol.balance_order = b.SPOT_AVAILABLE || 0;
}

// 百分比切换
// root.methods.sectionSelect = function (num) {
// 	this.numed = num
//   if (this.orderType != 0) {
//     // this.amount = (this.currentSymbol.balance_order * num).toFixed(this.baseScale)
//     // console.log(this.baseScale)
//     this.amount = this.$globalFunc.accFixed(this.currentSymbol.balance_order * num, this.baseScale);
//     return
//   } else {
//     if (this.price) {
//       this.amount = this.$globalFunc.accFixed(this.currentSymbol.balance * num / this.price, this.baseScale)
//     }
//   }
// }
root.methods.getFocus = function () {
  this.numed2 = 0
}
root.methods.sectionSelect = function (num) {
	this.numed2 = num
  // console.info(this.numed2)
 // 双仓开多
  if(this.positionModeSecond == 'openWarehouse' && this.openSide=='long'){
    this.amount = this.$globalFunc.accFixed(this.canBeOpened[0] * num, this.baseScale);
  }
  // 双仓开空
  if(this.positionModeSecond == 'openWarehouse' && this.openSide=='short'){
    this.amount = this.$globalFunc.accFixed(this.canBeOpened[1] * num, this.baseScale);
  }
  // 双仓平空
  if(this.positionModeSecond == 'closeWarehouse' && this.openSide=='long'){
    this.amount = this.$globalFunc.accFixed(Math.abs(this.positionAmtShort) * num, this.baseScale);
  }
  // 双仓平多
  if(this.positionModeSecond == 'closeWarehouse' && this.openSide=='short'){
    this.amount = this.$globalFunc.accFixed(this.positionAmtLong * num, this.baseScale);
  }
  // 单仓开多
  if(this.positionModeFirst == 'singleWarehouseMode' && this.orderType==0){
    if(this.reducePositionsSelected && this.totalAmount < 0){
      // console.info('this.totalAmount',this.totalAmount)
      this.amount = this.$globalFunc.accFixed(Math.abs(this.totalAmount) * num, this.baseScale);
      return
    }
    if(!this.reducePositionsSelected){
      this.amount = this.$globalFunc.accFixed(this.canMore * num, this.baseScale);
    }
  }
  //  单仓开空
  if(this.positionModeFirst == 'singleWarehouseMode' && this.orderType==1){
    if(this.reducePositionsSelected && this.totalAmount > 0){
      this.amount = this.$globalFunc.accFixed(Math.abs(this.totalAmount) * num, this.baseScale);
      return
    }
    if(!this.reducePositionsSelected){
      this.amount = this.$globalFunc.accFixed(this.canMore * num, this.baseScale);
    }
  }
	// if (this.orderType != 0) {
	// 	// this.amount = (this.currentSymbol.balance_order * num).toFixed(this.baseScale)
	// 	// console.log(this.baseScale)
	// 	this.amount = this.$globalFunc.accFixed(this.currentSymbol.balance_order * num, this.baseScale);
	// 	return
	// } else {
	// 	if (this.price) {
	// 		this.amount = (this.currentSymbol.balance * num / this.price).toFixed(this.baseScale)
	// 	}
	// }
}

// 添加减少金额或数量
root.methods.reduceNum = function (type) {
  let reduce = !!this['transaction_' + type] ? this['transaction_' + type] : 0;
  if (!reduce) return;
  if ((reduce + '').indexOf('.') < 0) {
    !!reduce ? reduce-- : '';
    reduce > 0 && (this['transaction_' + type] = reduce);
  } else {
    let num = (reduce + '').split('.')[1].length;
    let float = 1 / Math.pow(10, num);
    let new_float = reduce - float;
    new_float > 0 && (this['transaction_' + type] = new_float.toFixed(num));
  }
}
root.methods.plusNum = function (type) {
  let plus = !!this['transaction_' + type] ? this['transaction_' + type] : 0;
  if (!plus) return;
  if ((plus + '').indexOf('.') < 0) {
    plus++;
    this['transaction_' + type] = plus;
  } else {
    let num = (plus + '').split('.')[1].length;
    let float = 1 / Math.pow(10, num);
    let new_float = Number(plus) + Number(float);
    new_float > 0 && (this['transaction_' + type] = new_float.toFixed(num));
  }
}
/* TODO:20201216 gua to delete
// 获取rate
root.methods.getExchangeRate = function () {
  this.$http.send('GET_EXCHANGE__RAGE', {
    bind: this,
    callBack: this.setExchangeRateRate
  })
}
// store存储rate对象
root.methods.setExchangeRateRate = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data));
  let rateObj = data.dataMap.exchangeRate;
  this.$store.commit('SET_EXCHANGE_RATE', rateObj);
}


// 请求所有币对信息, header, right都需要此数据
root.methods.getCurrencyList = function () {
  this.$http.send('COMMON_SYMBOLS', {
    bind: this,
    callBack: this.re_getCurrencyList
  });
}

// 渲染币对列表信息
root.methods.re_getCurrencyList = function (data) {
  this.getPrices();
  typeof(data) == 'string' && (data = JSON.parse(data));
  let objs = this.symbolList_priceList(data);
  this.currency_list = objs;
}

// 请求price
root.methods.getPrices = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getCurrencyLists
  })
}

// price接口数据返回
root.methods.re_getCurrencyLists = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.currency_list = this.$globalFunc.mergeObj(data, this.currency_list);
}
root.methods.symbolList_priceList = function (symbol_list) {
  let obj = {};
  let objs = symbol_list.symbols;
  objs.forEach((v, i) => {
    obj[v.name] = [0, 0, 0, 0, 0, 0];
  })
  return obj;
}*/

// 切换tab
root.methods.changeType = function (typeNum) {
  this.orderType = typeNum;
  this.latestFlag = false;
  if (typeNum === 0) {
    this.$store.commit('changeMobileHeaderTitle', '买入');
  }
  if (typeNum === 1) {
    this.$store.commit('changeMobileHeaderTitle', '卖出');
  }
  if (typeNum === 2) {
    this.$store.commit('changeMobileHeaderTitle', '当前委托');
  }
  if (typeNum === 3) {
    this.$store.commit('changeMobileHeaderTitle', '历史委托');
  }
  // 切换买入卖出时候需要清空数量
  this.amount = '';
}

// 切换左右结构
root.methods.changeFloat = function () {
  this.is_right = !this.is_right;
}

/*
// BDB是否抵扣
root.methods.getBDBInfo = function () {
  // console.log('是否进入此方法')
  this.$store.state.authMessage.userId && this.$http.send('FIND_FEE_DEDUCTION_INFO', {
    bind: this,
    callBack: this.re_getBDBInfo,
    errorHandler: this.error_getBDBInfo
  })
}

// BDB是否抵扣正确回调
root.methods.re_getBDBInfo = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  if (data.dataMap.BDBFEE === 'yes') {
    this.BDBInfo = true
  }
  if (data.dataMap.BDBFEE === 'no') {
    this.BDBInfo = false
  }
  // BDB状态
  this.BDBReady = true
  this.loading = !(this.stateReady && this.BDBReady && (this.stateStatusReady || !this.isMobile))
}

// BDB是否抵扣错误回调
root.methods.error_getBDBInfo = function (err) {
  console.log('测试err', err);
}
*/


root.methods.formatnumber = function (value, num) {
  var a, b, c, i;
  a = value.toString();
  b = a.indexOf(".");
  c = a.length;
  if (num == 0) {
    if (b != -1) {
      a = a.substring(0, b);
    }
  } else {//如果没有小数点
    if (b == -1) {
      a = a + ".";
      for (i = 1; i <= num; i++) {
        a = a + "0";
      }
    } else {//有小数点，超出位数自动截取，否则补0
      a = a.substring(0, b + num + 1);
      for (i = c; i <= b + num; i++) {
        a = a + "0";
      }
    }
  }
  return a;
}


root.methods.accMul = function (arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  // return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
  let num = Number(s1.replace(".", "") * s2.replace(".", "")) / Math.pow(10, m);
  // return this.scientificToNumber(num);
  return this.$globalFunc.accFixed(num, 8);
}

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
      return num.toFixed(8)
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

// // 监听数量和单价的变化 amount， price
// root.computed.transactionAmount = function () {
//   return this.amount;
// }

root.computed.transactionPrice = function () {
  return this.price;
}
// 检验是否登录
root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}
root.watch = {};
root.watch.orderType = function (newVal,oldVal) {
  if(newVal==oldVal)return
  this.numed2 = 0
}
root.watch.openSide = function (newVal,oldVal) {
  if(newVal==oldVal)return
  this.numed2 = 0
}
root.watch.pendingOrderType  = function (){
  this.numed2 = 0
  this.amount = ''
  if(this.pendingOrderType == 'limitPrice' || this.pendingOrderType == 'marketPrice') {
    this.reducePositionsSelected = false
    return
  }
  this.reducePositionsSelected = true
}
root.watch.positionModeSecond  = function (){
  // if (this.positionModeSecond == 'closeWarehouse') {
  //   this.optionVal = '触发市价止盈止损'
  //   this.pendingOrderType = 'marketPriceProfitStopLoss'
  //   this.triggerPrice = ''
  //   this.price = ''
  //   this.amount = ''
  // }else{
    this.optionVal = '市价单'
    this.pendingOrderType = 'marketPrice'
    this.triggerPrice = ''
    this.price = ''
    this.amount = ''
    this.numed2=0
  // }
}
root.watch.optionVal = function () {
  // if (this.positionModeSecond=='openWarehouse') {
  //   this.optionVal = '市价单'
  //   this.pendingOrderType = 'marketPrice'
  //   return
  // }
}
root.watch.amount = function (newValue, oldValue) {
  let value = newValue.toString();
  // 限制输入位数
  if (!!value.split('.')[1] && value.split('.')[1].length > this.baseScale) {
    this.amount = value.split('.')[0] + '.' + value.split('.')[1].substring(0, this.baseScale);
  }
  // this.cnyValuation(this.price, newValue);
}

root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // 重新拉取数据
  // this.GET_LATEST_DEAL();

  // 切换币对时候清空所有socket的数据，等socket推送以后重新赋值
  this.socket_snap_shot = {};
  this.socket_tick = {};
  this.topic_bar = {};

  this.socketTickObj = {};

  this.buy_sale_list = {}//﻿放开这行，保证盘口及时刷新，币对时价不从这里取值了
  this.buy_sale_list.asks = []
  this.buy_sale_list.bids = []

  this.latestPriceArr = []

  // this.price = 0;

  // this.initSocket();

  this.getScaleConfig();
  this.getDepth();// 获取币安深度
  this.getLatestrice()// 获取币安最新价格
  this.getMarkPricesAndCapitalRates()//获取币安最新标记价格和资金费率

}

root.watch.price = function (newValue, oldValue) {
  let value = newValue.toString();
  // 限制输入位数
  if (!!value.split('.')[1] && value.split('.')[1].length > this.quoteScale) {
    this.price = value.split('.')[0] + '.' + value.split('.')[1].substring(0, this.quoteScale);
  }
  // this.cnyValuation(newValue, this.amount);
}

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
      return num.toFixed(8)
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

// 监听数量和单价的变化 amount， price
root.computed.transactionAmount = function () {
  return this.amount;
}

root.computed.transactionPrice = function () {
  return this.price;
}


// 循环出来的items
root.computed.item_list = function () {
  // let ans = this.selectMarketChange
  // console.log("this.currencylist-------"+JSON.stringify(this.currencylist));
  // console.log('this.currencylist======',this.currencylist)
  return this.currencylist || []
}

// root.root.currency_list = function(){
//   return this.currency_list
// }

// ajax获取的数据
root.computed.currencylist = function () {
  // 把对象按字母排序
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  let o = [];
  Object.keys(currencyList).sort().forEach(symbol => {
    let currency = symbol.split('_')[1];
    if (!currency) return;
    // console.log('symbol',symbol)
    let initData = {};
    initData.name = symbol;
    [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]
    o.push(initData);
  })
  return o.sort((a,b)=>!b.open && b.open - a.open)
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


/*// // 计算后的order，排序之类的放在这里
root.computed.currentOrderComputed = function () {
  return this.currentOrder
}

root.computed.historyOrderComputed = function () {
  return this.historyOrder
}*/
// 获取订单
root.methods.getOrder = function () {
  // if (!this.$store.state.authState.userId) {
  //   this.loading = false
  //   return
  // }
  this.$http.send('GET_CURRENT_DELEGATION', {
    bind: this,
    query: {
      symbol:'',
      timestamp:this.serverTime,
      // orderId:'1231212'
    },
    callBack: this.re_getOrder,
    errorHandler: this.error_getOrder,
  })
}
// 获取订单回调
root.methods.re_getOrder = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.loading = false
  this.currentOrder = data.data || []
  let currOrderLen = {}
  this.currentOrder && this.currentOrder.forEach(v=>{
    if(!currOrderLen[v.symbol]){
      currOrderLen[v.symbol] = 0
    }
    currOrderLen[v.symbol] += 1
  })
  this.currOrderLenObj = currOrderLen;
  this.$store.commit('SET_CURRENT_ORDERS',this.currentOrder)
}
// 获取订单出错
root.methods.error_getOrder = function (err) {
  console.warn("获取订单出错！")
}

/*root.methods.getOrder = function () {
  if (!this.$store.state.authMessage.userId) {
    this.loading = false
    return
  }
  // this.loading = true
  this.$http.send('PENDDING_ORDERS',
    {
      bind: this,
      params: {
        // symbol: 'BTC_USD'
        symbol: this.capitalSymbol
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder,
    })
}
// 获取订单回调
root.methods.re_getOrder = function (data) {
  // console.warn('订单信息获取到了！！！！', data)
  this.loading = false
  if (this.cancelAll) {
    return
  }

  this.currentOrder = data.orders.filter(
    v => {
      v.click = false
      this.clickOrder.has(v.id) && (v.click = true)
      return (v.status !== 'PARTIAL_CANCELLED') && (v.status !== 'FULLY_CANCELLED') && (v.status !== 'FULLY_FILLED')
    }
  )
  this.historyOrder = data.orders.filter(
    v => {
      return ((v.status === 'PARTIAL_CANCELLED') || (v.status === 'FULLY_CANCELLED') || (v.status === 'FULLY_FILLED'))
    }
  )

  // console.warn("订单信息筛选！", this.currentOrder)

}*/

root.methods.computedToCNY = function (item) {

  // if (!this.btc_eth_rate.dataMap) {
  //
  //   return 0;
  // }

  let rate = 0
  let type = item.name.split('_')[1];
  let rate_obj = this.btc_eth_rate;

  switch (type) {
    case 'BTC':
      rate = rate_obj.btcExchangeRate;
      break;
    case 'ETH':
      rate = rate_obj.ethExchangeRate;
      break;
    case 'BDB':
      rate = rate_obj.ethExchangeRate * this.bdb_rate;
      break;
    case 'USDT':
      rate = 1;
      break;
    default:
      rate = 0;
  }

  return this.$globalFunc.accFixedCny(item.close * rate * this.$store.state.exchange_rate_dollar, 2)
}



root.methods.cancelOrder = async function (order) {
  // this.loading = true
  // console.warn('hi! this is order', order)
  this.clickOrder.add(order.id)
  order.click = true
  let params = {
    targetOrderId: order.id,
    symbol: order.symbol,
    type: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY' : 'CANCEL_SELL'
  }
  // console.warn("params", params)
  await this.$http.send('TRADE_ORDERS', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
root.methods.re_cancelOrder = function (data) {
  // console.warn("撤单返回！", data)

  this.$eventBus.notify({key: 'CANCEL_ORDER'})

  this.getOrder()
}

root.methods.diff24 = function (openvalue, nowvalue) {
  if (openvalue == 0) {
    return '0.00';
  } else {
    let diff = ((nowvalue - openvalue) / openvalue * 100).toFixed(2);
    // console.log("diff=========="+diff);
    return diff;
  }
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  if(num == Infinity){num = 0}
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


// 订单状态
root.methods.getStatus = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return `撤单（成交 ${((order.filledAmount / order.amount).toFixed(4) * 100) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount).toFixed(4) * 100)}%）` //部分成功
  if (order.status === 'FULLY_CANCELLED') return '撤单'
  if (order.status === 'FULLY_FILLED') return '已完成'
}
// 可以显示详情
root.methods.canShowDetail = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return true
  if (order.status === 'FULLY_CANCELLED') return false
  if (order.status === 'FULLY_FILLED') return true
}
root.methods.showDetail = function (id) {
  if (this.clickThis === id) {
    this.clickThis = -1
    return
  }
  this.clickThis = id

}

root.methods.cancelOrder = async function (order) {
  // this.loading = true
  // console.warn('hi! this is order', order)
  this.clickOrder.add(order.id)
  order.click = true
  let params = {
    targetOrderId: order.id,
    symbol: order.symbol,
    type: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY' : 'CANCEL_SELL'
  }
  // console.warn("params", params)
  await this.$http.send('TRADE_ORDERS', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
root.methods.re_cancelOrder = function (data) {
  // console.warn("撤单返回！", data)

  this.$eventBus.notify({key: 'CANCEL_ORDER'})

  this.getOrder()
}

// 订单状态
root.methods.getStatus = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return `撤单（成交 ${((order.filledAmount / order.amount).toFixed(4) * 100) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount).toFixed(4) * 100)}%）` //部分成功
  if (order.status === 'FULLY_CANCELLED') return '撤单'
  if (order.status === 'FULLY_FILLED') return '已完成'
}
// 可以显示详情
root.methods.canShowDetail = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return true
  if (order.status === 'FULLY_CANCELLED') return false
  if (order.status === 'FULLY_FILLED') return true
}
root.methods.showDetail = function (id) {
  if (this.clickThis === id) {
    this.clickThis = -1
    return
  }
  this.clickThis = id
}


root.methods.getDetail = function () {
  this.$http.send('GET_ORDERS_DETAIL', {
    bind: this,
    urlFragment: `/${this.orderId}/matches`,
    params: {
      limit: this.limit,
    },
    callBack: this.re_getDetail,
    errorHandler: this.error_getDetail,
  })
}

// 获取订单详情回调
root.methods.re_getDetail = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.matches) return false
  // console.warn("order detail获取到数据！", data)
  this.orderDetail = data.matches
  this.loading = false
}

// 组件销毁前取消订阅
root.beforeDestroy = function () {
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol})
  clearInterval(interval);
}

root.methods.getDetail = function () {
  this.$http.send('GET_ORDERS_DETAIL', {
    bind: this,
    urlFragment: `/${this.orderId}/matches`,
    params: {
      limit: this.limit,
    },
    callBack: this.re_getDetail,
    errorHandler: this.error_getDetail,
  })
}

// 获取订单详情回调
root.methods.re_getDetail = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data || !data.matches) return false
  // console.warn("order detail获取到数据！", data)
  this.orderDetail = data.matches
  this.loading = false
}


// 关闭交易异常弹窗
root.methods.toastClose = function () {
  this.toastOpen = false
}



// 打开最新成交页
root.methods.openLatestFlag = function () {
  this.latestFlag = true
  this.$router.push('MobileHistoryOrder')
}

// 打开历史成交页
root.methods.openLatestHistoryFlag = function () {
  // this.latestFlag = true
  this.$router.push('MobileHistoryOrder')
}



// 打开全部成交页
// root.methods.openLatestwhole = function () {
//   this.latestFlag = true
// }
// 关闭最新成交页
root.methods.closeLatestFlag = function () {
  this.latestFlag = false
}

// 拉取数据
root.methods.GET_LATEST_DEAL = function () {
  this.$http.send('GET_SYMBOL_TRADE', {
    bind: this,
    params: {symbol: this.capitalSymbol},
    callBack: this.RE_GET_LATEST_DEAL
  });
}
root.methods.RE_GET_LATEST_DEAL = function (res) {
  let data = JSON.parse(res);
  this.list = data;
}



root.methods.closeNobindToast = function () {
  this.toastNobindShow = false
}

root.methods.goToBindEmail = function () {
  this.toastNobindShow = false
  this.$router.push({name: 'bindEmail'})
}

/*---------------------- 跳入到首页面页面 ---------------------*/
root.methods.gotoNewH5homePage = function () {
  // this.$router.push({name: 'NewH5homePage'});
  window.location.replace(this.$store.state.contract_url + 'index/NewH5homePage');
}

/*---------------------- 跳入到市场页面 ---------------------*/
root.methods.gotoShichang = function () {
  this.$router.push({name: 'mobileTradingHall'});
  window.location.replace(this.$store.state.contract_url + 'index/mobileTradingHall');
}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods.gotoZichan = function () {
  // this.$router.push({name: 'MobileAssetRechargeAndWithdrawals'});
  window.location.replace(this.$store.state.contract_url + 'index/mobileAsset/mobileAssetRechargeAndWithdrawals');
}

/*---------------------- 跳入到交易页面 ---------------------*/
root.methods.gotoJiaoyi = function () {
  // this.$router.push({name: 'mobileTradingHallDetail'});
  window.location.replace(this.$store.state.contract_url + 'index/mobileTradingHallDetail');
}
/*---------------------- 跳入到合约页面 ---------------------*/
// root.methods.gotoContract = function () {
//   this.$router.push({name: 'mobileTradingHallDetail'});
// }

//移动端是否显示右侧菜单
root.methods.clickChangePopOpen = function () {
  this.$store.commit('changeMobilePopOpen', !this.$store.state.mobilePopOpen)
}

root.methods.changeHeaderBoxFlag = function (item) {
  this.$store.commit('changeMobileTradingHallFlag',true);
  this.$store.commit('changeMobileSymbolType',item.name);
  this.$store.commit('SET_HALL_SYMBOL',true);
  this.$store.commit('BUY_OR_SALE_TYPE', 1);
  // this.$router.push('mobileTradingHall')
  this.isDisplayMarket = false;

  // let user_symbol = this.$cookie.get('unlogin_user_symbol_cookie') || 'ETH_USDT'
  // let user_symbol1 = this.$cookies.get('user_symbol_cookie') || 'ETH_USDT'
  // // this.$store.commit('SET_SYMBOL', user_symbol)
  // this.$store.commit('SET_SYMBOL', user_symbol1)
  let user_id = this.$store.state.authMessage.userId;
  let user_id_symbol = user_id + '-' + item.name;
  !user_id && this.$cookies.set('unlogin_user_symbol_cookie', item.name, 60 * 60 * 24 * 30,"/");
  !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24 * 30,"/");
  this.$store.commit('SET_SYMBOL', item.name);



}

root.methods.changeMarketStatus = function(){
  this.isDisplayMarket = !this.isDisplayMarket;
}

root.methods.openkexian = function(){
  this.$store.commit('changeMobileTradingHallFlag',true);
  // this.$router.push('mobileTradingHall')
  this.$router.go(-1)
}
root.methods.openBottonOpener = function(){
  let openerStatus = sessionStorage.getItem("opener_states")
  if(openerStatus != null && openerStatus == '1'){
    this.openBottleOpen = true
    sessionStorage.setItem("opener_states",0)
  }



  // if (!this.openBottleOpen) {
  //   let currencyO =  JSON.parse(sessionStorage.getItem("opener_states"))
  //   this.openBottleOpen = currencyO
  // }
  // let currencyObj = 1
  // sessionStorage.setItem("opener_states",currencyObj)
  // this.openBottleOpen = currencyObj




  // sessionStorage 存储布尔值要注意存储 0，1，因为存布尔值时会变成字符串的'true'和'false'
  // sessionStorage.setItem("opener_states",1)
  // this.$router.push({name:'MobileBottleOpener',
  //   query:{
  //     isNowPrice:this.isNowPrice,
  //     positionModeFirst:this.positionModeFirst
  //   }})
  // this.$router.go(-1)
}
// 关闭开平器弹窗
root.methods.closeBottonOpener = function(){
  this.openBottleOpen = false
}

root.methods.ToCurrentPage = function(){
  this.$router.push('MobileTradingHallDetail')
}


// // 合约首次风险提示弹窗关闭确认按钮
// root.methods.popCloseTemporarilyClosed = function () {
//   this.popWindowContractRiskWarning = false
//   window.location.replace(this.$store.state.contract_url + 'index/tradingHall?symbol=KK_USDT');
// }

// 第一次进入是否弹窗
root.methods.isFirstVisit = function () {
  // this.$http.send('POST_MANAGE_TIME', {
  this.$http.send('POST_MANAGE_API',{
    bind: this,
    callBack: this.re_isFirstVisit
  })
}
root.methods.re_isFirstVisit = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if (data.code == 1000) {
    this.$router.push({'path': '/index/contractRiskWarning'})
  }

  /*//APP测试专用
  setTimeout(()=>{
    this.$router.push({'path': '/index/contractRiskWarning'})
  },5000)*/

  // this.$router.push({'path': '/index/contractRiskWarning'})
  // } else {
  //   this.$router.push({'path':'index/mobileTradingHallDetail'})
  //   // this.$router.push({'path':'/index/contractRiskWarning'})
  // }
}

//合约全部记录
root.methods.openAllRecords = function () {

  if(this.$route.query.isApp) {
    if(!this.$store.state.authState.userId){
      window.postMessage(JSON.stringify({
        method: 'toLogin'
      }))
      return
    }

    window.postMessage(JSON.stringify({
        method: 'toH5Route',
        parameters: {
          url: window.location.origin + '/index/mobileContractAllRecords?isApp=true&isWhite=true',
          loading: false,
          navHide: false,
          title: '',
          requireLogin:true,
          isTransparentNav:true
        }
      })
    );
    return
  }

  this.$router.push('/index/mobileContractAllRecords')
}
//划转
root.methods.openTransfer = function () {

  if(this.$route.query.isApp) {
    if(!this.$store.state.authState.userId){
      window.postMessage(JSON.stringify({
        method: 'toLogin'
      }))
      return
    }

    window.postMessage(JSON.stringify({
        method: 'toH5Route',
        parameters: {
          url: this.$store.state.contract_url + 'index/mobileWebTransferContract?isApp=true&isWhite=true',
          loading: false,
          navHide: false,
          title: '合约划转',
          requireLogin:true,
          // isTransparentNav:true
        }
      })
    );
    return
  }

  window.location.replace(this.$store.state.contract_url + 'index/mobileAsset/mobileAssetRechargeAndWithdrawals?toWebTransfer=true');
  // window.location.replace('http://ccc.2020-ex.com:8085/index/mobileAsset/mobileAssetRechargeAndWithdrawals?toWebTransfer=true');
}


//当前委托，仓位持仓切换
root.methods.listSwitching = function (listType) {
  this.listType = listType
}

export default root;
