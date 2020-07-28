const root = {}

root.name = 'StockCrossItems'

root.props = {}
root.props.transactionData = {
  type: Array,
  default: function () {
    return []
  }
}
root.props.socket_price = {
  type: Object,
  default: {}
}
root.props.btc_eth_rate = {
  type: Object,
  default: {}
}
root.props.currency_list = {
  type: Object,
  default: {}
}

root.props.transactionType = {type: Number}

root.props.type = {type: Number}

root.data = function () {
  return {
    word: '',
    baseScale: 0,
    quoteScale: 0,
    highColor: false,
    list: [],

    // 2018-4-4  BDB汇率
    bdb_rate: 0,
    change_price: 0,  // 当前价格
    show_key: '-1',  // 展示当前价格
    totalAmount:1//用户计算深度的总值，相当于分母
  }
}

root.computed = {}
// 所有币对信息
root.computed.symbol_list = function () {
  return this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
}

// 获取当前币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}

/*// 获取价格区间
root.computed.KKPriceRange = function () {
  // return ['0.2504','0.2506']
  return this.$store.state.KKPriceRange;
}*/

root.computed.depth_list = function () {
  // let list = [];
  // console.log('type=======',this.type)
  // console.log('KKPriceRange=======',this.KKPriceRange)

  let transactionData = this.transactionData

  /*if(this.symbol == 'KK_USDT' && this.KKPriceRange.length >0){
    let minPrice = this.KKPriceRange[0] || 0;
    let maxPrice = this.KKPriceRange[this.KKPriceRange.length -1] || 10;

    // console.log('this is minPrice',minPrice,'maxPrice',maxPrice);

    if(transactionData instanceof Array)
      transactionData = transactionData.filter(v => !!v && v.price >= minPrice && v.price <= maxPrice)
  }*/
  // let depth;
  // this.type < 3 ? (depth = this.transactionData.slice(0,32)) : (depth = this.transactionData.slice(0, 16))

  let depthLength = this.type < 3 ? 32 :16;
  let depth = transactionData.slice(0,depthLength)
  let lengthStep = depthLength - depth.length;

  // let depth = this.transactionData;
  // depth.forEach(v => {
  //   list.push({
  //     price: v.price,
  //     amount: v.amount,
  //     is_select: false
  //   })
  // });

  let list2 = [];
  let totalAmount = depth.reduce((pre,curr)=> {
    let currPrice = (curr && Number(curr[1]) || 0)
    curr.perAmount= this.accAdd(currPrice,pre)
    list2.push({
      price: curr[0],
      amount: curr[1],
      is_select: false,
      perAmount:curr.perAmount
    })
    return curr.perAmount
  },0);

  let arrStep = Array(lengthStep).fill({is_select: false,amount:'-',perAmount:'-',price:'-'})
  list2 = [...list2,...arrStep]

  // this.totalAmount = totalAmount || 100;
  this.$store.commit('SET_DEPTH_MAX_TOTAL_AMOUNT', totalAmount)

  // console.log('this is depth_list',list2,totalAmount)
  return list2 instanceof Array ? list2 : [];
}

// 买、卖盘中数量总和的最大值
root.computed.depthMaxTotalAmount = function () {
  return this.$store.state.depthMaxTotalAmount
}

// 当前委托价格list
root.computed.order_list = function () {
  return this.$store.state.openOrder
}

// 深度图百分比  如果是 ETH->BTC的，数量超过10就满，BDB->BTC或BDB->ETH的，超过10万才满,ICC->BTC超过100万才满, ELF的超过1万就满
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

root.watch = {};
root.watch.depth_list = function (newValue, oldValue) {
  this.getScaleConfig();
  this.contrastDeepthOpenOrder(this.order_list, newValue);
}

root.watch.order_list = function (newValue, oldValue) {
  this.contrastDeepthOpenOrder(newValue, this.depth_list);
}

root.watch.symbol_list = function (newValue, oldValue) {
  let self = this;
  for (let key in newValue) {
    if (key == 'BDB_ETH') {
      self.bdb_rate = newValue[key][4];
    }
  }
}

root.methods = {}

