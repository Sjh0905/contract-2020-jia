const root = {}
root.name = 'MobileAssetRechargeAndWithdrawalsDetail'

/*---------------------- 组件 -----------------------*/
root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*---------------------- data -----------------------*/
root.data = function () {
  return {
    loading: true, // 加载中
    name: '',

    currencyTitle: '', // 根据query带值

    symbols:'',

    activeIndex: -1, //激活
    recharge: false,
    withdrawals: false,
    accounts: [],
    currency: new Map(),

    currentPrice: {},//最近的一次socket数据

    initData: {}, //初始值
    initReady: false,

    socketTime: 0,  //socket计数器
    socketBase: 1,  //socket基数，多少次取一次socket

    priceReady: false,    //socket准备
    currencyReady: false, //currency准备，只有加载完全部的loading才会关闭！
    authStateReady: false, //认证状态准备

    popWindowTitle: '', //弹出提示标题
    popWindowPrompt: '',//弹出样式提示
    popWindowStyle: 0,//跳转 0表示实名认证，1表示手机或谷歌，2只有确定

    thisCurrency: {}, // 此币种信息

    thisCurrencyToBtc: 0, // 估值btc的值


    exchangeRate: 0, //人民币汇率
    exchangeRateReady: false, //人民币汇率拿到
    exchangeRateInterval: null, //循环拿汇率
    valuation: 0,//换算成人民币的估值

    // 货币对列表
    currency_list: {},
    // 总价格
    socket_price: {},

    exchangeRates: '', // 获取所有的汇率

    bdb_rate: 0, // 获取bdb汇率

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    toastNobindShow: false,

    popIdenOpen: false,

    // 转账提示框是否打开
    openTips:false,
    // 当前币种是否可以转账  fasle为不可以转账
    isTransfer: false,
    prohibitAll: false
  }
}


/*---------------------- 生命周期 -----------------------*/

root.created = function () {

  this.getProhibitAll()

  //从query获取的币种信息
  this.getCurrencyTitle()

  // 获取initData
  this.getInitData()

  this.getCurrencyList()

  // socket获取价格
  this.getPrice()


  // 获取验证状态
  this.getAuthState()

  let currency = [...this.$store.state.currency]
  if (!currency) {
    // 获取币种状态
    this.getCurrency()
    return
  }

  // 获取账户信息
  this.getAccounts()


  // 获取汇率
  this.getExchangeRate()
}

root.mounted = function () {
  setTimeout(this.initSocket(), 1000)
}

/*----------------------------- 计算 ------------------------------*/

// 计算
root.computed = {}
root.computed.isMyWallet = function () {
  return true//现在只开放钱包
  // return this.$route.params.assetAccountType == 'wallet'
}
root.computed.staticUrl = function () {
  return this.$store.state.static_url
}
// 计算当前的服务器时间
root.computed.serverT = function () {
  return this.$store.state.serverTime/1000
}
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}
// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  // 特殊处理
  let items = this.accounts.filter(v => {
    return v.currency === this.currencyTitle
  })
  let item = items[0] || {}

  if(item.appraisement){
    this.thisCurrencyToBtc = item.appraisement
    this.valuation = this.exchangeRate * this.thisCurrencyToBtc
  }
  // console.log('item',item)
  return item
}

