import axios from "axios";
import tradingHallData from "../../dataUtils/TradingHallDataUtils";
import {parse} from "echarts/extension-src/dataTool/gexf";

const root = {}
root.props = {}

root.name = 'TradingHall'

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
  'ProgressBar': resolve => require(['../vue/ProgressBar'], resolve),
  'TradeContainer': resolve => require(['../vue/Trade'], resolve),
  'AssetOverview': resolve => require(['../vue/AssetOverview'], resolve),
  'HeaderTitle': resolve => require(['../vue/HeaderTitle'], resolve),
  'StockCross': resolve => require(['../vue/StockCross'], resolve),
  'MarketPrice': resolve => require(['../vue/MarketPrice'], resolve),
  'orderCurrent': resolve => require(['../vue/OrderPageCurrentEntrustment'], resolve),
  'orderHistory': resolve => require(['../vue/OrderPageHistoricalEntrustment'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
  'ContractRiskWarning': resolve => require(['../vue/ContractRiskWarning'], resolve),
  // 实时成交
  'LatestDeal': resolve => require(['../vue/LatestDeal'], resolve),
  // BDB开关
  'Toggle': resolve => require(['../vue/BaseToggle'], resolve),

  // 历史成交
  'HistoricalTransaction': resolve => require(['../vue/HistoricalTransaction'], resolve),
  // 资金流水
  'CapitalFlow': resolve => require(['../vue/CapitalFlow'], resolve),
  // 仓位
  'OrderPosition': resolve => require(['../vue/OrderPosition'], resolve),
  // 保证金余额
  'OrderMarginBalance': resolve => require(['../vue/OrderMarginBalance'], resolve),
  // 移动端
  'MobileTradingHall': resolve => require(['../mobileVue/MobileTradingHall'], resolve),
  // 计算机组件
  'CalculatorBommbBox': resolve => require(['../vue/CalculatorBommbBox'], resolve)

}

root.data = function () {
  return {
    socket:null,
    // 货币对列表
    currency_list: {},
    // left买卖列表
    buy_sale_list: {},
    // btc和eth汇率
    btc_eth_rate: {},
    // header请求信息
    header_price: {},

    // socket推送信息
    topic_bar: {}, // k线
    socket_price: {}, //总价格
    socket_tick: {}, // header单个币对价格
    socket_snap_shot: {}, //深度图
    socket_snap_shot_temp: {}, //记录最近一次时间间隔小于500ms的深度图
    snap_shot_timeout: null, //定时器，判断是否刷新最近一次时间间隔小于500ms的深度图
    socketTickArr: [], // 第一次tick推送 数组，用作全站成交
    socketTickObj: {}, // 单个成交推送 对象，用作全站成交

    // 信息提示
    popType: 0,
    popText: '',
    promptOpen: false,
    // 加载中
    loading: true,

    // 各板块加载中
    trade_loading: true,

    // 是否开启BDB燃烧
    BDBInfo: true,
    BDBChanging: false,
    isNow: 4,

    // 币对时间配置
    symbol_config_times: [],

    // 深度刷新时间
    refreshTime: 0,
    // 深度刷新间隔
    refresh: 500,
    tabPosition: 'top',
    rate: '',
    // DB市场的汇率 是用BDB/ETH的汇率 * BDB/ETH的时价算出来的
    bdb_rate: 0,
    time: 60,
    get_currency_list: {},
    // 精度
    baseScale: 0,
    quoteScale: 0,
    // screenWidth: document.body.clientWidth,     // 屏幕宽
    // screeHeight: document.body.clientHeight,    // 屏幕高
    latestDealSpread:true,
    stockShow:true,
    // showsscj:false,
    // pankqh:true,
    showinfo : false,

    tradinghallLimit:10,




    /* TODO ================================    合约数据   =================================== */

    positionModeFirst:'singleWarehouseMode',//单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
    positionModeFirstTemp:'',//临时存储值，等用户点击弹窗确认按钮后才真正改变positionModeFirst的值
    positionModeSecond:'openWarehouse',//单仓 singleWarehouse 开仓 openWarehouse 平仓 closeWarehouse
    pendingOrderType:'limitPrice',//限价 limitPrice 市价 marketPrice 限价止盈止损 limitProfitStopLoss 市价止盈止损 marketPriceProfitStopLoss

    reducePositionsSelected:false,//只减仓状态

    //保证金模式Strat
    popWindowSecurityDepositMode: false,
    //保证金模式End

    //调整杠杆 Strat
    popWindowAdjustingLever: false,
    // 合约风险提示
    popWindowContractRiskWarning: false,
    value:1,
    marks: {
      1: '1X',
      15: '15X',
      30: '30X',
      45:'45X',
      60:'60X',
      75:'75X'
    },
    //调整杠杆 End

    //仓位模式Start
    popWindowPositionModeBulletBox: false, //仓位模式弹框
    cardType:1, //仓位模式选择初始值
    marginModeType:1,  // 1 全仓、2 逐仓
    //仓位模式End

    leverage:'', // 杠杆倍数

    effectiveTime:'GTX',
    latestPrice:'最新价格',
    // 计算器弹框 begin
    openCalculator:false,
    // 计算器弹框 end
  //  限价---被动委托，生效时间选择
    checkPrice:1,

    highPrice: '', // 24小时最高价
    lowPrice: '', // 24小时最低价
    volume: '', // 24小时量
    priceChangePercent: '', // 24涨幅
    markPrice: '', // 标记价格
    lastFundingRate: '', // 资金费率
    nextFundingTime: '',   // 下次资金费时间
    Latestrice: '',   // 最新价格
    maxNotionalValue: '',   // 当前杠杆倍数下允许的最大名义价值
    marginType:'',
    dualSidePosition:''  // "true": 双向持仓模式；"false": 单向持仓模式

  }
}

root.created = function () {
  this.isFirstVisit()
  // if(this.screenWidth<1450){
  //   this.latestDealSpread = false;
  //   // this.pankqh = false;
  // }else{
  //   this.latestDealSpread = true;
  //   // this.pankqh = true;
  //   this.showStockFunc()
  // }
  // console.log("latestDealSpread---------"+this.latestDealSpread);
  this.watchScreenWidth();
  // 获取兑换汇率
  this.getCny();
  // 一小时更新一次汇率
  // this.changeCny();

  // 判断是否有 props currency_list带过来的值，如果没有请求
  !this.currency_list[this.symbol] ? this.getSymbolsList() : (this.loading = false);

  // 获取小数位
  this.getScaleConfig();
  // window.CURRENT_SYMBOL = this.$store.state.symbol
  this.$store.commit('changeJoinus', false);

  // 判断是否开启BDB燃烧
  this.getBDBInfo();
  // 判断是否进行实名认证
  this.getAuthState();

  //获取bt燃烧比例
  // this.getBtReward();
  // this.initWebSocket(this.$store.state.symbol);

  this.initTicket24Hr()  // 获取币安24小时价格变动接口
  this.getMarkPricesAndCapitalRates()  // 获取币安最新标记价格和资金费率
  this.getLatestrice()  // 获取币安最新价格
  this.getDepth()  // 获取币安深度
  this.positionRisk()  // 获取全逐仓状态
  this.getPositionsideDual() // 获取仓位模式

}

root.mounted = function () {
  // 初始化所有信息
  let self = this;
  // setTimeout(this.init, 1000);
  this.init();

  // 更改query
  this.$router.push({name: 'tradingHall', query: {symbol: this.$store.state.symbol}});

  var that = this
  window.onresize = () => that.watchScreenWidth()//为了避免页面刷新后监听失效，去掉函数的{}

  // window.onresize = function () {
  //     window.screenWidth = document.body.clientWidth
  //     that.screenWidth = window.screenWidth
  //
  //     // console.log("this.screenWidth====watch=======",that.screenWidth);
  //     // that.screenWidth = that.screenWidth == oldValue ? newValue : newValue;
  // }
}

// 计算symbol变化
root.computed = {};
// 当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
// 当前socket订阅货币对
root.computed.subscribeSymbol = function () {
  return this.$store.state.subscribeSymbol;
}
//直到下个资金时段的剩余时间
root.computed.toNextFundingTime = function () {
  return 0
  let nowTime = new Date().getTime();
  let remainTime = this.$globalFunc.timeCountdown(nowTime,this.nextFundingTime,':h');
  return remainTime
}
// 实时价格
root.computed.isNowPrice = function () {
  return 0//TODO 以后再说
  // console.log('socket_snap_shot====',this.socket_snap_shot,this.buy_sale_list,this.quoteScale)
  let price = this.$globalFunc.mergeObj(this.socket_snap_shot.price, this.buy_sale_list.price) || 0;
  let priceObj = this.$globalFunc.mergeObj(this.socket_tick, {price: price});
  let now_price = this.$globalFunc.accFixed(priceObj.price, this.quoteScale);
  document.title = now_price+" "+this.$store.state.symbol.replace('_', '/')+" "+this.$t('document_title');
  // if (!!this.socket_snap_shot.price)
  return now_price;
}
// 实时价格的升降
root.computed.direction = function () {
  return 0//TODO 以后再说
  return this.socket_tick.direction;
}
// 实时价格cny
root.computed.isCnyPrice = function () {
  let close = this.isNowPrice || 0;
  // if (this.$store.state.lang === 'CH') {
  return ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (close * this.rate), 2));
  // }
  // else {
  //   return ('$' + this.$globalFunc.accFixedCny((close * this.rate), 2));
  // }
  // if (this.$store.state.lang === 'EN') {
  // 	return ('$' + ((close * this.rate)).toFixed(2));
  // }
}

