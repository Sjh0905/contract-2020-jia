import axios from "axios";
import tradingHallData from "../../dataUtils/TradingHallDataUtils";
import {parse} from "echarts/extension-src/dataTool/gexf";
import {isUndefined} from "element-ui/src/utils/types";

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
  'CalculatorBommbBox': resolve => require(['../vue/CalculatorBommbBox'], resolve),
  // 开平器组件
  'KaipingqiPopWindow': resolve => require(['../vue/KaipingqiPopWindow'], resolve),
  'AssetSnapshot': resolve => require(['../vue/AssetSnapshot'], resolve),

}

root.data = function () {
  return {
    socket:null,
    // 货币对列表
    marketSymbolList: [],
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
    socket24hrTicker:[],//symbol24小时ticker信息
    socketTickArr: [], // 最新成交，归集交易，暂时没用到
    socketTickObj: {}, // 单个归集交易推送
    apiTickArr: [], // 第一次接口获取的最新归集交易

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
    isNow: 4, // 交易页底部必须默认显示仓位否则刷新没有数据

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

    positionModeFirst:'doubleWarehouseMode',//单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
    positionModeFirstTemp:'',//临时存储值，等用户点击弹窗确认按钮后才真正改变positionModeFirst的值
    positionModeSecond:'openWarehouse',//单仓 singleWarehouse 开仓 openWarehouse 平仓 closeWarehouse
    pendingOrderType:'marketPrice',//限价 limitPrice 市价 marketPrice 限价止盈止损 limitProfitStopLoss 市价止盈止损 marketPriceProfitStopLoss

    reducePositionsSelected: false,//只减仓状态

    //保证金模式Strat
    popWindowSecurityDepositMode: false,
    // cardType:1, //仓位模式选择初始值
    marginModeType: 'quanCang',  // "quanCang":全仓  "zhuCang":逐仓
    marginType: 'CROSSED', // 全仓逐仓
    marginModeTypeTemp:'',// 临时存储值，等用户点击弹窗确认按钮后才真正改变 marginModeType 的值
    //保证金模式End

    //调整杠杆 Strat
    popWindowAdjustingLever: false,
    // 合约风险提示
    popWindowContractRiskWarning: false,
    value: 0,
    calculatorClass:['radiusa_blu1','radiusa_blu2','radiusa_blu3','radiusa_blu4','radiusa_blu5'],
    leverageMarks:{
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
    //调整杠杆 End

    //仓位模式Start
    popWindowPositionModeBulletBox: false, //仓位模式弹框

    //仓位模式End

    leverage:20, // 杠杆倍数

    effectiveTime:'GTX',
    latestPrice:'最新价格',
    // 计算器弹框 begin
    openCalculator:false,
    // 计算器弹框 end
  //  限价---被动委托，生效时间选择
    checkPrice:2,

    highPrice: '', // 24小时最高价
    lowPrice: '', // 24小时最低价
    volume: '', // 24小时量
    priceChangePercent: '', // 24涨幅
    markPrice: '', // 标记价格
    markPriceObj: {}, // 多币对标记价格
    lastFundingRate: '', // 资金费率
    nextFundingTime: '',   // 下次资金费时间
    latestPriceVal: '' ,   // 最新价格，用于价格输入框显示
    latestPriceArr: [] ,   // 最新价格数组，用于判断价格升降和盘口显示
    maxNotionalValue: '',   // 当前杠杆倍数下允许的最大名义价值

    dualSidePosition:false,  // "true": 双向持仓模式；"false": 单向持仓模式
    // availableBalance:0 , // 可用余额
    recordsIndex:0, // 仓位数量
    currentLength:0, // 当前委托数量
    recordsIndexS:0, // 当前币对的仓位数量
    currentLengthS:0, // 当前币对的当前委托数量
    currOrderLenObj:{}, // 当前币对的当前委托数量
    // 显示的最大头寸
    // maximumPosition : ['50,000','250,000','100,0000','5,000,000','20,000,000','50,000,000','100,000,000','200,000,000'],
    // positionAmtLong:0,
    // positionAmtShort:0,
    popTextLeverage:'',
    availableBalance:0,
/* -------------------------- 开平器Data begin -------------------------- */
    openOpener:false,
    positionList:[],
/* -------------------------- 开平器Data end -------------------------- */
    invitreCodeInput:'',//邀请码
    pswPlaceholderShow: true,
    name_0:'',
    positionRecords:[],

  }
}

root.created = function () {
  this.checkPrice ==1 ? this.effectiveTime='GTX' : this.effectiveTime='GTC'
  // if(this.screenWidth<1450){
  //   this.latestDealSpread = false;
  //   // this.pankqh = false;
  // }else{
  //   this.latestDealSpread = true;
  //   // this.pankqh = true;
  //   this.showStockFunc()
  // }
  this.getOrder()
  this.$eventBus.listen(this, 'GET_ORDERS', this.getOrder)
  this.$eventBus.listen(this,'GET_BALANCE',this.getBalance)
  this.watchScreenWidth();
  // 获取兑换汇率
  this.getCny();
  // 一小时更新一次汇率
  // this.changeCny();
  // 请求币对列表
  // this.getSymbolsList()

  // 获取小数位
  this.getScaleConfig();

  // window.CURRENT_SYMBOL = this.$store.state.symbol
  this.$store.commit('changeJoinus', false);
  // 判断是否开启BDB燃烧
  // this.getBDBInfo();

  // 判断是否进行实名认证
  this.getAuthState();
  //获取bt燃烧比例
  // this.getBtReward();
  // this.initWebSocket(this.$store.state.symbol);
  this.getLatestrice()  // 获取币安最新价格
  this.initTicket24Hr()  // 获取币安24小时价格变动接口

  this.getMarkPricesAndCapitalRates()  // 获取币安最新标记价格和资金费率
  this.getDepth()  // 获取币安深度
  this.getAggTrades() //获取归集交易
  // this.positionRisk()  // 获取全逐仓状态 刷新时候不调用，调整全逐仓和杠杆倍数需要调用
  this.getPositionsideDual() // 获取仓位模式
  this.isFirstVisit()
  this.getBalance()

}

root.mounted = function () {
  // 初始化所有信息
  let self = this;
  // setTimeout(this.init, 1000);
  this.init(this.$store.state.symbol);

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
root.computed.currencyInfo = function () {
  let cInfo = this.$store.state.currencyInfo
  let csv = cInfo[this.capitalSymbol];

  if(csv.marginType == 'isolated'){
    this.marginType = 'ISOLATED'  // 传参使用
    this.marginModeType = 'zhuCang' // 切换样式使用
  }else{
    this.marginType = 'CROSSED'
    this.marginModeType = 'quanCang'
  }
  return cInfo
  // console.info(this.$store.state.currencyInfo[this.capitalSymbol].leverage)
  // console.info(this.$store.state.currencyInfo[this.capitalSymbol].marginType)
  // return this.$store.state.currency[this.capitalSymbol].leverage || ''
}
// // 杠杆分层数组
// root.computed.bracketList = function () {
//   return (this.$store.state.bracketList || {})[this.capitalSymbol] || []
// }
// 最大头寸值
root.computed.maximumPosition = function () {
  return this.$store.state.bracketNotionalcap[this.capitalSymbol] || []
}
// 杠杆倍数
root.computed.initialLeverage = function () {
  return this.$store.state.bracketLeverage[this.capitalSymbol] || []
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
// 计算是否有仓位和当前委托
root.computed.isHasOrders = function (){
  // 如果当前币对的仓位和订单数量为0，不能切换全逐仓
  if(!this.currOrderLenObj[this.capitalSymbol] && !this.recordsIndexS) return true
  // if(!this.currentLengthS && !this.recordsIndexS) return true
  return false
}

// 计算是否有仓位和当前委托(全部的，用于切换单双仓)
root.computed.isHasOrdersOrPosition = function (){
  // 如果当前币对的仓位和订单数量为0，不能切换全逐仓
  if(!this.currentLength && !this.recordsIndex) return true
  // if(!this.currentLengthS && !this.recordsIndexS) return true
  return false
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
// 当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}

//不加下划线币对集合
root.computed.sNameList = function () {
  return this.$store.state.sNameList || []
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
/*// 实时价格cny
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
}*/

/*// 24小时最低价
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
// root.computed.topic_price = function () {
//   return this.socket_price;
// }*/

/*root.computed.mergeList = function () {
  let list = this.$globalFunc.mergeObj(this.socket_price, this.marketSymbolList);
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
}*/

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

//页面功能模块显示逻辑配置信息
root.computed.positionModeConfigs = function () {
  let data = tradingHallData.positionModeConfigs;
  // console.log(data);
  return data
}
root.computed.serverTime = function () {
  return new Date().getTime();
}
// 初始化各子组件
root.methods = {}
/*---------------  开平器 Begin  ---------------*/
// 打开开平器
root.methods.openBottleOpener = function () {
  // alert('打开开平器')
  this.openOpener = true
  this.getPositionRisk()
}
// 关闭开平器弹框
root.methods.closeBottleOpener = function () {
  this.openOpener = false
}
// // 提交开平器
// root.methods.comitBottleOpener = function () {
//   this.closeBottleOpener()
// }
/*---------------  开平器 End  ---------------*/

// root.methods.currentSymbolLegth = function (records,length) {
//   let filterRecords = []
//   records && records.forEach(v=>{
//     if (v.symbol == this.capitalSymbol) {
//       filterRecords.push(v)
//     }
//   })
//   return length = filterRecords.length || 0
// }
root.methods.setFilterListIndex = function (index) {
  this.recordsIndexS = index
  console.info(this.recordsIndexS)
}
// 获取仓位的数据
root.methods.setRecords = function (records) {
  this.positionRecords = [...records]
  // let filterRecords = []
  // this.positionRecords && this.positionRecords.forEach(v=>{
  //   if (v.symbol == this.capitalSymbol) {
  //     filterRecords.push(v)
  //   }
  // })
  // console.info(this.recordsIndexS,filterRecords)
  // return this.recordsIndexS = filterRecords.length || 0
}
// 仓位
root.methods.getPositionRisk = function () {
  this.$http.send("GET_POSITION_RISK", {
    bind: this,
    query: {
      symbols: this.sNameList.toString()
    },
    callBack: this.re_getPositionRisk,
    errorHandler: this.error_getPositionRisk
  })
}
// 该数据使用于开平器打开时已有仓位的仓位数量 该回调由仓位的接口传递过来，交易页底部必须默认显示仓位否则全部无数据
root.methods.re_getPositionRisk = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  let records = data.data,filterRecords = []
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

/*---------------------- 合约接口部分 begin ---------------------*/

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
  let availableBalance  = data.data[0].availableBalance || 0
  this.availableBalance = availableBalance >=0 ? availableBalance : 0

}
// 获取用户可用余额错误回调
root.methods.error_getBalance = function (err) {
  console.log('获取用户可用余额',err)
}

// 获取币安24小时价格变动接口
root.methods.initTicket24Hr = function () {
  this.$http.send('GET_TICKER_24HR',{
    bind: this,
    query:{
      symbol:this.sNameList.toString()
    },
    callBack: this.re_initTicket24Hr,
    errorHandler:this.error_initTicket24Hr
  })
}
// 获取币安24小时价格变动正确回调
root.methods.re_initTicket24Hr = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data || !data.data[0])return
  // console.info('data====',data.data[0])
  data = data.data;
  this.highPrice = data[0].highPrice || '--'
  this.lowPrice = data[0].lowPrice || '--'
  this.volume = data[0].volume || '--'
  this.priceChangePercent = data[0].priceChangePercent || '--'

  // data[1] = {...data[0]};//为了前端自造数据，不能写成data[1] = data[0]，否则MarketPrice.js里v.priceStep属性计算会出错
  data.map(v=>{
    v.P = v.priceChangePercent
    v.p = v.priceChange
    v.c = v.lastPrice
    v.s = v.symbol
  })
  this.marketSymbolList = data
}
// 获取币安24小时价格变动错误回调
root.methods.error_initTicket24Hr = function (err) {
  console.log('获取币安24小时价格变动接口',err)
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

/*获取接口移到了PreHandler里边
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

  // let objs = this.symbolList_priceList(data);
  // this.marketSymbolList = objs;

  // 记录当前币对开始结束时间
  // data.symbols.forEach(function (v, i) {
  //   self.symbol_config_times.push({name: v.name, startTime: v.startTime, endTime: v.endTime});
  // });
}*/

// 获取深度信息
root.methods.getDepth = function () {
  this.$http.send('GET_DEPTH', {
    bind: this,
    query:{
      symbol:this.capitalSymbol,
      limit: 50
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
  this.marginModeTypeTemp = this.marginModeType
  this.popWindowSecurityDepositMode = true
}
//保证金模式
root.methods.popWindowCloseSecurityDepositMode = function () {
  this.marginModeTypeTemp = this.marginModeType
  this.popWindowSecurityDepositMode = false
}

// 关闭但不改变其中的值
root.methods.popWindowClosePositionModeBullet = function () {
  this.marginModeType = this.marginModeTypeTemp
  this.popWindowSecurityDepositMode = false
}
// 切换保证金模式
root.methods.securityDepositMode = function (cardType) {
  this.marginModeTypeTemp = cardType
}
// 获取订单
root.methods.getOrder = function () {
  if (!this.$store.state.authState.userId) {
    this.loading = false
    return
  }
  this.$http.send('GET_CURRENT_DELEGATION', {
    bind: this,
    query: {
      symbol:'',
      // timestamp:this.serverTime,
      // orderId:'1231212'
    },
    callBack: this.re_getOrder,
    errorHandler: this.error_getOrder,
  })
}
// 获取订单回调
root.methods.re_getOrder = function (data) {
  // console.log('this is currOrder',JSON.stringify(data));
  typeof(data) == 'string' && (data = JSON.parse(data));
  let currentOrder = data.data || []
  this.currentLength = currentOrder.length
  this.$store.commit('SET_CURRENT_ORDERS',currentOrder)
  // this.currentSymbolLegth(currentOrder,this.currentLengthS)
  let currOrderLen = {}
  currentOrder && currentOrder.forEach(v=>{
    if(!currOrderLen[v.symbol]){
      currOrderLen[v.symbol] = 0
    }
    currOrderLen[v.symbol] += 1
  })

  this.currOrderLenObj = currOrderLen;
  // console.info("this is currOrderLenObj",this.currOrderLenObj,this.currOrderLenObj[this.capitalSymbol])

  /*let filterRecords = []
  currentOrder && currentOrder.forEach(v=>{
    if (v.symbol == this.capitalSymbol) {
      filterRecords.push(v)
    }
  })
 this.currentLengthS = filterRecords.length || 0
*/
}
// 获取订单出错
root.methods.error_getOrder = function (err) {
  console.warn("获取订单出错！")
}

// 获取仓位子组件的值
root.methods.getIndex = function (index) {
  this.recordsIndex = index
}
// 获取当前委托子组件的值
root.methods.getOrdersLength = function (index) {
  this.currentLength = index
}
root.methods.positionRisk = function () {
  this.$http.send('GET_POSITION_RISK',{
    bind: this,
    query: {
      symbols: this.sNameList.toString()
    },
    callBack: this.re_positionRisk
  })
}
root.methods.re_positionRisk = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data || !data.data || data.data == []) return
  // let filterRecords = []
  let currencyInfo = {...this.currencyInfo}
  this.sNameList.forEach(s=>{
    for (let i = 0,len = data.data.length; i < len; i++) {
      let v = data.data[i];
      if (v.symbol == s) {
        currencyInfo[s] = {
          leverage:v.leverage,
          marginType:v.marginType
        }
        break;
      }
    }
    this.$store.commit("CHANGE_CURRENCY_INFO", currencyInfo);
  })

  let csv = this.currencyInfo[this.capitalSymbol];

  // this.leverage = csv.leverage
  // this.$store.commit("CHANGE_LEVERAGE", csv.leverage);
  if(csv.marginType == 'isolated'){
    this.marginType = 'ISOLATED'  // 传参使用
    this.marginModeType = 'zhuCang' // 切换样式使用
    return
  }
  this.marginType = 'CROSSED'
  this.marginModeType = 'quanCang'

 /* data.data.find(v=>{
    if (v.symbol == this.capitalSymbol) {
      this.leverage = v.leverage
      this.$store.commit("CHANGE_LEVERAGE", v.leverage);
      this.$store.commit("CHANGE_CURRENCY_INFO", v);
      // this.$store.commit("CHANGE_CURRENCY_INFO", v.marginType);
      if(v.marginType == 'isolated'){
        this.marginType = 'ISOLATED'
        this.marginModeType = 'zhuCang'
        return
      }
      this.marginType = 'CROSSED'
      this.marginModeType = 'quanCang'
    }
  })*/

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
//保证金模式 End



// 打开计算机
root.methods.openCalculatorWindow = function () {
  this.openCalculator = true
}
// 关闭计算器
root.methods.closeCalculatorWindow = function () {
  this.openCalculator = false
}

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
root.methods.init = function (newSymbol) {
  // 初始化订阅socket
  this.initSocket(newSymbol);
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

// 初始化socket
root.methods.initSocket = function (newSymbol) {
  let that = this;
  // 订阅某个币对的信息
  // this.$socket.emit('UNSUBSCRIBE', {symbol: this.$store.state.symbol});
  // this.$socket.emit('SUBSCRIBE', ["btcusdt@depth"]);

  // let subscribeSymbol = this.$store.state.subscribeSymbol;
  let subscribeSymbol = this.$globalFunc.toOnlyCapitalLetters(this.$store.state.symbol || newSymbol);
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
    }
  })

  // 获取币安24小时价格变动
  this.$socket.on({
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
  })

  // 获取深度图信息
  this.$socket.on({
    key: 'depthUpdate', bind: this, callBack: (message) => {
      // console.log('depth is ===',message);
      // console.log("depth is === this.capitalSymbol == message.s",this.capitalSymbol == message.s)

      if(message.s != subscribeSymbol)return

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

}

// 初始化数据请求
root.methods.initGetDatas = function () {
  // 请求所有币对信息 right和header都需要此数据
  // this.getSymbolsList();

  // 根据当前币对请求买或卖列表
  // this.getCurrencyBuyOrSaleList();

  // 请求btc->cny汇率，header需要
  this.getExchangeRate();

}

/*// 对symbol获取的数据进行处理，处理成 {symbol: [time, 1,2,3,4,5]}的格式
// 例如：{ETX_BTX:[1517653957367, 0.097385, 0.101657, 0.097385, 0.101658, 815.89]}
root.methods.symbolList_priceList = function (symbol_list) {
  let obj = {};
  let objs = symbol_list.data;
  objs.forEach((v, i) => {
    obj[v.baseName+'_'+ v.quoteName] = [0, 0, 0, 0, 0, 0];
  })
  return obj;
}*/

/* TODO 准备删除
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
*/

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
  // console.warn('this is num', this.isNow)
}

// 提示信息
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

/*// BDB是否抵扣
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
}*/

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
    return
  }
  this.popType = 0;
  this.popText = '调整仓位模式失败';
}
// 仓位模式选择确认错误回调
root.methods.error_positionModeSelectedConfirm = function (err) {
  console.log('仓位模式选择确认接口',err)
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

//打开调整杠杆 Strat
root.methods.openLever = function () {
  this.popTextLeverage=''
  this.popWindowAdjustingLever = true
  this.value = this.currencyInfo[this.capitalSymbol].leverage
}
//打开调整杠杆 End
// 调整杠杆接口调取
root.methods.postLevelrage = function () {
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
  if (data.code == 303) {
    this.popTextLeverage = '调整杠杆失败';
    return
  }
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

// 关闭调整杠杆 Strat
root.methods.popWindowCloseAdjustingLever = function () {
  this.popWindowAdjustingLever = false
}
// 关闭调整杠杆 End

// 处理滑动条显示框内容
root.methods.formatTooltip =(val)=>{
  return  val + 'X';
}
//调整杠杆 End
//被动委托
root.methods.priceLimitSelection = function (checkPrice) {
  this.checkPrice = checkPrice
  if(checkPrice == 2) {
    this.effectiveTime = 'GTC'
    return
  }
  this.effectiveTime = 'GTX'
}
/*---------------------- 生效时间 begin ---------------------*/
root.methods.closeDropDownTime= function () {
  $(".effective-time-drop-down").attr("style","display:none");
}
root.methods.openDropDownTime = function () {
  if (this.checkPrice == 2) {
    $(".effective-time-drop-down").attr("style","display:block");
  }
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
  window.location.replace(this.$store.state.contract_url + 'index/tradingHall?symbol=KK_USDT');
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
root.methods.openAContract1 = function () {
  // this.popWindowContractRiskWarning = false
  // return
  this.$http.send('POST_MANAGE_TIME',{
    bind: this,
    query: {},
    callBack: this.re_openAContract
  })
}
root.methods.re_openAContract = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if (data.code == 200) {
    history.go(0)
    this.popWindowContractRiskWarning = false
  }
}

//
root.methods.openAContract = function () {
  this.name_0 = ''
  // this.pswPlaceholderShow = true

  if (this.invitreCodeInput=='') {
    this.openAContract1()
    return
  }

  this.$http.send('GET_INVITE_ID',{
    bind: this,
    urlFragment: this.invitreCodeInput,
    callBack: this.re_getInviteCodeId
  })

}

root.methods.re_getInviteCodeId = function (data) {
  if (data.errorCode == 3) {
    this.name_0 = '邀请人不存在';
    return
  }
  if (data.errorCode == 0) {
    this.getInviteCode()
  }
}


root.methods.getInviteCode = function () {
  this.name_0 = ''
  this.$http.send('GET_INVITE_CODE',{
    bind: this,
    urlFragment: this.invitreCodeInput,
    callBack: this.re_getInviteCode
  })
}
root.methods.re_getInviteCode = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  if (this.invitreCodeInput == this.userId) {
    this.name_0 = '自己不能邀请自己';
    return
  }
  if (data.errorCode == 2) {
    this.name_0 = ' 邀请关系建立失败';
    return;
  }
  if (data.errorCode == 0) {
    this.openAContract1()
    return;
  }
}

/*// 计算symbol变化
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
  let list = this.$globalFunc.mergeObj(this.socket_price, this.marketSymbolList);
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

/!*****************************************************!/
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
}*/



// 监听symbol 做一些操作
root.watch = {};
// root.watch.availableBalance = function (newValue, oldValue) {
//   console.info('newValue===',newValue)
// }
root.watch.positionModeSecond = function () {

  // if (this.positionModeSecond == 'closeWarehouse') {
  //   this.pendingOrderType = 'marketPriceProfitStopLoss'
  //   return
  // }
    this.pendingOrderType = 'marketPrice'
}
root.watch.pendingOrderType  = function (){
  if(this.pendingOrderType == 'limitPrice' || this.pendingOrderType == 'marketPrice') {
    this.reducePositionsSelected = false
    return
  }
  this.reducePositionsSelected = true
}

root.watch.isNowPrice = function (newValue, oldValue) {
  this.GET_RATE('');
}

root.watch.positionRisk = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.positionRisk()
}
root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // this.leverageMarks
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
  // this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});

  // 2018-2-8 切换币对时候清空所有socket的数据，等socket推送以后重新赋值
  this.socket_snap_shot = {};
  this.socket_tick = {};
  this.topic_bar = {};
  this.socketTickArr = [];
  this.socketTickObj = {};

  this.buy_sale_list = {}//放开这行，保证盘口及时刷新，币对时价不从这里取值了
  this.buy_sale_list.asks = []
  this.buy_sale_list.bids = []

  this.latestPriceArr = []

  this.header_price = {}
  // socket_price: {}, //总价格
  this.socket_snap_shot_temp = {}
  this.snap_shot_timeout = null

  // 重新获取信息
  this.getScaleConfig();
  this.init(newValue);
  this.getDepth()  // 获取币安深度
  this.getAggTrades() //获取归集交易
  this.initTicket24Hr() // 获取24小时价格变动
  this.getLatestrice()// 获取币安最新价格
  this.getMarkPricesAndCapitalRates()//获取币安最新标记价格和资金费率
  // this.initGetDatas();

  // 各小版块加载中
  this.trade_loading = true;

  this.$router.push({name: 'tradingHall', query: {symbol: newValue}});
}

// 组件卸载前取消订阅
root.beforeDestroy = function () {
  // this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
}
// 组件卸载取消订阅
root.destroyed = function () {
  //加进window的方法当跳出此页面后需要销毁哦
  window.onresize = null;
}
// 要跳划转页面
root.methods.goToTransfer = function () {
  window.location.replace(this.$store.state.contract_url + 'index/asset/contractRecord?propertyType=propertyAssets');
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
