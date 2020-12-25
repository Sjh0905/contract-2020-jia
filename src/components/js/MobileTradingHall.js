const root = {};

root.name = 'MobileTradingHall';

root.props = {};
root.props.symbol_config_times = {
  type: Array,
  default: function () {
    return []
  }}

root.computed = {}

root.watch = {}

root.methods = {}

root.components = {
  'Trade': resolve => require(['../vue/Trade'], resolve),
  'MobileMarket': resolve => require(['../mobileVue/MobileHomePageMarket'], resolve),
  'MobileStockCross': resolve => require(['../mobileVue/MobileStockCross'], resolve),
  'MobileHomePageMarketItem': resolve => require(['../mobileVue/MobileHomePageMarketItem'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'MobileMarketPrice': resolve => require(['../mobileVue/MobileMarketPrice'], resolve),
}

root.data = function () {
  return {
    // 精度参数
    baseScale: 0,
    quoteScale: 0,
    // 切换币对市场 0=btc, 1=eth
    currencyType: 0,

    // 货币市场列表
    currency_list: {},

    // socket推送数据
    topic_bar: {},
    socket_price: {},
    socket_snap_shot: {}, //深度图
    socket_tick: {}, //实时价格
    // 深度图中的price
    price: 0,
    //买卖列表
    buy_sale_list: {},

    // 当前币对是否可交易
    symbol_transaction: true,
    // symbol_transaction_diy: true,

    // 币对市场


    // 选中分区 主板区/超级为蜜区
    selectEdition: 0,
    selectMarket: ['ETH', 'USDT'], // 市场
    selectMarketChange: false, // 作用是使computed反应迅速

    // 市场顺序
    marketOrder: ['USDT', 'BTC', 'ETH'],
    clickTab: false, // 市场是否已经初始化


    market_list: [],
    select_name: '',

    // 当前选中哪个
    tradingTitle: '1分',
    tradingNum: '1',
    is_more: true,
    interval_btn_list: [{title: '分时'}, {title: '1分'}, {title: '5分'}, {title: '15分'}, {title: '30分'}, {title: '1小时'}, {title: '2小时'},{title: '4小时'},{title: '1天'},{title: '3天'}, {title: '1周'}],

    highPrice: '--', // 24小时最高价
    lowPrice: '--', // 24小时最低价
    volume: '--', // 24小时量
    priceChangePercent: '--', // 24涨幅
    markPrice: '', // 标记价格
    markPriceObj: {}, // 多币对标记价格
    latestPriceVal: '' ,   // 最新价格
    latestPriceArr: [],   // 最新价格数组，用于判断价格升降和盘口显示

    // 提示信息
    popType: 0,
    popText: '',
    popOpen: false,
    opening:false,
    opened:false,

    isDisplayMarket:false,
  }
}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 检验是否登录
root.computed.isLogin = function () {
  return this.$store.state.authState.userId;//这么写 APP里边登录后才会生效
}
// 特殊专区 0为超级蜜
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol && this.$store.state.specialSymbol || []
}

// 计算当前symbol
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
// 计算是否显示列表
root.computed.headerBoxFlag = function () {
  return this.$store.state.mobileTradingHallFlag;
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
}
// 实时价格
root.computed.isNowPrice = function () {

  let nowPrice = this.latestPriceArr[this.latestPriceArr.length-1]//这里不用容错，否则写成了 "0" 取不到this.latestPriceVal

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


// 市场列表
root.computed.marketList = function () {
  let storeMarketList = this.$store.state.marketList[this.selectEdition].slice(0)
  let ans = []
  this.marketOrder.forEach(v => {
    let i = storeMarketList.indexOf(v)
    if (i === -1) {
      return
    }
    ans.push(v)
    storeMarketList.splice(i, 1)
  })
  ans.push(...storeMarketList)
  return ans
}
// 2018-4-10 添加 start
root.computed.currencylist = function () {
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  // var [initO, key] = [{}, ""];

  let o = [];

  Object.keys(currencyList).sort().forEach(symbol => {
    let currency = symbol.split('_')[1];
    if (!currency || currency == 'ENX') return;//TODO：由于H5没有做分区，所以暂时屏蔽ENX选区的币对
    let initData = {};
    initData.name = symbol;
    [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]
    // // 如果是超级为蜜区
    // if (this.specialSymbol[0] && this.specialSymbol[0].has(symbol)) {
    //   !o[1] && (o[1] = [])
    //   o[1].push(initData)
    //   return
    // }
    // // 如果不是
    // !o[0][currency] && (o[0][currency] = []);
    // o[0][currency].push(initData);
    o.push(initData);
  })
  return o//.sort((a,b)=>!b.open && b.open - a.open)
}

// 选中的市场数据
root.computed.computedMarketList = function () {
  // console.log(this.currencylist)
  return this.currencylist || []
}

// 服务器时间
root.computed.serverTime = function () {
  return this.$store.state.serverTime;
}

root.watch.symbol = function (newValue, oldValue) {
  // console.log("==========root.watch.symbol===========",newValue,oldValue)

  if (newValue == oldValue) return;

  //切换symbol清空socket推送
  this.socket_tick = {}; //实时价格
  this.socketTickObj = {}

  this.buy_sale_list = {}//接口深度图
  this.buy_sale_list.asks = []
  this.buy_sale_list.bids = []

  this.latestPriceArr = []
  this.header_price = {}

  this.socket_snap_shot_temp = {}
  this.snap_shot_timeout = null

  // this.price = 0;

  // this.initGetDatas();
  // 获取不同货币对精度
  // this.getScaleConfig();

  this.initSocket();

  this.getScaleConfig();
  this.getDepth();
  this.initTicket24Hr();
  this.getLatestrice();
  this.getMarkPricesAndCapitalRates();

}

root.watch.serverTime = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // this.SYMBOL_ENTRANSACTION();
}


root.watch.currencylist = function (newValue, oldValue) {
  // if (!this.clickTab) this.initTab()
}

root.created = function () {
  if(this.$route.query.type && !this.userId) {
    this.$router.push({'path':'/index/InvitOpenContract'})
  }
  // 海报进来的要调取这个接口
  if(this.$route.query.type){
    // this.invitUid()
    this.invitPoster()
  }
  this.$route.params.source === 'mobileTradingHallDetail' && this.$store.commit('SET_HALL_SYMBOL', false)

  // 修改header title标题
  this.$store.commit('changeMobileHeaderTitle', '交易大厅');

  // console.log('跳转进入此处',this.$route.query)
  if (this.$route.query) {
    // console.log('跳转进入此处',this.$route.query.symbol)
    // this.currencyType = this.$route.query.symbol
  }

  // 获取不同货币对精度
  this.getScaleConfig();
  // 订阅socket
  this.initSocket();
  // 获取深度图 用来渲染header的price信息

  // 获取币安最新价格
  this.getLatestrice()
  // 获取币安24小时价格变动接口
  this.initTicket24Hr()
  // 获取币安最新标记价格和资金费率
  this.getMarkPricesAndCapitalRates()
  // 根据当前币对请求买或卖列表
  this.getDepth();
  // 获取实时成交归集交易
  this.getAggTrades();

}

/*// 判断当前币是否可交易
root.methods.SYMBOL_ENTRANSACTION = function () {
  // console.log("=====root.methods.SYMBOL_ENTRANSACTION========>1",this.symbol_transaction)
  let self = this;
  // console.log("=====root.methods.SYMBOL_ENTRANSACTION========>1.1",this.symbol_config_times.length)
  if (this.symbol_config_times.length < 1) return;
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
  // console.log("=====root.methods.SYMBOL_ENTRANSACTION========>3",this.symbol_transaction)
}*/
// 关闭弹出框
root.methods.closePop = function () {
  this.popOpen = false;
}
root.methods.invitUid = function () {
  let uid
  if(this.$route.query.uid) {
    uid = Number.parseInt(this.$route.query.uid)
  }
  if(!this.$route.query.uid) {
    uid = 0
  }
  return uid
}
// 若是从扫描海报过来，则调用此接口
root.methods.invitPoster = function () {
  this.$http.send('POST_CHECK_OPEN_POSTER',{
    bind: this,
    params:{
      inviteduserId: this.invitUid(),
    },
    callBack: this.re_invitPoster,
    errorHandler: this.error_invitPoster,
  })
}
root.methods.re_invitPoster = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if(!data && !data.data) return
  if(data.code == 1){
    this.popOpen = true;
    this.popType = 0;
    this.popText = '请您登录'
    return
  }
  if(data.code == 2){
    this.popOpen = true;
    this.popType = 0;
    this.popText = '合约开通失败'
    return
  }
  if(data.code == 3){
    this.popOpen = true;
    this.popType = 0;
    this.popText = '合约开通邀请关系建立异常'
    return
  }
  if(data.code == 4){
    this.popOpen = true;
    this.popType = 0;
    this.popText = '不能自己邀请自己哦'
    return
  }
  if(data.code == 200) {
    this.opening = data.data.opening
    this.opened = data.data.opened
    return
  }
  if(!(this.opening || this.opened)) {
    this.popOpen = true;
    this.popType = 0;
    this.popText = '开通合约失败，请重新操作'
    this.$router.push('/index/InvitOpenContract')
  }
}
root.methods.error_invitPoster = function (err) {
  console.warn('err===',err)
}

