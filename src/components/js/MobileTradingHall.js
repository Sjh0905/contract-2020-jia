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
    // 增减判断
    direction: '',
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
    tradingTitle: '日线',
    is_more: true,
    interval_btn_list: [{title: '分时'}, {title: '1分'}, {title: '5分'}, {title: '15分'}, {title: '30分'}, {title: '1小时'}, {title: '4小时'}, {title: '日线'}],

    // KKPriceRange:[]
  }
}

// 特殊专区 0为超级为蜜
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol && this.$store.state.specialSymbol || []
}

// 计算当前symbol
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
// 计算是否显示列表
root.computed.headerBoxFlag = function () {
  return this.$store.state.mobileTradingHallFlag;
}
// 实时价格
root.computed.priceNow = function () {
  let list = this.mergeList[this.symbol];
  let priceObj = this.$globalFunc.mergeObj(this.socket_tick, {price: this.price});

  // console.log('this is price',priceObj);

  return priceObj.price || 0;
}
// 汇率
root.computed.rate = function () {
  let self = this;
  let symbol = this.symbol.split('_')[1];
  for (let key in this.socket_price) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = this.socket_price[key][4];
    }
  }
  switch (symbol) {
    case 'BTC':
      return this.$store.state.exchange_rate.btcExchangeRate || 0
      break;
    case 'ETH':
      return this.$store.state.exchange_rate.ethExchangeRate || 0
      break;
    case 'BDB':
      return (this.$store.state.exchange_rate.ethExchangeRate * this.bdb_rate) || 0
      break;
    case 'USDT':
      return 1;
      break;
    default:
      return 0;
      break;
  }
}
// 折合人民币或美元
root.computed.cny = function () {
  let close = this.priceNow || 0;
  return ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (close * this.rate), 2));

  // if (this.$store.state.lang === 'CH') {
  //   return ('￥' + (6.7 * (close * this.rate)).toFixed(2));
  // } else {
  //   return ('$' + ((close * this.rate)).toFixed(2));
  // }
  // if (this.$store.state.lang === 'EN') {
  //   return ('$' + ((close * this.rate)).toFixed(2));
  // }
}

