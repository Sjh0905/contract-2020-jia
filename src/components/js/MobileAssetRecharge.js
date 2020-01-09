const root = {}
root.name = 'MobileAssetRecharge'

root.props = {}


root.data = function () {
  return {
    loading: false, //加载中

    accounts: [], //
    authStateReady: false, // 获取用户信息是否获取

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    alertFlag: false,

    toastNobindShow: false,


  }
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '充值');

  // 获取币种，发送请求
  this.getCurrency()
  // 获取用户权限
  this.getAuthState()

  if (!this.$cookies.get('rechargeAddressChanged')) {
    this.$cookies.set('rechargeAddressChanged', true, 60 * 60 * 6)
    this.alertFlag = true
  }
}

root.computed = {}
// 计算当前的服务器时间
root.computed.serverT = function () {
  return this.$store.state.serverTime/1000
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
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}


/*----------------------------- 监听 ------------------------------*/

root.watch = {}


// 监听vuex中的变化
root.watch.currencyChange = function (newVal, oldVal) {
  this.accounts = [...this.$store.state.currency.values()]
  console.log('accounts',this.accounts)
}

root.methods = {};

// ------------------------- 获取币种 -------------------------
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
  console.warn("这是currency", data)
  this.$store.commit('CHANGE_CURRENCY', data.dataMap.currencys)
  // this.accounts = data.dataMap.currencys
  // console.log('accounts',this.accounts)
  // // 获取账户信息
  // this.getAccounts()
}

// 获取币种出错
root.methods.error_getCurrency = function (err) {
  console.warn('获取币种列表出错！',err)
}

// ------------------------- 获取用户权限 -------------------------

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
  // this.loading = !(this.accountReady && this.authStateReady)
}


// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  this.authStateReady = true
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
}






// 点击币种进入充值详情页
// 点击充值
root.methods.clickRecharge = function (name,item) {
  if(this.authStateReady === false) {
    return false;
  }
  if (this.serverT < item.rechargeOpenTime) {
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放充值功能，敬请期待！';
    return
  }

  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.toastNobindShow = true
    return
  }

  // if(this.bindIdentify) {
  if (!this.bindMobile && !this.bindGA) {
    this.popOpen = true
    this.popType = 0
    this.popText = '请绑定谷歌验证或手机'
  }
  if (this.bindMobile || this.bindGA) {
    // this.$store.commit('changeMobileHeaderPriceTitle', name)
    this.$router.push('/index/mobileAsset/mobileAssetRechargeDetail?currency='+name)
  }
  // }
  // if(!this.bindIdentify) {
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '您尚未通过实名认证'
  // }


}




// 点击币种，是否弹出币种的详细信息开关
root.methods.changeTableOpenFlag = function (obj) {
  // console.log(123123123,obj);
  // this.tableOpenFlag = !this.tableOpenFlag

  // this.tableOpenData.name = obj.currency
  // this.tableOpenData.totalPrice = obj.total
  // this.tableOpenData.availablePrice = obj.available
  // this.tableOpenData.frozenPrice = obj.frozen
  // this.tableOpenData.appraisementPrice = obj.appraisement

}

// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

root.methods.closeAlertFlag = function () {
  this.alertFlag = false
}


root.methods.closeNobindToast = function () {
  this.toastNobindShow = false
}

root.methods.goToBindEmail = function () {
  this.toastNobindShow = false
  this.$router.push({name: 'bindEmail'})
}



export default root