// 24小时最低价
root.computed.low24 = function () {
  // console.log('list', this.mergeList[this.symbol][3])
  if (!this.mergeList[this.symbol]) return;
  let low = Math.min((this.isNowPrice || 10000), this.mergeList[this.symbol][3]);
  let low24 = this.$globalFunc.accFixed(low, this.quoteScale);
  return low24;
}
// 24小时最高价
root.computed.high24 = function () {
  // console.log('list', this.mergeList[this.symbol][2])
  if (!this.mergeList[this.symbol]) return;
  let high = Math.max(this.isNowPrice, this.mergeList[this.symbol][2]);
  let high24 = this.$globalFunc.accFixed(high, this.quoteScale);
  return high24;
}
// 24小时成交量
// root.computed.volume = function () {
//   if (!this.mergeList[this.symbol]) return;
//   let volume = this.$globalFunc.accFixed(this.mergeList[this.symbol][5], 0);
//   return volume;
// }

// 实时价格 需要取BDB/ETH的时价和汇率来算BDB的汇率
root.computed.topic_price = function () {
  return this.socket_price;
}

root.computed.mergeList = function () {
  let list = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  return list;
}

// 24小时涨跌
root.computed.diff24 = function () {
  // let diff = this.isNowPrice  - Number(this.mergeList[this.symbol][1])
  // 减法
  if (!this.mergeList[this.symbol]) return;
  let diff = this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.isNowPrice, this.mergeList[this.symbol][1]), this.quoteScale);
  return diff;
}
// 24小时涨跌百分比 (现价 - 开盘价) / 开盘价
root.computed.diff24Ratio = function () {
  if (!this.mergeList[this.symbol]) return;
  let now_price = this.isNowPrice || 0;
  let diff = ((Number(now_price) - Number(this.mergeList[this.symbol][1])) / Number(this.mergeList[this.symbol][1])*100).toFixed(2);
  // let diff = this.toFixed(this.accMul(this.accDiv(this.accMinus(now_price, this.mergeList[this.symbol][1]), this.mergeList[this.symbol][1] || 1), 100), 2)
  if (this.mergeList[this.symbol][1] == 0) {
    return 0
  } else {
    return diff;
  }
}

/*****************************************************/
root.computed.listenSymbol = function () {
  return this.$store.state.symbol;
}
// 判断是否为移动端
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 特殊专区
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol
}
// // 是否显示为蜜简介
// root.computed.showSuperBeeIntroduction = function () {
//   // if (this.specialSymbol[0].has(this.listenSymbol)) {
//   //   return true
//   // }
//   return false
// }
//页面功能模块显示逻辑配置信息
root.computed.positionModeConfigs = function () {
  let data = tradingHallData.positionModeConfigs;
  // console.log(data);
  return data
}
// 初始化各子组件
root.methods = {}
/*---------------------- 合约接口部分 begin ---------------------*/
// 获取币安24小时价格变动接口
root.methods.initTicket24Hr = function () {
  this.$http.send('GET_TICKER_24HR',{
    bind: this,
    query:{
      symbol:this.symbol
    },
    callBack: this.re_initTicket24Hr,
    errorHandler:this.error_initTicket24Hr
  })
}
// 获取币安24小时价格变动正确回调
root.methods.re_initTicket24Hr = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  // console.info('data====',data.data[0])
  this.highPrice = data.data[0].highPrice || '--'
  this.lowPrice = data.data[0].lowPrice || '--'
  this.volume = data.data[0].volume || '--'
  this.priceChangePercent = data.data[0].priceChangePercent || '--'
}
// 获取币安24小时价格变动错误回调
root.methods.error_initTicket24Hr = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