// 20180828 是否免费
root.computed.reduce_list = function () {
  let symbol_list = this.$store.state.reduce_fee;
  let ans = this.selectMarketChange
  let currentMarketList = this.currencylist[this.selectEdition]
  let reduce_list = [];

  symbol_list.forEach(v => {
      if (!v.feeDiscount) {
        return
      }
      let market = v.name && v.name.split('_')[1]
      if (!market) return
      let marketArr = currentMarketList[market]
      if (!marketArr) return
      for (let i = 0; i < marketArr.length; i++) {
        if (marketArr[i].name === v.name && reduce_list.indexOf(market) == '-1') {
          reduce_list.push(market)
          break;
        }
      }
    }
  )

  return reduce_list;
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

// // 2018-4-10 添加 start
// root.computed.currencylist = function () {
//   let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
//   // var [initO, key] = [{}, ""];
//
//   let o = [{}, []];
//
//   Object.keys(currencyList).sort().forEach(symbol => {
//     let currency = symbol.split('_')[1];
//     if (!currency) return;
//     let initData = {};
//     initData.name = symbol;
//     [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]
//     // 如果是超级为蜜区
//     if (this.specialSymbol[0] && this.specialSymbol[0].has(symbol)) {
//       !o[1] && (o[1] = [])
//       o[1].push(initData)
//       return
//     }
//     // 如果不是
//     !o[0][currency] && (o[0][currency] = []);
//     o[0][currency].push(initData);
//   })
//   return o
// }
//
// // 选中的市场数据
// root.computed.computedMarketList = function () {
//   let ans = this.selectMarketChange
//   if (this.selectEdition === 0) {
//     // console.log('computedMarket',this.currencylist[0][this.selectMarket[this.selectEdition]])
//     return this.currencylist[0][this.selectMarket[this.selectEdition]] || []
//   }
//   // console.log('computedMarket',this.currencylist[1])
//   return this.currencylist[1] || []
// }
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

// 24小时涨跌/最高/最低价格/成交量/的数据源
root.computed.mergeList = function () {
  let list = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  // console.log('list:', list)
  !!list[this.symbol] ? list : (list[this.symbol] = [0, 0, 0, 0, 0, 0]);
  return list;
}
// 24小时涨跌
root.computed.diff24 = function () {
  // let diff = this.mergeList[this.symbol][4] - this.mergeList[this.symbol][1];
  let diff = this.priceNow - Number(this.mergeList[this.symbol][1])
  return this.$globalFunc.accFixed(diff, this.quoteScale);
  // return diff.toFixed(8);
}
// 24小时涨跌百分比 收盘-开盘/开盘
root.computed.diff24Ratio = function () {
  // let diff = ((this.mergeList[this.symbol][4] - this.mergeList[this.symbol][1]) / (this.mergeList[this.symbol][1] || 1) * 100).toFixed(2);
  // return diff;
  let now_price = this.priceNow || 0;
  let diff = (Number(now_price) - Number(this.mergeList[this.symbol][1])) / Number(this.mergeList[this.symbol][1]);
  if (this.mergeList[this.symbol][1] == 0) {
    return 0
  } else {
    return this.$globalFunc.accFixed(diff * 100, 2);
  }
}
// 24小时最低价
root.computed.low24 = function () {
  let low = Math.min(this.mergeList[this.symbol][3], this.priceNow || 10000);
  return this.$globalFunc.accFixed(low, this.quoteScale);
}
// 24小时最高价
root.computed.high24 = function () {

  let high = Math.max(this.mergeList[this.symbol][2], this.priceNow);

  return this.$globalFunc.accFixed(high, this.quoteScale);
}
// 24小时成交量
root.computed.volume = function () {
  let volume = this.mergeList[this.symbol][5];
  return this.$globalFunc.accFixed(volume, 0);
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

  // 重新拉取price
  // this.getDepthInfo();
  // this.initGetDatas();
  // 获取不同货币对精度
  // this.getScaleConfig();

  this.initSocket();

  this.getHeaderInfo();
  // 根据当前币对请求买或卖列表
  // this.getCurrencyBuyOrSaleList();
  // this.getDepthInfo();
  // 请求btc->cny汇率，header需要
  this.getExchangeRate();

  this.getCurrencyBuyOrSaleList();
  this.getScaleConfig();


}

// 判断选中的是哪个市场  18-4-9 新加
// root.watch.currencylist = function (newValue, oldValue) {
//   let market = this.select_name || this.symbol.split('_')[1];
//   for (var i = 0; i < newValue.length; i++) {
//     let name = newValue[i].name;
//     if (market == name) {
//       this.currencyType = i;
//     }
//   }
// }

root.watch.serverTime = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.SYMBOL_ENTRANSACTION();
}


root.watch.currencylist = function (newValue, oldValue) {
  if (!this.clickTab) this.initTab()
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

  // 获取不同货币对精度
  this.getScaleConfig();
  // 拉取汇率并存到store  state.exchange_rate
  this.getExchangeRate();
  // 获取货币对列表
  this.getHeaderInfo();
  // 订阅socket
  this.initSocket();
  // 获取深度图 用来渲染header的price信息
  // this.getDepthInfo();

  // 根据当前币对请求买或卖列表
  this.getCurrencyBuyOrSaleList();

  // this.getKKPriceRange();

}





//
// // 获取grc交易价格区间
// root.methods.getKKPriceRange = function () {
//   this.$http.send('GRC_PRICE_RANGE',
//     {
//       bind: this,
//       callBack: this.re_getKKPriceRange,
//       errorHandler: this.error_getKKPriceRange
//     })
// }
// // 获取grc交易价格区间成功
// root.methods.re_getKKPriceRange = function (data) {
//   console.log('获取grc交易价格区间成功',data);
//   if(!data || !data.kkPriceRange)return
//   this.KKPriceRange = data.kkPriceRange;
// }
// // 获取grc交易价格区间报错
// root.methods.error_getKKPriceRange = function () {
//   console.log('获取grc交易价格区间报错');
// }





// 判断当前币是否可交易
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

