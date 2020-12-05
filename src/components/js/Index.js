import fa from "element-ui/src/locale/lang/fa";
import tradingHallData from "../../dataUtils/TradingHallDataUtils";
import store from "../../configs/storeConfigs/StoreConfigs";

const REFRESH_KEY = 'refreshDataObj'
const REFRESH_TIME_STEP = 10000
const REFRESH_COUNT = 5

const root = {}
root.name = "index"


/*------------------------------ 组件 -------------------------------*/

root.components = {
  'IndexHeader': resolve => require(['../vue/IndexHeader'], resolve),
  'IndexFooter': resolve => require(['../vue/IndexFooter'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
}

/*------------------------------ data -------------------------------*/

root.data = function () {
  return {
    popOpen: false,
    bindEmailPopOpen: false,
    accountInterval: null,
    accountIntervalTime: 3000, //多长时间获取一次
    screenWidth: document.body.clientWidth,

    isApp: false,

    isIOS: false,
    isWhite:false,

    // 刷新频繁弹窗
    popWindowOpen:false,
    popWindowTitle : this.$t('prompt'),
    popWindowPrompt:this.$t('RefreshTooften'),

    getTimeInterval:null,
    getTimeout:10,
    show:false,
    borderTop:true,

    listenKey:'',
    socketConnected:false,
    listenKeyLoaded:false

  }
}


/*------------------------------ 生命周期 -------------------------------*/


root.beforeCreate = function () {
  // this.refreshTipsPop();
}
root.created = function () {
  this.getUserBalance();
  this.refreshTipsPop();

  this.$eventBus.listen(this, 'BIND_AUTH_POP', this.listen_popup)
  this.$eventBus.listen(this, 'BIND_EMAIL_POP', this.listen_email_pop)

  this.initSocket();
  // 获取订单状态
  this.getCurrencyAndAccount()

  this.isAppQuery()

  this.isIOSQuery()

  this.isWhiteQuery()

  this.getListenKey()  // 获取listenKey信息
  setInterval(()=>{
    this.dealWithListenKey()
    // 设定55分钟时间搓
  },55 * 60 * 1000)

  this.getLeverageBracket();
  this.getOrderbookTicker()
}

root.mounted = function () {
  const that = this
  window.onresize = () => {
    return (() => {
      window.screenWidth = document.body.clientWidth
      that.screenWidth = window.screenWidth
    })()
  }
}

root.beforeDestroy = function () {
  // 清空clearInterval
  this.accountInterval && clearInterval(this.accountInterval)

}

/*------------------------------ 计算 -------------------------------*/


root.computed = {}
// 观察是否登录
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
// 判断是否登录
root.computed.isLogin = function () {
  return this.$store.state.isLogin
}
// 判断语言
root.computed.lang = function () {
  return this.$store.state.lang
}
// 是否绑定手机
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}

// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}

// 是否绑定谷歌
root.computed.bindGa = function () {
  return this.$store.state.authState.ga
}

root.computed.isClose = function(){
  return this.$store.state.downloadShow
}
root.computed.symbol = function(){
  return this.$store.state.symbol
}

root.computed.onlyCapitalSymbol = function(){
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol)
}

root.computed.cumFastMaintenanceAmount = function () {
  return tradingHallData.cumFastMaintenanceAmount;
}

root.computed.timeOut = function (){
  this.getTimeInterval && clearInterval(this.getTimeInterval)  //获取倒计时
  this.getTimeInterval = setInterval(() => {
    this.getTimeout--
    if (this.getTimeout < 0) {

      sessionStorage.setItem(REFRESH_KEY,JSON.stringify({count:0,time:0,isOpen:'hide'}));

      this.getTimeInterval && clearInterval(this.getTimeInterval)  //获取倒计时
      // this.getTimeout = 60
      this.popWindowOpen = false
    }
  }, 1000)
  return this.getTimeout
}

/*------------------------------ 观察 -------------------------------*/

root.watch = {}
// 观察是否登录
root.watch.userId = function () {
  if (!this.userId) {
    this.$store.commit('RESET_CURRENCY')
  }
}

root.watch.screenWidth = function (oldVal, newVal) {
  if (oldVal <= 768) {
    this.$store.commit('changeIsMobile', true)
    this.$i18n.locale = 'CH'
  } else {
    this.$store.commit('changeIsMobile', false)
    let lang = this.$cookies.get('BWLanguageSet')
    lang && (this.$i18n.locale = lang)
  }
}

/*------------------------------ 方法 -------------------------------*/


root.methods = {}

