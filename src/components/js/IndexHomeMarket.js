const root = {};

root.name = 'IndexHomeMarket'


root.data = function () {
  return {
    // 当前在哪个市场
    marketType: 2,
    // 币对市场
    market_list: [],
    select_name: '',

    selectEdition: 0, // 版块 主板区和超级为蜜区 0为主板区 1为超级为蜜区
    selectMarket: ['USDT', 'USDT'], // 市场
    selectMarketChange: false, // 作用是使computed反应迅速
    clickTab: false, // 是否切换了市场

    // 市场顺序
    marketOrder: ['USDT','ENX', 'BTC', 'ETH'],
    exchangeRate: {}, // 估值汇率

    collectionMarket: [],// 自选区币对

    createMarket:['WB_USDT'], // 创新区币对

    selectStar:[],// 星星
    currentId:null, // 当前币对信息

    // 搜索框信息
    searchText:'',
    //搜索列表
    searchList:[],

  // 货币对列表
  currency_list: {},
  // btc和eth汇率
  btc_eth_rate: {},

  // socket推送信息
  socket_price: {}, //总价格


}
}

root.components = {
  'IndexHomeMarketItem': resolve => require(['../vue/IndexHomeMarketItem'], resolve),
}

// root.props = {}
// root.props.currency_list = {
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


root.computed = {};
// 主题颜色
root.computed.themeColor = function () {
  return this.$store.state.themeColor || 0
}

// 当前显示币对
root.computed.filterCurrency = function () {
  return this.$store.state.filterCurrency
}

// 特殊专区 0为超级为蜜
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol && this.$store.state.specialSymbol || []
}

// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}

// 市场列表
root.computed.marketList = function () {
  // 如果是自选区，不能从store里选取!
  if (this.selectEdition === 2) {
    let ans = new Set()
    this.collectionMarket.forEach(v => {
      ans.add(v.split('_')[1])
    })
    if (!this.selectMarket[this.selectEdition] && [...ans].length > 0) {
      this.selectMarket[this.selectEdition] = [...ans][0]
    }
    return [...ans]
  }

  if (!this.$store.state.marketList[this.selectEdition]) return []
  let storeMarketList = this.$store.state.marketList[this.selectEdition] && this.$store.state.marketList[this.selectEdition] || []
  let ans = []
  // console.log(this.storeMarketList)
  this.marketOrder.forEach(v => {
    let i = storeMarketList.indexOf(v)
    if (i === -1) {
      return
    }

    ans.push(v)
    storeMarketList.splice(i, 1)
  })
  ans.push(...storeMarketList)

  // TODO:暂时先写死，后期修改专区再改吧
  // return ans.length == 0 ? ['自选区','USDT','ENX','创新区'] : ans
  // return ['自选区','USDT','ENX','创新区']
  return [this.$t('Favorites'),'USDT','ENX',this.$t('Innovation')]
}

// ajax获取的数据
root.computed.currencylist = function () {
  // 把对象按字母排序
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  let collectionMarketSet = new Set(this.collectionMarket)
  let o = [{}, {}, {}];
  Object.keys(currencyList).sort().forEach(symbol => {
    let currency = symbol.split('_')[1];
    if (!currency) return;
    // initData 为整行的数据对象
    let initData = {};
    initData.name = symbol;
    [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]

    !o[0].optionalArea && (o[0].optionalArea = [])
    !o[0].createArea && (o[0].createArea = [])
    // 如果是自选区
    if (collectionMarketSet.has(symbol)) {
      // console.log(initData)
      initData.isCollection = true
      // !o[2][currency] && (o[2][currency] = [])
      // o[2][currency].push(initData)
      o[0].optionalArea.push(initData)
    }
    // 如果是创新区
    if (this.createMarket.includes(symbol)) {
      initData.isCreate = true

      o[0].createArea.push(initData);
      return;
    }

    // 如果是超级为蜜区
    // if (this.specialSymbol[0] && this.specialSymbol[0].has(symbol)) {
    //   !o[1][currency] && (o[1][currency] = [])
    //   o[1][currency].push(initData)
    //   return
    // }
    // 如果不是
    !o[0][currency] && (o[0][currency] = []);
    o[0][currency].push(initData);
  })
  return o
}