// 获取币安最新标记价格和资金费率
root.methods.getMarkPricesAndCapitalRates = function () {
  this.$http.send('GET_MARKET_PRICE',{
    bind: this,
    query:{
      symbol:this.symbol
    },
    callBack: this.re_getMarkPricesAndCapitalRates,
    errorHandler:this.error_getMarkPricesAndCapitalRates
  })
}
// 获取币安最新标记价格和资金费率正确回调
root.methods.re_getMarkPricesAndCapitalRates = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.info('data========',data.data[0])
  this.markPrice = data.data[0].markPrice || '--'
  this.lastFundingRate = data.data[0].lastFundingRate || '--'
  this.nextFundingTime = data.data[0].nextFundingTime || '--'
//
}
// 获取币安最新标记价格和资金费率错误回调
root.methods.error_getMarkPricesAndCapitalRates = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

// 获取币安最新价格接口
root.methods.getLatestrice = function () {
  this.$http.send('GET_TICKER_PIRCE',{
    bind: this,
    query:{
      symbol:this.symbol
    },
    callBack: this.re_getLatestrice,
    errorHandler:this.error_getLatestrice
  })
}
// 获取币安最新价格接口正确回调
root.methods.re_getLatestrice = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.currency_list = this.$globalFunc.mergeObj(data.data[0], this.currency_list);
  this.Latestrice = data.data[0].price
}
// 获取币安最新价格接口错误回调
root.methods.error_getLatestrice = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

// 请求所有币对信息, header, right都需要此数据
root.methods.getSymbolsList = function () {
  this.$http.send('GET_SYMBOLS', {
    bind: this,
    callBack: this.re_getSymbolsList
  });
}
// 渲染币对列表信息
root.methods.re_getSymbolsList = function (data) {
  let self = this;
  // this.getPrices();
  this.getLatestrice()
  typeof(data) == 'string' && (data = JSON.parse(data));

  // let symbol_list = [];
  // for (let symbol in data) {
  // 	symbol_list.push(symbol);
  // }
  // if (symbol_list.indexOf(this.$store.state.symbol) < 0) {
  // 	if (!!symbol_list[0]) {
  // 		this.$store.commit('SET_SYMBOL', symbol_list[0]);
  // 	}
  // }

  let objs = this.symbolList_priceList(data);
  this.currency_list = objs;

  // 记录当前币对开始结束时间
  // data.symbols.forEach(function (v, i) {
  //   self.symbol_config_times.push({name: v.name, startTime: v.startTime, endTime: v.endTime});
  // });
}

// 获取深度信息
root.methods.getDepth = function () {
  this.$http.send('GET_DEPTH', {
    bind: this,
    query:{
      symbol:'BTC_USDT',
      limit: 50
    },
    callBack: this.re_getDepth
  });
}
// 获取深度信息正确回调
root.methods.re_getDepth = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.info('data======',data)
  this.buy_sale_list = data;
}




/*---------------------- 合约接口部分 end ---------------------*/

/*---------------------- hover弹框 begin ---------------------*/
root.methods.closePositionBox= function (name) {
  if(name == 'reducePositionsModule')name = this.getReducePositionsHoverClassName();
  if(name == 'triggerTypeModule')name = this.getTriggerTypeClassName();
  if(name == 'effectiveTimeModule')name = this.getEffectiveTimeClassName();

  $("." + name).attr("style","display:none");
}
root.methods.openPositionBox = function (name) {
  if(name == 'reducePositionsModule')name = this.getReducePositionsHoverClassName();
  if(name == 'triggerTypeModule')name = this.getTriggerTypeClassName();
  if(name == 'effectiveTimeModule')name = this.getEffectiveTimeClassName();
  $("." + name).attr("style","display:block");
}
// 只减仓模块
root.methods.getReducePositionsHoverClassName = function () {
  let className = ''
  this.pendingOrderType == 'limitPrice' && (className = 'lighten-up-positions')
  this.pendingOrderType == 'marketPrice' && (className = 'lighten-up-positions-market-price')
  this.pendingOrderType == 'limitProfitStopLoss' && (className = 'lighten-up-positions-full-stop')
  this.pendingOrderType == 'marketPriceProfitStopLoss' && (className = 'lighten-up-positions-market-price-stop')
  return className
}
// 触发类型模块
root.methods.getTriggerTypeClassName = function () {
  let className = ''
  this.pendingOrderType == 'limitProfitStopLoss' && (className = 'trigger-type-block')
  this.pendingOrderType == 'marketPriceProfitStopLoss' && (className = 'trigger-type-block-market-price')
  return className
}
// 生效时间模块
root.methods.getEffectiveTimeClassName = function () {
  let className = ''
  this.pendingOrderType == 'limitPrice' && (className = 'effective-time-block')
  this.pendingOrderType == 'limitProfitStopLoss' && (className = 'effective-time-block-box')
  return className
}

/*---------------------- hover弹框 end ---------------------*/

// 打开调整杠杆
root.methods.openAdjustingLever = function () {
  this.popWindowAdjustingLever = true
}
// 打开全仓逐仓弹窗
root.methods.openSecurityDepositMode = function () {
  this.popWindowSecurityDepositMode = true

}
// 打开计算机
root.methods.openCalculatorWindow = function () {
  this.openCalculator = true
}
// 关闭计算器
root.methods.closeCalculatorWindow = function () {
  this.openCalculator = false
}


// 获取币安24小时价格变动接口
// root.methods.initTicket24Hr =  async function () {
//   this.$binance.futuresDaily(
//     'BTC_USDT'
//   ).then((data)=>{
//     typeof(data) == 'string' && (data = JSON.parse(data));
//     this.highPrice = data.highPrice || '--'
//     this.lowPrice = data.lowPrice || '--'
//     this.volume = data.volume || '--'
//     this.priceChangePercent = data.priceChangePercent || '--'
//   }).catch((err)=>{
//     console.info('binance.futuresDepth( "BTC_USDT" )出错',err);
//   })
// }

// 获取币安最新标记价格和资金费率
// root.methods.getMarkPricesAndCapitalRates =  async function () {
//   this.$binance.futuresMarkPrice(
//     'BTC_USDT'
//   ).then((data)=>{
//     typeof(data) == 'string' && (data = JSON.parse(data));
//     this.marketPrice = data.markPrice || '--'
//     this.lastFundingRate = data.lastFundingRate || '--'
//     this.nextFundingTime = data.nextFundingTime || '--'
//
//   }).catch((err)=>{
//     console.info('binance.futuresDepth( "BTC_USDT" )出错',err);
//   })
// }

// // 获取币安最新价格接口
// root.methods.getLatestrice =  async function () {
//   this.$binance.price(
//     'BTCUSDT',(err,ticket) =>{
//       console.info('Price BTC===',ticket.BTC)
//     }
//   )
//   //   .then((data)=>{
//   //     typeof(data) == 'string' && (data = JSON.parse(data));
//   //     console.info('data=======',data)
//   //
//   //   }).catch((err)=>{
//   //   console.info('binance.futuresDepth( "BTCUSDT" )出错',err);
//   // })
// }

