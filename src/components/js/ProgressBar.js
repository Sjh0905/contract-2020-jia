// import SlideBar from './slide'
// Object.definePrototype(Vue.prototype, '$SlideBarjs', { value: SlideBarjs });
import tradingHallData from "../../dataUtils/TradingHallDataUtils";

const root = {}
root.name = 'ProgressBar'
const interval = '';
root.props = {}
root.computed = {}
root.methods = {}
root.watch = {}

/*----------------------------- 计算 ------------------------------*/

// 观察货币对是否更改
root.computed.symbol = function () {
  return this.$store.state.symbol;
  // console.info('this.$store.state.symbol;',this.$store.state.symbol)
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


/*----------------------------- 观察 ------------------------------*/

root.watch.serverTime = function (newValue, oldValue) {

  if (newValue == oldValue) return;

  this.SYMBOL_ENTRANSACTION();
}

// 观察是否更改货币对
root.watch.symbol = function () {
  this.changeAvailableData();
  this.getScaleConfig();
  // 判断当前币对是否可交易
  this.SYMBOL_ENTRANSACTION();
  // 切换symbol清空价格和数量
  // this.price = '';
  this.amount = '';
}
// currency发生变化则更改估值！
root.watch.watchCurrency = function () {
  this.changeAvailableData()
}

// 18-2-7 添加的新需求 start

// 观察触发价格的变化，然后折合人民币或者美金
root.computed.getTriggerPrice = function () {
  return this.triggerPrice;
}
root.watch.getTriggerPrice = function () {
  this.get_now_price();
}
// 观察价格的变化，然后折合人民币或者美金
root.computed.get_price = function () {
  return this.price;
}
root.watch.get_price = function () {
  this.get_now_price();
}
root.computed.get_lang = function () {
  return this.$store.state.lang;
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

/*----------------------------- props ------------------------------*/


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
root.props.latestPrice = {
  type: String,
  default: '最新价格'
}

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PositionModeBulletBox': resolve => require(['../vue/PositionModeBulletBox'], resolve),
  'CalculatorBommbBox': resolve => require(['../vue/CalculatorBommbBox'], resolve),
}

/*----------------------------- data ------------------------------*/

root.data = function () {
  return {
    triggerPrice:'',
    price: this.depth_price,
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



  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
  // 左侧price变化时更改当前price
  this.$eventBus.listen(this, 'SET_PRICE', this.RE_SET_PRICE);
  //  根据买卖设置买卖amount，买对应卖，卖对应买
  this.$eventBus.listen(this, 'SET_AMOUNT', this.RE_SET_AMOUNT);

  this.$eventBus.listen(this, 'GET_GRC_PRICE_RANGE', this.getKKPriceRange);
  // 获取精度
  this.getScaleConfig();

  this.show_now_price();

  this.getKKPriceRange();
  // this.tradeMarket()
  // this.postOrdersPosition()
  // this.postOrdersCreate()

}

root.mounted = function () {
  this.dragWidth = $('.dragbox').width();
  // console.log(this.dragWidth)

}

/*----------------------------- 监测属性 ------------------------------*/


root.watch.value = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  // console.log(newValue)
  this.sectionSelect(newValue/100);
}
root.watch.pendingOrderType = function (newValue, oldValue) {
  this.value = 0
  this.amount = ''
}

/*----------------------------- 方法 ------------------------------*/


// 处理滑动条显示框内容
root.methods.formatTooltip=(val)=>{
  return  val + '%';
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

// 开仓
root.methods.postOrdersCreate = function () {
  let params = {}
  // 单仓 限价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'limitPrice' && this.checkPrice != '2') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: "BOTH",
      price: this.price,
      quantity: this.amount,
      reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      stopPrice: null,
      symbol: 'BTCUSDT',
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
      price: this.price,
      quantity: this.amount,
      reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      symbol: 'BTCUSDT',
      orderType: "MARKET",
    }
  }

  // 双仓 限价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 2 && this.pendingOrderType == 'limitPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'SHORT' : 'LONG',
      price: this.price,
      quantity: this.amount,
      // reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      symbol: 'BTCUSDT',
      timeInForce: this.effectiveTime,
      orderType: "LIMIT",
    }
  }

  // 双仓 市价
  if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 2 && this.pendingOrderType == 'marketPrice') {
    params = {
      leverage: this.$store.state.leverage,
      positionSide: this.orderType ? 'SHORT' : 'LONG',  // 开多传 "LONG" ，开空传 "SHORT"
      price: this.price,
      quantity: this.amount,
      // reduceOnly: this.reducePositionsSelected ? true : false,
      orderSide: this.orderType ? 'SELL':'BUY',
      symbol: 'BTCUSDT',
      orderType: "MARKET",
    }
  }

  // 单仓 限价止盈止损
  // if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'limitProfitStopLoss') {
  //   params = {
  //     leverage: this.$store.state.leverage,
  //     positionSide: "BOTH",
  //     price: this.price,
  //     quantity: 1,
  //     reduceOnly: true,
  //     orderSide: this.orderType ? 'SELL':'BUY',
  //     stopPrice: this.triggerPrice,
  //     symbol: "BTCUSDT",
  //     timeInForce: this.effectiveTime,
  //     orderType: 'TAKE_PROFIT',
  //     workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
  //   }
  // }
  // // 单仓 市价止盈止损
  // if (this.isHasModule('kaipingType') == 1 && this.isHasModule('buttonType') == 1 && this.pendingOrderType == 'marketPriceProfitStopLoss') {
  //   params = {
  //     leverage: this.$store.state.leverage,
  //     positionSide: "BOTH",
  //     price: "9352.50",
  //     quantity: 1,
  //     reduceOnly: true,
  //     orderSide: this.orderType ? 'SELL':'BUY',
  //     stopPrice: this.triggerPrice,
  //     symbol: "BTCUSDT",
  //     timeInForce: this.effectiveTime,
  //     orderType: "TAKE_PROFIT_MARKET",
  //     workingType: this.latestPrice == '最新价格'? 'CONTRACT_PRICE':'MARK_PRICE',
  //   }
  // }

  // Object.assign(params, {type: "LIMIT",});
  this.$http.send('POST_ORDERS_CREATE',{
    bind: this,
    params,
    callBack: this.re_postOrdersCreate,
    errorHandler: this.error_postOrdersCreate
  })
}
root.methods.re_postOrdersCreate = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  console.info('data=======',data)
}
root.methods.error_postOrdersCreate = function (err) {
  console.info('err======',err)
}