// 基础货币
root.computed.baseCurrency = function () {
  return this.$store.state.baseCurrency
}
// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}
// 获取userId
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}
// ajax获取的数据
root.computed.currencylist = function () {
  let data;
  let currencylist = [];
  if (this.socket_price === '' && this.currency_list === ''){
  // if (true){
    // data = this.symbol()

    data = this.symbols;
    typeof(data) == 'string' && (data = JSON.parse(data));
    data = this.symbols.symbols;
    // for (let item in data){
    //   let itemName = item;
    //   console.log('itemname',itemName)
    // }

    for(let i = 0; i<data.length;i++){
      // console.log('123123123',data[i].name)
      let itemName = data[i].name;
      let itemAllName = data[i].name.split("_");
      let i0 = itemAllName[0];
      let i1 = itemAllName[1];
      let currencyItem = {};
      if(this.currencyTitle === i0){
        currencyItem.name = itemName
        currencyItem.choose = 0
        currencyItem.data = [0,0,0,0,0,0];
        // console.log('i1',currencyItem.name,i1)

        if (i1 === 'BTC') {
          currencyItem.rate = this.exchangeRates.btcExchangeRate || 0
          // console.log('BTC',currencyItem.rate)
        }
        if (i1 === 'ETH') {
          currencyItem.rate = this.exchangeRates.ethExchangeRate || 0
        }
        if (i1 === 'BDB') {
          currencyItem.rate = this.exchangeRates.ethExchangeRate*this.bdb_rate || 0
        }
        if (i1 === 'USDT') {
          currencyItem.rate = 1
        }
        currencylist.push(currencyItem)
      }
    }

  }
  if (this.socket_price != '' || this.currency_list != ''){
  // if (false){
  //   console.log('进入此')
    data = this.$globalFunc.mergeObj(this.socket_price, this.currency_list)

    for (let item in data){
      // console.log('item',data[item],item)
      let itemName = item;
      let itemAllName = item.split("_");
      let i0 = itemAllName[0];
      let i1 = itemAllName[1];
      let currencyItem = {};

      if(this.currencyTitle === i0){
        currencyItem.name = itemName
        currencyItem.choose = 0
        currencyItem.data = data[itemName]
        // console.log('i1',currencyItem.name,i1)

        if (i1 === 'BTC') {
          currencyItem.rate = this.exchangeRates.btcExchangeRate || 0
          // console.log('BTC',currencyItem.rate)
        }
        if (i1 === 'ETH') {
          currencyItem.rate = this.exchangeRates.ethExchangeRate || 0
        }
        if (i1 === 'BDB') {
          currencyItem.rate = this.exchangeRates.ethExchangeRate*this.bdb_rate || 0
        }
        currencylist.push(currencyItem)
      }
      // if(this.currencyTitle === i1){
      //   currencyItem.name = itemName
      //   currencyItem.choose = 1
      //   currencyItem.data = data[itemName]
      //   currencylist.push(currencyItem)
      // }
    }
  }

  // console.log('datadata',this.currency_list)




  // console.warn('000',o)

  return currencylist;
}



/*----------------------------- 监听 todo------------------------------*/

// 监听
root.watch = {}
// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
  this.changeAppraisement(this.currentPrice)
}



// root.watch.accountsComputed = function (newVal, oldVal) {
//   for(let item in this.accountsComputed){
//     if(item.currency === this.currencyTitle) {
//       this.thisCurrency = item
//       return
//     }
//   }
// }



/*----------------------------- 方法 ------------------------------*/

root.methods = {};

/*----------------------------- 跳转锁仓记录 begin------------------------------*/
root.methods.goLockHouse = function (name) {
  this.$router.push({name:'MobileLockHouseRecord',query:{id:1,name:name}})

}
/*----------------------------- 跳转锁仓记录 end------------------------------*/

/*----------------------------- 敬请期待 begin------------------------------*/
root.methods.goExpecting = function () {

  // if (!this.isLogin) {
  //   this.$router.push('/index/sign/login')
  //   return;
  // }

  this.popText = "敬请期待"
  this.popOpen = true
  this.popType = 3
  return;

}
/*----------------------------- 敬请期待 end------------------------------*/

/*---------------------- 跳入到交易页面 begin---------------------*/
root.methods.gotoJiaoyi = function () {
  this.$router.push({name: 'mobileTradingHallDetail'});
}
/*---------------------- 跳入到交易页面 end---------------------*/

/*----------------------------- 获取currency begin------------------------------*/
root.methods.getCurrencyTitle = function () {
  this.currencyTitle = this.$route.query.currency
  this.$store.commit('changeMobileHeaderTitle', this.currencyTitle + '资产');

}
/*----------------------------- 获取currency end------------------------------*/




