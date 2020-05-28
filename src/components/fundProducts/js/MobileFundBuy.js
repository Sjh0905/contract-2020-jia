const root = {}
root.name = 'MobileFundBuy'
/*------------------------------ 组件 ------------------------------*/
root.components = {
  'PopupPrompt': resolve => require(['../../vue/PopupPrompt'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}
/*------------------------------ data -------------------------------*/
root.data = function () {
  return {
    // 弹框
    popType: 0,
    popText: '',
    popOpen: false,
    waitTime: 2000,

    // 申购input框内
    inputUserCopies: 1,
    //每份的USDT数量
    eachAmount:100,
    //发行份数
    issueCopies:300,
    //剩余份数
    // remainingCopies:0,
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {

}
root.mounted = function () {}
root.beforeDestroy = function () {}
/*------------------------------ 计算 -------------------------------*/
root.computed = {}
root.computed.isLogin = function () {
  return this.$store.state.isLogin;
}

root.computed.userId = function () {
  return this.$store.state.authMessage.userId ? this.$store.state.authMessage.userId : 0
}

// 检验是否是ios
root.computed.iosQuery = function () {
  return this.$route.query.isIOS
}

// 检验ios是否登录
root.computed.iosLogin = function () {
  return this.$route.query.iosLogin
}

// 获取屏幕宽度
root.computed.windowWidth = function () {
  return window.innerWidth
}

root.computed.remainingCopies = function () {
  let remainingCopies = this.accMinus(this.issueCopies,this.inputUserCopies || 0)
  return remainingCopies > 0 ? remainingCopies : 0
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
root.methods.inputUserCopiesInput = function () {
  // this.inputUserCopies = this.inputUserCopies
}
// 申购操作
root.methods.toBuyFund = function () {
  if (!this.isLogin) {
    this.goToLogin()
    return
  }

  if(this.inputUserCopies > 0 && this.inputUserCopies > this.issueCopies){
    this.openPop('购买份数不能大于发行份数')
    return
  }

  // this.$http.send('',
  //   {
  //     bind: this,
  //     params: {
  //
  //     },
  //     callBack: this.re_toBuyFund,
  //     errorHandler: this.error_toBuyFund
  //   }
  // )

}
root.methods.re_toBuyFund = function (res) {
  typeof(res) == 'string' && (res = JSON.parse(res));
  // console.log(res)
  if (res.errorCode) {

  }
}

root.methods.error_toBuyFund = function (err) {
  this.openPop('服务器升级中，请稍后再试')
}

root.methods.goToLogin = function () {
  if (this.iosQuery) {
    window.postMessage(JSON.stringify({
      method: 'toLogin'
    }))
    return
  } else {
    this.$router.push({name: 'login'});
  }
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
/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
  num1 = parseFloat(num1)
  num2 = parseFloat(num2)
  return this.$globalFunc.accMinus(num1, num2)
}
/*---------------------- 减法运算 end ---------------------*/

/*---------------------- 乘法运算 begin ---------------------*/
root.methods.accMul = function (num1, num2) {
  return this.$globalFunc.accMul(num1, num2)
}
/*---------------------- 乘法运算 end ---------------------*/

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/
export default root
