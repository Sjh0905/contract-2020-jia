const root = {};

root.name = 'MobileTradingHall';

root.props = {};
root.props.symbol_config_times = {
  type: Array,
  default: function () {
    return []
  }
}
root.props.changeMarketStatus = {
  type:Function,
  default:()=>{}
}

root.computed = {}

root.watch = {}

root.methods = {}

root.components = {
  // 'Trade': resolve => require(['../vue/Trade'], resolve),
  // 'MobileMarket': resolve => require(['../mobileVue/MobileHomePageMarket'], resolve),
  // 'MobileStockCross': resolve => require(['../mobileVue/MobileStockCross'], resolve),
  // 'MobileHomePageMarketItem': resolve => require(['../mobileVue/MobileHomePageMarketItem'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
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
    marketSymbolList:[],

    // socket推送数据
    socket24hrTicker:[],//symbol24小时ticker信息
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

    highPrice: '', // 24小时最高价
    lowPrice: '', // 24小时最低价
    volume: '', // 24小时量
    priceChangePercent: '', // 24涨幅
    markPrice: '', // 标记价格
    latestPriceVal: '' ,   // 最新价格
    latestPriceArr: [],   // 最新价格数组，用于判断价格升降和盘口显示

    // 提示信息
    popType: 0,
    popText: '',
    popOpen: false,
    opening:false,
    opened:false,

    mSymbolListTemp:[],//市场存储
    mSymbolListPrice:{},//市场价格列表存储
    lastTime:0
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
﻿//不加下划线币对集合
root.computed.sNameList = function () {
  return this.$store.state.sNameList || []
}
﻿// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {
      quoteScale: v.quoteScale,
      baseScale: v.baseScale
    };
  })
  return quoteScale_obj;
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

  let nowPrice = this.latestPriceArr[this.latestPriceArr.length-1] || '0'

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
﻿// ajax获取的数据
root.computed.mSymbolList = function () {

  //之前注释：mSymbolListTemp.length为0说明首次进入，mSymbolList取marketSymbolList的值,默认不刷新页面情况下币对个数不会变化，mSymbolListTemp.length>0就一直取本身
  //最新理解：mSymbolListTemp.length ≠ sNameList.length 说明没有缓存所有币对，取marketSymbolList的值
  let mSymbolList = this.mSymbolListTemp.length > this.sNameList.length - 1 ? this.mSymbolListTemp : this.marketSymbolList,
    socket24hrTicker = this.socket24hrTicker.filter(v => this.sNameList.includes(v.s))

  //默认接口不会调用多次，第一次进入后socket还没推送
  if(socket24hrTicker.length == 0 && mSymbolList.length >= 0){

    mSymbolList > 0 && (mSymbolList = this.compareSymbolPrePrice(mSymbolList))
    this.mSymbolListTemp = mSymbolList;
    return mSymbolList;
  }

  //收到socket推送但是接口没返回的情况，很少
  if(socket24hrTicker.length > 0 && mSymbolList.length == 0){
    socket24hrTicker = this.compareSymbolPrePrice(socket24hrTicker)
    this.mSymbolListTemp = socket24hrTicker;
    return socket24hrTicker;
  }

  //由于只有发生变化的ticker更新才会被推送，默认为socket24hrTicker.length <  mSymbolList.length,外层循环少的
  // if(socket24hrTicker.length > 0 && mSymbolList.length > 0) {
  for (let i = 0; i < socket24hrTicker.length; i++) {
    let sItem = socket24hrTicker[i];
    for (let j = 0; j < mSymbolList.length; j++) {
      let v = mSymbolList[j];

      if(!v.priceChangeArr){
        v.priceChangeArr = [v.c]
        // v.priceStep = 0
      }

      if(v.s == sItem.s){
        // v = this.$globalFunc.mergeObj(v, sItem)

        v.c = sItem.c
        v.P = sItem.P
        v.p = sItem.p

        v.priceChangeArr.push(v.c);
        let len = v.priceChangeArr.length
        let step = len - 5
        if(step > 0 ){
          v.priceChangeArr.splice(0,step)
          len = v.priceChangeArr.length
        }
        v.priceStep = this.accMinus(v.priceChangeArr[len-1] || 0, v.priceChangeArr[len-2] || 0)

        // v.s == "BTCUSDT" && console.log('this is priceChangeArr priceStep',v.s,v.priceChangeArr,v.priceStep,v.priceStep>0);
      }
    }
  }
  // }

  this.mSymbolListTemp = mSymbolList;

  return mSymbolList;
}
﻿//价格处理
root.methods.compareSymbolPrePrice = function (list) {
  if(!Array.isArray(list) || list.length == 0)return []
  list.map(v=>{
    if(!v.priceChangeArr){
      v.priceChangeArr = [v.c]
      // v.priceStep = 0
    }

    v.priceChangeArr.push(v.c);
    let len = v.priceChangeArr.length
    let step = len - 5
    if(step > 0 ){
      v.priceChangeArr.splice(0,step)
      len = v.priceChangeArr.length
    }
    v.priceStep = v.priceChangeArr[len-1] - v.priceChangeArr[len-2]
  })

  return list;
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
  this.$socket.emit('unsubscribe', {symbol: oldValue});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});
  // 2018-2-9 切换symbol清空socket推送
  this.socket_snap_shot = {}; //深度图
  this.socket_tick = {}; //实时价格

  this.buy_sale_list = {}//接口深度图

  this.price = 0;

  // this.initGetDatas();
  // 获取不同货币对精度
  // this.getScaleConfig();

  // this.initSocket();

  this.getScaleConfig();


}