root.methods.initSocket = function () {
  this.$socket.on({key: 'connect',bind: this,callBack: (message)=>{
        this.socketConnected = true;
        if(this.socketConnected && this.listenKeyLoaded){
          this.$socket.emit('SUBSCRIBE', [this.listenKey]);
        }
      }
    }
  )
  // 获取仓位的数据
  this.$socket.on({
    key: 'ACCOUNT_UPDATE', bind: this, callBack: (message) => {
      if(!message) return
      let socketRecords = message.a.B[0] || {}

      let socketAssets = {
        walletBalance:socketRecords.wb || 0,
        crossWalletBalance:socketRecords.cw || 0
      }
      this.$store.commit('CHANGE_ASSETS', socketAssets)
    }
  })
}
root.methods.dealWithListenKey = function () {
  if(!this.$store.state.listenKey){
      this.getListenKey()
    return
  }
    this.getListenKey()
}

// 获取 listenKey 信息
root.methods.getListenKey = function () {
  this.listenKeyLoaded = false;
  this.$http.send('GET_USER_LISTENKEY', {
    bind: this,
    callBack: this.re_getListenKey
  });
}
// 获取 listenKey 信息
root.methods.re_getListenKey = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.info('listen======',data.data)
  this.listenKey = data.data || ""
  this.$store.commit("CHANGE_LISTENKEY",this.listenKey);

  this.listenKeyLoaded = true;
  if(this.socketConnected && this.listenKeyLoaded){
    this.$socket.emit('SUBSCRIBE', [this.listenKey]);
  }
  // this.$socket.emit('SUBSCRIBE', [this.listenKey]);
}

// 延长 listenKey 信息
root.methods.postKeepListenKey = function () {
  this.$http.send('POST_KEEP_LISTENKEY', {
    bind: this,
    params:{
      listenKey : this.$store.state.listenKey,
    },
    callBack: this.re_postKeepListenKey
  });
}
// 获取 listenKey 信息
root.methods.re_postKeepListenKey = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
}

// 关闭 listenKey 信息
root.methods.postcloseListenKey = function () {
  this.$http.send('POST_CLOSE_LISTENKEY', {
    bind: this,
    params: {
      listenKey:this.$store.state.listenKey
    },
    callBack: this.re_postcloseListenKey
  });
}
// 关闭 listenKey 信息
root.methods.re_postcloseListenKey = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  console.info('data======',data)
}
//查询杠杆分层标准，用于计算维持保证金
root.methods.getLeverageBracket = function(){
  this.$http.send('GET_LEVERAGE_BRACKET', {
    query:{
      // symbol:this.onlyCapitalSymbol
    },
    callBack: this.re_getLeverageBracket,
    errorHandler:this.err_getLeverageBracket
  })
}
//查询杠杆分层标准返回
root.methods.re_getLeverageBracket = function(data){
  typeof data === 'string' && (data = JSON.parse(data))
  // if(!data || !data.data || !data.data[0] || !data.data[0].data)return
  if(!data || !data.data)return
  let bracketList = {}

  this.$store.state.sNameList.map(s=> {
    let bSingle =  (data.data.find(v=>v.symbol == s) || {}).brackets || []

    //为了避免接口返回顺序改变，做一次按bracket升序排序处理，其他代码是这么用的
    bSingle = bSingle.sort((a,b)=>{

      //第一版接口没有cum字段，前端自己拼接，为了兼容老代码，增加一个字段，直接在排序的时候加上
      a.notionalCum = a.cum;
      b.notionalCum = b.cum;

      return a.bracket - b.bracket
    });

    bracketList[s] = bSingle
  })

 /* let item = data.data[0].data.find(v=>v.symbol == this.onlyCapitalSymbol) || {}
  let bracketSingle = item.brackets || []
  bracketSingle.map(v=>{
    v.notionalCum = this.cumFastMaintenanceAmount[v.bracket]
    // console.log('this is getLeverageBracket=',v.notionalCap,this.$globalFunc.accMinus(v.notionalCap,9223372036854776000));
  })

  bracketSingle = bracketSingle.sort((a,b)=>{return (a.bracket -b.bracket)});//必须按bracket倒序排序，其他代码是这么用的
*/
  // this.$store.commit('CHANGE_LEVERAGE_BRACKET',bracketSingle);
  this.$store.commit('CHANGE_BRACKET_LIST',bracketList);
  // console.info('this is getLeverageBracket=',item,bracketSingle)
}
//查询杠杆分层标准出错
root.methods.err_getLeverageBracket = function(err){
  console.info('查询杠杆分层标准出错',err)
}

