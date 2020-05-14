const root = {};

let interval;

root.name = 'MobileTradingHallDetail';

/*------------------------------ data begin -------------------------------*/

root.data = function () {
  return {

    // 是否可用BDB抵扣
    BDBInfo: true,
    BDBReady: false,

    openType: this.$store.state.buy_or_sale_type || 1,

    // 买卖form右侧
    is_right: false,

    // 买卖数量和价格列表
    price: '0',
    cnyPrice: '- -',

    sellOrders: [],
    buyOrders: [],

    // 交易时价格和数量
    transaction_price: '',
    transaction_amount: '',
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
    socket_tick: {},
    // 18-2-10 新加买卖信息对象，用来接收socket和ajax返回的数据 深度图
    buy_sall_list: {},
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

    isshowhangq:false,

    currency_list:[],

    KKPriceRange:[],

    popIdenOpen: false, // 弹窗开放

    priceCont:''

  }
}

/*------------------------------ 生命周期 begin -------------------------------*/


root.created = function () {

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

  // 获取BDB是否抵扣
  this.getBDBInfo()
  //请求所有币对信息
  this.getCurrencyList()
  // 获取汇率
  !!this.$store.state.exchange_rate.btcExchangeRate || this.getExchangeRate();


  // 获取精度
  this.getScaleConfig();
  // 拉取列表数据
  this.getDepthInfo();
  // 订阅socket
  this.initSocket();


  // 获取可用数量
  !!this.$store.state.authMessage.userId && this.$http.send('ACCOUNTS', {
    bind: this,
    callBack: this.RE_ACCOUNTS
  })

  if (this.$store.state.authMessage.userId) {
    this.$http.send('FIND_FEE_DEDUCTION_INFO', {
      bind: this,
      callBack: this.RE_FEE
    })
  }


  this.$eventBus.listen(this, 'TRADED', this.TRADED)
  // 获取订单
  this.loading = true
  this.getOrder()

  // 获取认证状态
  this.getAuthState()

  // 拉取最新成交数据
  // this.GET_LATEST_DEAL();

  // interval = setInterval(this.GET_LATEST_DEAL, 2000);

  this.getScaleConfig();

}

/*------------------------------ 组件 begin -------------------------------*/

root.components = {}
root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'MobileTrade': resolve => require(['../vue/MobileTrade'], resolve),
  'CurrentOrder': resolve => require(['../vue/MobileCurrentOrder'], resolve),
  'HistoryOrder': resolve => require(['../vue/MobileHistoryOrder'], resolve),
}

/*------------------------------ 计算 begin -------------------------------*/

root.computed = {}


root.computed.currencyList = function(){
  return this.$store.state.symbol.currencyList
}

root.computed.symbol = function () {
  return this.$store.state.symbol;
}