root.methods.watchScreenWidth = function () {
  //必须声明局部变量，否则this.screenWidth不能触发页面渲染
  var screenWidth = document.body.clientWidth
  // console.log("this.screenWidth====watchScreenWidth=======",screenWidth);
  if(screenWidth<1450){
    this.latestDealSpread = false;
    // this.pankqh = false;
  }
  if(screenWidth>=1450){
    this.latestDealSpread = true;
    // this.pankqh = true;
    this.showStockFunc();
  }
}

// 获取小数点位数
root.methods.getScaleConfig =  function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
}


// 如果没有属性带过来，请求一遍
root.methods.getCurrencyList = function () {
  this.$http.send('MARKET_PRICES',{
    bind: this,
    callBack: this.re_getCurrencyList
  })
}

// 渲染币对列表信息
root.methods.re_getCurrencyList = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.get_currency_list = data;
  this.loading = false;
}

// 获取汇率
root.methods.getCny = function () {
  this.$http.send('GET_EXCHANGE__RAGE', {bind: this, callBack: this.getNowCny})
}
// 判断汇率
root.methods.getNowCny = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.GET_RATE(data);
}
// 获取汇率
root.methods.GET_RATE = function (data) {
  let btc_eth_rate = !!data ? data : this.btc_eth_rate;
  if (!btc_eth_rate.dataMap) {
    return 0;
  }
  let type = this.$store.state.symbol.split('_')[1];
  let rate_obj = btc_eth_rate.dataMap.exchangeRate;
  switch (type) {
    case 'BTC':
      this.rate = rate_obj.btcExchangeRate || 0;
      break;
    case 'ETH':
      this.rate = rate_obj.ethExchangeRate || 0;
      break;
    case 'BDB':
      this.rate = rate_obj.ethExchangeRate * this.bdb_rate || 0;
      break;
    case 'USDT':
      this.rate = 1;
      break;
    default:
      this.rate = 0;
      break;
  }
}

// 一小时轮询一次汇率
root.methods.changeCny = function () {
  let that = this;
  interval = setInterval(function () {
    that.time--;
    if (that.time == 0) {
      that.getCny();
      that.time = 60;
    }
  }, 1000);
}


// 获取区间位置
root.methods.rangePrice = function (max, min, every) {
  let position = (every / (max - min) * 100).toFixed(2);
  position = position > 95 ? 95 : (position < 0 ? 0 : position);
  this.max_min_pisition = position;
  // console.log('position', position);
}

// 组件销毁前清除 interval
root.beforeDestroy = function () {
  clearInterval(interval);
}


