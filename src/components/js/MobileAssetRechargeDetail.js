const root = {}
root.name = 'MobileAssetRechargeDetail'

// var btnCopy;

import Clipboard from 'clipboard'

root.props = {}


root.data = function () {
  return {
    loading: true, //加载中
    // 获取地址
    address: '',
    // 点击复制按钮开关
    copyBtnFlag: true,
    // 复制按钮
    btnCopy: '',
    // 标题币种
    title: location.search.substr(1).split("=")[1] || '',
    // currency: location.search.substr(1).split("=")[1] || '',

    memoAddress: '',

    publicKeyAddress: '',


    // 弹窗
    popOpen: false,
    popType: 0,
    popText: '系统繁忙',

    toastOpen: false, //账号存在异常的弹出窗
    toastType: 2,
    toastText: '',

    alertFlag: true,

    // 是否展示memotoast弹窗
    memoToastShow: false,
    // memo选择框
    memoAgreement: false,

    publicKeyToastShow: false,

    publicKeyAgreement: false,

    selectTab:1,
  }
}
root.components = {
  'QRCodeVue': resolve => require(['qrcode.vue'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'MobileCheckbox': resolve => require(['../mobileVue/MobileCompentsVue/MobileCheckbox'], resolve),
}

root.created = function () {

  !this.rechargeFlagUSDT && this.rechargeFlagUSDT2 && (this.selectTab = 2)

  // this.selectTab=(this.currency == 'USDT' && this.withdrawalsFlagUSDT) ? 1 : 2
  this.createDetail('created');
}

root.mounted = function () {
  console.log('==memoAddress==',this.memoAddress)
  // 进入此页发请求
  // this.createDetail('mounted');
}

root.beforeDestroy = function () {
}

root.computed = {}
// 是否是WCG
root.computed.isWCG = function () {
  let currencyObj = this.$store.state.currency.get(this.title)
  return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.title === 'WCG')
}

root.computed.rechargeFlagUSDT = function(){
  if (!this.$store.state.currency.get('USDT') ) {
    let currencyO =  JSON.parse(sessionStorage.getItem("rechargeFlagUSDT"))
    return currencyO && currencyO.depositEnabled
  }
  let currencyObj = this.$store.state.currency.get('USDT')
  sessionStorage.setItem("rechargeFlagUSDT",JSON.stringify(currencyObj))
  return currencyObj && currencyObj.depositEnabled
}

root.computed.rechargeFlagUSDT2 = function(){
  if (!this.$store.state.currency.get('USDT2') ) {
    let currencyO =  JSON.parse(sessionStorage.getItem("rechargeFlagUSDT2"))
    return currencyO && currencyO.depositEnabled
  }
  let currencyObj = this.$store.state.currency.get('USDT2')
  sessionStorage.setItem("rechargeFlagUSDT2",JSON.stringify(currencyObj))
  return currencyObj && currencyObj.depositEnabled
}



root.methods = {}

// 创建复制按钮
root.methods.copyValue = function () {
  let copyBtn = new Clipboard('.mobile-asset-detail-container-copy-btn');
  let that = this
  copyBtn.on('success', function(e){
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function(e){
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })

}

root.methods.copyMemoValue = function () {
  let copyBtn = new Clipboard('.mobile-asset-detail-container-copy-memo-btn');
  let that = this
  copyBtn.on('success', function(e){
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function(e){
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}

root.methods.copyPublicKeyValue = function () {
  let copyBtn = new Clipboard('.mobile-asset-detail-container-copy-publicKey-btn');
  let that = this
  copyBtn.on('success', function(e){
    e.clearSelection();
    that.popOpen = true
    that.popType = 1
    that.popText = '复制成功'
    copyBtn.destroy()
  })
  copyBtn.on('error', function(e){
    that.popOpen = true
    that.popType = 0
    that.popText = '复制失败'
    copyBtn.destroy()
  })
}


root.methods.isERC20 = function () {
  // let currencyObj = this.$store.state.currency.get(this.title)
  // return currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.currency === 'WCG')
  return (this.title == "USDT" && this.selectTab == 2) ? "USDT2" : this.title;
}


// 切换状态
root.methods.toggleStatus= function (tab) {
  this.selectTab = tab
  console.log('this.selectTab===========',this.selectTab);
  // if(this.selectTab === 2){
    this.createDetail()
  // }
}

root.methods.createDetail = function (type) {
  console.log(type);
  this.title = location.search.substr(1).split("=")[1]

  this.$store.commit('changeMobileHeaderTitle', this.title + '充值');
  console.log(this.title)
  let params = {"currency": this.title == "USDT" ? this.isERC20() : this.title}
  // let params = {"currency": this.title}
  // let params = {"currency": "USDT2"}
  this.$http.send('RECHARGE', {
    bind: this,
    callBack: this.re_createDetail,
    errorHandler: this.error_createDetail,
    params
  })
}

root.methods.re_createDetail = function (data) {
  // let dataObj = JSON.stringify(data)

  if (data.errorCode) {
    // this.close()
    this.toastOpen = true
    return
  }
  console.log('data.dataMap===1',data.dataMap)

  this.loading = false

  let currencyObj = this.$store.state.currency.get(this.title)
  if (currencyObj && (currencyObj.addressAliasTo === 'WCG' || this.title === 'WCG')) {
    let address = data.dataMap.addressBean.address || '';
    let addressArr = address.split('?');
    this.address = addressArr[0] || '';
    this.publicKeyAddress = addressArr[1] || '';

    return;
  }

  this.address = data.dataMap.addressBean.address;

  if(data.dataMap.addressBean.memoAddress){
    this.memoAddress = data.dataMap.addressBean.memoAddress;
    this.memoToastShow = true;
  }

  // if(data.dataMap.addressBean.publicKeyAddress){
  //   this.publicKeyAddress = data.dataMap.addressBean.publicKeyAddress;
  //   this.publicKeyToastShow = true;
  // }

  // this.createBtnCopy()
  // console.log('address', address)
}
//
// root.methods.re_createDetail = function (data) {
//   // let dataObj = JSON.stringify(data)
//   if (data.errorCode) {
//     // this.close()
//     this.toastOpen = true
//     return
//   }
//   this.address = data.dataMap.addressBean.address;
//   if(data.dataMap.addressBean.publicKeyAddress){
//     this.publicKeyAddress = data.dataMap.addressBean.publicKeyAddress;
//     this.publicKeyToastShow = true;
//   }
//   this.loading = false
//
//   // this.createBtnCopy()
//   // console.log('address', address)
// }
root.methods.error_createDetail = function (err) {
  console.log('err', err);
}


// 关闭pop提示
root.methods.popClose = function () {
  this.popOpen = false
}

// 关闭交易异常弹窗
root.methods.toastClose = function () {
  this.toastOpen = false
}

root.methods.closeAlertFlag = function () {
  this.alertFlag = false
}

/*---------------------- 关闭memo弹框系列 ---------------------*/

root.methods.closeMemoToast = function () {
  this.memoToastShow = false;
  this.$router.back();
}

root.methods.changeAgreement = function () {
  this.memoAgreement = !this.memoAgreement
}

root.methods.memoConfirm = function () {
  if(this.memoAgreement === false) return;
  this.memoToastShow = false
}


root.methods.closePublickeyToast = function () {
  this.publicKeyToastShow = false;
}

root.methods.changePublickeyAgreement = function () {
  this.publicKeyAgreement = !this.publicKeyAgreement
}

root.methods.PublickeyConfirm = function () {
  if(this.publicKeyAgreement === false) return;
  this.publicKeyToastShow = false
}



export default root
