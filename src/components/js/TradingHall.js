import axios from "axios";
import tradingHallData from "../../dataUtils/TradingHallDataUtils";

const root = {}
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
    positionModeFirst:'doubleWarehouseMode',//单仓模式 singleWarehouseMode 双仓模式 doubleWarehouseMode
    positionModeSecond:'openWarehouse',//单仓 singleWarehouse 开仓 openWarehouse 平仓 closeWarehouse
    pendingOrderType:'limitPrice',//限价 limitPrice 市价 marketPrice 限价止盈止损 limitProfitStopLoss 市价止盈止损 marketPriceProfitStopLoss

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
    socket_tick_arr: [], // 第一次tick推送 数组，用作全站成交
    socket_tick_obj: {}, // 单个成交推送 对象，用作全站成交

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

    //仓位模式Start
    popWindowPositionModeBulletBox: false, //仓位模式弹框
    cardType:1, //仓位模式选择初始值
    //仓位模式End

    //保证金模式Strat
    popWindowSecurityDepositMode: false,
    //保证金模式End

    //调整杠杆 Strat
    popWindowAdjustingLever: false,
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

    // 计算器弹框 begin
    openCalculator:false
    // 计算器弹框 end
  }
}

root.created = function () {
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
  !this.currency_list[this.symbol] ? this.getCurrencyList() : (this.loading = false);

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

}

root.mounted = function () {
  // 初始化所有信息
  let self = this;
  // setTimeout(this.init, 1000);
  this.init();

  // 更改query
  this.$router.push({name: 'tradingHall', query: {symbol: this.$store.state.symbol}});

  var that = this
  window.onresize = ()=>{
    that.watchScreenWidth()
  }

  // window.onresize = function () {
  //     window.screenWidth = document.body.clientWidth
  //     that.screenWidth = window.screenWidth
  //
  //     // console.log("this.screenWidth====watch=======",that.screenWidth);
  //     // that.screenWidth = that.screenWidth == oldValue ? newValue : newValue;
  //
  //
  // }
}

// 初始化各子组件
root.methods = {}

root.methods.openSecurityDepositMode = function () {
  this.popWindowSecurityDepositMode = true
}
root.methods.openCalculatorWindow = function () {
  this.openCalculator = true
}
// 关闭弹窗
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
  this.socket_tick_arr = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message) || [];
  this.socket_tick_obj = message instanceof Array && {} || (message.symbol === this.$store.state.symbol && message);
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
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});

  this.$socket.on({key: 'connect',bind: this,callBack: ()=>{
      // console.log("监听socket连接状态，成功，订阅消息")
      this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
      this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});
      }
    }
  )

  // this.$socket.on({key: 'reconnect',bind: this,callBack: (data)=>{
  //   console.log("监听socket连接状态，重连",data)
  // }})

  // k线
  this.$socket.on({
    key: 'topic_bar', bind: this, callBack: (message) => {
      if (this.$store.state.symbol == message.symbol) {
        this.topic_bar = message;
      }
    }
  })
  // console.log("topic_bar 订阅成功")

  // 获取所有币对价格
  this.$socket.on({
    key: 'topic_tick', bind: this, callBack: (message) => {
      this.socket_tick = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message[0]) || (message.symbol === this.$store.state.symbol && message)
      //当this.socket_tick为false的时候，给一个默认值{}
      if(!this.socket_tick){
        this.socket_tick = {}
      }
      // this.socket_tick = message instanceof Array && message[0] || message;
      this.socket_tick_arr = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message) || [];
      this.socket_tick_obj = message instanceof Array && {} || (message.symbol === this.$store.state.symbol && message || {});
      // 取消板块loading
      this.trade_loading = false;
    }
  })
  // console.log("topic_tick 订阅成功")


  // 获取深度图信息 左侧列表
  this.$socket.on({
    key: 'topic_snapshot', bind: this, callBack: (message) => {
      // console.log(this.$store.state.symbol+"----------------11111111111111-------------------"+message.symbol);
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
  })
  // console.log("topic_snapshot 订阅成功")

  // 接收所有币对实时价格
  this.$socket.on({
    key: 'topic_prices', bind: this, callBack: (message) => {
      this.socket_price = message;
      // console.warn('this is topic_price',message)
      // let obj = {}
      // obj[this.$store.state.symbol] = [0,0,0,0,0,0]
      // this.socket_price = this.$globalFunc.mergeObj(message,obj)

      // 取消板块loading
      this.trade_loading = false;
    }
  })
  // console.log("topic_prices 订阅成功")
}


