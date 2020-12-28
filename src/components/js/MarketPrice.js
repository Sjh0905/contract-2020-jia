import axios from "axios";

const root = {}
root.name = 'MarketPrice'

root.props = {}
root.props.marketSymbolList = {
  type: Array,
  default: []
}
root.props.socket24hrTicker = {
  type: Array,
  default: []
}
root.props.btc_eth_rate = {
  type: Object,
  default: {}
}
root.props.socket_tick = {
  type: Object,
  default: {}
}

root.data = function () {
  return {
    marcketType: 2, //是否选中当前币种
    volumeType: 0, //展示成交量或者涨跌
    symbol_type: this.$store.state.symbol,
    quoteScale: 8, //保留位数
    baseScale: 0, //基础位数
    // 币对市场
    market_list: [],
    select_name: '',

    // 2018-4-4  BDB汇率
    bdb_rate: 0,
    change_price: 0, // 当前价格
    show_key: '-1', // 展示当前价格

    tips_top: 0,

    selectEdition: 0, // 版块 主板区和超级为蜜区 0为主板区 1为超级为蜜区
    selectMarket: ['', 'USDT'], // 市场
    selectMarketChange: false, // 作用是使computed反应迅速
    clickTab: false, // 是否切换了市场

    // 市场顺序
    marketOrder: ['USDT', 'BTC', 'ETH'],
    exchangeRate: {}, // 估值汇率

    collectionMarket: [],// 自选区币对
    createMarket:['KK_USDT'], // 创新区币对
    selectStar:[],// 星星
    selectArray:[], // 自选区数据
    currentId:null, // 当前币对信息

    // biduival: [],

    // 价格初始化标识
    pricesymbol:[],
    // 搜索内容
    searchText:'',
    searchList:[],

    mSymbolListTemp:[],//市场存储
    mSymbolListPrice:{},//市场价格列表存储
    lastTime:0
  }
}

root.created = function () {
  // this.getUSDThl();
  // console.log('marketprice')
  // this.getCollectionMarket()
}

// 组件销毁
// _cc 组件销毁前清除获取汇率定时器
root.beforeDestroy = function () {
  this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
}

root.computed = {}
//不加下划线币对集合
root.computed.sNameList = function () {
  return this.$store.state.sNameList || []
}
// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}

// 当前显示币对
root.computed.filterCurrency = function () {
  return this.$store.state.filterCurrency
}
// 特殊专区 0为超级为蜜
root.computed.specialSymbol = function () {
  return this.$store.state.specialSymbol && this.$store.state.specialSymbol || []
}

// 特殊专区 0为超级为蜜
root.computed.sNameMap = function () {
  // let defaultSNameMap = {"BTCUSDT":"BTC_USDT","ETHUSDT":"ETH_USDT"}
  let defaultSNameMap = this.$store.state.defaultSNameMap;
  return this.$store.state.sNameMap || defaultSNameMap
}

// 市场列表
root.computed.marketList = function () {
  // let storeMarketList = this.$store.state.marketList[this.selectEdition].slice(0)
  // let ans = []
  // this.marketOrder.forEach(v => {
  //   let i = storeMarketList.indexOf(v)
  //   if (i === -1) {
  //     return
  //   }
  //   ans.push(v)
  //   storeMarketList.splice(i, 1)
  // })
  // ans.push(...storeMarketList)
  // TODO:暂时先写死，后期修改专区再改吧
  // return [this.$t('Favorites'),'USDT','ENX',this.$t('Innovation')]
  return [this.$t('Favorites'),'USDT',this.$t('Innovation')]
}

// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;

  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {
      quoteScale: v.quoteScale,
      baseScale: v.baseScale
    };
  })
  // console.info('quoteScale_list====',quoteScale_obj)
  return quoteScale_obj;
}
// 所有币对信息
root.computed.symbol_list = function () {
  return this.marketSymbolList;
}