// 刷新频繁操作
root.methods.refreshTipsPop = function () {

  var data = sessionStorage.getItem(REFRESH_KEY);
  var dataObj = JSON.parse(data);
  var count = dataObj.count;
  var time = dataObj.time;
  var nowTime = dataObj.nowTime;
  var isOpen = dataObj.isOpen;
  // alert('this is time step <= '+REFRESH_TIME_STEP+(nowTime - (dataObj.time)) <= REFRESH_TIME_STEP);
  if(count >= REFRESH_COUNT && (isOpen == 'show' || (nowTime - time) <= REFRESH_TIME_STEP) ){
    // alert('this is '+'第'+count+'次'+nowTime+'减去'+time+'='+(nowTime - time));

    this.popWindowOpen = true;
    isOpen = 'show';
    sessionStorage.setItem(REFRESH_KEY,JSON.stringify({count,time,nowTime,isOpen}));


    // alert('请5秒之后再刷新')
    // setTimeout(function(){
    //   sessionStorage.setItem(REFRESH_KEY,JSON.stringify({count:0,time:0}));
    // },10000)
  }
  if(count >= REFRESH_COUNT && (nowTime - time) > REFRESH_TIME_STEP && isOpen == 'hide') {
    // alert('this is '+'第'+count+'次'+nowTime+'减去'+time+'='+(nowTime - time));
    sessionStorage.setItem(REFRESH_KEY,JSON.stringify({count:0,time:0,isOpen:'hide'}));
  }
}
// 关闭弹窗
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}
//sss=== click_bind

root.methods.click_bind = function () {
  this.bindEmailPopOpen = false
}
// 获取币种和账户
root.methods.getCurrencyAndAccount = function () {

  // 5s获取一次
  this.accountInterval && clearInterval(this.accountInterval)
  this.accountInterval = setInterval(this.getAccounts, this.accountIntervalTime)


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
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // 获取账户信息
  this.getAccounts()
}
// 获取币种出错
root.methods.error_getCurrency = function (err) {
  console.warn('index获取币种列表出错！')
}

// 获取账户信息
root.methods.getAccounts = function () {
  let currency = [...this.$store.state.currency.values()]
  // 如果没有币种列表或者说没有登录则不请求
  if (currency.length === 0 || !this.isLogin) {
    return
  }
  // 请求各项估值
  this.$http.send('RECHARGE_AND_WITHDRAWALS_RECORD', {
    bind: this,
    callBack: this.re_getAccount,
    errorHandler: this.error_getAccount
  })
}

// 获取账户信息回调
root.methods.re_getAccount = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.accounts) {
    return
  }
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
}
// 获取账户信息出错
root.methods.error_getAccount = function (err) {
  console.warn('index获取账户信息出错')
}

// 获取当前最优价格
root.methods.getOrderbookTicker = function () {
  this.$http.send('GET_ORDER_BOOK_TICKER',{
    bind: this,
    query:{
      symbol:this.onlyCapitalSymbol
    },
    callBack: this.re_getOrderbookTicker,
    errorHandler: this.error_getOrderbookTicker
  })
}
// 获取当前最优价格成功
root.methods.re_getOrderbookTicker = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data && !data.data) return
  let bidPrice = data.data[0].bidPrice || 0
  let askPrice = data.data[0].askPrice || 0

  this.$store.commit('CHANGE_ORDER_BOOK_TICKER',{bidPrice,askPrice})
  // console.info('最优价格成功=',data)
}
// 获取当前最优价格报错
root.methods.error_getOrderbookTicker = function (err) {
  console.info('err==',err)
}


root.methods.closePopup = function () {
  this.popOpen = false
}

// 关闭绑定邮箱的
root.methods.closeBindEmailPop = function () {
  this.bindEmailPopOpen = false
}

// 监听pop，如果用户未绑定谷歌和手机，调到各自的绑定页面
root.methods.listen_popup = function () {
  if (!this.bindGa && !this.bindMobile && !this.$store.state.isMobile) {
    this.popOpen = true
  }
}

// 监听pop，如果用户未绑定邮箱，调到各自的绑定页面
root.methods.listen_email_pop = function () {
  if (!this.bindEmail && !this.$store.state.isMobile) {
    this.bindEmailPopOpen = true
  }
}

// 绑定手机页面
root.methods.click_bind_mobile = function () {
  this.popOpen = false
  this.$router.push({name: 'bindMobile'})
}

// 绑定邮箱
root.methods.click_bind_email = function () {
  this.bindEmailPopOpen = false
  this.$router.push({name: 'bindEmail'})
}

// 绑定谷歌页面
root.methods.click_bind_ga = function () {
  this.popOpen = false
  this.$router.push({name: 'bindGoogleAuthenticator'})
}

// 判断是否是app打开
root.methods.isAppQuery = function () {
  if (this.$route.query.isApp) {
    this.isApp = true
  } else {
    this.isApp = false
  }
}

// 判断是否是ios打开
root.methods.isIOSQuery = function () {
  if (this.$route.query.isIOS) {
    this.isIOS = true
  } else {
    this.isIOS = false
  }
}

// 判断是否是ios打开
root.methods.isWhiteQuery = function () {
  if (this.$route.query.isWhite) {
    this.isWhite = true
  } else {
    this.isWhite = false
  }
}

root.methods.getUserBalance = function () {
  this.$http.send('GET_BALAN__BIAN', {
    callBack: this.re_getUserBalance
  })
}

root.methods.re_getUserBalance = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.$store.commit('CHANGE_ASSETS', data.data.assets[0] || {})
}
export default root