// 计算当前币对折合多少人民币  2018-4-4 start
root.methods.get_now_price = function (key, price) {
  if (!this.btc_eth_rate.dataMap) return;
  let rate;
  let rateObj = this.btc_eth_rate.dataMap.exchangeRate;
  let lang = this.$store.state.lang;
  let type = this.symbol.split('_')[1];
  if (type == 'BTC') {
    rate = rateObj.btcExchangeRate || 0;
  }
  if (type == 'ETH') {
    rate = rateObj.ethExchangeRate || 0;
  }
  if (type == 'BDB') {
    rate = rateObj.ethExchangeRate * this.bdb_rate || 0;
  }
  if (type == 'USDT') {
    rate = 1;
  }
  if (lang === 'CH') {
    this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    this.change_price = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  // 展示价格
  this.show_key = key;
}
root.methods.hide_now_price = function () {
  this.show_key = '-1';
}
// 2018-4-4  end

// 深度图和当前委托价格对比，如果深度图的价格和当前委托价格有一样的，需要变色显示
root.methods.contrastDeepthOpenOrder = function (order_list, depth_list) {
  let self = this;
  depth_list.forEach(v => {
    let price = v.price;
    if (order_list.indexOf(price) > -1) {
      Object.assign(v, {is_select: true});
    } else {
      Object.assign(v, {is_select: false});
    }
  })
  this.list = depth_list;

  // if(depth_list.length>28){
  //   this.list.slice(0,29)
  // }else{
  //   this.list = depth_list;
  // }


  // console.log('list==============',this.list)

}

root.methods.sortList = function(list){
  return this.transactionType ? list : list.reverse()
}

root.created = function () {
  this.getScaleConfig()


  if (this.transactionType) {
    this.word = '买'
  }
  if (!this.transactionType) {
    this.word = '卖'
  }
}


root.methods.getBuyAndSaleWidth = (num, maxNum) => {

}

root.methods.scale = function (num, scale) {
  var r = /^[+-]?[1-9]?[0-9]*\.[0-9]*$/;
  if (r.test(num)) {
    var l = scale - num.toString().length + 1
    if (l > 0) {
      for (var i = 0; i < l; i++) {
        num += '0'
      }
    }
    return num.toString().substr(0, scale + 1)
  }
  if (!r.test(num)) {

    var l = scale - num.toString().length + 1
    num += '.'
    if (l > 0) {
      for (var i = 0; i < l; i++) {
        num += '0'
      }
    }
    return num.toString().substr(0, scale + 1)
  }
}

// 买卖价格
root.methods.updatePrice = function (type, price) {
  this.$eventBus.notify({key: 'SET_PRICE'}, price);
}
// 买卖数量
root.methods.updateAmount = function (type, key, price, amount, baseScale) {
  let amounts = 0;
  this.depth_list.forEach((v, k) => {
    if (k <= key) {
      amounts += v.amount;
    }
  })
  // 给price赋值
  this.$eventBus.notify({key: 'SET_PRICE'}, price);
  // 给amount赋值，需要从key开始向前累加
  this.$eventBus.notify({key: 'SET_AMOUNT'}, {type:type, amount:this.formatnumber(amounts, baseScale)});

}


root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
  // console.log('baseScale', this.baseScale)
}

root.methods.formatnumber = function (value, num) {
  value = this.$globalFunc.accFixed(value, 8)
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

root.methods.highPrice = function (list, item, index) {

  if (!index) return true

  if (this.formatnumber(item.price, 8).substr(7, 1) != this.formatnumber(list[index - 1].price, 8).substr(7, 1)) return true

}


root.methods.excuteStye = function (transactionType,type ) {
  // transactionType 1 买 0卖
  //0 :全部 1,卖 2,买

  if(transactionType == 0 || type == 1)return  'display: flex;flex-direction:column-reverse'
  return  'flex-direction:column'

  // !transactionType ? 'flex-direction:column-reverse' : ''
  /*if(!type && !transactionType) return  'flex-direction:column-reverse'
  if(!type && transactionType) return  'flex-direction:column'
  if(type) return  'flex-direction:column-reverse'*/

}

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}

export default root