// 选中的市场数据
root.computed.computedMarketList = function () {
  // console.log(this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]])
  let ans = this.selectMarketChange
  if(this.selectMarket[this.selectEdition] == this.$t('Favorites'))return (this.currencylist[this.selectEdition].optionalArea)
  if(this.selectMarket[this.selectEdition] == this.$t('Innovation'))return (this.currencylist[this.selectEdition].createArea)
  return (this.currencylist[this.selectEdition] && this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]] || []).sort((a,b)=>!b.open && b.open - a.open)
}

root.computed.computedCreate = function () {
  let createMarket = this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]]
  createMarket.slice()
}




// // 自选区
// root.computed.computedSelfArea = function (){
//   let  that = this
//   this.marketList.forEach(i=>{
//     if(i==='自选区' && this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]].includes(this.selectStar)){
//       // console.log(this.currencylist[this.selectEdition][this.selectMarket[this.selectEdition]])
//       this.selectArray.push()
//     }
//     console.log(this.selectStar)
//     return this.selectArray
//   })
//   return this.selectArray
// }


/*// ajax获取的数据2
root.computed.currencylist = function () {
  // 把对象按字母排序
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  let collectionMarketSet = new Set(this.collectionMarket)
  let o = [];
  Object.keys(currencyList)./!*sort().*!/forEach(symbol => {
    // if(this.filterCurrency.indexOf(symbol) != -1){
      let currency = symbol.split('_')[1];
      if (!currency) return;
      let initData = {};
      initData.name = symbol;
      [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...currencyList[symbol]]

      o.push(initData);
    // }
  })
  return o
}

// 选中的市场数据2
root.computed.computedMarketList = function () {
  let ans = this.selectMarketChange
  return this.currencylist || []
}*/

// 获取当前symbol
root.computed.symbol = function () {
  return this.$store.state.symbol;
}

// 语言
root.computed.lang = function () {
  return this.$store.state.lang;
}

// 是否免费 分专区
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

root.watch = {};



// 判断选中的是哪个市场  18-4-9 新加
root.watch.currencylist = function (newValue, oldValue) {
  let market = this.select_name || this.symbol.split('_')[1];
  for (var i = 0; i < newValue.length; i++) {
    let name = newValue[i].name;
    if (market == name) {
      this.marketType = i;
    }
  }
}

root.watch.searchText = function(v){
  // console.log(this.changeInputValue)
  // console.log(this.computedMarketList.name )
  // console.log('this.searchList====111',this.searchList)
  // console.log(this.computedMarketList)

  this.searchList = this.computedMarketList.filter(v=>v.name.includes(this.searchText) || v.name.includes(this.searchText.toUpperCase()))

  // console.log('this.searchList====',this.searchList , this.computedMarketList)

}

// 生命周期
root.created = function () {
  this.getCollectionMarket()
  this.GET_MARKET()
  this.getExchangeRate()
}
root.methods = {};

// 切换图片的选中状态
// root.methods.toggleSelect = function (value,key) {
//   console.log(value)
//   if (this.collectionMarket.indexOf(value.name) === -1) {
//     this.collectionMarket.push(value.name)
//     // this.getCollectionMarket()
//     this.handleCollectionMarket(value.name,true)
//     // console.log(this.currencylist[this.selectEdition].optionalArea)
//     return;
//   }
//   this.collectionMarket.splice(this.collectionMarket.indexOf(value.name),1)
//   this.handleCollectionMarket(value.name,false)
//   console.log(key)
// }

// 切换市场
root.methods.CHANGE_MARKET_TYPE = function (type, name) {
  if (this.marketType == type) return;
  this.marketType = type;
  this.select_name = name;
}

// 点击切换版块
root.methods.changeEdition = function (type) {
  if (parseInt(type) === this.selectEdition) return
  this.selectEdition = parseInt(type)
  this.clickTab = true
}

// 点击切换版块下的市场
root.methods.changeMarket = function (market) {
  this.selectMarket[this.selectEdition] = market
  this.selectMarketChange = !this.selectMarketChange
  this.clickTab = true
}

// 选中的市场
root.methods.selectedMarket = function (item) {
  // console.log(this.selectMarket[this.selectEdition],item)
  return this.selectMarket[this.selectEdition] === item
}

