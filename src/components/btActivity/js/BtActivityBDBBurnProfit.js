const root = {}

root.name = 'BtActivityBDBBurnProfit'


/*------------------------ 组件 ------------------------*/

// 组件
root.components = {
  'PopupWindow': resolve => require(['../../vue/BasePopupWindow'], resolve),
  'Loading': resolve => require(['../../vue/Loading'], resolve),
  'PageBar': resolve => require(['../../vue/BasePageBar'], resolve),
}

/*------------------------ data ------------------------*/
root.data = function () {
  return {

    offset: 1,
    maxResults: 10,
    maxPage: 1,
    selectIndex: 1,
    BDBBurnProfitRecords: [],
    reward: 0,

    regulationConfigLoading: true,// 奖励规则加载中
    rewardRate: 0,//奖励费率
    activityRate: 0,//奖励费率


    loading: true,
    popOpen: false,
  }
}
/*------------------------ 生命周期 ------------------------*/
root.created = function () {
  this.getBDBBurnProfitRecords()
  this.getRegulationConfig()
}

/*------------------------ 计算 ------------------------*/
root.computed = {}
// 奖励
root.computed.computedReward = function () {
  return this.reward && this.toFixed(this.reward, 8) || 0
}


/*------------------------ 方法 ------------------------*/
root.methods = {}


// 获取奖励比率
root.methods.getRegulationConfig = function () {
  this.$http.send('GET_BT_REGULATION_CONFIG', {
    bind: this,
    callBack: this.re_getRegulationConfig,
    errorHandler: this.error_getRegulationConfig,
  })
}

root.methods.re_getRegulationConfig = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('获取奖励比率', data)
  if (data.errorCode) {
    return
  }
  this.regulationConfigLoading = false
  this.activityRate = data.activity || 0
  this.rewardRate = data.reward || 0

}
root.methods.error_getRegulationConfig = function (err) {
  console.warn('获取奖励比率', err)
}


// 获取列表数据
root.methods.getBDBBurnProfitRecords = function () {
  this.offset = (this.selectIndex - 1) * this.maxResults
  this.$http.send('GET_BT_BURNING_BDB_REWARD', {
    params: {
      offset: this.offset,
      maxResults: this.maxResults
    },
    bind: this,
    callBack: this.re_getBDBBurnProfitRecords,
    errorHandler: this.error_getBDBBurnProfitRecords,
  })
}
root.methods.re_getBDBBurnProfitRecords = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  // console.warn('获取列表数据', data)
  this.loading = false

  if (data.errorCode) {
    return
  }

  this.BDBBurnProfitRecords = data.dataMap && data.dataMap.record
  this.reward = data.dataMap && data.dataMap.reward

}
root.methods.error_getBDBBurnProfitRecords = function (err) {
  console.warn('获取列表数据出错', err)
}

// 分页
root.methods.clickChangePage = function (n) {
  this.selectIndex = n
  this.getBDBBurnProfitRecords()
}

// 打开弹窗
root.methods.openPopupWindow = function () {
  this.popOpen = true
}
// 关闭弹窗
root.methods.closePopupWindow = function () {
  this.popOpen = false
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
