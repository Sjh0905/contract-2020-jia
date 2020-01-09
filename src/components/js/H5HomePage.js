// 引用第三方css
// import '../../../static/bg_canvas/iohk.css'
// import IOHP2 from '../../../static/bg_canvas/GPUFluid'

const root = {};

root.name = 'IndexHome';

root.data = function () {
  return {
    popOpen: false,
    loading: false,

    total: 0, //总资产
    frozen: 0, //冻结
    available: 0, //可用
    currentPrice: {}, //最近一次的socket推送数据

    priceReady: false, //socket连接上
    accountReady: false,  //账户信息拿到

    initData: {},

    sphere: 1,
    delay: null,
    sphereLeft: 0,
    sphereTop: 0,

    downloadShow: true,

  }
}

root.created = function () {
  this.getInitData()
  this.getPrice()
  this.getCurrencyAndAccount()


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
}


root.components = {
  'IndexHeaderAssets': resolve => require(['../vue/IndexHeaderAssets'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'IndexHeaderAlpha': resolve => require(['../vue/IndexHeaderAlpha'], resolve)
}

root.mounted = function () {
  let self = this;
  self.initCanvasImg();

  // IOHP2();
}

root.computed = {}
// 显示语言
root.computed.lang = function () {
  return this.$store.state.lang
}

root.computed.isAndroid = function () {
  console.log('123123')
  return this.$store.state.isAndroid
}

root.methods = {}

root.methods.initCanvasImg = function () {
  if (!$("body").hasClass('transin')) {
    $("body").addClass('transin');
  }
  $(".modal-image").each(function () {
    $(this).click(function (e) {
      e.preventDefault();
      var url = $(this).attr('href');
      $("#iohk-modal-load").html('<img src="' + url + '" alt="" class="fullwidth" />');
    });
  });
}

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
  this.$router.go(0);
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
  let emailArr = this.$store.state.authMessage.email.split('@')
  let first = emailArr[0]
  first.length > 2 && (first = `${first.slice(0, 2)}****`)
  return `${first}@${emailArr[1]}`
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

// 清空canvas
// root.beforeDestroy = function () {
// 	$('body').css({'overflow': ''});
// 	$('canvas').remove();
// }

root.methods.mousemove = function ($evevt) {
  let lastX = 250, lastY = 250;
  lastX < $evevt.layerX && (this.sphereLeft = -8);
  lastX > $evevt.layerX && (this.sphereLeft = 8);
  lastX < $evevt.layerY && (this.sphereTop = -8);
  lastX > $evevt.layerY && (this.sphereTop = 8);
  lastX = $evevt.layerX;
  lastY = $evevt.layerY;

  // console.log(lastX,lastY)


}

root.methods.mousemove2 = function ($evevt) {
  // console.log(222,$evevt)
  let lastX = 250, lastY = 250;
  // lastX > $evevt.layerX && (this.sphereLeft = -2,this.sphereTop = -2);
  // lastX < $evevt.layerX && (this.sphereLeft = 2,this.sphereTop = 2);
  lastX < $evevt.changedTouches[0].clientX && (this.sphereLeft = -10);
  lastX > $evevt.changedTouches[0].clientX && (this.sphereLeft = 10);
  lastX < $evevt.changedTouches[0].clientY && (this.sphereTop = -10);
  lastX > $evevt.changedTouches[0].clientY && (this.sphereTop = 10);
  lastX = $evevt.changedTouches[0].clientX;
  lastY = $evevt.changedTouches[0].clientY;


}

root.methods.closeDownload = function () {
  this.downloadShow = false
}

root.methods.toTradingHall = function () {
  this.$store.commit('changeMobileTradingHallFlag', false)
  this.$store.commit('SET_HALL_SYMBOL', true)
}

export default root