// init
root.methods.init = function () {
  // 初始化订阅socket
  this.initSocket();
  // 初始化数据请求
  this.initGetDatas();

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

//临时调试socket添加的方法
/*root.methods.initWebSocket = function (CURRENT_SYMBOL){
  // let that = this;
  // console.log('that=====',that)
  // socket = new WebSocket('wss://wss.highdefi.com/v1/market/notification');
  let func_snapshot = this.func_snapshot

  let func_topic_bar = this.func_topic_bar
  let func_topic_prices = this.func_topic_prices
  let func_topic_tick = this.func_topic_tick

  this.socket = new WebSocket('wss://wss.highdefi.com/v1/market/notification');
  this.socket.onopen = ()=> {
    console.log('this',this);
    console.log('window.symbol',window.symbol);
    this.socket.send(JSON.stringify({
      action: 'subscribe',
      symbol: CURRENT_SYMBOL
    }));
  }
  this.socket.onclose = ()=> {
    console.log('web socket disconnected.');
    closeWebSocket();
    setTimeout(initWebSocket, 10000);
  };
  this.socket.onerror = ()=> {
    console.log('web socket error.');
    closeWebSocket();
    setTimeout(initWebSocket, 10000);
  };
  this.socket.onmessage = function() {
    var data = JSON.parse(event.data);
    // console.log('this is onmessage data',data);
    if (Array.isArray(data) && data.length==2) {
      var
        topic = data[0],
        message = data[1];
      if (topic === 'topic_snapshot') {
        func_snapshot(message);
        console.log('this is topic_snapshot data',message);
        // onTopicSnapshot(message);
      } else if (topic === 'topic_bar') {
        func_topic_bar(message)
        console.log('this is topic_bar data',message);
        // onTopicBar(message);
      } else if (topic === 'topic_prices') {
        func_topic_prices(message)
        console.log('this is topic_prices data',message);
        // onTopicPrices(message);
      } else if (topic === 'topic_tick') {
        func_topic_tick(message)
        // onTopicTick(message);
      } else if (topic === 'topic_order') {
        // onTopicOrder(message);
      }
    }
  };
}

root.methods.closeWebSocket= function() {
  if (window.socket) {
    window.socket.close();
    window.socket = null;
  }
}
root.methods.func_topic_bar = function(message){
  if (this.$store.state.symbol == message.symbol) {
    this.topic_bar = message;
  }
}
root.methods.func_topic_tick = function(message){
  this.socket_tick = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message[0]) || (message.symbol === this.$store.state.symbol && message)
  //当this.socket_tick为false的时候，给一个默认值{}
  if(!this.socket_tick){
    this.socket_tick = {}
  }
  // this.socket_tick = message instanceof Array && message[0] || message;
  this.socketTickArr = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message) || [];
  this.socketTickObj = message instanceof Array && {} || (message.symbol === this.$store.state.symbol && message);
  // 取消板块loading
  this.trade_loading = false;
}
root.methods.func_snapshot= function(message){
  if (this.$store.state.symbol == message.symbol) {
    if (Number(message.timestamp) - Number(this.refreshTime) > this.refresh) {

      this.snap_shot_timeout && clearTimeout(this.snap_shot_timeout);
      // console.log('正常刷新，清空定时器',this.snap_shot_timeout);
      this.socket_snap_shot = message;
      this.refreshTime = message.timestamp;
    }else {
      this.socket_snap_shot_temp = message;

      this.snap_shot_timeout && clearTimeout(this.snap_shot_timeout);
      this.snap_shot_timeout = setTimeout(()=>{
        let refreshTime = this.socket_snap_shot_temp.timestamp;
        // console.log('小于最近一次时间间隔小于500ms深度图的时间',this.refreshTime < refreshTime);
        // console.log('刷新为',this.socket_snap_shot_temp);
        // 如果最后一次刷新时间小于最近一次时间间隔小于500ms深度图的时间，说明没有任何推送，主动刷新
        if (this.refreshTime < refreshTime){
          this.socket_snap_shot = this.socket_snap_shot_temp;
          this.refreshTime = refreshTime;
        }
      },this.refresh)
    }
    //延迟500ms刷新，如果不写else代码，如果当前没有推送，上一次刷新间隔时间小于500ms，
    // 则不会进行最后一次数据的刷新，直到下一次推送才会重新判断时间，以下写法只会让所有推送延迟刷新
    // 并不会减少刷新次数
    // setTimeout(()=>{
    //
    //   //如果this.refresh为0，则说明切换了币对或第一次进入，只有在当前币对页面停留才需要延迟500ms
    //   this.refresh == 0 && (this.refresh = 500);
    //
    //   this.socket_snap_shot = message;
    //   // this.refreshTime = message.timestamp;
    // },this.refresh)
  }
  // 取消板块loading
  this.trade_loading = false;
}
root.methods.func_topic_prices = function(message){
  this.socket_price = message;
  // console.warn('this is topic_price',message)
  // let obj = {}
  // obj[this.$store.state.symbol] = [0,0,0,0,0,0]
  // this.socket_price = this.$globalFunc.mergeObj(message,obj)

  // 取消板块loading
  this.trade_loading = false;
}*/





// 初始化socket
root.methods.initSocket = function () {
  let that = this;
  // 订阅某个币对的信息
  // this.$socket.emit('UNSUBSCRIBE', {symbol: this.$store.state.symbol});
  // this.$socket.emit('SUBSCRIBE', ["btcusdt@depth"]);

  let subscribeSymbol = this.$store.state.subscribeSymbol;
  // 获取最新标记价格
  this.$socket.on({
    key: 'markPrice', bind: this, callBack: (message) => {
      // console.log('markPrice is ===',message);
      if(message.s === subscribeSymbol){
        message.p > 0 && (this.markPrice = message.p)// 标记价格
        message.r > 0 && (this.lastFundingRate = message.r)// 资金费率
        message.T > 0 && (this.nextFundingTime = message.T)//下个资金时间
      }
    }
  })

  // 获取深度图信息
  this.$socket.on({
    key: 'depth', bind: this, callBack: (message) => {
      // console.log('depth is ===',message);
    }
  })

  // 获取最新成交，归集交易
  this.$socket.on({
    key: 'aggTrade', bind: this, callBack: (message) => {
      if(!message)return

      this.socket_tick = message.s === subscribeSymbol && message || {}
      this.socketTickObj = message.s === subscribeSymbol && message || {}
      // 取消板块loading
      this.trade_loading = false;
        // console.log('aggTrade is ===',message);
      }
  })

  // this.$socket.on({key: 'connect',bind: this,callBack: ()=>{
  //     // console.log("监听socket连接状态，成功，订阅消息")
  //     this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
  //     this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});
  //     }
  //   }
  // )

  // this.$socket.on({key: 'reconnect',bind: this,callBack: (data)=>{
  //   console.log("监听socket连接状态，重连",data)
  // }})

  // k线
  // this.$socket.on({
  //   key: 'topic_bar', bind: this, callBack: (message) => {
  //     if (this.$store.state.symbol == message.symbol) {
  //       this.topic_bar = message;
  //     }
  //   }
  // })
  // console.log("topic_bar 订阅成功")

  // 获取所有币对价格
  // this.$socket.on({
  //   key: 'topic_tick', bind: this, callBack: (message) => {
  //     this.socket_tick = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message[0]) || (message.symbol === this.$store.state.symbol && message)
  //     //当this.socket_tick为false的时候，给一个默认值{}
  //     if(!this.socket_tick){
  //       this.socket_tick = {}
  //     }
  //     // this.socket_tick = message instanceof Array && message[0] || message;
  //     this.socketTickArr = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message) || [];
  //     this.socketTickObj = message instanceof Array && {} || (message.symbol === this.$store.state.symbol && message || {});
  //     // 取消板块loading
  //     this.trade_loading = false;
  //   }
  // })
  // console.log("topic_tick 订阅成功")


  // 获取深度图信息 左侧列表
  // this.$socket.on({
  //   key: 'topic_snapshot', bind: this, callBack: (message) => {
  //     // console.log(this.$store.state.symbol+"----------------11111111111111-------------------"+message.symbol);
  //     if (this.$store.state.symbol == message.symbol) {
  //       if (Number(message.timestamp) - Number(this.refreshTime) > this.refresh) {
  //
  //         this.snap_shot_timeout && clearTimeout(this.snap_shot_timeout);
  //         // console.log('正常刷新，清空定时器',this.snap_shot_timeout);
  //         this.socket_snap_shot = message;
  //         this.refreshTime = message.timestamp;
  //       }else {
  //         this.socket_snap_shot_temp = message;
  //
  //         this.snap_shot_timeout && clearTimeout(this.snap_shot_timeout);
  //         this.snap_shot_timeout = setTimeout(()=>{
  //           let refreshTime = this.socket_snap_shot_temp.timestamp;
  //           // console.log('小于最近一次时间间隔小于500ms深度图的时间',this.refreshTime < refreshTime);
  //           // console.log('刷新为',this.socket_snap_shot_temp);
  //           // 如果最后一次刷新时间小于最近一次时间间隔小于500ms深度图的时间，说明没有任何推送，主动刷新
  //           if (this.refreshTime < refreshTime){
  //             this.socket_snap_shot = this.socket_snap_shot_temp;
  //             this.refreshTime = refreshTime;
  //           }
  //         },this.refresh)
  //       }
  //       //延迟500ms刷新，如果不写else代码，如果当前没有推送，上一次刷新间隔时间小于500ms，
  //       // 则不会进行最后一次数据的刷新，直到下一次推送才会重新判断时间，以下写法只会让所有推送延迟刷新
  //       // 并不会减少刷新次数
  //       // setTimeout(()=>{
  //       //
  //       //   //如果this.refresh为0，则说明切换了币对或第一次进入，只有在当前币对页面停留才需要延迟500ms
  //       //   this.refresh == 0 && (this.refresh = 500);
  //       //
  //       //   this.socket_snap_shot = message;
  //       //   // this.refreshTime = message.timestamp;
  //       // },this.refresh)
  //     }
  //     // 取消板块loading
  //     this.trade_loading = false;
  //   }
  // })
  // console.log("topic_snapshot 订阅成功")

  // 接收所有币对实时价格
  // this.$socket.on({
  //   key: 'topic_prices', bind: this, callBack: (message) => {
  //     this.socket_price = message;
  //     // console.warn('this is topic_price',message)
  //     // let obj = {}
  //     // obj[this.$store.state.symbol] = [0,0,0,0,0,0]
  //     // this.socket_price = this.$globalFunc.mergeObj(message,obj)
  //
  //     // 取消板块loading
  //     this.trade_loading = false;
  //   }
  // })
  // console.log("topic_prices 订阅成功")
}


// // 获取bt奖励比率
// root.methods.getBtReward = function () {
//   /*let that = this
//   this.$globalFunc.getBTRegulationConfig(this, (data) => {
//     this.btRewardReady = true
//     this.loading = !(this.stateReady && this.BDBReady && this.btRewardReady && (this.stateStatusReady || !this.isMobile))
//
//   })*/
// }

// 初始化数据请求
root.methods.initGetDatas = function () {
  // 请求所有币对信息 right和header都需要此数据
  // this.getSymbolsList();

  // 根据当前币对请求买或卖列表
  this.getCurrencyBuyOrSaleList();

  // 请求btc->cny汇率，header需要
  this.getExchangeRate();

}
// todo 币币交易获取价格接口处理
// root.methods.getPrices = function () {
//   this.$http.send('MARKET_PRICES', {
//     bind: this,
//     callBack: this.re_getCurrencyLists
//   })
// }
// // price接口数据返回
// root.methods.re_getCurrencyLists = function (data) {
//   typeof(data) == 'string' && (data = JSON.parse(data));
//   this.currency_list = this.$globalFunc.mergeObj(data, this.currency_list);
// }

/* todo 重复获取币对 begin*/
// 请求所有币对信息, header, right都需要此数据
// root.methods.getSymbolsList = function () {
//   this.$http.send('GET_SYMBOLS', {
//     bind: this,
//     callBack: this.re_getSymbolsList
//   });
// }
// // 渲染币对列表信息
// root.methods.re_getSymbolsList = function (data) {
//   let self = this;
//   // this.getPrices();
//   typeof(data) == 'string' && (data = JSON.parse(data));
//
//   // let symbol_list = [];
//   // for (let symbol in data) {
//   // 	symbol_list.push(symbol);
//   // }
//   // if (symbol_list.indexOf(this.$store.state.symbol) < 0) {
//   // 	if (!!symbol_list[0]) {
//   // 		this.$store.commit('SET_SYMBOL', symbol_list[0]);
//   // 	}
//   // }
//
//   let objs = this.symbolList_priceList(data);
//   this.currency_list = objs;
//   // this.currency_list = {
//   //   BTC_USDT:[0,0,0,0,0,0]
//   // };
//
//   // // 记录当前币对开始结束时间
//   // data.symbols.forEach(function (v, i) {
//   //   self.symbol_config_times.push({name: v.name, startTime: v.startTime, endTime: v.endTime});
//   // });
//
// }
/* todo 重复获取币对 end*/

// 对symbol获取的数据进行处理，处理成 {symbol: [time, 1,2,3,4,5]}的格式
// 例如：{ETX_BTX:[1517653957367, 0.097385, 0.101657, 0.097385, 0.101658, 815.89]}
root.methods.symbolList_priceList = function (symbol_list) {
  let obj = {};
  let objs = symbol_list.data;
  objs.forEach((v, i) => {
    obj[v.baseName+'_'+ v.quoteName] = [0, 0, 0, 0, 0, 0];
  })
  return obj;
}

// 根据当前币对请求买或卖列表
root.methods.getCurrencyBuyOrSaleList = function () {
  this.$http.send('DEPTH', {
    bind: this,
    query: {
      symbol: this.$store.state.symbol
    },
    callBack: this.re_getCurrencyBuyOrSaleList
  })
}

// 渲染买卖列表信息
root.methods.re_getCurrencyBuyOrSaleList = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.log("obj==="+JSON.stringify(data));
  this.buy_sale_list = data;

  this.trade_loading = false;
  // console.log(this.buy_sale_list)
}