// 获取bt奖励比率
root.methods.getBtReward = function () {
  /*let that = this
  this.$globalFunc.getBTRegulationConfig(this, (data) => {
    this.btRewardReady = true
    this.loading = !(this.stateReady && this.BDBReady && this.btRewardReady && (this.stateStatusReady || !this.isMobile))

  })*/
}

// 初始化数据请求
root.methods.initGetDatas = function () {
  // 请求所有币对信息 right和header都需要此数据
  // this.getCurrencyList();

  // 根据当前币对请求买或卖列表
  this.getCurrencyBuyOrSaleList();

  // 请求btc->cny汇率，header需要
  this.getExchangeRate();

}



// 请求price
root.methods.getPrices = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getCurrencyLists
  })
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
  let self = this;
  this.getPrices();
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
  data.symbols.forEach(function (v, i) {
    self.symbol_config_times.push({name: v.name, startTime: v.startTime, endTime: v.endTime});
  });

}

// price接口数据返回
root.methods.re_getCurrencyLists = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.currency_list = this.$globalFunc.mergeObj(data, this.currency_list);
}

// 对symbol获取的数据进行处理，处理成 {symbol: [time, 1,2,3,4,5]}的格式
// 例如：{ETX_BTX:[1517653957367, 0.097385, 0.101657, 0.097385, 0.101658, 815.89]}
root.methods.symbolList_priceList = function (symbol_list) {
  let obj = {};
  let objs = symbol_list.symbols;
  objs.forEach((v, i) => {
    obj[v.name] = [0, 0, 0, 0, 0, 0];
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
//打开仓位模式
root.methods.turnOnLocationMode = function () {
  this.popWindowPositionModeBulletBox = true
}


//仓位模式Start
// 仓位模式
root.methods.popWindowClosePositionModeBulletBox = function () {
  this.popWindowPositionModeBulletBox = false
}
// 仓位模式选择
root.methods.positionModeSelected = function (cardType) {
  this.cardType = cardType
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
  console.log('交易类型切换',this.positionModeConfigs[this.positionModeFirst][this.positionModeSecond][this.pendingOrderType]['passiveDelegation']);
}
//交易类型切换 Start

//页面功能模块显示逻辑判断 Start
root.methods.isHasModule = function (type) {
  let isHas = this.positionModeConfigs[this.positionModeFirst][this.positionModeSecond][this.pendingOrderType][type]
  console.log(type,isHas);

  return isHas
}
//页面功能模块显示逻辑判断 End

//保证金模式 Strat
root.methods.popWindowCloseSecurityDepositMode = function () {
  this.popWindowSecurityDepositMode = false
}
//保证金模式 End

//调整杠杆 Strat
root.methods.popWindowCloseAdjustingLever = function () {
  this.popWindowAdjustingLever = false
}
// 处理滑动条显示框内容
root.methods.formatTooltip=(val)=>{
  return  val + 'X';
}
//调整杠杆 End


root.props = {}
// root.props.currency_list = {
//   type: Object,
//   default: {}
// }
// root.props.socket_tick = {
//   type: Object,
//   default: {}
// }
// root.props.socket_snap_shot = {
//   type: Object,
//   default: {}
// }
// root.props.socket_price = {
//   type: Object,
//   default: {}
// }
// root.props.btc_eth_rate = {
//   type: Object,
//   default: {}
// }
// root.props.buy_sale_list = {
//   type: Object,
//   default: {}
// }


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
root.computed.volume = function () {
  if (!this.mergeList[this.symbol]) return;
  let volume = this.$globalFunc.accFixed(this.mergeList[this.symbol][5], 0);
  return volume;
}

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
// 是否显示为蜜简介
root.computed.showSuperBeeIntroduction = function () {
  // if (this.specialSymbol[0].has(this.listenSymbol)) {
  //   return true
  // }
  return false
}
//页面功能模块显示逻辑配置信息
root.computed.positionModeConfigs = function () {
  let data = tradingHallData.positionModeConfigs;
  // console.log(data);
  return data
}


// 监听symbol 做一些操作
root.watch = {};

root.watch.isNowPrice = function (newValue, oldValue) {
  this.GET_RATE('');
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
  this.socket_tick_arr = [];
  this.socket_tick_obj = {};

  // this.buy_sale_list = {}//为了保证切换币对时价不显示0
  this.buy_sale_list.sellOrders = []
  this.buy_sale_list.buyOrders = []

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

// 如果切换市场的时候，在超级为蜜区，并且打开了为蜜资料
root.watch.showSuperBeeIntroduction = function (newValue, oldValue) {
  if (!newValue && oldValue && this.isNow == 3) {
    this.isNow = 0
  }
}

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


export default root
