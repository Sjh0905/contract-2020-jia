import logo from '../../assets/download-icon.png'
const root = {}
root.name = 'IndexHeader'

/*------------------------------- 组件 --------------------------------*/

root.components = {
  'IndexHeaderAssets': resolve => require(['../vue/IndexHeaderAssets'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'Qrcode': resolve => require(['qrcode-vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}



/*----------------------- props --------------------------*/
root.props = {}
// 下拉条黑色版本
root.props.black = {
  type: [Boolean, String],
  default: false
}

// 是否开启换肤
root.props.changeThemeColor = {
  type: [Boolean, String],
  default: false
}


/*------------------------------- data --------------------------------*/

root.data = function () {
  return {
    loading: false, // 加载中
    popOpen: false,
    languageFlag: 'language-img-china',
    notice_tips: this.$store.state.lang == 'CH' ? 'TwentyTwenty 上线IOST，送币活动火热开启！活动期间注册、充值IOST送IOST,数量有限，先到先得！交易前50名更有IOST奖励，最高4万IOST！' : 'TwentyTwenty  lists IOST, get IOST bonus now! Register during the event, make a deposit, will get IOST bonus! Whoever comes first will get the bonus, until all are given out. Top 50 members with high IOST transaction volume will get up-to 40,000 IOST!',
    noticeInterval: '',
    // 语言按钮切换
    jtval:false,
    // 钱包按钮切换
    moneyVal:false,
    // 订单按钮切换
    orderVal:false,
    // 活动
    activeVal:true,
    // 字体切换
    jttext:'',
    logo: logo,
    size: 124,
    bgColor: '#fff',
    fgColor: '#000',
    value: '',
    // downloadShow: true,
    noticeList: [],
    noticelength:'',
    offset: 0,//从第几个开始
    maxResults: 3, //请求个数
    // 货币对列表
    currency_list: {},
    // btc和eth汇率
    btc_eth_rate: {},

    // socket推送信息
    socket_price: {}, //总价格


    // targetHours : [3 , 6 , 9 , 12 , 15 , 18 , 21 , 0],
    targetHours : [3 , 6 , 9 , 12 , 15 , 18 , 21 , 0],
    targetMinutes : [0],
    // targetMinutes : [60,50,51,52,53,54,55,56,57,58,59],

    // targetHours : [0,1],
    // targetMinutes : [35]
    showAssets:false,

    idType: '',
    groupId: '',
    isExist: true,
    account: '',
    // uuid:'0'

    popType: 0,
    // popOpen: false,
    popText: '系统繁忙',

  }
}

/*------------------------------- 生命周期 --------------------------------*/

root.created = function () {
  // 获取小红点
  if (this.isLogin) {
    this.getNoticeRedPoint()
  }
  if (!this.isLogin) {
    this.$store.commit('changeNoticeRedPoint', false);
  }
  this.getLangVal()

  this.GET_COOKIE();

  this.GET_NOTICE();

  this.$store.commit('SET_SERVER_TIME_CALL_BACK',this.refreshGRCPriceRange);

  if (this.isLogin) {
    this.getCheck(); //是不是会员
  }


  this.$eventBus.listen(this, 'CHECK_IS_VIP', this.getCheck);

}


/*------------------------------- 组件 --------------------------------*/

root.mounted = function () {
  // this.value = this.staticUrl + '/AppDownload'
  this.value = 'https://download.2020.exchange/'
  this.size = 124 /  window.devicePixelRatio
}

root.computed = {}

// // uid
// root.computed.uuid = function () {
//   if(this.$store.state.authMessage.uuid == undefined){
//     return this.$store.state.authMessage.userId
//   }
//   return this.$store.state.authMessage.uuid
// }


// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

// 是否是会员
root.computed.flag = function () {
  // console.log('flag======',this.$store.state.flag)
  return this.$store.state.isVIP.flag
}



root.computed.mobileLoginShow = function () {
  return this.$store.state.mobileLoginShow;
}

// 当前主题颜色
root.computed.themeColor = function () {
  return this.$store.state.themeColor
}

// 是否可以改变主题颜色
root.computed.isBlack = function () {
  if (!this.changeThemeColor) return this.black
  return this.themeColor === 0
}

// 计算是否在资产页
root.computed.AssetRecharge = function () {
  if(this.$route.query = 'mobileAssetRechargeAndWithdrawals'){
    return 'true'
  }
  return  'false' ;
}


// 计算当前symbol
root.computed.symbol = function () {
  // console.warn('symbol',this.$store.state.symbol);
  return this.$store.state.symbol;
}

root.computed.downloadShow = function(){
  return this.$store.state.downloadShow;
}



// 交易大厅 or 交易详情
root.computed.hall_symbol = function () {
  return this.$store.state.hall_symbol;
}
root.computed.mobileTradingHallFlag = function () {
  return this.$store.state.mobileTradingHallFlag;
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

// 是否为交易大厅界面
root.computed.isTradingHall = function () {
  if (this.$route.name == 'tradingHall' && this.$store.state.serverTime > 1522375200000) {
    return true;
  } else {
    return false;
  }
}

// 返回用户邮箱

// 用户类型，如果是手机用户，为0，如果是邮箱用户，为1
root.computed.userType = function () {
  return this.$store.state.authMessage && this.$store.state.authMessage.province === 'mobile' ? 0 : 1
}

// 邮箱
root.computed.userName = function () {
  if (this.userType === 0) {
    return this.$globalFunc.formatUserName(this.$store.state.authMessage.mobile)
  }
  if (!this.$store.state.authMessage.email) {
    return '****@****'
  }
  return this.$globalFunc.formatUserName(this.$store.state.authMessage.email)
}
root.computed.lang = function () {
  // 返回语言
  return this.$store.state.lang
}

root.computed.langNum = function () {

  if (this.lang === 'CH') {
    this.jttext = '简体中文';
    return 1
  }
  if (this.lang === 'CHT') {
    this.jttext = '繁体中文';
    return 2
  }
  if (this.lang === 'CA') {
    this.jttext = 'English';
    return 3
  }
  if (this.lang === 'KOR') {
    this.jttext = '한국어';
    return 4
  }
  if (this.lang === 'JP') {
    this.jttext = '日本語';
    return 5
  }
  return 1
}

root.computed.redPoint = function () {
  return this.$store.state.noticeRedPoint
}
// 主题色
root.computed.themeColor = function () {
  return this.$store.state.themeColor
}
//下载地址
root.computed.staticUrl = function () {
  //return this.$store.state.static_url
  return this.value;
}


root.watch = {}
root.watch.lang = function (newValue, oldValue) {
  this.getNoticeRedPoint()
  this.notice_tips = newValue == 'CH' ? 'TwentyTwenty 上线IOST，送币活动火热开启！活动期间注册、充值IOST送IOST,数量有限，先到先得！交易前50名更有IOST奖励，最高4万IOST！' : 'TwentyTwenty  lists IOST, get IOST bonus now! Register during the event, make a deposit, will get IOST bonus! Whoever comes first will get the bonus, until all are given out. Top 50 members with high IOST transaction volume will get up-to 40,000 IOST!'
  if (newValue == oldValue) return;
  this.GET_NOTICE();

}


root.watch.isLogin = function (newValue, oldValue) {
  if (newValue) {
    this.getNoticeRedPoint()
  }
  if (!newValue) {
    this.$store.commit('changeNoticeRedPoint', false);
  }
}

root.watch.redPoint = function (newValue, oldValue) {
  if (!newValue) {
    this.noticeInterval && clearInterval(this.noticeInterval)
    this.noticeInterval = setInterval(() => {
      this.getNoticeRedPoint()
    }, 600000)
  }
}


/*------------------------------- 方法 --------------------------------*/

root.methods = {}

//是否是会员get (query:{})
root.methods.getCheck= function () {

  this.$http.send('GET_CHECK', {
    bind: this,
    urlFragment: this.userId,
    // query:{
    //   gname: this.gname
    // },
    callBack: this.re_getCheck,
    errorHandler: this.error_getCheck
  })
}

root.methods.re_getCheck = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))

  this.data = data.data
  this.$store.commit('IS_VIP', data.data || {});
  console.log('是否是会员get-----',this.data)
}

root.methods.error_getCheck = function (err) {
  console.log("this.err=====",err)
}
root.methods.reFresh  = function () {
  if (this.$route.name == 'home') {
    this.$router.go(0)
  }
}


root.methods.getGroupLevel1 = function () {

  if (!this.isLogin) {
    this.$router.push('/index/sign/login')
    return;
  }

  if (this.isLogin) {
    this.popText = this.$t('indexHeader.forward') //参数有误
    this.popOpen = true
    this.popType = 3
    setTimeout(() => {
     this.popOpen = true
    }, 100)
     return;
  }

}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// 不会写  登陆用户组等级信息get (query:{})  未完成
root.methods.getGroupLevel = function () {

  if(!this.isLogin){
    this.$router.push('/index/sign/login')
    return;
  }
  this.$http.send('GET_ASSEMBLE_GET', {
    bind: this,
    urlFragment:this.userId,
    // query:{
    //   userId:this.uuid
    // },
    callBack: this.re_getGroupLevel,
    errorHandler: this.error_getGroupLevel
  })
}
root.methods.re_getGroupLevel = function (data) {
  // res = {
  //   "data": {
  //   "idType": 2,
  //     "groupId": 2,
  //     "isExist": true,
  //     "account": "yx.318@qq.cn"
  // },
  //   "status": "200",
  //   "message": "success"
  // }
  console.log("this.re_getGroupLevel登陆用户组等级信息 + data=====",data)
  typeof data === 'string' && (data = JSON.parse(data))
  this.idType = data.data.idType
  this.groupId = data.data.groupId
  this.isExist = data.data.isExist
  this.account = data.data.account

  if (this.isExist == true) {
    this.$router.push({name: 'detailsOfTheGroup'})
  }
  if (this.isExist == false) {
    this.$router.push({name: 'assembleARegiment'})
  }

}
root.methods.error_getGroupLevel = function (err) {
  console.log("this.err=====",err)
}


//判断是否刷新价格区间
root.methods.refreshGRCPriceRange = function (serverTime) {
  let date = new Date(serverTime)
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  // console.log("当前服务器时间",date.getHours(),date.getMinutes(),date.getSeconds());
  // console.log("当前服务器时间2",this.targetHours.indexOf(hour) > -1,this.targetMinutes.indexOf((minute+1)%60) > -1,second > 57);
  // console.log("当前服务器时间3",this.targetHours.indexOf(hour) > -1,this.targetMinutes.indexOf(minute%60) > -1,second < 3);
  //2 , 5 , 8 , 11 , 14 , 17 , 20 , 23 this.targetMinutes.indexOf(minute%60) > -1
  if(this.targetHours.indexOf((hour+1)%24) > -1 && (this.targetMinutes.indexOf((minute+1)%60) > -1) && second > 57){
    // console.log("当前服务器时间需要掉接口");
    this.$eventBus.notify({key: 'GET_GRC_PRICE_RANGE'});
  }

  //3 , 6 , 9 , 12 , 15 , 18 , 21 , 0
  if(this.targetHours.indexOf(hour) > -1 && (this.targetMinutes.indexOf(minute%60) > -1) && second < 3){
    // console.log("当前服务器时间需要掉接口");

    this.$eventBus.notify({key: 'GET_GRC_PRICE_RANGE'});

  }

}
// 切换语言
root.methods.changeLanguage = function (lang) {
  // console.log(lang)
  this.$eventBus.notify({key: 'LANGCHANGED'}, lang)
  this.$eventBus.notify({key: 'HOMEBANNER'}, lang)

}

root.methods.changeLanguageLS = function () {
  this.popText = this.$t('indexHeader.forward') //参数有误
  this.popOpen = true
  this.popType = 3
  setTimeout(() => {
    this.popOpen = true
  }, 100)
  return;
}

// 弹窗
root.methods.popClose = function () {
  this.popOpen = false
}

// cc 切换语言
root.methods.getLangVal = function(){
    if(this.$store.state.lang == 'CH'){
      this.jttext = '简体中文';
    }else if(this.$store.state.lang == 'CHT'){
      this.jttext = '繁体中文';
    }else if(this.$store.state.lang == 'CA'){
      this.jttext = 'English';
    }else if(this.$store.state.lang == 'JP'){
      this.jttext = '日本語';
    }else if(this.$store.state.lang == 'KOR'){
      this.jttext = '한국어';
    }
}
// root.methods.toHomeMarket = function(){
// this.$router.push('indexHomeMarket')
// }

// 跳到C2C页面
root.methods.GO_OTC = function () {
  // console.log("c2c_url-------------------c2c_url");
  let paras = this.$store.state.save_cookie;
  console.log("paras-------------------"+paras);
  // if (!paras) return;
  // if(!this.isLogin){
  //   this.$router.push('/index/sign/login?toUrl=c2c_url')
  //   // this.$router.push('/index/Transaction/TransactionBuy')
  //   return;
  // }
  let c2c_url = process.env.DOMAIN;
  // console.log(c2c_url)
  window.open(c2c_url);
}
// 跳到GRC页面
root.methods.GO_GRC = function () {
  if(!this.isLogin){
    this.$router.push('/index/sign/login?toUrl=GRC')
    return;
  }
  let paras = this.$store.state.save_cookie;
  typeof paras == 'string' && (paras = JSON.parse(paras))
  let _bitsession_ =paras.cookies && paras.cookies.value || '';
  let isApp = false;
  let userId = this.$store.state.authMessage.userId;
  let lang = this.$store.state.lang;
  let GRC_URL = this.$store.state.GRC_URL+'?'+'isApp='+isApp+'&_bitsession_='+_bitsession_+'&userId='+userId+'&lang='+lang;
  window.open(GRC_URL);
}

// 切换语言
root.methods.changeLanguage = function (lang) {
  this.$eventBus.notify({key: 'LANGCHANGED'}, lang)
  // this.$eventBus.notify({key: 'HOMEBANNER'}, this.GET_BANNER)
  // 获取小红点
  this.getNoticeRedPoint()
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
  window.location.reload();
}


// 请求公告顶部小红点
root.methods.getNoticeRedPoint = function () {
  this.$http.send('GET_READ_NOTICE',
    {
      bind: this,
      params: {
        languageId: this.langNum
      },
      callBack: this.re_get_notice_callback
    }
  )
}

root.methods.re_get_notice_callback = function (data) {
  // console.log('获取小红点', data.readNotice)
  data.readNotice && this.$store.commit('changeNoticeRedPoint', true);
  !data.readNotice && this.$store.commit('changeNoticeRedPoint', false);
  let that = this

  if (!data.readNotice) {
    that.noticeInterval && clearInterval(that.noticeInterval)
    that.noticeInterval = setInterval(() => {
      that.getNoticeRedPoint()
    }, 600000)
  }
}


//移动端是否显示右侧菜单
root.methods.clickChangePopOpen = function () {
  this.$store.commit('changeMobilePopOpen', !this.$store.state.mobilePopOpen)
}

// 移动端跳转交易大厅，打开交易大厅弹窗
root.methods.changeMobileTradingHallFlag = function () {
  this.$store.commit('changeMobileTradingHallFlag', false)
  this.$store.commit('SET_HALL_SYMBOL', true)
  this.$store.commit('changeMobilePopOpen', false)
}

// 移动端跳转当前委托和历史委托
root.methods.changeBuyOrSaleView = function (num) {
  // console.log(num)
  this.$store.commit('BUY_OR_SALE_TYPE', num)
  this.$store.commit('changeMobilePopOpen', false)
}

// 移动端跳转，关闭菜单
root.methods.closeMobilePopOpen = function () {
  this.$store.commit('changeMobilePopOpen', false)
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


root.methods.changeHeaderBoxFlag = function () {

  if (this.$route.name === 'mobileTradingHallDetail') {
    this.$store.commit('changeMobileTradingHallFlag', false);
    this.$store.commit('SET_HALL_SYMBOL', false);
    this.$router.push({name: 'mobileTradingHall', params: {source: 'mobileTradingHallDetail'}});

    return
  }


  if (this.$route.name !== 'mobileTradingHall') {

    this.$router.push('/index/mobileTradingHall')
  }
  this.$store.commit('changeMobileTradingHallFlag', !this.mobileTradingHallFlag);
}


root.methods.changeHeaderBoxFlag1 = function () {
  console.log(this.$route.name)
  if (this.$route.name == 'MobileAssetRechargeAndWithdrawals') {
    this.$router.push({name: 'MobileAssetRechargeAndWithdrawRecord'});
    return
  }
  this.$router.push({name: 'MobileAssetRechargeAndWithdrawRecord'});

}

// root.methods.foo = function () {
//
// }

// 获取cookie
root.methods.GET_COOKIE = function () {
  this.$http.send('GET_COOKIES', {
    bind: this,
    params: {},
    callBack: this.RE_GET_COOKIE
  })
}
root.methods.RE_GET_COOKIE = function (res) {
  let data = res.cookies;
  let params = {};
  for (let name in data) {
    if (name == 'value' || name == 'name' || name == 'maxAge' || name == 'secure' || name == 'httpOnly') {
      params[name] = data[name];
    }
  }
  let paras = JSON.stringify({cookies: params});
  this.$store.commit('SAVE_COOKIE', paras);
}
// 改变颜色
root.methods.clickToChangeThemeColor = function (n) {
  this.$store.commit('SET_THEME_COLOR', parseInt(n))
}


// 活动鼠标移入
root.methods.enterActive = function () {
  $(".langfont-active").attr("style","color: #fff;");
  this.activeVal = false;
}

root.methods.leaveActive = function () {
  $(".langfont-active").attr("style","color: (255, 255, 255, 0.8);");
  this.activeVal = true;
}

// 钱包鼠标移入
root.methods.enterMoney = function () {
  $(".langfont-money").attr("style","color: #fff;");
  this.moneyVal = false;
}

root.methods.leaveMoney = function () {
  $(".langfont-money").attr("style","color: (255, 255, 255, 0.8);");
  this.moneyVal = true;
}

// 钱包鼠标移入
root.methods.enterOrder = function () {
  $(".langfont-order").attr("style","color: #fff;");
  this.orderVal = false;
}

root.methods.leaveOrder = function () {
  $(".langfont-order").attr("style","color: (255, 255, 255, 0.8);");
  this.orderVal = true;
}



//鼠标移入改变语言文字样式和上下箭头
root.methods.enter = function () {
  $(".langfont").attr("style","color: #fff;");
  this.jtval = false;
}

//鼠标移入改变语言文字样式和上下箭头
root.methods.leave = function () {
  $(".langfont").attr("style","color: (255, 255, 255, 0.8);");
  this.jtval = true;
}

root.methods.go = function () {
  // window.open("https://TwentyTwenty help.zendesk.com/hc/zh-tw/sections/360005016974")
  // if(this.$store.state.lang == 'CH'){
  //   window.open("https://customerservice8872.zendesk.com/hc/zh-cn/categories/360002253311-%E5%85%AC%E5%91%8A%E4%B8%AD%E5%BF%83")
  // }else{
  //   window.open("https://customerservice8872.zendesk.com/hc/en-001/categories/360002253311-Announcements")
  // }

  // let id
  // id=this.noticeList[0].id
  // this.noticeList.forEach(item=>{
  //   console.log(item)
  //     if(item.sortsId == 1){
  //       id=item.id
  //     }
  // })
  // console.log(id,'aaaaaa')
  // this.$router.push({path: '/index/notice/noticeDetail', query: {id:id}})
  this.$router.push({path: '/index/notice'})
}


//鼠标移入改变语言文字样式和上下箭头
root.methods.appdownenter = function () {
  $(".navigation-item-hidden-erwm").attr("style","display:block");

}

//鼠标移入改变语言文字样式和上下箭头
root.methods.appdownleave = function () {
  $(".navigation-item-hidden-erwm").attr("style","display:none");
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
// TODO: 请求重复（暂时注释）
// root.methods.getCurrencyList = function () {
//   this.$http.send('COMMON_SYMBOLS', {
//     bind: this,
//     callBack: this.re_getCurrencyList
//   });
// }
//
// // 渲染币对列表信息
// root.methods.re_getCurrencyList = function (data) {
//   this.getPrices();
//   typeof(data) == 'string' && (data = JSON.parse(data));
//   let objs = this.symbolList_priceList(data);
//   this.currency_list = objs;
// }

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

// --------------- 关闭顶部下载弹窗 start ---------------

root.methods.closeDownload = function () {
  // console.log("-----------2222222");P
  // this.downloadShow = false;
  this.$store.commit('closeIsloadshow',false)
}

// --------------- 公告部分信息 ---------------

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
      columnId:this.$route.query.columnId
    },
    callBack: this.RE_GET_NOTICE
  });
}

// 渲染通告列表
root.methods.RE_GET_NOTICE = function (res) {
  this.noticelength = res.length;
  console.log(res)
  this.noticeList = res;
  // console.log(this.noticeList)
}

//公告跳转zendesk
root.methods.goNotice = function (res) {
  // window.open(res)
  // console.log(res)
  this.$router.push({path: '/index/notice/noticeDetail', query: {columnId:'0' , id: res}})
}

root.methods.goToNoticeCenter = function (id) {
  if(this.$route.name  == 'notice') {
    this.$eventBus.notify({key: 'GET_NOTICE_LIST'},id);
  }
  // this.$router.push({name: 'notice', query: {columnId: id}})
}
//
// // 更换类（区分h5和pc）
// root.methods.toggleClass = function () {
//  isMobile? 'HeaderCenter':'header_body_container'
// }

// 获取汇率


export default root