// 请求btc->cny汇率，header需要
root.methods.getExchangeRate = function () {
  this.$http.send('GET_EXCHANGE__RAGE', {
    bind: this,
    callBack: this.re_getExchangeRate
  })
}

// 渲染汇率
root.methods.re_getExchangeRate = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.btc_eth_rate = data;
}

//切换委托
root.methods.clickTab = function (num) {
  this.isNow = num
  console.warn('this is num', this.isNow)
}

// 提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

// BDB是否抵扣
root.methods.getBDBInfo = function () {
  if (!!this.$store.state.authMessage.userId) {
    this.$http.send('FIND_FEE_DEDUCTION_INFO', {
      bind: this,
      callBack: this.re_getBDBInfo,
      errorHandler: this.error_getBDBInfo
    })
  }
}

// BDB是否抵扣回调
root.methods.re_getBDBInfo = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  // console.warn("get BDB info", data)
  if (data.dataMap.TTFEE === 'yes') {
    this.BDBInfo = true
  }
  if (data.dataMap.TTFEE === 'no') {
    this.BDBInfo = false
  }
  // BDB状态
  this.BDBReady = true
  this.loading = !(this.stateReady && this.BDBReady && (this.stateStatusReady || !this.isMobile))

}
// BDB是否抵扣出错
root.methods.error_getBDBInfo = function (err) {
  // console.warn('BDB抵扣出错', err)
}

// 点击切换手续费折扣
root.methods.clickToggle = function (e) {
  if (!this.$store.state.authMessage.userId) {
    // 信息提示
    this.popType = 0;
    this.popText = '请先登录';
    this.promptOpen = true;
    return;
  }
  if (this.BDBChanging) return;
  this.BDBInfo = !this.BDBInfo;
  this.BDBChanging = true;
  this.$http.send('FEECHANGE', {
    bind: this,
    params: {
      'deduction': this.BDBInfo ? 'yes' : 'no'
    },
    callBack: this.re_clickToggle,
    errorHandler: this.error_clickToggle
  })
}

// 点击切换手续费折扣
root.methods.re_clickToggle = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  // console.warn('更改！', data)
  // setTimeout(() => {
  this.BDBChanging = false
  // }, 1000)
}
// 点击切换手续费折扣失败
root.methods.error_clickToggle = function (err) {
  console.warn('点击切换手续费折扣失败', err)
  this.BDBInfo = !this.BDBInfo
  this.BDBChanging = false
}

//点击切换显示盘口还是实时成交
root.methods.showStockFunc = function(data){
  this.stockShow = true;
  // this.showsscj = false;
  // this.pankqh = false;
}

//点击切换显示盘口还是实时成交
root.methods.showLatestDeal = function(data){
  this.stockShow = false;
  // this.showsscj = true;
  // this.pankqh = true;
}