// 点击切换版块下的市场
root.methods.changeMarket = function (market) {
  this.selectMarket[this.selectEdition] = market
  this.selectMarketChange = !this.selectMarketChange
  this.clickTab = true
}

// 选中的市场
root.methods.selectedMarket = function (item) {
  return this.selectMarket[this.selectEdition] === item
}

root.methods.changeSelectEdition = function (num) {
  if (parseInt(num) === this.selectEdition) return
  this.selectEdition = parseInt(num)
  this.clickTab = true
}

// 初始化socket
root.methods.initSocket = function () {
  let that = this;
  // 订阅某个币对的信息
  // this.$socket.emit('UNSUBSCRIBE', {symbol: this.$store.state.symbol});
  // this.$socket.emit('SUBSCRIBE', ["btcusdt@depth"]);

  //由于H5没有在监听切换币对时push新路由，需要解绑vue组件在SocketHandler注册的回调函数
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


// 获取精度
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    })
}

// 展示货币对列表
root.methods.changeHeaderBoxFlag = function () {
  this.$store.commit('changeMobileTradingHallFlag', false);
}

// 隐藏货币对列表
root.methods.closeHeaderBoxFlag = function () {
  this.$store.commit('changeMobileTradingHallFlag', true)
}

// 切换币对市场
root.methods.changeCurrencyMarket = function (type, name) {
  this.currencyType = type;
  this.select_name = name;
}


