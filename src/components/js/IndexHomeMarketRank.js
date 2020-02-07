const root = {}
root.name = 'IndexHomeMarketRank'
/*------------------------------ 组件 ------------------------------*/
//root.components = {
//  'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
//}
/*------------------------------ data -------------------------------*/
root.props = {}
root.props.currency_list = {
  type: Object,
  default: {}
}
root.props.socket_price = {
  type: Object,
  default: {}
}
root.props.btc_eth_rate = {
  type: Object,
  default: {}
}

root.data = function () {
  return {
    rankList: [],
    rankListReady: false,
    noticeList: [],
    noticelength:'',
    exchangeRate: {},
    offset: 0,//从第几个开始
    maxResults: 4, //请求个数
    screenWidth: document.body.clientWidth,     // 屏幕宽
    screeHeight: document.body.clientHeight,    // 屏幕高
    biduinum:4,
    //首页公告下边的横向展示币对
    homePageSymbols:[],
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.screenWidth<1450){
    this.biduinum = 4;
  }else{
    this.biduinum = 6;
  }
  this.getMarketRank()
  this.GET_NOTICE()
  // 获取轮播图下方币对信息
  this.getBiDuiInfo()
}
root.mounted = function () {
}
root.beforeDestroy = function () {
}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 主题颜色
root.computed.themeColor = function () {
  return this.$store.state.themeColor || 0
}
// 加载中
root.computed.loading = function () {
  return !this.rankListReady
}
// 语言
root.computed.lang = function () {
  return this.$store.state.lang;
}
// 排序对象
root.computed.computedRankList = function () {
  let ans = []
  if (this.loading) return []
  // console.log("this.currency_list-------"+JSON.stringify(this.currency_list));
  let currencyList = this.$globalFunc.mergeObj(this.socket_price, this.currency_list);
  ans = this.rankList
  ans.forEach(v => {
    let symbol = v.symbol
    v.price = currencyList[symbol] && currencyList[symbol][4] || 0
  })
  // console.log("ans-------"+JSON.stringify(ans));
  return ans
}

// 循环出来的items
root.computed.computedRankLists = function () {
  // let ans = this.selectMarketChange
  if(!(this.homePageSymbols instanceof Array) || !((this.computedRankList) instanceof Array)) return []
  // console.log(this.currencylist)
  let temp = [];
  this.homePageSymbols.length > 4 && (this.homePageSymbols.length = 4)
  this.homePageSymbols.forEach(symbol=>{
    let item = this.computedRankList.find(v => v && v.symbol == symbol)
    item && temp.push(item);
  })
  return temp || []
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}

root.watch.lang = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.GET_NOTICE();
}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
root.methods.getMarketRank = function () {
  this.$http.send('GET_MARKET_RANK', {bind: this})
    .then(({data}) => {
      typeof data === 'string' && (data = JSON.parse(data))
      // console.warn('this is data,what', data)
      this.rankListReady = true
      this.rankList = data
    })
    .catch(e => {
      console.warn('出错', e)
    })
}

// 24小时涨跌百分比 (现价 - 开盘价) / 开盘价
root.methods.diff24Ratio = function (now_price, open_price) {
  let diff = this.toFixed(this.accMul(this.accDiv(this.accMinus(now_price, open_price), open_price || 1), 100), 2)
  return diff
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
  rate = this.exchangeRate[symbol] || 0
  if (lang === 'CH') {
    ans = ('￥' + this.$globalFunc.accFixedCny(this.$store.state.exchange_rate_dollar * (price * rate), 2));
  } else {
    ans = ('$' + this.$globalFunc.accFixedCny((price * rate), 2));
  }
  return ans
}

// 获取首页币对信息
root.methods.getBiDuiInfo = function () {
  this.$http.send('GET_HOMEPAGE_SYMBOLS', {
    bind: this,
    urlFragment:'PC',
    callBack: this.re_getBiDuiInfoList,
    errorHandler: this.error_getBiDuiInfoList
  });
}

