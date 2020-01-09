const root = {};

root.name = 'MobileTradingHallDetail';

root.components = {
  'HistoryDetail': resolve => require(['../mobileVue/MobileHistoryDetail'], resolve),
}


root.data = function () {
  return {
    historyOrder: [],
    clickThis: -1,
	  orderDetail: [],


    limit: 100, //一次获取多少条数据
    offsetId: 0, //最后的订单id
    updatedAt:1,//最后的订单更新时间,默认为当前时间
    showLoadingMore: true,//是否显示加载更多
    loadingMoreIng: false, //是否正在加载更多

    // 精度
    quoteScale: 8,
    baseScale: 8,

  }
}


root.computed = {}
// 均值
root.computed.averagePrice = function () {
	let avargePrice = 0, price = 0, amount = 0
	this.orderDetail.forEach(v => {
		amount += v.amount
		price += v.price * v.amount
	})
	avargePrice = price / (amount === 0 ? 1 : amount)
	return avargePrice
}
// 总计成交数量
root.computed.amount = function () {
	let amount = 0
	this.orderDetail.forEach(v => {
		amount += v.amount
	})
	return amount
}

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

root.created = function () {
  // console.warn('历史订单！！！')
	this.$store.commit('changeMobileHeaderTitle', '历史委托');

	this.getOrder()
}


root.methods = {}

root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
  // console.log('baseScale', this.baseScale)
}

// 发送请求获取
root.methods.getOrder = function () {
  if (!this.$store.state.authMessage.userId) {
    this.loading = false
    return
  }
  this.loading = true
  this.$http.send('POST_USER_ORDERS',
    {
      bind: this,
      params: {
        updatedAt:this.updatedAt,//最后的订单更新时间
        offsetId: this.offsetId, //最后一条订单的id
        limit: this.limit, //一次请求多少条订单
        isFinalStatus: true //是否是历史订单
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder
    })
}
// 获取历史订单回调
root.methods.re_getOrder = function (data) {

  // this.historyOrder = data.orders.filter(v => (v.status === 'SEQUENCED' && v.filledAmount > 0))
  this.historyOrder.push(...data.orders.filter(
    v => {
      return ((v.status === 'PARTIAL_CANCELLED') || (v.status === 'FULLY_CANCELLED') || (v.status === 'FULLY_FILLED'))
    }
  ))
  this.loading = false
  // console.warn('history ====', data, this.historyOrder)
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
  if (order.status === 'PARTIAL_CANCELLED') return `撤单（成交 ${((order.filledAmount / order.amount).toFixed(4) * 100) < 0.01 ? '<0.01' : ((order.filledAmount / order.amount).toFixed(4) * 100)}%）` //部分成功
  if (order.status === 'FULLY_CANCELLED') return '撤单'
  if (order.status === 'FULLY_FILLED') return '已完成'
}
// 可以显示详情
// root.methods.canShowDetail = function (order) {
// 	if (order.status === 'PARTIAL_CANCELLED') return true
// 	if (order.status === 'FULLY_CANCELLED') return false
// 	if (order.status === 'FULLY_FILLED') return true
// }
//
root.methods.showDetail = function (id, status) {
  return
  if (status == "FULLY_CANCELLED") return
  if (this.clickThis === id) {
    this.clickThis = -1
    return
  }
  this.clickThis = id

}
root.methods.goDetail = function (order) {
	this.$router.push({path: "/index/MobileHistoryDetail", query: {...order}})
}


export default root;
