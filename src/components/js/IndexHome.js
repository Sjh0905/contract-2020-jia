const root = {};

root.name = 'IndexHome';

root.data = function () {
  return {
    popOpen: false,
    loading: false,

    // 货币对列表
    currency_list: {},
    // btc和eth汇率
    btc_eth_rate: {},

    // socket推送信息
    socket_price: {}, //总价格

    // 公告参数
    notice_list: [],
    offset: 0,//从第几个开始
    maxResults: 3, //请求个数

    // banner 列表
    banner_list: [],

    // pictureOpen: false, // 2018-8-7 图片活动提示

    // 关闭国内服务弹框提示
    popWindowOpen: false,

    // 主题色
    // themeColor: 'dark',

    show: true,
    showload:true,
    show3:true,
    kmdongx:true,

    isApp:false,
    isIOS:false

  }
}

root.created = function () {

  this.$store.commit('changeJoinus', false);

  // 请求btc->cny汇率，header需要
  this.getExchangeRate();


  // this.delay = setTimeout(function () {
  // 	console.log(1)
  // 	this.sphere = 1;
  // }.bind(this),500)
  this.delay = setTimeout(function () {
    // console.log(2)
    this.sphere = 2;
  }.bind(this), 1500)
  this.delay = setTimeout(function () {
    // console.log(3)
    this.sphere = 3;
  }.bind(this), 3000)
  this.delay = setTimeout(function () {
    // console.log(4)
    this.sphere = 4;
  }.bind(this), 4500)
  this.$store.commit('changeMobileTradingHallFlag', false)
  this.$store.commit('SET_HALL_SYMBOL', true)

  setTimeout(function () {
    this.closeLoad();
  }.bind(this), 1500)

  setTimeout(function () {
      this.kmdongx = !this.kmdongx;
    }.bind(this), 3000)

  //
  // // 2018-8-7 是否打开图片提示
  // this.isOpenPicture()

  // 2018-8-25 关闭国内服务提示
  // this.SHOW_CLOSE_TIPS();

}


