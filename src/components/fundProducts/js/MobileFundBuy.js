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
    // issueCopies:300,
    //剩余份数
    remainingCopies:0,
    remainingType:'',
    // productsDataList:1
    firstList:{},
    period:{}
  }
}
/*------------------------------ 生命周期 -------------------------------*/
root.created = function () {
  // console.info('this.$route.query.item======',this.$route.query.item)
  console.info('this.$route.query.firstList.startTime',this.$route.query.firstList,this.$route.query.item)
  this.firstList = this.$route.query.firstList

  this.getProductList()
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
  let remainingCopies = this.accMinus(this.period.copies,this.inputUserCopies || 0)
  return remainingCopies > 0 ? remainingCopies : 0
}
/*------------------------------ 观察 -------------------------------*/
root.watch = {}
/*------------------------------ 方法 -------------------------------*/
root.methods = {}
root.methods.inputUserCopiesInput = function () {
  // this.inputUserCopies = this.inputUserCopies
}

root.methods.jumpToBack = function () {
  this.$router.push({'path':'/index/mobileFinancialFund/mobileFundProducts'})
}




// 基金详情get
root.methods.getProductList = function () {
  this.$http.send('GET_FUND_DETAILS', {
    bind: this,
    query:{
      currency:this.$route.query.firstList.currency,
      projectId:this.$route.query.firstList.id,
      period:this.$route.query.item

    },
    callBack: this.re_getProductList,
    errorHandler: this.error_getProductList
  })
}
// 基金详情get返回
root.methods.re_getProductList = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))

  this.remainingCopies = data.dataMap.count // 剩余份数
  this.remainingType = data.dataMap.type // 剩余份数
  this.period = data.dataMap.period // 剩余份数
}
// 基金详情get出错
root.methods.error_getProductList = function (err) {
  // console.warn('获取err出错', err)
}










// 申购操作
root.methods.toBuyFund = function () {
  if (!this.isLogin) {
    this.goToLogin()
    return
  }

  if(this.inputUserCopies > 0 && this.inputUserCopies > this.period.copies){
    this.openPop('购买份数不能大于发行份数')
    return
  }

  this.$http.send('POST_PURCHASE_TKF',
    {
      bind: this,
      params: {
        projectId:this.period.projectId,//id
        periodNumber:this.$route.query.item,//第几期
        predictNumber:this.inputUserCopies,//输入的分数
      },
      callBack: this.re_toBuyFund,
      errorHandler: this.error_toBuyFund
    }
  )

}
root.methods.re_toBuyFund = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  // console.log(res)
  if (data.errorCode) {

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



// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}
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