// 平仓
root.methods.postOrdersPosition = function () {
  let params = {}
  // 双仓 平仓 限价
  if (this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3 && this.pendingOrderType == 'limitPrice') {
    params = {
      leverage: 20,
      positionSide: "LONG",
      price: "9510.00",
      quantity: 2,
      side: "SELL",
      stopPrice: null,
      symbol: "BTCUSDT",
      timeInForce: "GTC",
      type: "LIMIT",
      workingType: null,
    }
  }

  // 双仓 平仓 市价
  if (this.isHasModule('kaipingType') == 2 && this.isHasModule('buttonType') == 3 && this.pendingOrderType == 'marketPrice') {
    params = {

    }
  }


  this.$http.send('POST_ORDERS_POSITION',{
    bind: this,
    callBack: this.re_postOrdersPosition,
    errorHandler: this.error_postOrdersPosition
  })
}
root.methods.re_postOrdersPosition = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
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
    this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
    this.changeTriggerPrice = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (triggerPrice * rate), 2));
  } else {
    this.change_price = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
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
root.methods.sectionSelect = function (num) {
  if (!this.isLogin) return;
  if (this.orderType) {
    // this.amount = (this.available * num).toFixed(this.baseScale);
    this.amount = this.$globalFunc.accFixed(this.available * num, this.baseScale);
    return
  }
  if (this.price) {
    // this.price == 0 || (this.amount = (this.available * num / this.price).toFixed(this.baseScale));
    this.price == 0 || (this.amount = this.$globalFunc.accFixed(this.available * num / this.price, this.baseScale))
  }
}

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

root.methods.accMul = function (arg1, arg2) {
  if (!arg1 || !arg2) return;
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  } catch (e) {
  }
  let num = Number(s1.replace(".", "") * s2.replace(".", "")) / Math.pow(10, m);
  return this.$globalFunc.accFixed(num, 4);
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
root.methods.show_now_price = function () {
  this.price = this.$store.state.depth_price;
  // console.log("this.price--------"+this.price);

}

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
  // console.log(this.priceNow)

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
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}

export default root
