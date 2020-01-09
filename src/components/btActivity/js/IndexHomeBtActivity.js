const root = {}

root.name = 'IndexHomeBtActivity'


/*------------------------ 组件 ------------------------*/

// 组件
root.components = {
  'PopupWindow': resolve => require(['../../vue/BasePopupWindow'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
}

/*------------------------ data ------------------------*/
root.data = function () {
  return {

    // 今日待分配收益折合
    platformWaitToDistributionLoading: true, //平台待分配收益加载中
    platformWaitToDistribution: 0, //平台待分配收益
    yesterdayPlatformDistribution: 0,//昨日分配收益折合

    // 昨日挖矿产出
    platformYesterdayMiningProduceLoading: true, //昨日挖矿产出加载中
    platformYesterdayMiningProduce: 0,//昨日挖矿产出
    platformTodayTotalCirculationBT: 0,//今日BT流通总量

    getPlatformWaitToDistributionInterval: null, //平台待分配收益轮询


    popOpen: false,
  }
}
/*------------------------ 生命周期 ------------------------*/
root.created = function () {

  this.getPlatformWaitToDistribution()
  this.getPlatformYesterdayMiningProduce()

  this.getPlatformWaitToDistributionInterval && clearInterval(this.getPlatformWaitToDistributionInterval)
  this.getPlatformWaitToDistributionInterval = setInterval(this.getPlatformWaitToDistribution, 1000 * 60 * 5)

}


root.beforeDestroy = function () {
  this.getPlatformWaitToDistributionInterval && clearInterval(this.getPlatformWaitToDistributionInterval)
}
/*------------------------ computed ------------------------*/
root.computed = {}
root.computed.computedPlatformWaitToDistribution = function () {
  return this.platformWaitToDistribution && this.toFixed(this.platformWaitToDistribution, 8) || 0
}
root.computed.computedYesterdayPlatformDistribution = function () {
  return this.yesterdayPlatformDistribution && this.toFixed(this.yesterdayPlatformDistribution, 8) || 0
}
root.computed.computedPlatformYesterdayMiningProduce = function () {
  return this.platformYesterdayMiningProduce && this.toFixed(this.platformYesterdayMiningProduce, 8) || 0
}
root.computed.computedPlatformTodayTotalCirculationBT = function () {
  return this.platformTodayTotalCirculationBT && this.toFixed(this.platformTodayTotalCirculationBT, 8) || 0
}


/*------------------------ method ------------------------*/
root.methods = {}

// 获取今日待分配收益折合
root.methods.getPlatformWaitToDistribution = function () {
  this.$http.send('GET_BT_FEE_DIVIDENT', {
    bind: this,
    callBack: this.re_getPlatformWaitToDistribution,
    errorHandler: this.error_getPlatformWaitToDistribution
  })
}
root.methods.re_getPlatformWaitToDistribution = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('获取今日待分配收益折合', data)
  this.platformWaitToDistributionLoading = false
  if (data.errorCode) {
    return
  }
  this.platformWaitToDistribution = data.dataMap && data.dataMap.dividend || 0
}
root.methods.error_getPlatformWaitToDistribution = function (err) {
  console.warn('获取今日待分配收益折合出错', err)
}

// 获取昨日挖矿产出
root.methods.getPlatformYesterdayMiningProduce = function () {
  this.$http.send('GET_BT_PLATFORM_DATA', {
    bind: this,
    callBack: this.re_getPlatformYesterdayMiningProduce,
    errorHandler: this.error_getPlatformYesterdayMiningProduce
  })
}
root.methods.re_getPlatformYesterdayMiningProduce = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('获取昨日挖矿产出', data)
  this.platformYesterdayMiningProduceLoading = false
  if (data.errorCode) {
    return
  }
  this.platformYesterdayMiningProduce = data.dataMap && data.dataMap.mining || 0
  this.platformTodayTotalCirculationBT = data.dataMap && data.dataMap.grand || 0
  this.yesterdayPlatformDistribution = data.dataMap && data.dataMap.sumAmount || 0
}
root.methods.error_getPlatformYesterdayMiningProduce = function (err) {
  console.warn('获取昨日挖矿产出出错', err)
}


// 打开弹窗
root.methods.openPopupWindow = function () {
  this.popOpen = true
}

// 关闭弹窗
root.methods.closePopupWindow = function () {
  this.popOpen = false
}

// 去活动页面
root.methods.goToBtActivity = function () {
  this.$router.push({name: 'btActivity'})
}


/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

/*---------------------- 加法运算 begin ---------------------*/
root.methods.accAdd = function (num1, num2) {
  return this.$globalFunc.accAdd(num1, num2)
}
/*---------------------- 加法运算 end ---------------------*/

/*---------------------- 减法运算 begin ---------------------*/
root.methods.accMinus = function (num1, num2) {
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
// 格式化时间
root.methods.formatDateUitl = function (time) {
  return this.$globalFunc.formatDateUitl(time, 'YYYY-MM-DD hh:mm:ss')
}


export default root