// 计算当前币对折合多少人民币  2018-4-4 start
root.methods.get_now_price = function (price, symbol) {
  if (!this.btc_eth_rate.dataMap) return
  let rate, ans
  let rateObj = this.btc_eth_rate.dataMap.exchangeRate
  this.exchangeRate['USDT'] = 1
  this.exchangeRate['BTC'] = rateObj.btcExchangeRate || 0
  this.exchangeRate['ETH'] = rateObj.ethExchangeRate || 0
  let lang = this.lang
  // rate = this.exchangeRate[this.selectMarket[this.selectEdition]] || 0
  rate = this.exchangeRate[symbol] || 0
  if (lang === 'CH') {
    ans = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    ans = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  return ans
}

// 24小时涨跌百分比 (现价 - 开盘价) / 开盘价
root.methods.diff24Ratio = function (now_price, open_price) {
  let diff = this.toFixed(this.accMul(this.accDiv(this.accMinus(now_price, open_price), open_price || 1), 100), 2)
  return diff
}
// 点击市场跳转
root.methods.clickToGoTradingHall = function (value) {
  let symbol = value.name

  this.$store.commit('SET_SYMBOL', symbol);

  let user_id = this.$store.state.authMessage.userId;
  let user_id_symbol = user_id + '-' + symbol;
  !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24)
  this.$router.push({name: 'tradingHall'})
}

// 获取自选区市场列表
root.methods.getCollectionMarket = function () {
  if (!this.isLogin) {
    try {
      this.collectionMarket = JSON.parse(this.$cookies.get('COLLECTION_MARKET1')) || []
      console.log(this.collectionMarket)
    } catch (e) {
      this.collectionMarket = []
    }
    return
  }
  this.$http.send('GET_COLLECTION_SYMBOL', {
    bind: this
  }).then(({data}) => {
    // console.log(data)
    typeof data === 'string' && (data = JSON.parse(data))
    let collectionMarkets = data.dataMap && data.dataMap.symbols
    // console.log(collectionMarkets)
    this.collectionMarket = []
    collectionMarkets.forEach(v => {
      this.collectionMarket.push(v.symbol)
      // console.log(this.collectionMarket)
    })
  }).catch(e => {
    console.warn('自选区币对出错', e)
  })
  return false
}

// 选择\取消自选区市场
root.methods.handleCollectionMarket = function (symbol, type) {

  if (!this.isLogin) {

    // 如果是增加
    if (type) {
      this.collectionMarket = this.$globalFunc.addArray(symbol, this.collectionMarket)
      // this.$cookies.set('COLLECTION_MARKET', JSON.stringify(this.collectionMarket))
    }
    // 如果是减少
    if (!type) {
      this.collectionMarket = this.$globalFunc.removeArray(symbol, this.collectionMarket)
    }
    // 存储下
    this.$cookies.set('COLLECTION_MARKET1', JSON.stringify(this.collectionMarket))
    console.warn('添加自选')
    return
  }

  if (type) {
    this.collectionMarket = this.$globalFunc.addArray(symbol, this.collectionMarket)
    // this.$cookies.set('COLLECTION_MARKET', JSON.stringify(this.collectionMarket))
  }
  // 如果是减少
  if (!type) {
    this.collectionMarket = this.$globalFunc.removeArray(symbol, this.collectionMarket)
  }
  // 存储下
  this.$cookies.set('COLLECTION_MARKET', JSON.stringify(this.collectionMarket))
  this.$http.send('POST_COLLECTION_SYMBOL', {
    bind: this,
    params: {
      symbol: symbol,
      status: type
    }
  }).then(({data}) => {
    // console.log(data)
    typeof data === 'string' && (data = JSON.parse(data))
    // console.warn('绑定取消自选', data)
    this.getCollectionMarket()
  }).catch(e => {
      console.warn('绑定取消自选出错', e)
    })
  return false
}




// 获取市场列表
root.methods.GET_MARKET = function () {
  // 初始化数据请求
  this.initGetDatas();
  // 初始化socket
  this.initSocket();
}

// 初始化请求
root.methods.initGetDatas = function () {
  // 请求所有币对信息 right和header都需要此数据
  this.getCurrencyList();
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
  console.log('data==============',data)
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

// 初始化socket
root.methods.initSocket = function () {
  // 订阅某个币对的信息
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});

  // 接收所有币对实时价格
  this.$socket.on({
    key: 'topic_prices', bind: this, callBack: (message) => {
      this.socket_price = message;
    }
  })
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


export default root;