//显示 币种资料
root.methods.showInfo = function(data){
  this.showinfo = true;
}
//关闭 币种资料
root.methods.closeInfo = function(data){
  this.showinfo = false;
}
//仓位模式Start
//打开仓位模式
root.methods.turnOnLocationMode = function () {
  this.positionModeFirstTemp = this.positionModeFirst;//打开弹窗前需要初始化positionModeFirstTemp的值，必须和positionModeFirst一致
  this.popWindowPositionModeBulletBox = true
}
// 仓位模式
root.methods.popWindowClosePositionModeBulletBox = function () {
  this.popWindowPositionModeBulletBox = false
  this.positionModeFirstTemp = this.positionModeFirst;//直接关闭弹窗后需要还原positionModeFirstTemp的值，必须和positionModeFirst一致
}
// 仓位模式选择
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
  console.info('data===',data)
  this.dualSidePosition = data.data.dualSidePosition
}
// 获取仓位模式错误回调
root.methods.error_getPositionsideDual = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}

// 仓位模式选择确认
root.methods.positionModeSelectedConfirm = function () {
    this.$http.send('POST_SINGLE_DOUBLE',{
      bind: this,
      params:{
        dualSidePosition: this.dualSidePosition ? false : true,
        // timestamp: this.serverTime
      },
      callBack: this.re_positionModeSelectedConfirm,
      errorHandler:this.error_positionModeSelectedConfirm
    })
  }
// 获取币安24小时价格变动正确回调
root.methods.re_positionModeSelectedConfirm = function (data) {
    typeof(data) == 'string' && (data = JSON.parse(data));
    if(!data && !data.data)return
    if (data.code == 200) {
      this.positionModeFirst = this.positionModeFirstTemp;
      this.getPositionsideDual()
      this.popWindowPositionModeBulletBox = false
    }
  }
// 获取币安24小时价格变动错误回调
root.methods.error_positionModeSelectedConfirm = function (err) {
  console.log('获取币安24小时价格变动接口',err)
}
//仓位模式End

//仓位模式二级切换 Start
root.methods.changePositionModeSecond = function (type) {
  this.positionModeSecond = type;
}
//仓位模式二级切换 End

//交易类型切换 Start
root.methods.changePendingOrderType = function (type) {
  if(this.pendingOrderType == type)return
  this.pendingOrderType = type;
  // console.log('交易切换类型this.pendingOrderType========',this.pendingOrderType)
  // console.log('交易类型切换',this.positionModeConfigs[this.positionModeFirst][this.positionModeSecond][this.pendingOrderType]['passiveDelegation']);
}
//交易类型切换 Start

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
root.methods.changeReducePositions = function(){
  this.reducePositionsSelected = !this.reducePositionsSelected
}

//保证金模式 Strat
root.methods.popWindowCloseSecurityDepositMode = function () {
  this.popWindowSecurityDepositMode = false
}

root.methods.securityDepositMode = function (cardType) {
  this.cardType = cardType
}
root.methods.positionRisk = function () {
  this.$http.send('GET_POSITION_RISK',{
    bind: this,
    // query:{
    //   "symbol":'BTCUSDT'
    // },
    callBack: this.re_positionRisk
  })
}
root.methods.re_positionRisk = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  console.info('data=====',data)
  data.data.forEach(v=>{
    if (v.symbol == 'BTCUSDT') {
      this.$store.commit("CHANGE_LEVERAGE", v.leverage);
      v.marginType == 'isolated'? this.marginType = 'ISOLATED' : this.marginType = 'CROSSED'
    }
  })
}

root.methods.marginModeConfirm = function () {
  if ((this.cardType == 2 && this.marginType == 'ISOLATED')|| (this.cardType == 1 && this.marginType == 'CROSSED')) {
    this.popType = 0;
    this.popText = '不需要切换仓位模式';
    this.promptOpen = true;
    return
  }
  if (this.cardType == 1) {
    this.marginModeType = 1
  }
  if (this.cardType == 2) {
    this.marginModeType = 2
  }


  this.$http.send('POST_MARGIN_TYPE',{
    bind: this,
    params:{
      "symbol": "BTCUSDT",
      "marginType": this.marginModeType == 2 ? 'ISOLATED':'CROSSED'
      // "timestamp": new Date().getTime()
    },
    callBack: this.re_marginModeConfirm,
    errorHandler:this.error_marginModeConfirm
  })

}
root.methods.re_marginModeConfirm = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.positionRisk()
  this.popWindowCloseSecurityDepositMode()
}
root.methods.error_marginModeConfirm = function (err) {
}
//保证金模式 End


//打开调整杠杆 Strat
root.methods.openLever = function () {
  this.popWindowAdjustingLever = true
}
//打开调整杠杆 End
// 调整杠杆接口调取
root.methods.postLevelrage = function () {
  this.$http.send('POST_LEVELRAGE',{
    bind: this,
    params:{
      "symbol":"BTCUSDT",
      "leverage": this.value,
    },
    callBack: this.re_postLevelrage
  })
}
root.methods.re_postLevelrage = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.leverage = data.data.leverage
  this.positionRisk()
  this.popWindowCloseAdjustingLever()
}

// 关闭调整杠杆 Strat
root.methods.popWindowCloseAdjustingLever = function () {
  this.popWindowAdjustingLever = false
}
// 关闭调整杠杆 End

// 处理滑动条显示框内容
root.methods.formatTooltip=(val)=>{
  return  val + 'X';
}
//调整杠杆 End
//被动委托
root.methods.priceLimitSelection = function (checkPrice) {
  this.checkPrice = checkPrice
  if(checkPrice == '1') {
    this.effectiveTime = 'GTX'
    return
  }
  this.effectiveTime = 'GTC'
}
/*---------------------- 生效时间 begin ---------------------*/
root.methods.closeDropDownTime= function () {
  $(".effective-time-drop-down").attr("style","display:none");
}
root.methods.openDropDownTime = function () {
  $(".effective-time-drop-down").attr("style","display:block");
}
/*---------------------- 生效时间 end ---------------------*/
/*---------------------- 最新价格 begin ---------------------*/
root.methods.closeLatestPrice= function () {
  $(".effective-time-drop-down-pic").attr("style","display:none");
}
root.methods.openLatestPrice = function () {
  $(".effective-time-drop-down-pic").attr("style","display:block");
}
/*---------------------- 最新价格 end ---------------------*/
root.methods.goToGtc = function () {
  this.effectiveTime = 'GTC'
  $(".effective-time-drop-down").attr("style","display:none");
}
root.methods.goToIoc = function () {
  this.effectiveTime = 'IOC'
  $(".effective-time-drop-down").attr("style","display:none");
}
root.methods.goToFok = function () {
  this.effectiveTime = 'FOK'
  $(".effective-time-drop-down").attr("style","display:none");
}
root.methods.goToLatestPrice = function () {
  this.latestPrice = '最新价格'
  $(".effective-time-drop-down-pic").attr("style","display:none");
}
root.methods.goToMarkedPrice = function () {
  this.latestPrice = '标记价格'
  $(".effective-time-drop-down-pic").attr("style","display:none");
}
// 合约首次风险提示弹窗关闭确认按钮
root.methods.popCloseTemporarilyClosed = function () {
  this.popWindowContractRiskWarning = false
  this.$router.push('index/home')
}

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
    this.popWindowContractRiskWarning = true
  } else {
    this.popWindowContractRiskWarning = false
  }
}

