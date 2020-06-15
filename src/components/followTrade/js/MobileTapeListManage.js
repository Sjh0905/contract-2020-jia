const root = {}
root.name = 'mobileTapeListManage'
/*------------------------------ 组件 ------------------------------*/
root.components = {
 // 'Loading': resolve => require(['../Loading/Loading.vue'], resolve),
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    incomeDetaisList:[
    ],
    openMaskWindow:false,
    // 是否开启带单
    isTapeList: false,
    currencyPair:0, //订阅费用

    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    waitTime: 2000,

  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  if(this.$route.query.isApp) {
    window.postMessage(JSON.stringify({
        method: 'setTitle',
        parameters: '带单管理'
      })
    );
    window.postMessage(JSON.stringify({
      method: 'setH5Back',
      parameters: {
        canGoH5Back:false
      }
    }))
  }
}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
// 检验是否是APP
root.computed.isApp = function () {
  return this.$route.query.isApp ? true : false
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
// 判断数字
root.methods.commit = function () {
  if(this.currencyPair == 0 ) {
    this.openPop('请输入正确的数字')
  }
}
// 返回个人页面
root.methods.jumpToFollowTradeStrategy = function () {
  this.$router.push({name:'mobileFollowTradeStrategy'})
}
// 打开蒙层
root.methods.openMask = function () {
  this.openMaskWindow = true
}
// 关闭蒙层
root.methods.closeMaskWindow = function () {
  this.openMaskWindow = false
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
export default root