/*----------------------------- 获取初始data begin------------------------------*/
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
  console.warn('获取了初始化数据', data)
  // this.initData = data
  for (let key in data) {
    if (key == 'BDB_ETH') {
      this.bdb_rate = data[key][4];
    }
  }


  this.initReady = true
  this.changeAppraisement(this.initData)
  this.currency_list = this.$globalFunc.mergeObj(data, this.currency_list);

}
// 获取data出错
root.methods.error_getInitData = function (err) {
  // console.warn('获取init数据出错', err)
}

// 请求所有币对信息
root.methods.getCurrencyList = function () {
  this.$http.send('COMMON_SYMBOLS', {
    bind: this,
    callBack: this.re_getCurrencyList
  });
}

root.methods.re_getCurrencyList = function(data) {
  // console.log('symbols',data);
  this.symbols = data
}




/*---------------------- socket监听价格begin ---------------------*/
// 打开socket监听
root.methods.getPrice = function () {
  this.$socket.on(
    {
      key: 'topic_prices',
      bind: this,
      callBack: this.re_getPrice
    })
}

// socket估值发生变化！
root.methods.re_getPrice = function (data) {
  if (this.socketTime % this.socketBase !== 0) {
    this.socketTime++
    return
  }
  this.socketTime = 1
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data) return

  // console.warn("rechargeAndWithdrawals 收到socket!",data)
  for (let key in data) {
    if (key == 'BDB_ETH') {
      this.bdb_rate = data[key][4];
    }
  }

  this.priceReady = true
  this.loading = !(this.currencyReady && this.authStateReady)


  // 记录最近的price
  this.currentPrice = data
  this.changeAppraisement(data)
}
/*---------------------- socket监听价格end ---------------------*/




/*---------------------- 修改估值 begin ---------------------*/

// 修改估值
root.methods.changeAppraisement = function (dataObj) {
  typeof (dataObj) === 'string' && (dataObj = JSON.parse(dataObj))
  let data = this.$globalFunc.mergeObj(dataObj, this.initData)
  this.initData = data

  this.$globalFunc.handlePrice(this.$store.state.currency, data)

  if (!data) return

  for (let key in data) {
    let targetName = key.split('_')[0]
    let baseName = key.split('_')[1]
    if (baseName !== this.baseCurrency) continue
    for (let i = 0; i < this.accounts.length; i++) {
      if (this.accounts[i].currency !== targetName) continue
      this.accounts[i].appraisement = this.accounts[i].total * data[key][4]
      break
    }
  }

  // 特殊处理，如果是基础货币
  for (let i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].currency !== this.baseCurrency) continue
    this.accounts[i].appraisement = this.accounts[i].total
  }

}

/*---------------------- 修改估值 end ---------------------*/




/*---------------------- 获取验证状态 begin ---------------------*/
// 判断验证状态
root.methods.getAuthState = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
  // 获取认证状态成功
  this.authStateReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
}


// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功
  // console.warn('获取验证状态成功', data)
  this.authStateReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
}
/*---------------------- 获取验证状态 end ---------------------*/




/*---------------------- 获取币种 begin ---------------------*/
// 获取币种
root.methods.getCurrency = async function () {
  this.$http.send('GET_CURRENCY', {
    bind: this,
    callBack: this.re_getCurrency,
    errorHandler: this.error_getCurrency,
  })
}
// 获取币种的状态
root.methods.re_getCurrency = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  // console.warn("获取币种状态", data)
  if (!data.dataMap || !data.dataMap.currencys) {
    return
  }
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  this.getAccounts()
}
// 获取币种失败
root.methods.error_getCurrency = function (err) {
  // console.warn("获取币种失败", err)
}
/*---------------------- 获取币种 end ---------------------*/



/*---------------------- 获取账户信息 begin ---------------------*/
//获取账户信息
root.methods.getAccounts = function () {
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
    // console.warn("拿回来了个奇怪的东西", data)
    return
  }
  // console.warn('请求更新accounts', data.accounts)
  this.$store.commit('CHANGE_ACCOUNT', data.accounts)
  // 关闭loading
  this.currencyReady = true
  this.loading = !(this.currencyReady && this.authStateReady)
  this.changeAppraisement(this.currentPrice)

}
// 获取账户信息失败
root.methods.error_getAccount = function (err) {
  // console.warn("获取账户内容失败", err)
}
/*---------------------- 获取账户信息 end ---------------------*/


