const root = {}

root.name = 'BtActivityMyRecommend'


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
    loading: true,


    records: [],
    offset: 1,
    limit: 10,
    maxResults: 0,
    size: 0,
    totalRebate: 0,
    totalRegister: 0,
    yesterdayExRateIOSTtoBDB: 0,
    loadingMore: true,
    loadingMoreIng: false,


    popOpen: false,
  }
}
/*------------------------------ 生命周期 ------------------------------*/
root.created = function () {
  // 获取列表
  this.getMyInvites()

  // 是否显示'查看历史'四个字
  this.getMyHistory()
}


/*------------------------------ 计算 ------------------------------*/
root.computed = {}

root.computed.lang = function () {
  return this.$store.state.lang;
}

root.computed.recordsLength = function () {
  return this.records.length
}
// 累计
root.computed.total = function () {
  let total = 0

  for (let i = 0; i < this.records.length; i++) {
    let state = this.registerAward(this.records[i])
    if (state === '3 BDB') total = this.accAdd(total, 3)
    if (state === '50 IOST') total = this.accAdd(total, this.accMul(50, this.yesterdayExRateIOSTtoBDB))
  }
  return this.toFixed(total, 8)
}
// 累计本月返佣
root.computed.totalThisMonthRebate = function () {
  let total = 0
  for (let i = 0; i < this.records.length; i++) {
    total = this.accAdd(total, this.toFixed(this.records[i].thisMonthRebate))
  }
  return total || 0
}
// 累计累计返佣
root.computed.totalTotalRebate = function () {
  let total = 0
  for (let i = 0; i < this.records.length; i++) {
    total = this.accAdd(total, this.toFixed(this.records[i].totalRebate))
  }
  return total || 0
}


/*------------------------ 方法 ------------------------*/
root.methods = {}


// 获取我的推荐
root.methods.getMyInvites = function () {
  this.loadingMoreIng = true
  this.$http.send('POST_NEW_INVITES', {
    bind: this,
    params: {
      fromIndex: 1,
      toIndex: this.maxResults + this.limit
    },
    callBack: this.re_getMyInvites,
    errorHandler: this.error_getMyInvites,
  })
  this.maxResults += this.limit;
}
// 推荐返回
root.methods.re_getMyInvites = function (data) {
  typeof data === 'string' && (data = JSON.parse(data))
  console.warn('获取我的推荐列表', data)
  let res = data.dataMap;
  this.size = res.size;
  this.totalRebate = res.totalRebate;
  this.totalRegister = res.totalRegister;
  this.records = res.myInvites;
  this.yesterdayExRateIOSTtoBDB = res.yesterdayExRateIOSTtoBDB;

  this.loading = false

  if (this.recordsLength < this.maxResults) {
    this.loadingMore = false
  }
  this.loadingMoreIng = false
}

root.methods.error_getMyInvites = function (err) {
  this.loadingMoreIng = false
  this.loading = false
}


// 打开弹窗
root.methods.openPopupWindow = function () {
  this.popOpen = true
}
// 关闭弹窗
root.methods.closePopupWindow = function () {
  this.popOpen = false
}

// 用户名修改
root.methods.handleName = function (name) {
  return this.$globalFunc.listFormatUserName(name)
}


// 注册奖励，根据活动不同显示送不同的币，刚开始是BDB，之后是IOST
root.methods.registerAward = function (item) {
  if (item.identityAuthStatus != 2) return '---'
  // 2018年3月1日之前的实名认证的奖励3 BDB
  if (parseFloat(item.createdAt) < 1519833600000) return '3 BDB'
  // 2018年3月13日14:00-3月15日17:00实名认证的奖励50 IOST
  if (parseFloat(item.createdAt) > 1520920800000 && parseFloat(item.createdAt) < 1521104400000) return '50 IOST'
  return '---'
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


export default root
