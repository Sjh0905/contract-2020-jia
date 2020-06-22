const root = {}
root.name = 'tapeListManage'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../../vue/PopupWindow'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    openMaskWindow:false,
    // 是否开启带单
    isTapeList: false,
    currencyPair:'', //订阅费用
    currencyPairFee:'', //修改订阅费用


    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    waitTime: 2000,

    countFollower:0, //跟单人数
    sumFee:0, //累计收益
    todayFee:0, //今日收益
    userFollowFees:[], //收益明细
    followDay:'', // 跟单天数
    godInfo:{}, //是否开启带单

    // 信息弹框
    popWindowOpen:false,

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

  this.postManage()
  if(this.$route.query.isApp) {
    // window.postMessage(JSON.stringify({
    //     method: 'setTitle',
    //     parameters: '带单管理'
    //   })
    // );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:true
      }
    }))
  }
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}

root.computed.isHasItem = function () {
  if(JSON.stringify(this.godInfo) == '{}') {
    return false
  }
  return true
}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
// 检验是否是安卓
root.computed.isAndroid = function () {
  return this.$store.state.isAndroid
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
//修改跟单
root.methods.goToModify = function (fee) {
  this.currencyPairFee = fee
  this.popWindowOpen = true
}
// 关闭修改策略弹框
root.methods.popWindowClose= function () {
  this.popWindowOpen = false
}
// 返回个人页面
root.methods.jumpToFollowTradeStrategy = function () {
  this.$router.go(-1)
}
// 打开蒙层
root.methods.openMask = function () {
  this.openMaskWindow = true
}
// 关闭蒙层
root.methods.closeMaskWindow = function () {
  this.openMaskWindow = false
}
root.methods.testCurrencyPair = function () {
  if(this.currencyPair == ''){
    this.currencyPairText = '订阅费用不能为空'
    return
  }
}

//成为大神
root.methods.postCommitFee = function () {
  if(this.currencyPair == ''){
    this.openPop ('订阅费用不能为空')
    return
  }
  // if(this.currencyPair == 0){
  //   this.openPop ('订阅费用不能为0')
  //   return
  // }
  let params = {
    fee: this.currencyPair,
  }
  this.$http.send('POST_GOD', {
    bind: this,
    params: params,
    callBack: this.re_postCommitFee,
    errorHandler: this.error_postCommitFee
  })
}
root.methods.re_postCommitFee = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if(data.errorCode == 0) {
    this.openMaskWindow = false
    this.isTapeList = true
    this.openPop('订阅成功',1)
    this.postManage()
  }
  if(data.errorCode != 0) {
    this.openMaskWindow = false
    this.isTapeList = true
    this.openPop('系统有误')
  }
}
root.methods.error_postCommitFee = function (err) {
  console.log("this.err=====",err)
}



//修改大神
root.methods.postRevisionFee = function () {
  if (this.currencyPairFee == '') {
    this.openPop('修改费用不可为空')
    return
  }
  let params = {
    fee: this.currencyPairFee,
  }
  this.$http.send('POST_REVISION_FEE', {
    bind: this,
    params: params,
    callBack: this.re_postRevisionFee,
    errorHandler: this.error_postRevisionFee
  })
}
root.methods.re_postRevisionFee = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  if(data.errorCode == 0) {
    this.openMaskWindow = false
    this.isTapeList = true
    this.openPop('修改成功',1)
    this.popWindowClose()
    this.postManage()
  }
  if(data.errorCode != 0) {
    this.openMaskWindow = false
    this.isTapeList = true
    this.openPop('系统有误')
  }
}
root.methods.error_postRevisionFee = function (err) {
  console.log("this.err=====",err)
}

//个人带单管理
root.methods.postManage = function () {
  this.$http.send('POST_MANAGE', {
    bind: this,
    // params: params,
    callBack: this.re_postManage,
    errorHandler: this.error_postManage
  })
}
root.methods.re_postManage = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  this.countFollower = data.dataMap.countFollower || '0'
  this.sumFee = data.dataMap.sumFee || '0'
  this.todayFee = data.dataMap.todayFee || '0'
  this.userFollowFees = data.dataMap.userFollowFees || []
  this.godInfo = data.dataMap.godInfo || {}
  this.followDay = data.dataMap.days || '0'
}
root.methods.error_postManage = function (err) {
  console.log("this.err=====",err)
}

//修改带单费用
root.methods.RevisionFee = function () {
  this.openMaskWindow = true
}


// 打开toast
root.methods.openPop = function (popText, popType, waitTime) {
  this.popText = popText
  this.popType = popType || 0
  this.popOpen = true
  this.waitTime = waitTime || 2000
}
// 关闭toast
root.methods.closePop = function () {
  this.popOpen = false;
}

// 保留小数点后8位
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
export default root