root.methods.re_getBiDuiInfoList = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.log(data)
  data && (this.homePageSymbols = data)
}

root.methods.error_getBiDuiInfoList = function (err) {
  console.error('请求失败', err);
}

// 点击市场跳转
root.methods.clickToGoTradingHall = function (symbol) {
  this.$store.commit('SET_SYMBOL', symbol);
  let user_id = this.$store.state.authMessage.userId;
  let user_id_symbol = user_id + '-' + symbol;
  !!user_id && this.$cookies.set('user_symbol_cookie', user_id_symbol, 60 * 60 * 24)
  this.$router.push({name: 'tradingHall'})
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

root.computed.hideNotice = function () {
  // if (this.lang === 'KOR') return true;
  return false;
}

// 语言选项
root.computed.languageId = function () {
  if (this.$store.state.lang === 'CH') return 1
  if (this.$store.state.lang === 'EN') return 2
  if (this.$store.state.lang === 'CA') return 3
  if (this.$store.state.lang === 'KOR') return 3
  if (this.$store.state.lang === 'JP') return 3
  return 1
}
// 获取通告信息
root.methods.GET_NOTICE = function () {
  this.$http.send('POST_NOTICE_LIST', {
    bind: this,
    params: {
      offset: this.offset,
      maxResults: this.maxResults,
      languageId: this.languageId,
    },
    callBack: this.RE_GET_NOTICE
  });
}
// 渲染通告列表
root.methods.RE_GET_NOTICE = function (res) {
  this.noticelength = res.length;
  // console.log(res)
  this.noticeList = res;


// console.log(res,'hahhahhah')
//   this.noticeList = [
//     {beginTime:1570885172000,title:'正式开放注册启事',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360034740012-%E6%AD%A3%E5%BC%8F%E5%BC%80%E6%94%BE%E6%B3%A8%E5%86%8C%E5%90%AF%E4%BA%8B'},
//     {beginTime:1570885172000,title:'二零二零交易所验证邮件延迟',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360035114331-%E4%B8%AD%E7%A7%8B%E4%BA%A4%E6%98%93%E6%89%80%E9%AA%8C%E8%AF%81%E9%82%AE%E4%BB%B6%E5%BB%B6%E8%BF%9F%E5%85%AC%E5%91%8A'},
//     {beginTime:1570885172000,title:'关于二零二零交易所',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360035121071-%E5%85%B3%E4%BA%8E%E4%B8%AD%E7%A7%8B%E4%BA%A4%E6%98%93%E6%89%80'},
//     {beginTime:1570885172000,title:'二零二零交易所实名认证延迟',url:'https://customerservice8872.zendesk.com/hc/zh-cn/articles/360034740072-%E4%B8%AD%E7%A7%8B%E4%BA%A4%E6%98%93%E6%89%80%E5%AE%9E%E5%90%8D%E8%AE%A4%E8%AF%81%E5%BB%B6%E8%BF%9F%E5%85%AC%E5%91%8A'},
//   ]

}

root.methods.goNotice = function (res) {
  window.open(res)
  // this.$router.push({path: '/index/notice/noticeDetail', query: {id: res}})
//公告小图标跳转zendesk
}

root.methods.goPicNotice = function (res) {
//公告跳转zendesk
  if(this.$store.state.lang == 'CH'){
    window.open("https://customerservice8872.zendesk.com/hc/zh-cn/categories/360002253311-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83")
  }else{
    window.open("https://customerservice8872.zendesk.com/hc/en-001/categories/360002253311-Announcements")
  }
  // window.open("https://customerservice8872.zendesk.com/hc/zh-cn/categories/360002253311-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83")
//   let id
//   id=this.noticeList[0].id
//
//   this.noticeList.forEach(item=>{
//       if(item.sortsId==1){
//         id=item.id
//       }
//   })
//   console.log(id)
//
//   this.$router.push({path: '/index/notice/noticeDetail', query: {id:id}})

}



export default root