root.computed.name = function () {
  return this.$store.state.symbol.split('_')[1];
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

/*------------------------------ 方法 begin -------------------------------*/

root.methods = {};


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

// 获取深度图，用来渲染header的price信息
root.methods.getDepthInfo = function () {
  this.$http.send("DEPTH", {
    bind: this,
    query: {symbol: this.$store.state.symbol},
    callBack: this.RE_DEPTH
  })
}
// 拉取第一次数据
root.methods.RE_DEPTH = function (data) {
  //console.log('aaaaaaaaaaaaaaaaaa',data)

  if(this.$store.state.symbol != data.symbol)return

  this.buy_sall_list = Object.assign(this.buy_sall_list, data);

  // 2018-4-23 解决当socekt没有推送的话，用depth返回的price
  this.price = this.buy_sall_list.price;

  // !!this.buy_sall_list.sellOrders.length && (this.sellOrders = this.buy_sall_list.sellOrders.splice(0, 9))
  // !!this.buy_sall_list.buyOrders.length && (this.buyOrders = this.buy_sall_list.buyOrders.splice(0, 9))

  !!this.buy_sall_list.sellOrders.length && (this.sellOrders = this.getPriceChangeOrders(this.buy_sall_list.sellOrders))
  !!this.buy_sall_list.buyOrders.length && (this.buyOrders = this.getPriceChangeOrders(this.buy_sall_list.buyOrders))

  let symbol = this.$store.state.symbol.split('_')[1];
  let self = this;
  let rate = 0;
  for (let key in this.socket_price) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = this.socket_price[key][4];
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

  this.cnyPrice = !(this.price * rate) ? 0 : this.$globalFunc.accFixedCny(this.price * rate * this.$store.state.exchange_rate_dollar, 2);
}
// 初始化订阅socket
root.methods.initSocket = function () {

  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol})
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol})

  this.$socket.on({
    key: 'topic_snapshot',
    bind: this,
    callBack:  (message) =>{
      // console.log(message)
      if (self.$store.state.symbol == message.symbol) {
        this.buy_sall_list = Object.assign(self.buy_sall_list, message);
        // console.log(message)
        // !!this.buy_sall_list.sellOrders.length && (self.sellOrders = this.buy_sall_list.sellOrders.splice(0, 9))
        // !!this.buy_sall_list.buyOrders.length && (self.buyOrders = this.buy_sall_list.buyOrders.splice(0, 9))

        !!this.buy_sall_list.sellOrders.length && (self.sellOrders = this.getPriceChangeOrders(this.buy_sall_list.sellOrders))
        !!this.buy_sall_list.buyOrders.length && (self.buyOrders = this.getPriceChangeOrders(this.buy_sall_list.buyOrders))
      }
    }
  })

  // 获取所有币对价格
  this.$socket.on({
    key: 'topic_tick', bind: this, callBack: (message) => {
      this.socket_tick = message instanceof Array && (message[0]['symbol'] ===  this.$store.state.symbol && message[0]) ||( message.symbol === this.$store.state.symbol && message )
      // this.socket_tick = message instanceof Array && message[0] || message;
      // console.warn('this is socket_tick',this.socket_tick)
      this.price = this.socket_tick.price || 0;
      // 判断BTC或ETH汇率
      let symbol = this.$store.state.symbol.split('_')[1];
      this.getDepthCny(this.socket_price, this.price, symbol);

      // 全站交易
      // this.DISPLAY_LATEST(message);

    }
  })

  // 接收所有币对实时价格
  this.$socket.on({
    key: 'topic_prices', bind: this, callBack: (message) => {
      this.socket_price = message;
      let self = this;
      let rate = 0;
      let symbol = this.$store.state.symbol.split('_')[1];
      this.getDepthCny(this.socket_price, this.price, symbol);
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
  let orderType = this.orderType;
  this.tradeMarket(false,orderType)
}

root.methods.comparePriceNow = function () {
  if (this.price <= 0 || this.transaction_price <=0)return true
  let multiple = this.accDiv(this.transaction_price,Number(this.price));

  let priceCont = ''
  multiple == 1/2 && (priceCont = '挂单价格等于时价1/2，确定下单吗？')
  multiple < 1/2 && (priceCont = '挂单价格低于时价1/2，确定下单吗？')
  multiple == 2 && (priceCont = '挂单价格等于时价2倍，确定下单吗？')
  multiple > 2 && (priceCont = '挂单价格高于时价2倍，确定下单吗？')
  if(priceCont == '')return true

  this.priceCont = priceCont;
  return false;
}

// 提交买入或卖出
root.methods.tradeMarket = function (popIdenOpen,type) {
  this.orderType = type;
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


  if (!type && Number(this.transaction_price * this.transaction_amount) > Number(available)) {
    // alert('您的持仓不足')
    this.popText = '您的余额不足,请充值';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  if (type && Number(this.transaction_amount) > Number(available)) {
    // alert('您的持仓不足')
    this.popText = '您的余额不足,请充值';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  let txt = !type ? '买入' : '卖出';
  let symbol = this.$store.state.symbol;

  if(symbol == 'KK_USDT' && !this.checkPriceRange()) return;
  if (!type && this.transaction_price == 0) {
    this.popText = '请输入正确的' + txt + '价';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  if(!type && popIdenOpen){
    this.popIdenOpen = !this.comparePriceNow();
    if(this.popIdenOpen)return;
  }

  if (!type && this.transaction_amount == 0) {
    this.popText = '请输入正确的' + txt + '量';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  if (type && this.transaction_price == 0) {
    this.popText = '请输入正确的' + txt + '价';
    this.popType = 0;
    this.promptOpen = true;
    return
  }

  if(type && popIdenOpen){
    this.popIdenOpen = !this.comparePriceNow();
    if(this.popIdenOpen)return;
  }

  if (type && this.transaction_amount == 0) {
    this.popText = '请输入正确的' + txt + '量';
    this.popType = 0;
    this.promptOpen = true;
    return
  }
  let params = {
    symbol: this.symbol,
    price: this.transaction_price,
    amount: this.transaction_amount,
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
  let turnover = Number(this.transaction_price) * Number(this.transaction_amount);
  let turnoverAmount = Number(this.transaction_amount);
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
  this.transaction_amount = '';
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

  if(minPrice > 0 && this.transaction_price < minPrice){
    this.popText = (this.lang === 'CH' ?  'Price cannot be less than' : '价格不能低于') + minPrice;
    this.popType = 0;
    this.promptOpen = true;
    return false
  }
  if(maxPrice > 0 && this.transaction_price > maxPrice){
    this.popText = (this.lang === 'CH' ? 'Price cannot be higher than' :  '价格不能高于') + maxPrice;
    this.popType = 0;
    this.promptOpen = true;
    return false
  }

  return true;
}


// 更新价格
root.methods.setTransactionPrice = function (price) {
  this.transaction_price = this.$globalFunc.accFixed(price, this.quoteScale);
  // 计算估值
  this.cnyValuation(price, this.transaction_amount);
}

// 计算人民币估值 amount*price*rate 修改成price*rate*6.7
root.methods.cnyValuation = function (price, amount) {
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
}

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
root.methods.sectionSelect = function (num) {
	this.numed = num
  if (this.openType != 1) {
    // this.transaction_amount = (this.currentSymbol.balance_order * num).toFixed(this.baseScale)
    // console.log(this.baseScale)
    this.transaction_amount = this.$globalFunc.accFixed(this.currentSymbol.balance_order * num, this.baseScale);
    return
  } else {
    if (this.transaction_price) {
      this.transaction_amount = this.$globalFunc.accFixed(this.currentSymbol.balance * num / this.transaction_price, this.baseScale)
    }
  }
}

root.methods.sectionSelect2 = function (num) {
	this.numed2 = num
	if (this.openType != 1) {
		// this.transaction_amount = (this.currentSymbol.balance_order * num).toFixed(this.baseScale)
		// console.log(this.baseScale)
		this.transaction_amount = this.$globalFunc.accFixed(this.currentSymbol.balance_order * num, this.baseScale);
		return
	} else {
		if (this.transaction_price) {
			this.transaction_amount = (this.currentSymbol.balance * num / this.transaction_price).toFixed(this.baseScale)
		}
	}
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
}

// 切换tab
root.methods.changeType = function (typeNum) {
  this.openType = typeNum;
  this.latestFlag = false;
  if (typeNum === 1) {
    this.$store.commit('changeMobileHeaderTitle', '买入');
  }
  if (typeNum === 2) {
    this.$store.commit('changeMobileHeaderTitle', '卖出');
  }
  if (typeNum === 3) {
    this.$store.commit('changeMobileHeaderTitle', '当前委托');
  }
  if (typeNum === 4) {
    this.$store.commit('changeMobileHeaderTitle', '历史委托');
  }
  // 切换买入卖出时候需要清空数量
  this.transaction_amount = '';
}

// 切换左右结构
root.methods.changeFloat = function () {
  this.is_right = !this.is_right;
}

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

// 监听数量和单价的变化 transaction_amount， transaction_price
root.computed.transactionAmount = function () {
  return this.transaction_amount;
}

root.computed.transactionPrice = function () {
  return this.transaction_price;
}


root.watch = {};
root.watch.transactionAmount = function (newValue, oldValue) {
  let value = newValue.toString();
  // 限制输入位数
  if (!!value.split('.')[1] && value.split('.')[1].length > this.baseScale) {
    this.transaction_amount = value.split('.')[0] + '.' + value.split('.')[1].substring(0, this.baseScale);
  }
  this.cnyValuation(this.transaction_price, newValue);
}

root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // 重新拉取数据
  // this.GET_LATEST_DEAL();

  this.$socket.emit('unsubscribe', {symbol: oldValue});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});
  // 2018-2-9 切换symbol清空socket推送
  this.buy_sall_list = {}; //深度图
  this.buyOrders = [];
  this.sellOrders = [];
  // this.socket_tick = {}; //实时价格

  // this.buy_sale_list = {}//接口深度图

  this.price = 0;

  this.initSocket();

  // 获取汇率
  !!this.$store.state.exchange_rate.btcExchangeRate || this.getExchangeRate();

  this.getDepthInfo();
  this.getScaleConfig();

}
// root.watch = {};
root.watch.transactionAmount = function (newValue, oldValue) {
  let value = newValue.toString();
  // 限制输入位数
  if (!!value.split('.')[1] && value.split('.')[1].length > this.baseScale) {
    this.transaction_amount = value.split('.')[0] + '.' + value.split('.')[1].substring(0, this.baseScale);
  }
  this.cnyValuation(this.transaction_price, newValue);
}
root.watch.transactionPrice = function (newValue, oldValue) {
  let value = newValue.toString();
  // 限制输入位数
  if (!!value.split('.')[1] && value.split('.')[1].length > this.quoteScale) {
    this.transaction_price = value.split('.')[0] + '.' + value.split('.')[1].substring(0, this.quoteScale);
  }
  this.cnyValuation(newValue, this.transaction_amount);
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

// 监听数量和单价的变化 transaction_amount， transaction_price
root.computed.transactionAmount = function () {
  return this.transaction_amount;
}

root.computed.transactionPrice = function () {
  return this.transaction_price;
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


// // 计算后的order，排序之类的放在这里
root.computed.currentOrderComputed = function () {
  return this.currentOrder
}

root.computed.historyOrderComputed = function () {
  return this.historyOrder
}


root.methods.getOrder = function () {
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
        symbol: this.symbol
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder,
    })
}


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
    params: {symbol: this.symbol},
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
  this.isshowhangq = false;

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

root.methods.openhangq = function(){
  this.isshowhangq = !this.isshowhangq;
}

root.methods.openkexian = function(){
  this.$store.commit('changeMobileTradingHallFlag',true);
  this.$router.push('mobileTradingHall')
}
root.methods.ToCurrentPage = function(){
  this.$router.push('MobileTradingHallDetail')
}


export default root;
