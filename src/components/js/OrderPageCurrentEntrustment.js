const root = {}
root.name = 'OrderPageCurrentEntrustment'



/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
}

/*----------------------------- data ------------------------------*/

root.data = () => {
  return {
    loading: true, // 加载中
    currentOrder: [],
    popOpen: false,

    promptOpen: false,
    promptType: 0,
    clickOrder: new Set(),

    cancelAll: false,

    currentInterval: null,

    waitForCancelOrder: null, //等待撤销的订单
    waitForCancel: false, //是否开启等待
    waitForCancelTime: 2, //等待时间
    waitForCancelInterval: null, //等待计时器

    cancelConfirm: false,

    limit: 100, //请求次数
    offsetId: 0, //最后一条的订单id

    showLoadingMore: true,//是否显示加载更多
    loadingMoreIng: false, //是否正在加载更多

  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.props = {};
root.props.tradinghallLimit = {
  type: Number
}

//sss===

root.created = function () {
  this.$store.commit('changeJoinus', false);
  this.$eventBus.listen(this, 'TRADED', this.TRADED)
  // 获取订单
  this.loading = true
  this.getOrder()
  this.currentInterval && clearInterval(this.currentInterval)
  this.currentInterval = setInterval(this.getOrder, 5000)

  console.log('this.$route=======',this.$route.name)
  // console.log(('this.$router==========第四季',this.$router))
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


root.methods = {}

// 获取订单
root.methods.getOrder = function () {
  if (!this.$store.state.authMessage.userId) {
    this.loading = false
    return
  }
  this.$http.send('POST_USER_ORDERS',
    {
      bind: this,
      params: {
        offsetId: this.offsetId,
        limit: (this.tradinghallLimit===10) ? this.tradinghallLimit : this.limit, //一次请求多少条订单,
        isFinalStatus: false,

      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder,
    })
}

// 获取订单回调
root.methods.re_getOrder = function (data) {
  // console.warn('订单信息获取到了！！！！', data)
  this.loading = false
  let open_order = [];
  let symbol = this.$store.state.symbol;
  if (this.cancelAll) {
    return
  }
  this.currentOrder = data.orders.filter(
    v => {
      // 是否点击过撤单
      v.click = false
      // 如果已经点击过撤单
      this.clickOrder.has(v.id) && (v.click = true)

      return (v.status !== 'PARTIAL_CANCELLED') && (v.status !== 'FULLY_CANCELLED') && (v.status !== 'FULLY_FILLED')
    }
  )

  // 存储当前list的price，存入store，用于和深度图的价格做对比
  this.currentOrder.forEach(v=>{
    if (v.symbol == symbol) {
      open_order.push(v.price);
    }
  })
  this.$store.commit('GET_OPEN_ORDER', open_order);

  console.log('this.currentOrder',this.currentOrder)
  // this.loading = false
  // // 加载更多中
  // this.loadingMoreIng = false
  //
  // // 如果获取
  // data.orders.length !== 0 && (this.offsetId = data.orders[data.orders.length - 1].id)
  // data.orders.length !== 0 && (this.updatedAt = data.orders[data.orders.length - 1].updatedAt)
  //
  // // 是否显示加载更多
  // // console.warn('this is order length', data.orders.length, this.limit)
  // if (data.orders.length < this.limit) {
  //   this.showLoadingMore = false
  // }
}

// 获取订单出错
root.methods.error_getOrder = function (err) {
  console.warn("获取订单出错！")
}

// 跳转当前订单页
root.methods.toCurrentHistory = function (err) {
  this.$router.push({name:'currentEntrust'})
}

root.methods.TRADED = function (para) {
  this.getOrder()
}

// 撤单确认
root.methods.clickToCancel = function (order) {
  this.initInterval()
  this.waitForCancelOrder = order
  this.cancelConfirm = true
}

// 点击确定取消订单
root.methods.clickToCancelConfirm = function () {
  this.cancelOrder(this.waitForCancelOrder)
  this.cancelConfirm = false
}
// 2秒后方可点击撤单
root.methods.initInterval = function () {
  // console.warn('!!!')
  this.waitForCancelInterval && clearInterval(this.waitForCancelInterval)
  this.waitForCancelTime = 2
  this.waitForCancel = true
  this.waitForCancelInterval = setInterval(() => {
    this.waitForCancelTime--
    if (this.waitForCancelTime <= 0) {
      this.waitForCancel = false
      this.waitForCancelTime = 2
      this.waitForCancelInterval && clearInterval(this.waitForCancelInterval)
    }
  }, 1000)

}

// 撤单
root.methods.cancelOrder = async function (order, cancelAll = false) {
  this.clickOrder.add(order.id)
  order.click = true
  let params = {
    targetOrderId: order.id,
    symbol: order.symbol,
    type: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY' : 'CANCEL_SELL'
  }
  if (!cancelAll) {
    await new Promise(function (resolve, reject) {
      setTimeout(resolve, 2000)
    })
  }
  // console.warn("params", params)
  await this.$http.send('TRADE_ORDERS', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
// 返回
root.methods.re_cancelOrder = function (data) {
  // console.warn("撤单返回！", data)

  this.$eventBus.notify({key: 'CANCEL_ORDER'})

  this.getOrder()
}
root.methods.error_cancelOrder = function (err) {
  console.warn("撤单错误！", err)
}

// 判断是否点击了某个订单
root.methods.clickOneOrder = function (id) {
  return !this.clickOrder.has(id)
}

// 全撤
root.methods.cancelAllOrder = function () {
  // this.initInterval()
  this.popOpen = true
}

// 关闭弹窗
root.methods.closePop = function () {
  this.popOpen = false
}
// 确认全撤
root.methods.ensurePop = async function () {
  this.cancelAll = true
  this.popOpen = false
  this.promptType = 2
  this.promptOpen = true
  for (let i = 0; i < this.currentOrder.length; i++) {
    await this.cancelOrder(this.currentOrder[i], true)
  }
  this.promptOpen = false
  this.cancelAll = false
}


// 关闭提示
root.methods.closePrompt = function () {
  this.promptOpen = false
}

// 撤单确认
root.methods.cancelConfirmClose = function () {
  this.cancelConfirm = false
}

/*---------------------- 保留小数 begin ---------------------*/
root.methods.toFixed = function (num, acc = 8) {
  return this.$globalFunc.accFixed(num, acc)
}
/*---------------------- 保留小数 end ---------------------*/

export default root