//sss===

/*---------------------- 获取汇率begin ---------------------*/
root.methods.getExchangeRate = function () {

  this.$http.send('GET_EXCHANGE__RAGE', {
    bind: this,
    callBack: this.re_getExchangeRate,
    errorHandler: this.error_getExchangeRate
  })

  this.exchangeRateInterval && clearInterval(this.exchangeRateInterval)
  // 循环请求
  this.exchangeRateInterval = setInterval(() => {
    this.$http.send('GET_EXCHANGE__RAGE', {
      bind: this,
      callBack: this.re_getExchangeRate,
      errorHandler: this.error_getExchangeRate
    })
  }, 60000)
}
// 获取人民币汇率回调
root.methods.re_getExchangeRate = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if (!data || !data.dataMap) return
  // console.warn("assetPage获取汇率！", data)
  if (data.result === 'SUCCESS') {
    this.exchangeRateReady = true
    this.exchangeRate = data.dataMap.exchangeRate.btcExchangeRate
    this.exchangeRates = data.dataMap.exchangeRate
    // console.log('exchangeRates',this.exchangeRates)
    this.valuation = this.exchangeRate * this.thisCurrencyToBtc

    // this.loading = !(this.accountReady && this.exchangeRateReady && (this.priceReady || this.initReady))

  }

}
// 获取人民币汇率失败
root.methods.error_getExchangeRate = function (err) {
  // console.warn("assetPage获取汇率失败！", err)
}

/*---------------------- 获取汇率end ---------------------*/




/*---------------------- 获取币对市场的值 begin ---------------------*/
root.methods.init = function () {
  // 初始化订阅socket
  this.initSocket();

}

// 初始化socket
root.methods.initSocket = function () {
  let that = this;
  // 订阅某个币对的信息
  this.$socket.emit('unsubscribe', {symbol: this.$store.state.symbol});
  this.$socket.emit('subscribe', {symbol: this.$store.state.symbol});

  // 接收所有币对实时价格
  this.$socket.on({
    key: 'topic_prices', bind: this, callBack: (message) => {
      // console.log('message',message)
      this.socket_price = message;
      // console.warn('this is topic_price',message)
      // let obj = {}
      // obj[this.$store.state.symbol] = [0,0,0,0,0,0]
      // this.socket_price = this.$globalFunc.mergeObj(message,obj)
    }
  })
}

/*---------------------- 获取币对市场的值 end ---------------------*/


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/




/*-----------------------------  跳转页面 ------------------------------*/
root.methods.jumpToTradingHall = function (name) {
  this.$store.commit('changeMobileTradingHallFlag',true);
  this.$store.commit('changeMobileSymbolType',name);
  this.$store.commit('SET_HALL_SYMBOL',false);
  this.$router.push({name: 'mobileTradingHall'})
}

root.methods.jumpToRecharge = function (name) {

  let currencyObj = this.$store.state.currency.get(name)

  //只有当USDT MONI类型未开放充值时才判断USDT2是否开放，当两个都未开放时才拦截
  if(name == 'USDT' && (currencyObj && !currencyObj.depositEnabled)){
    let currencyUSDT2 = this.$store.state.currency.get('USDT2')
    if(currencyUSDT2 && !currencyUSDT2.depositEnabled){
      this.popOpen = true
      this.popType = 0
      this.popText = '该币种暂未开放充值功能，敬请期待！';
      return
    }
  }

  if (name!='USDT' && this.serverT < this.accountsComputed.rechargeOpenTime) {
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放充值功能，敬请期待！';
    return
  }

  // 如果没有绑定邮箱，不允许打开提现
  // if (!this.bindEmail) {
  //   this.toastNobindShow = true
  //   return
  // }
  //
  // if (!this.bindMobile && !this.bindGA) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '请绑定谷歌验证或手机'
  // }
  if (this.bindMobile || this.bindGA) {
    // this.$store.commit('changeMobileHeaderPriceTitle', name)
    this.$router.push('/index/mobileAsset/mobileAssetRechargeDetail?currency='+name)
  }
}