// 合约首次风险提示弹窗确认按钮
root.methods.openAContract = function () {
  this.$http.send('POST_MANAGE_TIME',{
    bind: this,
    query: {},
    callBack: this.re_openAContract
  })
}
root.methods.re_openAContract = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if (data.code == 200) {
    this.popWindowContractRiskWarning = false
  }
}


// 计算symbol变化
root.computed = {};
// 当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
// 实时价格
root.computed.isNowPrice = function () {
  // console.log('socket_snap_shot====',this.socket_snap_shot,this.buy_sale_list,this.quoteScale)
  let price = this.$globalFunc.mergeObj(this.socket_snap_shot.price, this.buy_sale_list.price) || 0;
  let priceObj = this.$globalFunc.mergeObj(this.socket_tick, {price: price});
  let now_price = this.$globalFunc.accFixed(priceObj.price, this.quoteScale);
  document.title = now_price+" "+this.$store.state.symbol.replace('_', '/')+" "+this.$t('document_title');
  // if (!!this.socket_snap_shot.price)
  return now_price;
}
// 实时价格的升降
root.computed.direction = function () {
  return this.socket_tick.direction;
}
// 实时价格cny
root.computed.isCnyPrice = function () {
  let close = this.isNowPrice || 0;
  // if (this.$store.state.lang === 'CH') {
    return ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (close * this.rate), 2));
  // }
  // else {
  //   return ('$' + this.$globalFunc.accFixedCny((close * this.rate), 2));
  // }
  // if (this.$store.state.lang === 'EN') {
  // 	return ('$' + ((close * this.rate)).toFixed(2));
  // }
}

// 24小时最低价
root.computed.low24 = function () {
  // console.log('list', this.mergeList[this.symbol][3])
  if (!this.mergeList[this.symbol]) return;
  let low = Math.min((this.isNowPrice || 10000), this.mergeList[this.symbol][3]);
  let low24 = this.$globalFunc.accFixed(low, this.quoteScale);
  return low24;
}
// 24小时最高价
root.computed.high24 = function () {
  // console.log('list', this.mergeList[this.symbol][2])
  if (!this.mergeList[this.symbol]) return;
  let high = Math.max(this.isNowPrice, this.mergeList[this.symbol][2]);
  let high24 = this.$globalFunc.accFixed(high, this.quoteScale);
  return high24;
}
// 24小时成交量
// root.computed.volume = function () {
//   if (!this.mergeList[this.symbol]) return;
//   let volume = this.$globalFunc.accFixed(this.mergeList[this.symbol][5], 0);
//   return volume;
// }

// 实时价格 需要取BDB/ETH的时价和汇率来算BDB的汇率
root.computed.topic_price = function () {
  return this.socket_price;
}


root.computed.mergeList = function () {
  let list = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  return list;
}

// 24小时涨跌
root.computed.diff24 = function () {
  // let diff = this.isNowPrice  - Number(this.mergeList[this.symbol][1])
  // 减法
  if (!this.mergeList[this.symbol]) return;
  let diff = this.$globalFunc.accFixed(this.$globalFunc.accMinus(this.isNowPrice, this.mergeList[this.symbol][1]), this.quoteScale);
  return diff;
}
// 24小时涨跌百分比 (现价 - 开盘价) / 开盘价
root.computed.diff24Ratio = function () {
  if (!this.mergeList[this.symbol]) return;
  let now_price = this.isNowPrice || 0;
  let diff = ((Number(now_price) - Number(this.mergeList[this.symbol][1])) / Number(this.mergeList[this.symbol][1])*100).toFixed(2);
  // let diff = this.toFixed(this.accMul(this.accDiv(this.accMinus(now_price, this.mergeList[this.symbol][1]), this.mergeList[this.symbol][1] || 1), 100), 2)
  if (this.mergeList[this.symbol][1] == 0) {
    return 0
  } else {
    return diff;
  }
}

/*****************************************************/
root.computed.listenSymbol = function () {
  return this.$store.state.symbol;
}
// 判断是否为移动端
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
// 特殊专区
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol
}
// // 是否显示为蜜简介
// root.computed.showSuperBeeIntroduction = function () {
//   // if (this.specialSymbol[0].has(this.listenSymbol)) {
//   //   return true
//   // }
//   return false
// }
//页面功能模块显示逻辑配置信息
root.computed.positionModeConfigs = function () {
  let data = tradingHallData.positionModeConfigs;
  // console.log(data);
  return data
}
root.computed.serverTime = function () {
  return new Date().getTime();
}



// 监听symbol 做一些操作
root.watch = {};

root.watch.isNowPrice = function (newValue, oldValue) {
  this.GET_RATE('');
}

root.watch.positionRisk = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.positionRisk()
}
root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // this.getScaleConfig();
  // this.init();
}
root.watch.listenSymbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.refreshTime = 0;
  //切换币对后第一次进入不需要延迟刷新
  // this.refresh = 0;
  // 订阅某个币对的信息
  // this.$socket.emit('unsubscribe', {symbol: oldValue});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});

  // 2018-2-8 切换币对时候清空所有socket的数据，等socket推送以后重新赋值
  this.socket_snap_shot = {};
  this.socket_tick = {};
  this.topic_bar = {};
  this.socketTickArr = [];
  this.socketTickObj = {};

  // this.buy_sale_list = {}//为了保证切换币对时价不显示0
  this.buy_sale_list.asks = []
  this.buy_sale_list.bids = []

  this.header_price = {}
  // socket_price: {}, //总价格
  this.socket_snap_shot_temp = {}
  this.snap_shot_timeout = null

  // 重新获取信息
  this.getScaleConfig();
  this.init();
  // this.initGetDatas();

  // 各小版块加载中
  this.trade_loading = true;

  this.$router.push({name: 'tradingHall', query: {symbol: newValue}});
}

// // 如果切换市场的时候，在超级为蜜区，并且打开了为蜜资料
// root.watch.showSuperBeeIntroduction = function (newValue, oldValue) {
//   if (!newValue && oldValue && this.isNow == 3) {
//     this.isNow = 0
//   }
// }

// 组件卸载前取消订阅
root.beforeDestroy = function () {
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
}
// 组件卸载取消订阅
root.destroyed = function () {
  //加进window的方法当跳出此页面后需要销毁哦
  window.onresize = null;
}


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

/*---------------------- 格式化时间 begin ---------------------*/
root.methods.formatDateUitll = function(time) {
  return this.$globalFunc.formatDateUitl(time, 'hh:mm:ss')
}
/*---------------------- 格式化时间 end ---------------------*/
export default root