root.methods.toDeal = function () {
  if(this.$route.query.isApp && !this.isLogin) {
    window.postMessage(JSON.stringify({
      method: 'toLogin'
    }))
    return
  }

  // this.$router.go(-1);
  this.$router.push('/index/mobileTradingHallDetail')
}

// view跳转 跳到买或者卖
root.methods.toBuyOrSaleView = function (type) {
  this.$store.commit('BUY_OR_SALE_TYPE', type);
  // !!this.$store.state.authMessage.userId ? this.$router.push('/index/mobileTradingHallDetail') : this.$router.push('/index/sign/login');
  this.$router.push('/index/mobileTradingHallDetail')
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

  var tickerData = data.find(v=>v.symbol === this.capitalSymbol)
  if(tickerData){
    this.highPrice = tickerData.highPrice || '--'
    this.lowPrice = tickerData.lowPrice || '--'
    this.volume = tickerData.volume || '--'
    this.priceChangePercent = tickerData.priceChangePercent || '--'
  }

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
    query:{
      symbol:this.sNameList.toString(),
    },
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

root.methods.changeMarketStatus = function(){
  this.isDisplayMarket = !this.isDisplayMarket;
}

// 2018-4-17 add tradingView选择
root.methods.SELECT_MORE = function () {
  this.is_more = !this.is_more;
}

root.methods.SELECT_INTEVAL = function (k, name) {
  // console.log("name1111111-----------"+name);
  this.SELECT_MORE();
  this.tradingTitle = name;
}

root.methods.beforeDestroy = function () {
  // this.$socket.emit('unsubscribe', {symbol: this.symbol});
}

/*---------------------- 跳入到首页面页面 ---------------------*/
root.methods.gotoNewH5homePage = function () {
  // this.$router.push({name: 'NewH5homePage'});
  window.location.replace(this.$store.state.contract_url + 'index/newH5homePage');
}
/*---------------------- 跳入到市场页面 ---------------------*/
root.methods.gotoShichang = function () {
  // this.$router.push({name: 'mobileTradingHall'});
  window.location.replace(this.$store.state.contract_url + 'index/mobileTradingHall');
}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods.gotoZichan = function () {
  // this.$router.push({name: 'MobileAssetRechargeAndWithdrawals'});
  window.location.replace(this.$store.state.contract_url + 'index/MobileAssetRechargeAndWithdrawals');
}

/*---------------------- 跳入到合约页面 ---------------------*/
root.methods.gotoContract = function () {
  this.$router.push({name: 'mobileTradingHallDetail'});
}

/*---------------------- 跳入到交易页面 ---------------------*/
root.methods.gotoJiaoyi = function () {
  // this.$router.push({name: 'mobileTradingHallDetail'});
  window.location.replace(this.$store.state.contract_url + 'index/mobileTradingHallDetail');
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

// 买卖提交
// root.methods.tradeMarket = function () {
//   if (!this.symbol_transaction_diy) return;
//   // 按钮添加点击效果
//   this.BTN_CLICK();
//
//   let txt = !this.orderType ? this.lang == 'CH' ? '买入' : 'Buy' : this.lang == 'CH' ? '卖出' : 'Sall';
//   // 判断有没有登录
//   if (!this.$store.state.authMessage.userId) {
//     this.$router.push({name: 'login'})
//     return
//   }
//   // 暂未开放
//   if (!this.symbol_transaction) return;
//   // 判断实名认证
//   // if (!this.$store.state.authState.identity) {
//   // 	this.$router.push('/index/personal/auth/authenticate')
//   // 	return
//   // }
//
//   // 判断是否绑定邮箱，如果没有绑定，提示绑定
//   if (!this.bindEmail) {
//     this.$eventBus.notify({key: 'BIND_EMAIL_POP'})
//     return
//   }
//   // 判断是否绑定谷歌或手机，如果都没绑定
//   if (!this.bindGa && !this.bindMobile) {
//     this.$eventBus.notify({key: 'BIND_AUTH_POP'})
//     return
//   }
//
//
//   if (!this.orderType && Number(this.price * this.amount) > Number(this.available)) {
//     // alert('您的持仓不足')
//     this.popText = this.lang == 'CH' ? '您的余额不足,请充值' : 'Insufficient funds. Please make a deposit first.';
//     this.popType = 0;
//     this.promptOpen = true;
//     return
//   }
//   if (this.orderType && Number(this.amount) > Number(this.available)) {
//     // alert('您的持仓不足')
//     this.popText = this.lang == 'CH' ? '您的余额不足,请充值' : 'Insufficient funds. Please make a deposit first.';
//     this.popType = 0;
//     this.promptOpen = true;
//     return
//   }
//   // 添加price、amount不为数字和为0时的校验
//   if (!this.orderType && this.price == 0) {
//     this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '价' : 'Invalid price';
//     this.popType = 0;
//     this.promptOpen = true;
//     return
//   }
//   if (!this.orderType && this.amount == 0) {
//     this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '量' : 'Invalid amount';
//     this.popType = 0;
//     this.promptOpen = true;
//     return
//   }
//   if (this.orderType && this.price == 0) {
//     this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '价' : 'Invalid price';
//     this.popType = 0;
//     this.promptOpen = true;
//     return
//   }
//   if (this.orderType && this.amount == 0) {
//     this.popText = this.lang == 'CH' ? '请输入正确的' + txt + '量' : 'Invalid amount';
//     this.popType = 0;
//     this.promptOpen = true;
//     return
//   }
//
//   let params = {
//     symbol: this.$store.state.symbol,
//     price: this.price,
//     amount: this.amount,
//     type: this.orderType,
//     source: 'WEB', //访问来源
//     // customFeatures: this.fee ? 65536 : 0
//   };
//   //燃烧抵扣不再需要
//   // if (this.fee) {
//   //   Object.assign(params, {customFeatures: 65536});
//   // }
//   // 如果当前是BTC市场的话，price*amount<0.001不允许提交
//   // 如果当前是ETH市场的话，price*amount<0.01不允许提交
//   // 如果当前是BDB市场的话，price*amount<100不允许提交
//   let turnover = Number(this.price) * Number(this.amount);
//   let miniVolume;
//   let tradingParameters = this.$store.state.tradingParameters;
//   for (var i = 0; i < tradingParameters.length; i++) {
//     let item = tradingParameters[i];
//     let name = item.name;
//     if (name == this.$store.state.symbol) {
//       miniVolume = item.miniVolume;
//     }
//   }
//   if (Number(turnover) < Number(miniVolume)) {
//     this.popType = 0;
//     this.popText = this.lang == 'CH' ? '交易额不能小于' + miniVolume : 'Minimum trading amount' + miniVolume;
//     this.promptOpen = true;
//     return;
//   }
//   // console.log(params);
//   // return;
//   this.$http.send('TRADE_ORDERS',
//     {
//       bind: this,
//       params: params,
//       callBack: this.Callback,
//       errorHandler: this.RE_ERROR
//     })
//   // this, {symbol:this.$store.state.symbol + '_BTC',price:this.price,amount:this.amount,orderType:this.orderType}, this.Callback)
//   // symbol：货币对，如BTC_USD
//   // price：价格
//   // amount:数量
//   // orderType：类型：BUY_LIMIT 定价买  定价卖 SELL_LIMIT
// }

export default root;