//跳转充提页面
root.methods.jumpToDetail = function (name) {
  this.$router.push({name:'MobileAssetRechargeAndWithdrawRecord'})
}

root.methods.jumpToWithdraw = function (type) {
  let name = type.currency
  let currencyObj = this.$store.state.currency.get(name)
  let currencyUSDT2 = this.$store.state.currency.get('USDT2')
  //sss
  if(currencyUSDT2 && !currencyUSDT2.withdrawEnabled)return false
  // if(item.currency != 'USDT' && withdrawOpenTime && this.serverT < withdrawOpenTime)return false

  //只有当USDT MONI类型未开放充值时才判断USDT2是否开放，当两个都未开放时才拦截
  if(name == 'USDT' && (currencyObj && !currencyObj.withdrawEnabled)){
    // let currencyUSDT2 = this.$store.state.currency.get('USDT2')
    if(currencyUSDT2 && !currencyUSDT2.withdrawEnabled){
      this.popOpen = true
      this.popType = 0
      this.popText = '该币种暂未开放提现功能，敬请期待！';
      return
    }
  }

  if(name != 'USDT' && this.serverT < this.accountsComputed.withdrawOpenTime){
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放提现功能，敬请期待！';
    return
  }

  if (type.withdrawDisabled){
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放提现功能，敬请期待！';
    return
  }

  if (!this.bindIdentify) {
    this.popIdenOpen = true
    return
  }
  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.toastNobindShow = true
    return
  }

  if (this.bindIdentify) {
    if (!this.bindMobile && !this.bindGA) {
      this.popOpen = true
      this.popType = 0
      this.popText = '请绑定谷歌验证或手机'
      return
    }
    if (this.bindMobile || this.bindGA) {
      // this.$store.commit('changeMobileRechargeRecordData',type)
      this.$router.push("/index/mobileAsset/mobileAssetWithdrawDetail?currency=" + name)
      return
    }
  }
}

root.methods.jumpToTransfer = function (type) {
  let name = type.currency
  let currencyObj = this.$store.state.currency.get(name)

  this.$router.push("/index/mobileAsset/mobileAssetCapitalTransfer?currency=" + name)

  //只有当USDT MONI类型未开放充值时才判断USDT2是否开放，当两个都未开放时才拦截
  if(name == 'USDT' && (currencyObj && !currencyObj.withdrawEnabled)){
    let currencyUSDT2 = this.$store.state.currency.get('USDT2')
    if(currencyUSDT2 && !currencyUSDT2.withdrawEnabled){
      this.popOpen = true
      this.popType = 0
      this.popText = '该币种暂未开放提现功能，敬请期待！';
      return
    }
  }

  if(name != 'USDT' && this.serverT < this.accountsComputed.withdrawOpenTime){
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放提现功能，敬请期待！';
    return
  }

  if (type.withdrawDisabled){
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放提现功能，敬请期待！';
    return
  }

  if (!this.bindIdentify) {
    this.popIdenOpen = true
    return
  }
  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.toastNobindShow = true
    return
  }

  if (this.bindIdentify) {
    if (!this.bindMobile && !this.bindGA) {
      this.popOpen = true
      this.popType = 0
      this.popText = '请绑定谷歌验证或手机'
      return
    }
    if (this.bindMobile || this.bindGA) {
      // this.$store.commit('changeMobileRechargeRecordData',type)
      this.$router.push("/index/mobileAsset/mobileAssetCapitalTransfer?currency=" + name)
      return
    }
  }
}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 关闭弹窗
root.methods.popIdenClose = function () {
  this.popIdenOpen = false
}


root.methods.closeNobindToast = function () {
  this.toastNobindShow = false
}

root.methods.goToBindEmail = function () {
  this.toastNobindShow = false
  this.$router.push({name: 'bindEmail'})
}

/*---------------------- 跳入到资产页面 ---------------------*/
root.methods.gotoZichan = function () {
  this.$router.push({name: 'MobileAssetRechargeAndWithdrawals'});
}

/*---------------------- 内部转账 ---------------------*/



// 跳转转账页面
root.methods.gotoTransfer = function (){
  this.$router.push({name:'MobileTransfer',query:{currency:this.$route.query.currency}})
}

