import tradingHallData from '../../dataUtils/TradingHallDataUtils'
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

    orderTradeUpdate:{},
    socketOrders:[],

    workingTypeMap : {
      MARK_PRICE:"标记价格",
      CONTRACT_PRICE:"最新价格"
    },
    currentOrdersLength:0

  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.props = {};
root.props.tradinghallLimit = {
  type: Number
}

root.watch = {};
root.watch.currentOrder = function (newVal,oldVal){
  this.currentOrdersLength = newVal.length
  this.$emit('getcurrentOrdersLength',this.currentOrdersLength);
  // console.info('newVal===',newVal,this.currentOrdersLength)
}

root.created = function () {
  this.getOrder()
  this.receiveSocket()
  // this.orderTradeUpdate = this.$store.state.orderTradeUpdate
  // console.info('this.orderTradeUpdate ===',this.orderTradeUpdate)
  // console.info('this.socketOrdersArr ===',this.socketOrdersArr)
}

root.beforeDestroy = function () {
  this.currentInterval && clearInterval(this.currentInterval)
}

/*----------------------------- 计算 ------------------------------*/


root.computed = {}
// 存储订单/交易更新推送Key值的映射关系
root.computed.socketOrderKeyMap = function () {
  let data = tradingHallData.socketOrderKeyMap;
  // console.log(data);
  return data
}
// socket推送过来的对象  组成数组进行页面渲染
root.computed.socketOrdersArr = function (){
  // 处理socket返回对象
  // console.info('this.$store.state.orderTradeUpdate',)
  // console.info('socketOrders ===',this.socketOrders.length)
  return this.socketOrders || []
}
// 计算后的order，排序之类的放在这里
root.computed.currentOrderComputed = function () {
  return this.currentOrder
}
// 用户id，判断是否登录
root.computed.userId = function () {
  return this.$store.state.authState.userId
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
root.computed.serverTime = function () {
  return new Date().getTime();
}

/*----------------------------- 方法 ------------------------------*/

root.methods = {}
// 接收 socket 信息
root.methods.receiveSocket = function () {
  // 获取当前委托的数据
  // let subscribeSymbol = this.$store.state.subscribeSymbol;

  let socketOrderKeyMap = this.socketOrderKeyMap

  this.$socket.on({
    key: 'ORDER_TRADE_UPDATE', bind: this, callBack: (messageObj,stream) => {
      let message = messageObj.o || {}
      if(!message)return

      for(let k in socketOrderKeyMap){
        let smk = socketOrderKeyMap[k];
        smk && (message[smk] = message[k])
      }

      if(message.X == 'NEW' ){ //新增委托
        this.currentOrder.unshift(message);
        return
      }

      if(message.X == 'PARTIAL_FILL'){//部分成交直接替换
        for (let i = 0; i <this.currentOrder.length; i++) {
          let item = this.currentOrder[i]
          if(message.orderId == item.orderId){
            item = message
            break;
          }
        }
        return
      }

      //其他情况需要删除
      for (let i = 0; i <this.currentOrder.length ; i++) {
        let item = this.currentOrder[i]
        if(message.orderId == item.orderId){
          this.currentOrder.splice(i,1)
          break;
        }
      }

      console.info('this.currentOrder ===',message,stream)
      // this.$store.commit('CHANGE_CURRENT_ORDER',message)
    }
  })
}

// 获取订单
root.methods.getOrder = function () {
  if (!this.$store.state.authState.userId) {
    this.loading = false
    return
  }
  this.$http.send('GET_CURRENT_DELEGATION', {
      bind: this,
      query: {
        symbol:'BTCUSDT',
        timestamp:this.serverTime,
        orderId:'1231212'
      },
      callBack: this.re_getOrder,
      errorHandler: this.error_getOrder,
    })
}
// 获取订单回调
root.methods.re_getOrder = function (data) {
  // console.log('this is currOrder',JSON.stringify(data));
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.loading = false
  this.currentOrder = data.data || []
  this.currentOrdersLength = this.currentOrder.length
  this.$emit('getcurrentOrdersLength',this.currentOrdersLength);
  // console.info('this.currentOrdersLength',this.currentOrdersLength)
  // this.currentOrder.push()
}
// 获取订单出错
root.methods.error_getOrder = function (err) {
  console.warn("获取订单出错！")
}

// 跳转当前订单页
root.methods.toCurrentHistory = function (err) {
  this.$router.push({name:'currentEntrust'})
}
// root.methods.TRADED = function (para) {
//   this.getOrder()
// }

// 撤单确认
root.methods.clickToCancel = function (order) {
  this.initInterval()
  this.waitForCancelOrder = order
  this.cancelConfirm = true
}

// // 点击确定取消订单
// root.methods.clickToCancelConfirm = function () {
//   this.cancelOrder(this.waitForCancelOrder)
//   this.cancelConfirm = false
// }
// // 2秒后方可点击撤单
// root.methods.initInterval = function () {
//   // console.warn('!!!')
//   this.waitForCancelInterval && clearInterval(this.waitForCancelInterval)
//   this.waitForCancelTime = 2
//   this.waitForCancel = true
//   this.waitForCancelInterval = setInterval(() => {
//     this.waitForCancelTime--
//     if (this.waitForCancelTime <= 0) {
//       this.waitForCancel = false
//       this.waitForCancelTime = 2
//       this.waitForCancelInterval && clearInterval(this.waitForCancelInterval)
//     }
//   }, 1000)
// }

// 撤单
root.methods.cancelOrder = async function (order, cancelAll = false) {
  this.clickOrder.add(order.orderId)
  order.click = true
  let params = {
    orderId: order.orderId,
    symbol: order.symbol,
    timestamp:order.updateTime
  }
  if (!cancelAll) {
    await new Promise(function (resolve, reject) {
      setTimeout(resolve, 2000)
    })
  }
  // console.warn("params", params)
  await this.$http.send('GET_CAPITAL_CANCEL', {
    bind: this,
    params: params,
    callBack: this.re_cancelOrder,
    errorHandler: this.error_cancelOrder
  })
}
// 返回
root.methods.re_cancelOrder = function (data) {
  // this.$eventBus.notify({key: 'CANCEL_ORDER'})

  this.getOrder()
}
root.methods.error_cancelOrder = function (err) {
  console.warn("撤单错误！", err)
}

// 判断是否点击了某个订单
root.methods.clickOneOrder = function (orderId) {
  return !this.clickOrder.has(orderId)
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

  let params = {
    symbol: 'BTCUSDT',
    timestamp:this.serverTime
  }
  this.$http.send('GET_CAPITAL_CANCELALL',{
    bind: this,
    params: params,
    callBack: this.re_ensurePop,
    errorHandler:this.error_ensurePop
  })
}
// 获取币安24小时价格变动正确回调
root.methods.re_ensurePop = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  if(!data && !data.data)return
  // console.info('data====',data.data)
  if(data.code == 200) {
    this.popOpen = false
    this.getOrder()
  }
}
// 获取币安24小时价格变动错误回调
root.methods.error_ensurePop = function (err) {
  console.log('获取币安24小时价格变动接口',err)
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

/*---------------------- 除法运算 begin ---------------------*/
root.methods.accDiv = function (num1, num2) {
  return this.$globalFunc.accDiv(num1, num2)
}
/*---------------------- 除法运算 end ---------------------*/
export default root
