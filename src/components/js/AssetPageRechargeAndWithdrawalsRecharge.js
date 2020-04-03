const root = {}
root.name = 'AssetPageRechargeAndWithdrawalsRecharge'

/*--------------------------------- 组件 ----------------------------------*/

root.components = {
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'BasePopupWindow': resolve => require(['../vue/BasePopupWindow'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'QRCodeVue': resolve => require(['qrcode.vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),

}

/*--------------------------------- props ----------------------------------*/

root.props = {}
root.props.currency = {
  type: String,
  default: 'BTC'
}

/*--------------------------------- data ----------------------------------*/


root.data = function () {
  return {
    // 加载中
    address: '', // 充值地址
    address1: '', // 充值地址
    address2: '', // 充值地址
    memo: '', // memo
    publicKey : '',//仅供WCG系列币种使用
    popOpen: false,

    authStateReady: false, //获取认证状态
    rechargeReady: false, //获取充值状态

    usdt1: true,
    // 提示窗
    popType: 0,
    popText: '',
    promptOpen: false,

    popWindowOpen: false,//账号存在异常
    knowMemoRule: false,// 已阅读
    memoPopWindowOpen: false, // memo提示弹窗

    // 默认为omni
    selectTab: (this.currency == 'USDT' && this.rechargeFlagUSDT) ? 1 : 2,
    currency2:'USDT2',
    currency1:'USDT'

  }
}

/*--------------------------------- 生命周期 ----------------------------------*/


// 初始化
root.created = function () {
  this.selectTab =(this.currency == 'USDT' && this.rechargeFlagUSDT) ? 1 : 2
  this.getAuthState()

  this.getRecharge()
  // this.getRecharge1()


}

/*--------------------------------- 计算 ----------------------------------*/
root.computed = {}
root.computed.loading = function () {
  return !(this.rechargeReady && this.authStateReady)
}
// 是否是WCG
root.computed.isWCG = function () {
  let currencyObj = this.$store.state.currency.get(this.currency)
  return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
}
root.computed.rechargeFlagUSDT = function(){
  let currencyObj = this.$store.state.currency.get('USDT')
  return currencyObj && currencyObj.depositEnabled
}
root.computed.rechargeFlagUSDT2 = function(){
  let currencyObj = this.$store.state.currency.get('USDT2')
  return currencyObj && currencyObj.depositEnabled
}

/*--------------------------------- 观察 ----------------------------------*/
root.watch = {}
root.watch.loading = function (newVal, oldVal) {
  if (!newVal && this.memo) {
    this.memoPopWindowOpen = true
  }
}


/*--------------------------------- 方法 ----------------------------------*/


root.methods = {}


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
  // 如果没有认证
  // 取消实名认证的限制
  // if (!this.$store.state.authState.identity || (!this.$store.state.authState.sms && !this.$store.state.authState.ga)) {
  // if ((!this.$store.state.authState.sms && !this.$store.state.authState.ga) || !this.$store.state.authState.email) {
  //   this.close()
  //   return
  // }
  // 获取认证状态成功
  this.authStateReady = true
}
// 判断验证状态回调
root.methods.re_getAuthState = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if (!data) return
  this.$store.commit('SET_AUTH_STATE', data.dataMap)
  // 获取认证状态成功

  // 如果没有认证
  // 取消实名认证的限制
  // if (!this.$store.state.authState.identity || (!this.$store.state.authState.sms && !this.$store.state.authState.ga)) {
  if (!this.$store.state.authState.sms && !this.$store.state.authState.ga) {
    this.close()
    return
  }


  this.authStateReady = true
}
// 判断验证状态出错
root.methods.error_getAuthState = function (err) {
  // console.warn("获取验证状态出错！", err)
}


// 切换状态
root.methods.toggleStatus= function (tab) {
  this.selectTab = tab
  // if(this.selectTab === 2){
    this.getRecharge()
  // }
  // if(this.selectTab === 1){
  //   this.getRecharge1()
  // }
  // this.currency = "USDT2"
  // this.address = this.$refs.address

}

root.methods.isERC20 = function () {
  // let currencyObj = this.$store.state.currency.get(this.currency)
  // return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
  return (this.currency == "USDT" && this.selectTab == 2) ? "USDT2" : this.currency;
}


// 获取数据
root.methods.getRecharge = function () {
  let params = {"currency": (this.currency == "USDT") ? this.isERC20() : this.currency}
  // let params = {"currency": "USDT2"} && {"currency": this.currency}
  // let params = {"currency": this.currency}
  // let params = {"currency":"USDT2"}
  // console.warn('currency',this.currency)
  this.$http.send('RECHARGE', {
    bind: this,
    callBack: this.re_getRecharge,
    errorHandler: this.error_getRecharge,
    params,
  })
}
// root.methods.toggleStatus1= function (tab) {
//   this.selectTab = tab
//   this.currency = "USDT"
// }

// 初始化返回
root.methods.re_getRecharge = function (dataObj) {
  // console.log("拿到了Init数据", JSON.stringify(data))
  // let dataObj = JSON.parse(data)  //错误代码
  console.log(dataObj)
  typeof dataObj === 'string' && JSON.parse(dataObj)

  if (dataObj.errorCode) {
    // this.close()
    this.popWindowOpen = true
    return
  }
  // 加载中关闭
  this.rechargeReady = true

  if(this.isWCG){
    let address = dataObj.dataMap.addressBean.address || '';
    let addressArr = address.split('?');
    this.address = addressArr[0] || '';
    this.publicKey = addressArr[1] || '';

    return;
  }
  this.address = dataObj.dataMap.addressBean.address
  // this.address1 = dataObj.dataMap.addressBean.address

  this.memo = dataObj.dataMap.addressBean.memoAddress
  console.log(this.address)

}
root.methods.error_getRecharge = function (err) {
}




// 点击复制
root.methods.clickCopy = function () {

  // if(this.selectTab === 1){
  //   let input = this.$refs.address
  //   input.select()
  // }else {
  //   let input2 = this.$refs.address1
  //   input2.select()
  // }

  var obj = {1:'address', 2:'address1'}
  let input = this.$refs[obj[this.selectTab]]
  input.select()

  document.execCommand("copy")
  this.popType = 1;
  this.popText = this.$t('popText')
  this.promptOpen = true;
}

// 点击复制
root.methods.clickCopyMemo = function () {
  let input = this.$refs.memo
  input.select()
  document.execCommand("copy")
  this.popType = 1;
  this.popText = this.$t('popText')
  this.promptOpen = true;
}

// 点击复制
root.methods.clickCopyPublicKey = function () {
  let input = this.$refs.publicKey
  input.select()
  document.execCommand("copy")
  this.popType = 1;
  this.popText = this.$t('popText')
  this.promptOpen = true;
}


// 点击关闭
root.methods.close = function () {
  this.$emit('close')
}

// 关闭提示框
root.methods.closePrompt = function () {
  this.promptOpen = false;
}

// 账号存在异常弹窗关闭
root.methods.popWindowClose = function () {
  this.popWindowOpen = false
}

// 关闭memo弹窗提示
root.methods.memoPopWindowClose = function () {
  this.memoPopWindowOpen = false
  this.close()
}
root.methods.memoPopWindowGoAhead = function () {
  this.memoPopWindowOpen = false
}

// 弹窗提示提交工单
root.methods.goToCommitOrder = function () {
  // this.popWindowOpen = false
  // this.$router.push({name: 'wordOrder'})
}

// 弹窗联系客服
root.methods.goToCustomerService= function () {
  qimoChatClick();
  this.popWindowOpen = false;
}

root.methods.closeQRCode= function () {
  $(".qr-code").attr("style","display:none");
}

root.methods.openQRCode= function () {
  $(".qr-code").attr("style","display:block");
}



root.methods.closePublicKey= function () {
  $(".qr-code-public-key").attr("style","display:none");
}


root.methods.openPublicKey= function () {
  $(".qr-code-public-key").attr("style","display:block");
}







export default root