// 判断是否可以转账
root.methods.transferAble = function () {
  console.info('this.$route.query.currency   sssssss',this.$route.query.currency)
  this.$http.send('GET_TRANSFER_AMOUNT_INFO',{
    bind: this,
    query:{
      currency:this.$route.query.currency
      // currency:this.currencyTitle
    },
    callBack: this.re_transferAble,
    errorHandler: this.error_transferAble
  })
  // this.currencyTitle = this.$route.query.currency
}
root.methods.re_transferAble = function (data) {
  typeof (data) === 'string' && (data = JSON.parse(data))
  if(!data) return
  this.isTransfer = data.dataMap.insideTransferAccount.transferDisabled

  this.getProhibitAll()
  if (!this.bindIdentify) {
    this.popIdenOpen = true
    return
  }

  // 如果没有绑定邮箱，不允许打开内部转账
  if (!this.bindEmail) {
    this.toastNobindShow = true
    return
  }

  // this.transferAble()
  // this.getProhibitAll()
  // if (this.prohibitAll) {
  //   this.openTips = false
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '该币种暂不支持内部转账转账，敬请期待'
  //   return
  // }
  if (!this.isTransfer) {
    this.openTips = false
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂不支持内部转账转账，敬请期待'
    return
  }
  if (this.prohibitAll) {
    this.openTips = false
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂不支持内部转账转账，敬请期待'
    return
  }

  if (this.bindIdentify && this.isTransfer == true) {
    this.openTips = true
    return
  }
  if (this.bindIdentify) {
    if (!this.bindMobile && !this.bindGA) {
      this.popOpen = true
      this.popType = 0
      this.popText = '请绑定谷歌验证或手机'
      return
    }
    if (this.bindMobile || this.bindGA) {
      // this.$store.commit('changeMobileRechargeRecordData',type)
      // this.$router.push("/index/mobileAsset/mobileAssetRechargeDetail?currency=" + name)
      this.openTips = true
      return
    }
  }

  console.info('this.re_transferAble--------------',data)
  console.log(data)
}
root.methods.error_transferAble = function (error) {
  console.log(this.$route.query.currency)
  console.log(error)
}



//该用户是否可以转账get (query:{})
root.methods.getProhibitAll = function () {
  // /* TODO : 调试接口需要屏蔽 E*/
  this.$http.send('PROHIBIT_ALL_CURRENCY', {
    bind: this,
    // urlFragment: userId,
    query:{
      userId: this.userId
    },
    callBack: this.re_getProhibitAll,
    errorHandler: this.error_getProhibitAll
  })
}

root.methods.re_getProhibitAll = function (data) {
  //检测data数据是JSON字符串转换JS字符串
  typeof data === 'string' && (data = JSON.parse(data))
  if(!data) return

  if( data.errorCode ){
    data.errorCode == 1 &&  (this.popText = '用户未登录')

    this.popOpen = true
    this.popType = 0

    setTimeout(() => {
      this.popOpen = true
    }, 100)
    // console.log('用户登录')
  }
  this.prohibitAll = data.dataMap.prohibitAll


  console.info('this.re_getProhibitAll',this.getProhibitAll)
  console.info('this.re_getProhibitAll++++++++++++',data)
  // this.getCheckGroupDetails()
}

root.methods.error_getProhibitAll = function (err) {
  console.log("this.err=====",err)
}

// 转账入口是否可以打开
// root.methods.internalTransfer = function (index, item) {
//
//
//   this.transferAble(item.currency)
//
//   // if(this.prohibitAll == true) {
//   //   this.openTips = false
//   //   this.popOpen = true
//   //   this.popType = 0
//   //   this.popText = '该币种暂不支持转账'
//   //   return
//   // }
//   // if(this.isTransfer == false) {
//   //   this.openTips = false
//   //   this.popOpen = true
//   //   this.popType = 0
//   //   this.popText = '该币种暂不支持转账'
//   //   return
//   // }
// }
root.methods.openTipsBox = function (){
  this.openTips = true
}

root.methods.closeTipsBox = function (){
  this.openTips = false
}
export default root