// ajax获取的数据
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

  // console.info('this.mSymbolListTemp===',this.mSymbolListTemp[0].P)

  return mSymbolList;



  //----------------------------------------------------------- 把对象按字母排序

  let collectionMarketSet = new Set(this.collectionMarket)

  let o = [{}, {}];
  Object.keys(mSymbolList).sort().forEach(symbol => {
    let currency = symbol.split('_')[1];
    if (!currency) return;
    let initData = {};
    initData.name = symbol;
    [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...mSymbolList[symbol]]
    // 如果是超级为蜜区
    // if (this.specialSymbol[0] && this.specialSymbol[0].has(symbol)) {
    //   !o[1][currency] && (o[1][currency] = [])
    //   o[1][currency].push(initData)
    //   return
    // }

    /*!o[0].optionalArea && (o[0].optionalArea = [])
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
    }*/

    // 如果不是
    !o[0][currency] && (o[0][currency] = []);
    o[0][currency].push(initData);
  })


  // console.log('oooo=======',o)
  return o
}

// 选中的市场数据
root.computed.computedMarketList = function () {
  let ans = this.selectMarketChange
  // if(this.selectMarket[this.selectEdition] === this.$t('Favorites'))return this.mSymbolList[this.selectEdition].optionalArea
  // if(this.selectMarket[this.selectEdition] === this.$t('Innovation'))return this.mSymbolList[this.selectEdition].createArea
  // console.log('hhhhh====',this.mSymbolList,this.selectEdition,this.selectMarket,this.selectEdition)
  return this.mSymbolList.length != 0 && (this.mSymbolList[this.selectEdition][this.selectMarket[this.selectEdition]] || [])//.sort((a,b)=>!b.open && b.open - a.open) || []
}



// // ajax获取的数据2
// root.computed.mSymbolList = function () {
//   // 把对象按字母排序
//   let mSymbolList = this.$globalFunc.mergeObj(this.socket_price, this.marketSymbolList);
//   let o = [];
//   let count = 0;
//   // Object.keys(mSymbolList).sort().forEach(symbol => {
//   Object.keys(mSymbolList).forEach(symbol => {
//     // if(this.filterCurrency.indexOf(symbol) != -1) {
//
//     let currency = symbol.split('_')[1];
//     if (!currency) return;
//     let initData = {};
//     initData.name = symbol;
//     [initData.time, initData.open, initData.high, initData.low, initData.close, initData.volume] = [...mSymbolList[symbol]]
//
//     if(initData.time == 0 || initData.open == 0 || initData.high == 0 || initData.low == 0){
//       count++;
//     }
//     o.push(initData);
//     // }
//
//   })
//   // console.log("o====="+o.length);
//   // console.log("count====="+count);
//
//   if(count != o.length){
//     this.biduival = o;
//   }
//   return this.biduival;
// }
//
// // 选中的市场数据2
// root.computed.computedMarketList = function () {
//   let ans = this.selectMarketChange
//   return this.mSymbolList || []
// }

// 获取当前symbol
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}
//不加下划线币对集合
root.computed.sNameList = function () {
  return this.$store.state.sNameList;
}

//时价初始化标识数组
root.computed.initPriceSymbol = function () {
  return this.$store.state.initPriceSymbol;
}

// 18-2-7 新加  end
root.computed.lang = function () {
  return this.$store.state.lang;
}

/*// 是否免费
root.computed.reduce_list = function () {
  let symbol_list = this.$store.state.reduce_fee;
  let ans = this.selectMarketChange
  let currentMarketList = this.mSymbolList[this.selectEdition]
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
}*/

// 2018-4-4  start
root.watch = {};

// // 模糊搜索
root.watch.searchText = function(v){
  // console.log(this.changeInputValue)
  // console.log(this.computedMarketList.name )
  // console.log('this.searchList====111',this.searchList)

  this.searchList = this.mSymbolList.filter(v=>v.s.includes(this.searchText) || v.s.includes(this.searchText.toUpperCase()))

  // console.log('this.searchList====',this.searchList , this.computedMarketList)

}

// 2018-4-4  end

// 判断选中的是哪个市场  18-4-9 新加
/*root.watch.mSymbolList = function (newValue, oldValue) {
  if (!this.clickTab) this.initTab()
}*/

root.watch.symbol = function (newValue, oldValue) {
  if (newValue == oldValue) return
}



root.methods = {}
//价格处理
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
// root.methods.search  = function (){
//   console.log(this.searchText , this.mSymbolList)
// }

