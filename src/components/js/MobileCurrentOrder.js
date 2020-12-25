import tradingHallData from "../../dataUtils/TradingHallDataUtils";

const root = {};

root.name = 'MobileTradingHallDetail';

/*----------------------------- 组件 ------------------------------*/

root.components = {
  'Loading': resolve => require(['../vue/Loading'], resolve), // loading
  'PopupPrompt': resolve => require(['../vue/PopupPrompt'], resolve),
  'PopupWindow': resolve => require(['../vue/PopupWindow'], resolve),
  'MobilePopupWindow': resolve => require(['../vue/MobilePopupWindow'], resolve),
}


/*----------------------------- data ------------------------------*/


root.data = function () {
  return {
    loading:true,
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

    workingTypeMap : {
      MARK_PRICE:"标记价格",
      CONTRACT_PRICE:"最新价格"
    },
  }
}

/*----------------------------- 生命周期 ------------------------------*/

root.created = function () {
  // this.$eventBus.listen(this, 'TRADED', this.TRADED)
  // 获取订单
  // this.getOrder()
  // this.currentInterval && clearInterval(this.currentInterval)
  // this.currentInterval = setInterval(this.getOrder, 5000)

  this.$eventBus.listen(this, 'CANCEL_ALL', this.CANCEL_ALL)

  /*---------------- 合约部分 begin ------------------*/
  // 获取订单
  this.getOrder()
  this.$eventBus.listen(this, 'GET_ORDERS', this.getOrder)
  this.receiveSocket()

  /*---------------- 合约部分 end ------------------*/
}

root.beforeDestroy = function () {
  // this.currentInterval && clearInterval(this.currentInterval)
}


/*----------------------------- 计算 ------------------------------*/

root.computed = {}
// 存储订单/交易更新推送Key值的映射关系
root.computed.socketOrderKeyMap = function () {
  let data = tradingHallData.socketOrderKeyMap;
  // console.log(data);
  return data
}
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
// 当前货币对
root.computed.symbol = function () {
  return this.$store.state.symbol;
}
//不加下划线币对
root.computed.capitalSymbol = function () {
  return this.$globalFunc.toOnlyCapitalLetters(this.symbol);
}

/*----------------------------- 方法 ------------------------------*/

root.methods = {};
/*-----------------------  合约  begin  -----------------------*/
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

      // console.info('this.currentOrder ===',message,stream)
      // this.$store.commit('CHANGE_CURRENT_ORDER',message)
    }
  })
}

// 获取订单
root.methods.getOrder = function () {
  // if (!this.$store.state.authState.userId) {
  //   this.loading = false
  //   return
  // }
  this.$http.send('GET_CURRENT_DELEGATION', {
    bind: this,
    query: {
      symbol:'',
      timestamp:this.serverTime,
      // orderId:'1231212'
    },
    callBack: this.re_getOrder,
    errorHandler: this.error_getOrder,
  })
}
// 获取订单回调
root.methods.re_getOrder = function (data) {
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.loading = false
  let currOrderLen = {},currOrderLength
  this.currentOrder = data.data || []
  currOrderLength = this.currentOrder.length
  this.currentOrder && this.currentOrder.forEach(v=>{
    if(!currOrderLen[v.symbol]){
      currOrderLen[v.symbol] = 0
    }
    currOrderLen[v.symbol] += 1
  })
  this.currOrderLenObj = currOrderLen;
  this.$emit('setCurrentObj',this.currOrderLenObj)
  this.$emit('setCurrentLen',currOrderLength)
  this.$store.commit('SET_CURRENT_ORDERS',this.currentOrder)
}
// 获取订单出错
root.methods.error_getOrder = function (err) {
  console.warn("获取订单出错！")
}

