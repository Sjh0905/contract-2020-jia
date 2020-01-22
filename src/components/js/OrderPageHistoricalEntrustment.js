const root = {}
root.name = 'OrderPageHistoricalEntrustment'

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'HiddenDetail': resolve => require(['../vue/OrderPageHistoricalEntrustmentDetail'], resolve),
}

/*----------------------------- data ------------------------------*/

root.data = () => {
  return {
    loading: true,
    historyOrder: [],
    clickThis: -1,

    limit: 100, //一次获取多少条数据
    offsetId: 0, //最后的订单id
    updatedAt:1,//最后的订单更新时间,默认为1
    showLoadingMore: true,//是否显示加载更多
    loadingMoreIng: false, //是否正在加载更多
  }
}

root.props = {};
root.props.tradinghallLimit = {
  type: Number
}

/*----------------------------- 计算 ------------------------------*/
root.computed = {}
// 历史属性的计算后，排序之类的写在这里
root.computed.historyOrderComputed = function () {
  return this.historyOrder
}
// 获取登录状态
root.computed.userId = function () {
  return this.$store.state.authMessage.userId
}

// 所有币对精度信息
root.computed.quoteScale_list = function () {
  let quoteScale_obj = {};
  let quoteScale_list = this.$store.state.quoteConfig;
  quoteScale_list.forEach(v => {
    quoteScale_obj[v.name] = {quoteScale: v.quoteScale, baseScale: v.baseScale};
  })
  return quoteScale_obj;
}

/*----------------------------- 生命周期 ------------------------------*/


root.created = function () {
  // console.warn('历史订单！！！')
  console.log('this.$route=======historicalEntrust',this.$route.name)
  this.getOrder()
}

/*----------------------------- 方法 ------------------------------*/


root.methods = {}
// 发送请求获取
root.methods.getOrder = function () {
  if (!this.$store.state.authMessage.userId) {
    this.loading = false
    return
  }
  // this.loading = true

  this.$http.send('POST_USER_ORDERS',
    {
      bind: this,
      params: {
        updatedAt:this.updatedAt,//最后的订单更新时间
        offsetId: this.offsetId, //最后一条订单的id
        limit: (this.tradinghallLimit===10) ? this.tradinghallLimit : this.limit, //一次请求多少条订单
        isFinalStatus: true //是否是历史订单
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder
    })
}
// 获取历史订单回调
root.methods.re_getOrder = function (data) {
  this.historyOrder.push(...data.orders.filter(
    v => {
      return ((v.status === 'PARTIAL_CANCELLED') || (v.status === 'FULLY_CANCELLED') || (v.status === 'FULLY_FILLED'))
    }
  ))
  this.loading = false
  // 加载更多中
  this.loadingMoreIng = false

  // 如果获取
  data.orders.length !== 0 && (this.offsetId = data.orders[data.orders.length - 1].id)
  data.orders.length !== 0 && (this.updatedAt = data.orders[data.orders.length - 1].updatedAt)

  // 是否显示加载更多
  // console.warn('this is order length', data.orders.length, this.limit)
  if (data.orders.length < this.limit) {
    this.showLoadingMore = false
  }

}
// 错误处理
root.methods.error_getOrder = function (err) {
  console.warn("获取错误", err)
}

// 订单状态
root.methods.getStatus = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return this.$t('orderPageHistoricalEntrustmentDetail.partialCancelled',
    {point: ((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)})
  // `撤单（成交 ${((order.filledAmount / order.amount) * 100).toFixed(2) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount) * 100).toFixed(2)}%）` //部分成功
  if (order.status === 'FULLY_CANCELLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyCancelled')
  if (order.status === 'FULLY_FILLED') return this.$t('orderPageHistoricalEntrustmentDetail.fullyFilled')
}

// 可以显示详情
root.methods.canShowDetail = function (order) {
  if (order.status === 'PARTIAL_CANCELLED') return true
  if (order.status === 'FULLY_CANCELLED') return false
  if (order.status === 'FULLY_FILLED') return true
}

// 显示详情
root.methods.showDetail = function (id) {
  if (this.clickThis === id) {
    this.clickThis = -1
    return
  }
  this.clickThis = id
}

// 点击加载更多
root.methods.clickLoadingMore = function () {
  this.loadingMoreIng = true
  this.getOrder()
}

// 点击加载更多
root.methods.toOrderHistory = function () {
  this.$router.push({name:'historicalEntrust'})
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

export default root
