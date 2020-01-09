const root = {};

root.name = 'MobileTradingHallDetail';

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'MobilePopupWindow': resolve => require(['../vue/MobilePopupWindow'], resolve),
}


/*----------------------------- data ------------------------------*/


root.data = function () {
  return {
    currentOrder: [],
    currentInterval: null,
    clickOrder: new Set(),
    orderDetail: [],
    cancelAll: false,

    popOpen: false,

    promptOpen: false,
    promptType: 0,

    limit: 200, //请求次数
    offsetId: 0, //最后一条的订单id

	  canceling:false,

    // 精度
    quoteScale: 8,
    baseScale: 8,
  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
  this.$eventBus.listen(this, 'TRADED', this.TRADED)
  // 获取订单
  this.getOrder()
  this.currentInterval && clearInterval(this.currentInterval)
  this.currentInterval = setInterval(this.getOrder, 5000)

  this.$eventBus.listen(this, 'CANCEL_ALL', this.CANCEL_ALL)
}

root.beforeDestroy = function () {
  this.currentInterval && clearInterval(this.currentInterval)
}


/*----------------------------- 计算 ------------------------------*/

root.computed = {}
// 计算后的order，排序之类的放在这里
root.computed.currentOrderComputed = function () {
  return this.currentOrder
}
// 用户id，判断是否登录
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


/*----------------------------- 方法 ------------------------------*/

root.methods = {};

root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
  // console.log('baseScale', this.baseScale)
}


// 获取订单
root.methods.getOrder = function () {
  // if (!this.$store.state.authMessage.userId) {
  //   this.loading = false
  //   return
  // }
  // this.loading = true
  this.$http.send('POST_USER_ORDERS',
    {
      bind: this,
      params: {
        offsetId: this.offsetId,
        limit: this.limit,
        isFinalStatus: false,
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder,
    })
}

// 获取订单回调
root.methods.re_getOrder = function (data) {
  // console.log('订单信息获取到了！！！！', data)
  this.loading = false
  if (this.cancelAll) {
    return
  }

  this.currentOrder = data.orders.filter(
    v => {

      v.click = false

      this.clickOrder.has(v.id) && (v.click = true)

      return (v.status !== 'PARTIAL_CANCELLED') && (v.status !== 'FULLY_CANCELLED') && (v.status !== 'FULLY_FILLED')
    }
  )

}

// 获取订单出错
root.methods.error_getOrder = function (err) {
  console.warn("获取订单出错！")
}

root.methods.TRADED = function (para) {
  this.getOrder()
}

// 撤单
root.methods.cancelOrder = async function (order) {

	this.canceling = order.id
  console.log(order)

  this.clickOrder.add(order.id)
  order.click = true
  let params = {
    targetOrderId: order.id,
    symbol: order.symbol,
    type: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY' : 'CANCEL_SELL'
  }
  // console.warn("params", params)
  await this.$http.send('TRADE_ORDERS', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
root.methods.re_cancelOrder = function (data) {
  console.warn("撤单返回！", data)
	this.canceling =  false;
  this.$eventBus.notify({key: 'CANCEL_ORDER'})
  this.$router.push("mobileTradingHallDetail")
  this.getOrder()
}
root.methods.error_cancelOrder = function (err) {
	this.canceling = false
  console.warn("撤单错误！", err)
}

// 判断是否点击了某个订单
root.methods.clickOneOrder = function (id) {
  return !this.clickOrder.has(id)
}

// 全撤
root.methods.cancelAllOrder = function () {
  this.popOpen = true
}

root.methods.CANCEL_ALL = async function () {
  this.cancelAll = true
  this.popOpen = false
  this.promptType = 2
  this.promptOpen = true
  for (let i = 0; i < this.currentOrder.length; i++) {
    await this.cancelOrder(this.currentOrder[i])
  }
  this.promptOpen = false
  this.cancelAll = false
}
//=====================================================


// 关闭弹窗
root.methods.closePop = function () {
  this.popOpen = false
}
root.methods.ensurePop = async function () {
  this.cancelAll = true
  this.popOpen = false
  this.promptType = 2
  this.promptOpen = true
  for (let i = 0; i < this.currentOrder.length; i++) {
    await this.cancelOrder(this.currentOrder[i])
  }
  this.promptOpen = false
  this.cancelAll = false
}


export default root;