// 切换星星是否显示
// 切换图片的选中状态
// root.methods.toggleSelect = function (value,key) {
//   console.log(value)
//   if (this.selectStar.indexOf(value.name) === -1) {
//     this.selectStar.push(value.name)
//     // this.getCollectionMarket()
//     this.handleCollectionMarket(value.name,true)
//     console.log(this.mSymbolList[this.selectEdition].optionalArea)
//     return;
//   }
//   this.selectStar.splice(this.selectStar.indexOf(value.name),1)
//   this.handleCollectionMarket(value.name,false)
//   console.log(key)
// }


// 计算当前币对折合多少人民币  2018-4-4 start
root.methods.get_now_price = function (key, price,name) {
  if (!this.btc_eth_rate.dataMap) return;
  let rate;
  let rateObj = this.btc_eth_rate.dataMap.exchangeRate;

  this.exchangeRate['USDT'] = 1
  this.exchangeRate['BTC'] = rateObj.btcExchangeRate || 0
  this.exchangeRate['ETH'] = rateObj.ethExchangeRate || 0
  this.exchangeRate['BDB'] = rateObj.ethExchangeRate * this.bdb_rate || 0

  let lang = this.lang;

  // rate = this.exchangeRate[this.selectMarket[this.selectEdition]] || 0
  rate = this.exchangeRate[name.split('_')[1]] || 0

  if (lang === 'CH') {
    this.change_price = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    this.change_price = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  // console.log(this.$store.state.exchange_rate_dollar)
  // 展示价格
  this.show_key = key;
  let top = $(this.$refs.scroll_top).scrollTop();
  this.tips_top = (key * 28 - top + 2) + 'px';
}

root.methods.hide_now_price = function () {
  this.show_key = '-1';
}
// 2018-4-4  end

// 切换btc或eth
root.methods.tabChange = function (type, name) {
  this.marcketType = type;
  this.select_name = name;
}

// 初始化切换栏
root.methods.initTab = function () {
  for (let i = 0; i < this.mSymbolList.length; i++) {
    if (!this.mSymbolList[i]) continue
    for (let j in this.mSymbolList[i]) {
      let marketList = this.mSymbolList[i][j]
      if (!marketList) continue
      for (let k = 0; k < marketList.length; k++) {
        //处理挖矿区域
        if(this.createMarket.includes(this.symbol)){
          this.selectEdition = i;
          this.selectMarket[i] = this.$t('Innovation');
          return
        }
        //处理其他区域
        if (marketList[k].name === this.symbol) {
          this.selectEdition = i;
          this.selectMarket[i] = marketList[k].name.split('_')[1]
          return
        }
      }
    }
  }
}

// 获取位数配置
root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale, this.quoteScale = v.quoteScale)
    }
  )
}

// 切换成交与涨跌
root.methods.changeType = function (type) {
  this.volumeType = !this.volumeType;
}

// 位数保留计算
root.methods.formatnumber = function (value, num) {
  if (value == undefined) return
  var a, b, c, i;
  a = value.toString();
  b = a.indexOf(".");
  c = a.length;
  if (num == 0) {
    if (b != -1) {
      a = a.substring(0, b);
    }
  } else { //如果没有小数点
    if (b == -1) {
      a = a + ".";
      for (i = 1; i <= num; i++) {
        a = a + "0";
      }
    } else { //有小数点，超出位数自动截取，否则补0
      a = a.substring(0, b + num + 1);
      for (i = c; i <= b + num; i++) {
        a = a + "0";
      }
    }
  }
  return a;
}


//点击货币对 切换整个页面symbol
root.methods.slectSymbol = function (s, item) {
  let symbol = this.sNameMap[s]
  //700ms内不能重复调用
  if(this.$store.state.symbol == symbol || (Date.now() - this.lastTime < 700))return;

  this.lastTime = Date.now();

  // 把时价带入到progressBar里
  let quoteScale = 8
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === symbol && (quoteScale = v.quoteScale)
    }
  )
  this.$eventBus.notify({
    key: 'SET_PRICE'
  }, this.$globalFunc.accFixed(item.close, quoteScale))

  //  console.log(item.close)
  // this.$socket.emit('unsubscribe', {
  //   symbol: this.$store.state.symbol
  // });
  // this.$store.commit('SET_SYMBOL', symbol);
  // 把当前选中的币对写入cookie
  let user_id = this.$store.state.authState.userId;
  let user_id_symbol = user_id + '-' + symbol;
  // if(!this.isLogin){
  !user_id && this.$cookies.set('unlogin_contract_symbol_cookie', symbol, 60 * 60 * 24 * 30,"/");
  // this.$store.commit('SET_SYMBOL', symbol);
  // }
  // !!user_id && this.$cookies.set('contract_symbol_cookie', user_id_symbol, 60 * 60 * 24);
  !!user_id && this.$cookies.set('contract_symbol_cookie', user_id_symbol, 60 * 60 * 24 * 30,"/");
  this.$store.commit('SET_SYMBOL', symbol);
  // 清空委托列表
  this.$store.commit('GET_OPEN_ORDER', []);

  this.$socket.changeSymbol(s)

}