root.components = {
  'IndexHeaderAssets': resolve => require(['../vue/IndexHeaderAssets'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'IndexHeader': resolve => require(['../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
  'IndexHomeMarket': resolve => require(['../vue/IndexHomeMarket'], resolve),
  'BtActivity': resolve => require(['../btActivity/vue/IndexHomeBtActivity'], resolve),
  'PopupPicture': resolve => require(['../vue/BasePopupPicture'], resolve),

  'IndexHomeCarousel': resolve => require(['../vue/IndexHomeCarousel'], resolve),
  'IndexHomeMarketRank': resolve => require(['../vue/IndexHomeMarketRank'], resolve),
  'IndexHomeInfo': resolve => require(['../vue/IndexHomeInfo'], resolve),
  // 'IndexHomeMarketRank': resolve => require(['../vue/IndexHomeMarketRank'], resolve),
  // 'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}

root.mounted = function () {
  // 2018-3-28 添加  start
  // 获取banner信息
  this.GET_BANNER();
  // 获取通告信息
  this.GET_NOTICE();
  // 获取市场列表
  this.GET_MARKET();
  // 2018-3-28 添加  end
}

root.computed = {}

// 显示语言
root.computed.lang = function () {
  return this.$store.state.lang
}

// 语言选项
root.computed.languageId = function () {
  if (this.$store.state.lang === 'CH') return 1
  if (this.$store.state.lang === 'EN') return 2
  if (this.$store.state.lang === 'CA') return 3
  return 1
}

// 主题色
root.computed.themeColor = function () {
  return this.$store.state.themeColor
}

root.methods = {}


// 2018-3-28 添加  start  -------------------------------------------
// 跳转到详情
root.methods.GO_DETAIL = function (id) {
  let url = '/index/notice/noticeDetail?id=' + id;
  this.$router.push(url);
}
// 获取banner
root.methods.GET_BANNER = function () {
  this.$http.send('GET_HOME_BANNER', {
    bind: this,
    callBack: this.RE_GET_HOME_BANNER
  });
}
root.methods.RE_GET_HOME_BANNER = function (res) {
  this.banner_list = res;
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
  this.notice_list = res;
}
// 获取市场列表
root.methods.GET_MARKET = function () {
  // 初始化数据请求
  this.initGetDatas();
  // 初始化socket
  // this.initSocket();
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
  console.log(data)
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
      // console.log('222222222',message)
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

// 格式化通告 15个字符
root.methods.SubStr = function (value) {
  let len = value.length;
  if (len > 15) {
    return value.substr(0, 15) + '...';
  } else {
    return value;
  }
}

// 组件卸载前取消订阅
root.beforeDestroy = function () {
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
}


// 2018-3-28 添加  end  -------------------------------------------------


// 切换语言
root.methods.changeLanguage = function (lang) {
  this.$eventBus.notify({key: 'LANGCHANGED'}, lang)
}

// 登出
root.methods.loginOff = function () {
  this.$http.send('LOGIN_OFF',
    {
      bind: this,
      params: {},
      callBack: this.re_login_off_callback
    }
  )
}
// 登出回调
root.methods.re_login_off_callback = function (data) {
  // 清除cookie
  this.$cookies.remove("popShow");
  this.$store.commit('LOGIN_OUT');
  // this.$router.go(0);
  this.$router.push('index/sign/login')
}

//移动端是否显示右侧菜单
root.methods.clickChangePopOpen = function () {
  this.$store.commit('changeMobilePopOpen', !this.$store.state.mobilePopOpen)
}

root.methods.goToPersonal = function () {

}
// 打开客服对话框
root.methods.openYsf = function () {
  ysf.config({
    uid: this.$store.state.authMessage.userId && this.$store.state.authMessage.userId || "无",
    email: this.$store.state.authMessage.email && this.$store.state.authMessage.email || "无",

  });
  ysf.open();
}


// 判断是否是手机
root.computed.isMobile = function () {
  return this.$store.state.isMobile
}
root.computed.mobileHeaderTitle = function () {
  return this.$store.state.mobileHeaderTitle;
}
// 是否登录
root.computed.isLogin = function () {
  if (this.$store.state.authMessage.userId !== '') return true
  return false
}
// 是否显示右侧菜单
root.computed.changePopOpen = function () {
  if (this.$store.state.mobilePopOpen === true) return true
  return false
}

// 返回用户邮箱
root.computed.userName = function () {
  return this.$store.state.authMessage.email
}

// 观测currency是否发生变化
root.computed.watchCurrency = function () {
  return this.$store.state.currencyChange
}
// 计价货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 用户名
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 语言
root.computed.lang = function () {
  return this.$store.state.lang
}

/*----------------------- 观察 --------------------------*/

root.watch = {}
root.watch.watchCurrency = function () {
  this.changeAppraisement(this.currentPrice)
}
root.watch.lang = function (newValue, oldValue) {
  if (newValue == oldValue) return;
  this.GET_NOTICE();
}


/*----------------------- 方法 --------------------------*/


// 获取初始data
root.methods.getInitData = function () {
  this.$http.send('MARKET_PRICES', {
    bind: this,
    callBack: this.re_getInitData,
    errorHandler: this.error_getInitData
  })
}
// 返回初始data
root.methods.re_getInitData = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('获取了初始化数据', data)
  this.initData = data
  this.changeAppraisement(this.initData)
}
// 获取data出错
root.methods.error_getInitData = function (err) {
  console.warn('获取init数据出错', err)
}

// 获取币种和账户
root.methods.getCurrencyAndAccount = function () {
  let currency = [...this.$store.state.currency.values()]
  if (currency.length === 0) {
    // 先获取币种
    this.getCurrency()
    return
  }
  // 再获取账户
  this.getAccounts()
}

// 获取币种
root.methods.getCurrency = function () {
  this.$http.send("GET_CURRENCY", {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency
  })
}

// 获取币种回调
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data.dataMap || !data.dataMap.currencys) {
    // console.warn("拿回了奇怪的东西！", data)
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // 获取账户信息
  this.getAccounts()
}
// 获取币种出错
root.methods.error_getCurrency = function (err) {
  console.warn('获取币种列表出错！', err)
}

// 获取账户信息 登录后才可获取
root.methods.getAccounts = function () {
  // 请求各项估值
  !!this.$store.state.authMessage.userId && this.$http.send('RECHARGE_AND_WITHDRAWALS_RECORD', {
    bind: this,
    callBack: this.re_getAccount,
    errorHandler: this.error_getAccount
  })
}

// 获取账户信息回调
root.methods.re_getAccount = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.accounts) {
    console.warn("拿回了奇怪的东西！", data)
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  this.accountReady = true
  // this.loading = !(this.accountReady && this.priceReady)
}

// 获取账户信息出错
root.methods.error_getAccount = function (err) {
  console.warn('获取账户信息出错', err)
}
// 通过socket获取价格
root.methods.getPrice = function () {
  this.$socket.on({
    key: 'topic_prices',
    bind: this,
    callBack: this.re_getPrice
  })
}

// 通过socket获取价格的回调
root.methods.re_getPrice = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.priceReady = true
  // this.loading = !(this.accountReady && this.priceReady)

  this.currentPrice = data
  this.changeAppraisement(data)

}
// 修改估值
root.methods.changeAppraisement = function (dataObj) {
  typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj))
  let data = this.$globalFunc.mergeObj(dataObj, this.initData)
  this.initData = data
  if (!data) return

  let total = 0
  let frozen = 0
  let available = 0

  for (let key in data) {
    let targetName = key.split('_')[0]
    let baseName = key.split('_')[1]
    if (baseName !== this.baseCurrency) continue
    let targetObj = this.$store.state.currency.get(targetName)
    if (!targetObj) continue
    total += targetObj.total * data[key][4]
    frozen += targetObj.frozen * data[key][4]
    available += targetObj.available * data[key][4]
  }

  // 特殊处理，作为base的货币也要加进去
  let baseCurrencyHandle = this.$store.state.currency.get(this.baseCurrency)
  if (baseCurrencyHandle) {
    total += baseCurrencyHandle.total
    frozen += baseCurrencyHandle.frozen
    available += baseCurrencyHandle.available
  }

  this.total = total
  this.frozen = frozen
  this.available = available
}
//
// // 2018-8-7 是否打开图片提示
// root.methods.isOpenPicture = function () {
//   let time = this.$cookies.get('PICTURE_OPEN_TIME' + this.lang)
//   if (time && this.$globalFunc.formatDateUitl(parseFloat(time), 'YYYY-MM-DD') === this.$globalFunc.formatDateUitl(new Date().getTime(), 'YYYY-MM-DD')) {
//     return
//   }
//   this.openPicture()
// }
//
// // 2018-8-7 打开图片弹窗提示
// root.methods.openPicture = function () {
//   this.pictureOpen = true
// }
//
// // 2018-8-7 关闭图片弹窗提示
// root.methods.closePicturePopup = function () {
//   this.$cookies.set('PICTURE_OPEN_TIME' + this.lang, new Date().getTime())
//   this.pictureOpen = false
// }
//
// // 2018-8-7 去公告中心
// root.methods.goToNotice = function () {
//   this.$cookies.set('PICTURE_OPEN_TIME' + this.lang, new Date().getTime())
//   this.$router.push({name: 'noticeDetail', query: {id: 100281}})
// }


// 关闭弹框 2018-8-25
root.methods.SHOW_CLOSE_TIPS = function () {
  let time = this.$cookies.get('CLOSE_WEB' + this.lang)
  if ((time && this.$globalFunc.formatDateUitl(parseFloat(time), 'YYYY-MM-DD') === this.$globalFunc.formatDateUitl(new Date().getTime(), 'YYYY-MM-DD'))) {
    return
  }
  this.OPEN_TIPS()
}

// 2018-8-25 打开关闭提示
root.methods.OPEN_TIPS = function () {
  this.popWindowOpen = true
}
root.methods.popWindowClose = function () {
  this.$cookies.set('CLOSE_WEB' + this.lang, new Date().getTime())
  this.popWindowOpen = false;
}

root.methods.closeLoad = function () {
  this.show3 = !this.show3;
  this.show = !this.show;
  this.showload = !this.showload;
}


root.methods.isAppQuery = function (query) {
  if(this.$route.query.isApp) {
    this.isApp = true
  } else {
    this.isApp = false
  }
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if(this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

export default root