// 初始化订阅socket
root.methods.initSocket = function () {
  // 订阅某个币对的信息
  this.$socket.emit('unsubscribe', {symbol: this.symbol});
  this.$socket.emit('subscribe', {symbol: this.symbol});
  // 接收所有币对实时价格
  this.$socket.on({
    key: 'topic_prices', bind: this, callBack: (message) => {
      this.socket_price = message;
      // console.log('price', message)
      // let obj = {}
      // obj[this.symbol] = [0,0,0,0,0,0]
      // this.socket_price = this.$globalFunc.mergeObj(message,obj)
    }
  })

  // 获取所有币对价格
  this.$socket.on({
    key: 'topic_tick', bind: this, callBack: (message) => {
      this.socket_tick = message instanceof Array && (message[0]['symbol'] === this.$store.state.symbol && message[0]) || (message.symbol === this.$store.state.symbol && message)
      // this.socket_tick = message instanceof Array && message[0] || message;
      this.direction = this.socket_tick.direction;
    }
  })

  // 获取深度图信息 左侧列表
  this.$socket.on({
    key: 'topic_snapshot', bind: this, callBack: (message) => {
      // console.log('this is message',message)
      if (this.$store.state.symbol == message.symbol) {
        this.socket_snap_shot = message;
      }
    }
  })

  this.$socket.on({
    key: 'topic_bar', bind: this, callBack: (message) => {
      if (this.$store.state.symbol == message.symbol) {
        this.topic_bar = message;
      }
    }
  })
}

root.methods.initTab = function () {
  for (let i = 0; i < this.currencylist.length; i++) {
    if (!this.currencylist[i]) continue
    for (let j in this.currencylist[0]) {
      let marketList = this.currencylist[i][j]
      if (!marketList) continue
      for (let k = 0; k < marketList.length; k++) {
        if (marketList[k].name === this.symbol) {
          this.selectEdition = i;
          this.selectMarket[i] = marketList[k].name.split('_')[1]
          return
        }
      }
    }
    this.selectEdition = 1
  }
}

root.methods.beforeDestroy = function () {
  this.$socket.emit('unsubscribe', {symbol: this.symbol});
}

// 获取深度图，用来渲染header的price信息
root.methods.getDepthInfo = function () {
  this.$http.send("DEPTH", {
    bind: this, query: {symbol: this.$store.state.symbol}, callBack: this.RE_DEPTH
  })
}

root.methods.RE_DEPTH = function (data) {

  if(data.symbol != this.symbol)this.price = 0

  this.price = data.price;
}

// 获取列表信息
root.methods.getHeaderInfo = function () {
  this.$http.send('COMMON_SYMBOLS', {
    bind: this,
    callBack: this.re_getCurrencyList
  });
}
// 渲染币对列表信息
root.methods.re_getCurrencyList = function (data) {
  let self = this;
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.RE_MARKET_PRICES
  })
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.log("======re_getCurrencyList======",data)
  let objs = this.symbolList_priceList(data);
  this.currency_list = objs;
  data.symbols.forEach(function (v, i) {
    // console.log("======data.symbols========",v.name,v.startTime,v.endTime)
    self.symbol_config_times.push({name: v.name, startTime: v.startTime, endTime: v.endTime});
  });
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
root.methods.RE_MARKET_PRICES = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  console.log(this.currency_list)
  this.currency_list = this.$globalFunc.mergeObj(data, this.currency_list);
  console.log(this.currency_list)
  // this.currency_list = data;
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

// 获取汇率
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
  // this.$store.commit('SET_EXCHANGE_RATE', rateObj);
}

// view跳转 跳到买或者卖
root.methods.toBuyOrSaleView = function (type) {
  this.$store.commit('BUY_OR_SALE_TYPE', type);
  // !!this.$store.state.authMessage.userId ? this.$router.push('/index/mobileTradingHallDetail') : this.$router.push('/index/sign/login');
  this.$router.push('/index/mobileTradingHallDetail')
}


// 根据当前币对请求买或卖列表
root.methods.getCurrencyBuyOrSaleList = function () {
  // console.log("===========root.methods.getCurrencyBuyOrSaleList============")
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
  // console.log("========root.methods.re_getCurrencyBuyOrSaleList=======",data)

  if(data.symbol != this.symbol){
    this.price = 0
    this.buy_sale_list = {};
    return;
  }

  this.price = data.price;
  this.buy_sale_list = data;
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

/*---------------------- 跳入到首页面页面 ---------------------*/
root.methods.gotoNewH5homePage = function () {
  this.$router.push({name: 'NewH5homePage'});
}
/*---------------------- 跳入到市场页面 ---------------------*/
root.methods.gotoShichang = function () {
  this.$router.push({name: 'mobileTradingHall'});
}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods.gotoZichan = function () {
  this.$router.push({name: 'MobileAssetRechargeAndWithdrawals'});
}

/*---------------------- 跳入到交易页面 ---------------------*/
root.methods.gotoJiaoyi = function () {
  this.$router.push({name: 'mobileTradingHallDetail'});
}

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