root.updated = function () {
  this.priceInitialization()
}
// 价格初始化
root.methods.priceInitialization = function () {
  let quoteScale = 8
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (quoteScale = v.quoteScale)
    }
  )

  let computedMarketList = this.computedMarketList || []


  let a = 0

  computedMarketList.forEach(b => {
    if (b.name === this.$store.state.symbol) {
      a = b.close
    }
  })

  if (!a || this.pricesymbol.indexOf(this.$store.state.symbol) > -1){return};

  this.$eventBus.notify({
    key: 'SET_PRICE'
  }, this.$globalFunc.accFixed(a, quoteScale))
  // this.$store.commit('SET_INIT_PRICE_SYMBOL', this.$store.state.symbol)
  this.pricesymbol.push(this.$store.state.symbol)
  // console.log('this is initPriceSymbol', this.initPriceSymbol)
  // console.log('this.priceInitiali', this.pricesymbol)

}




// 点击切换版块
root.methods.changeEdition = function (type) {
  if (parseInt(type) === this.selectEdition) return
  this.selectEdition = parseInt(type)
  this.clickTab = true
}
// 点击切换版块下的市场
root.methods.changeMarket = function (market) {
  // console.log(market)
  this.selectMarket[this.selectEdition] = market
  this.selectMarketChange = !this.selectMarketChange
  this.clickTab = true
}
// 选中的市场
root.methods.selectedMarket = function (item) {
  return this.selectMarket[this.selectEdition] === item
}

//sss===
//获取USDT汇率
root.methods.getUSDThl = function () {
  // var doollar = localStorage.getItem("exchange_rate_dollar_usdt");
  // this.$store.commit('changeExchange_rate_dollar', doollar);
  // // 循环请求
  // this.exchangeRateInterval = setInterval(() => {
  //   axios('https://otc-api.huobi.co/v1/data/market/detail', {
  //     timeout: 50000
  //   }).then(({
  //     data
  //   }) => {
  //     if (data.success) {
  //       var detaildata = data.data.detail;
  //       detaildata.forEach((item) => {
  //         if (item.coinName == 'USDT') {
  //           this.$store.commit('changeExchange_rate_dollar', item.buy);
  //           localStorage.setItem("exchange_rate_dollar_usdt", item.buy);
  //         }
  //       })
  //     } else {
  //       this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //       this.$store.commit('changeExchange_rate_dollar', this.dollar_usdt);
  //     }
  //   }).catch(response => {
  //     this.dollar_usdt = localStorage.getItem("exchange_rate_dollar_usdt");
  //     this.$store.commit('changeExchange_rate_dollar', this.dollar_usdt);
  //   })
  // }, 60000)
}

// 获取自选区市场列表
root.methods.getCollectionMarket = function () {
  if (!this.isLogin) {
    try {
      this.collectionMarket = JSON.parse(this.$cookies.get('COLLECTION_MARKET1')) || []
      // console.log(this.collectionMarket)
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
    console.log(collectionMarkets)
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
  this.$cookies.set('COLLECTION_MARKET', JSON.stringify(this.collectionMarket))
  console.warn('添加自选')

  this.$http.send('POST_COLLECTION_SYMBOL', {
    bind: this,
    params: {
      symbol: symbol,
      status: type
    }
  }).then(({data}) => {
    // console.log(data)
    typeof data === 'string' && (data = JSON.parse(data))
    console.warn('绑定取消自选', data)
    this.getCollectionMarket()
  }).catch(e => {
      console.warn('绑定取消自选出错', e)
    })
   return false
}

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/


export default root