// 状态
root.methods.type = function (order) {
  let msg = ''

  switch (order.type) {
    case 'LIMIT':
      msg = '限价单'
      break;
    case 'MARKET':
      msg = '市价单'
      break;
    case 'STOP':
      msg = '止损限价单'
      break;
    case 'STOP_MARKET':
      msg = '止损市价单'
      break;
    case 'TAKE_PROFIT':
      msg = '止盈限价单'
      break;
    case 'TAKE_PROFIT_MARKET':
      msg = '止盈市价单'
      break;
    case 'TRAILING_STOP_MARKET':
      msg = '跟踪止损单'
      break;
    default:
      msg = '---'
  }

  return msg
}
// 撤单
root.methods.cancelOrder = async function (order, cancelAll = false) {
  this.loading = true
  this.canceling = order.orderId
  this.clickOrder.add(order.orderId)
  order.click = true
  let params = {
    clientOrderId:order.clientOrderId,
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
  if (data.code == '304') {
    this.promptOpen = true;
    this.popType = 0;
    this.popText = '用户无权限';
    return
  }
  typeof(data) == 'string' && (data = JSON.parse(data));
  this.canceling =  false;
  this.loading = false
  if(data.code == 200){
    this.getOrder()
    this.$eventBus.notify({key:'GET_POSITION'})
    this.$eventBus.notify({key:'GET_BALANCE'})
    return
  }
}
root.methods.error_cancelOrder = function (err) {
  this.canceling =  false;
  console.warn("撤单错误！", err)
}


/*-----------------------  合约  end  -----------------------*/

root.methods.getScaleConfig = function () {
  this.$store.state.quoteConfig.forEach(
    v => {
      v.name === this.$store.state.symbol && (this.baseScale = v.baseScale , this.quoteScale = v.quoteScale)
    }
  )
  // console.log('baseScale', this.baseScale)
}


// // 获取订单
// root.methods.getOrder = function () {
//   // if (!this.$store.state.authMessage.userId) {
//   //   this.loading = false
//   //   return
//   // }
//   // this.loading = true
//   this.$http.send('POST_USER_ORDERS',
//     {
//       bind: this,
//       params: {
//         offsetId: this.offsetId,
//         limit: this.limit,
//         isFinalStatus: false,
//       },
//       callBack: this.re_getOrder,
//       errorHandler: this.error_getOrder,
//     })
// }
//
// // 获取订单回调
// root.methods.re_getOrder = function (data) {
//   // console.log('订单信息获取到了！！！！', data)
//   this.loading = false
//   if (this.cancelAll) {
//     return
//   }
//
//   this.currentOrder = data.orders.filter(
//     v => {
//
//       v.click = false
//
//       this.clickOrder.has(v.id) && (v.click = true)
//
//       return (v.status !== 'PARTIAL_CANCELLED') && (v.status !== 'FULLY_CANCELLED') && (v.status !== 'FULLY_FILLED')
//     }
//   )
//
// }
//
// // 获取订单出错
// root.methods.error_getOrder = function (err) {
//   console.warn("获取订单出错！")
// }
//
// root.methods.TRADED = function (para) {
//   this.getOrder()
// }

// // 撤单
// root.methods.cancelOrder = async function (order) {
//
// 	this.canceling = order.id
//   console.log(order)
//
//   this.clickOrder.add(order.id)
//   order.click = true
//   let params = {
//     targetOrderId: order.id,
//     symbol: order.symbol,
//     type: order.type === 'BUY_LIMIT' ? 'CANCEL_BUY' : 'CANCEL_SELL'
//   }
//   // console.warn("params", params)
//   await this.$http.send('TRADE_ORDERS', {
//     bind: this,
//     params: params,
//     callBack: this.re_cancelOrder,
//     errorHandler: this.error_cancelOrder
//   })
// }
// root.methods.re_cancelOrder = function (data) {
//   console.warn("撤单返回！", data)
// 	this.canceling =  false;
//   this.$eventBus.notify({key: 'CANCEL_ORDER'})
//   this.$router.push("mobileTradingHallDetail")
//   this.getOrder()
// }
// root.methods.error_cancelOrder = function (err) {
// 	this.canceling = false
//   console.warn("撤单错误！", err)
// }

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
export default root;