root.watch.serverTime = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // this.SYMBOL_ENTRANSACTION();
}


root.watch.currencylist = function (newValue, oldValue) {
  // if (!this.clickTab) this.initTab()
}

root.created = function () {

  this.$route.params.source === 'mobileTradingHallDetail' && this.$store.commit('SET_HALL_SYMBOL', false)

  // 修改header title标题
  this.$store.commit('changeMobileHeaderTitle', '交易大厅');

  // console.log('跳转进入此处',this.$route.query)
  if (this.$route.query) {
    // console.log('跳转进入此处',this.$route.query.symbol)
    // this.currencyType = this.$route.query.symbol
  }

  // 获取币安最新价格
  this.getLatestrice()
  // 获取币安24小时价格变动接口
  this.initTicket24Hr()

  // 获取不同货币对精度
  // this.getScaleConfig();
  // 订阅socket
  this.initSocket();

}

// 阻止关闭弹出框
root.methods.stopChangeMarketStatus = function (e) {
 /* e = e || window.event;
  if(e.stopPropagation) { //W3C阻止冒泡方法
    e.stopPropagation();
  } else {
    e.cancelBubble = true; //IE阻止冒泡方法
  }*/
}

// 关闭弹出框
root.methods.closePop = function () {
  this.popOpen = false;
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

  // let subscribeSymbol = this.$store.state.subscribeSymbol;
  let subscribeSymbol = this.$globalFunc.toOnlyCapitalLetters(this.$store.state.symbol);
  /*// 获取最新标记价格
  this.$socket.on({
    key: 'markPriceUpdate', bind: this, callBack: (message) => {
      if(message.s === subscribeSymbol){
        message.p > 0 && (this.markPrice = message.p)// 标记价格
        message.r > 0 && (this.lastFundingRate = message.r)// 资金费率
        message.T > 0 && (this.nextFundingTime = message.T)//下个资金时间
      }
    }
  })*/

  // 获取币安24小时价格变动
  this.$socket.on({
    key: '24hrTicker', bind: this, callBack: (message) => {
      // console.log('24hrTicker is ===',message);

      this.socket24hrTicker = message;
     /* var tickerData = message.find(v=>v.s === subscribeSymbol)

      if(tickerData){
        tickerData.P && (this.priceChangePercent = tickerData.P)// 24小时价格变化(百分比)
        tickerData.h > 0 && (this.highPrice = tickerData.h)// 24小时内最高成交价
        tickerData.l > 0 && (this.lowPrice = tickerData.l)// 24小时内最低成交加
        tickerData.v && (this.volume = tickerData.v)// 24小时内成交量
      }*/
    }
  })

  /*// 获取深度图信息
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
  })*/

}


/*// 获取精度
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    })
}*/

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

export default root;
