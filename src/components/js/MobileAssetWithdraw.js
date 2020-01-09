const root = {}
root.name = 'MobileAssetWithdraw'

root.props = {}


root.data = function () {
  return {
    loading: false, //加载中

    accounts: [],
    authStateReady: false, // 获取用户信息是否获取

    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    toastNobindShow: false,

    popIdenOpen: false,
  }
}

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}


root.computed = {}


root.computed.staticUrl = function () {
  return this.$store.state.static_url
}
// 计算当前的服务器时间
root.computed.serverT = function () {
  return this.$store.state.serverTime/1000
}
// 计算后的accounts，排序、筛选之类的放在这里！
root.computed.accountsComputed = function () {
  return this.accounts
}
root.computed.currencyChange = function () {
  return this.$store.state.currencyChange
}

// 是否绑定手机
root.computed.bindMobile = function () {
  return this.$store.state.authState.sms
}
// 是否绑定谷歌验证码
root.computed.bindGA = function () {
  return this.$store.state.authState.ga
}
// 是否绑定邮箱
root.computed.bindEmail = function () {
  return this.$store.state.authState.email
}
// 是否实名认证
root.computed.bindIdentify = function () {
  return this.$store.state.authState.identity
}

root.created = function () {
  this.$store.commit('changeMobileHeaderTitle', '提现');

  // 获取币种，发送请求
  this.getCurrency()
  // 获取用户权限
  this.getAccoutData()
}

// ---------------------- 监听 ---------------------------
root.watch = {}

// 监听vuex中的变化
root.watch.currencyChange = function () {
  this.accounts = [...this.$store.state.currency.values()]
}

// ---------------------- 方法 ---------------------------
root.methods = {};
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
  this.accounts = data.dataMap.currencys
  // // 获取账户信息
  // this.getAccounts()
}

// 获取币种出错
root.methods.error_getCurrency = function (err) {
  console.warn('获取币种列表出错！',err)
}

// 判断验证状态
root.methods.getAccoutData = function () {
  if (!this.$store.state.authState) {
    this.$http.send('GET_AUTH_STATE', {
      bind: this,
      callBack: this.re_getAuthState,
      errorHandler: this.error_getAuthState
    })
    return
  }
}

// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功
  console.log('获取验证状态成功', data)
  this.authStateReady = true
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
}

root.methods.getToGetCash = function (type) {
  // console.log('type',type)
  if(this.serverT < type.withdrawOpenTime){
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放提现功能，敬请期待！';
    return;
  }

  if(type.withdrawDisabled){
    this.popOpen = true
    this.popType = 0
    this.popText = '该币种暂未开放提现功能，敬请期待！';
    return;
  }
  // if(type.available === 0){
  //   this.popOpen = true
  //   this.popType = 0
  //   this.popText = '您未持有此币种'
  //   return;
  // }

  if(!this.bindIdentify) {
    this.popIdenOpen = true
    return
  }

  // 如果没有绑定邮箱，不允许打开提现
  if (!this.bindEmail) {
    this.toastNobindShow = true
    return
  }

  if(this.bindIdentify) {
    if(!this.bindMobile && !this.bindGA) {
      this.popOpen = true
      this.popType = 0
      this.popText = '请绑定谷歌验证或手机'
      return
    }
    if(this.bindMobile || this.bindGA) {
      // this.$store.commit('changeMobileRechargeRecordData',type)
      this.$router.push("/index/mobileAsset/mobileAssetWithdrawDetail?currency="+type.currency)
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








export default root
